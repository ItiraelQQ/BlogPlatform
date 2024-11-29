using BlogPlatformAPI.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;

namespace BlogPlatformAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        // Регистрация нового пользователя
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto request)
        {
            var user = new ApplicationUser
            {
                UserName = request.Username,
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

        // Генерация JWT-токена
        private string GenerateJwtToken(string username)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                //new Claim(ClaimTypes.NameIdentifier, user.Id)
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
                Username = user.UserName
            };

            return Ok(profileData);
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
