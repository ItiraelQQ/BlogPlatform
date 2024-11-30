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
        public DbSet<Theme> Themes { get; set; }    

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Post>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Title).IsRequired().HasMaxLength(200);
                entity.Property(n => n.Content).IsRequired();
                entity.Property(n => n.CreatedAt).HasDefaultValueSql("NOW()");

                
            });

            builder.Entity<Theme>().HasData(
                    new Theme { Id = 1, Name = "Игры" },
                    new Theme { Id = 2, Name = "Программирование" },
                    new Theme { Id = 3, Name = "Компьютеры" },
                    new Theme { Id = 4, Name = "Консоли" },
                    new Theme { Id = 5, Name = "Искусство" },
                    new Theme { Id = 6, Name = "Кино и сериалы" },
                    new Theme { Id = 7, Name = "Музыка" },
                    new Theme { Id = 8, Name = "Гайды" },
                    new Theme { Id = 9, Name = "Путешествия" },
                    new Theme { Id = 10, Name = "Аниме" }
                );
        }
    }
}
