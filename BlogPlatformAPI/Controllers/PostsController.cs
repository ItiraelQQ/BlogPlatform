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
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts([FromQuery] int? themeId)
        {
            var query = _context.Posts.AsQueryable();

            if (themeId.HasValue)
            {
                query = query.Where(p => p.Theme.Id  == themeId.Value);
            }

            var posts = await query.Include(p => p.Theme).ToListAsync();
            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPostById(int id)
        {
            return await _context.Posts
                .Where(post => post.Id == id)
                .Include(p => p.Theme)
                .FirstOrDefaultAsync();
        }

        [HttpGet("themes")]
        public async Task<ActionResult<IEnumerable<Theme>>> GetThemes()
        {
            return await _context.Themes.ToListAsync();
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

            // Проверка на наличие валидной темы
            if (post.Theme == null || post.Theme.Id == 0 || !await _context.Themes.AnyAsync(t => t.Id == post.Theme.Id))
            {
                return BadRequest("Выберите валидную тему.");
            }

            // Привязываем тему по ID, если тема существует
            var theme = await _context.Themes.FirstOrDefaultAsync(t => t.Id == post.Theme.Id);
            if (theme == null)
            {
                return BadRequest("Тема не найдена.");
            }

            // Привязываем тему к посту
            post.Theme = theme;

            // Добавляем пост в базу данных
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            // Возвращаем ответ с созданным постом
            return CreatedAtAction(nameof(GetPosts), new { id = post.Id }, post);
        }


    }
}
