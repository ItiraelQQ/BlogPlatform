using BlogPlatformWEB.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace BlogPlatformWEB.Controllers
{
    public class PostsController : Controller
    {
        private readonly PostsService _postsService;

        public PostsController(PostsService postsService)
        {
            _postsService = postsService;
        }

        // GET: /news
        public async Task<IActionResult> Index()
        {
            var postsList = await _postsService.GetAllPostsAsync();

            return View(postsList.OrderByDescending(p => p.CreatedAt));
        }
    }
}
