using BlogPlatformAPI.Data;
using BlogPlatformAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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
        private readonly UserManager<ApplicationUser> _userManager;

        public PostsController(BlogDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
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
            var post = await _context.Posts
                .Include(p => p.Theme)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            // Проверяем, был ли этот пост уже просмотрен пользователем
            var postViewedCookie = Request.Cookies[$"post_{id}_viewed"];

            if (string.IsNullOrEmpty(postViewedCookie))
            {
                // Если cookie не существует, увеличиваем счетчик просмотров и устанавливаем cookie

                // Начинаем транзакцию, чтобы атомарно обновить количество просмотров
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                        post.Views += 1;

                        // Обновляем данные
                        _context.Posts.Update(post);
                        await _context.SaveChangesAsync();

                        // Устанавливаем cookie, чтобы больше не увеличивать просмотры для этого пользователя
                        Response.Cookies.Append($"post_{id}_viewed", "true", new CookieOptions
                        {
                            Expires = DateTimeOffset.Now.AddYears(1), 
                            HttpOnly = true, 
                            Secure = true 
                        });

                        // Подтверждаем транзакцию
                        await transaction.CommitAsync();
                    }
                    catch (Exception)
                    {
                        // В случае ошибки откатываем транзакцию
                        await transaction.RollbackAsync();
                        throw;
                    }
                }
            }

            return post;
        }

        [HttpGet("popular")]
        public async Task<ActionResult<IEnumerable<Post>>> GetPopularPosts()
        {
            var popularPosts = await _context.Posts
                .OrderByDescending(p => p.Views)  
                .Take(10)  
                .Include(p => p.Theme)  
                .ToListAsync();

            return Ok(popularPosts);
        }

        [HttpGet("new")]
        public async Task<ActionResult<IEnumerable<Post>>> GetNewPosts([FromQuery] int take = 10)
        {
            // Получаем последние `take` постов, отсортированных по дате создания
            var newPosts = await _context.Posts
                .OrderByDescending(p => p.CreatedAt)  // Сортировка по убыванию даты
                .Take(take)  // Ограничение на количество постов (по умолчанию 10)
                .Include(p => p.Theme)  // Включаем информацию о теме
                .ToListAsync();

            return Ok(newPosts);
        }


        [HttpGet("themes")]
        public async Task<ActionResult<IEnumerable<Theme>>> GetThemes()
        {
            return await _context.Themes.ToListAsync();
        }

        [Authorize]
        [HttpPost("create-post")]
        public async Task<ActionResult<Post>> CreatePost(Post post)
        {
            // Получаем имя пользователя и аватарку из токена
            var username = User.Identity.Name;
            var avatarUrl = User.FindFirst("AvatarUrl")?.Value; // Извлекаем аватарку из токена

            if (string.IsNullOrEmpty(username))
            {
                return BadRequest("Пользователь не авторизован.");
            }

            // Заполняем поле AuthorName из токена
            post.AuthorName = username;

            // Получаем ID пользователя
            var author = await _userManager.FindByNameAsync(username);

            if (author == null)
            {
                return BadRequest("Пользователь не найден.");
            }

            // Устанавливаем ID автора и аватарку
            post.AuthorId = author.Id;
            post.AuthorAvatarUrl = avatarUrl ?? "/uploads/avatars/default.jpg"; // Если аватарка отсутствует, ставим дефолт

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
