using BlogPlatformAPI.Data;
using BlogPlatformAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BlogPlatformAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly BlogDbContext _context;

        public PostsController(BlogDbContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
        {
            return await _context.Posts.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPostById(int id)
        {
            return await _context.Posts
                .Where(post => post.Id == id)
                .FirstOrDefaultAsync();
        }
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Post>> CreatePost(Post post)
        {
            // Получаем имя пользователя из токена
            var username = User.Identity.Name;

            if (string.IsNullOrEmpty(username))
            {
                return BadRequest("Пользователь не авторизован.");
            }

            // Заполняем поле AuthorName из токена
            post.AuthorName = username;

            // Получаем ID пользователя
            var author = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);

            if (author == null)
            {
                return BadRequest("Пользователь не найден.");
            }

            // Устанавливаем ID автора
            post.AuthorId = author.Id;

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPosts), new { id = post.Id }, post);
        }





    }
}
