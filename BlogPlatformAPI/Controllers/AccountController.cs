﻿using BlogPlatformAPI.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;

namespace BlogPlatformAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _webHostEnvironment = webHostEnvironment;
        }

        // Регистрация нового пользователя
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto request)
        {
            var user = new ApplicationUser
            {
                UserName = request.Username,
                AvatarUrl = "/uploads/avatars/default.jpg"
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("Пользователь успешно зарегистрирован.");
        }

        // Аутентификация (получение токена)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto request)
        {
            var user = await _userManager.FindByNameAsync(request.Username);
            if (user == null)
            {
                return Unauthorized("Неверное имя пользователя или пароль.");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!result.Succeeded)
            {
                return Unauthorized("Неверное имя пользователя или пароль.");
            }

            var token = GenerateJwtToken(request.Username);
            return Ok(new {Token = token});
        }

        

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            var profileData = new
            {
                Username = user.UserName,
                AvatarUrl = user.AvatarUrl,
                userId = user.Id,
            };

            return Ok(profileData);
        }
        [Authorize]
        [HttpGet("check-login-status")]
        public IActionResult CheckLoginStatus()
        {
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    return Ok(new { isLoggedIn = true, username = User.Identity.Name });
                }

                return Ok(new { isLoggedIn = false });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while checking login status." });
            }
        }


        [Authorize]
        [HttpPost("upload-avatar")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file selected.");
                }

                var username = User.Identity.Name;
                var user = await _userManager.FindByNameAsync(username);

                if (user == null)
                {
                    return NotFound();
                }

                var uploadsFolder = Path.Combine(_webHostEnvironment.ContentRootPath, "uploads", "avatars");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                user.AvatarUrl = $"/uploads/avatars/{fileName}";
                await _userManager.UpdateAsync(user);

                return Ok(new { AvatarUrl = user.AvatarUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while uploading avatar." });
            }
        }


        private string GenerateJwtToken(string username)
        {
            var user = _userManager.FindByNameAsync(username).Result; // Получаем пользователя по имени

            if (user == null)
            {
                throw new UnauthorizedAccessException("User not found.");
            }

            // Добавляем аватарку пользователя в claims
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, username),
        new Claim("AvatarUrl", user.AvatarUrl ?? "/uploads/avatars/default.jpg"),  // Добавляем аватарку в claims
        new Claim(ClaimTypes.NameIdentifier, user.Id)
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }



    }
    // DTO для регистрации
    public class UserRegisterDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    // DTO для аутентификации
    public class UserLoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    
}
