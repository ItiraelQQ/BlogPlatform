using BlogPlatformAPI.Models;

namespace BlogPlatformWEB.Services
{
    public class PostsService
    {
        private readonly HttpClient _httpClient;
        
        public PostsService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Получение всех постов
        public async Task<List<Post>> GetAllPostsAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<Post>>("https://localhost:44357/api/posts");
        }
    }
}
