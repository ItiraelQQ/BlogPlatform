using Microsoft.AspNetCore.Identity;

namespace BlogPlatformAPI.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string? AvatarUrl { get; set; }
    }
}
