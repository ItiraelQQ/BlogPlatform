using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using BlogPlatformAPI.Models;


namespace BlogPlatformAPI.Data
{
    public class BlogDbContext : IdentityDbContext<ApplicationUser>
    {
        public BlogDbContext(DbContextOptions<BlogDbContext> options) : base(options) { }
    
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
    }
}
