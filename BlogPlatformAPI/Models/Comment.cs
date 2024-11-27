using BlogPlatformAPI.Data;
using Microsoft.AspNetCore.Identity;
namespace BlogPlatformAPI.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime PostedAt { get; set; }
        public string UserId { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; }
        public ApplicationUser User { get; set; }
    }
}
