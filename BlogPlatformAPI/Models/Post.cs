using BlogPlatformAPI.Data;
using Microsoft.AspNetCore.Identity;

namespace BlogPlatformAPI.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        

        // Свойство для получения времени, прошедшего с момента создания поста
        public string TimeAgo
        {
            get
            {
                var timeDifference = DateTime.UtcNow - CreatedAt;

                var seconds = (int)timeDifference.TotalSeconds;
                var minutes = (int)timeDifference.TotalMinutes;
                var hours = (int)timeDifference.TotalHours;
                var days = (int)timeDifference.TotalDays;

                if (days > 0)
                {
                    return $"{days} дня(ей) назад";
                }
                else if (hours > 0)
                {
                    return $"{hours} час(ов) назад";
                }
                else if (minutes > 0)
                {
                    return $"{minutes} минут(ы) назад";
                }
                else
                {
                    return $"{seconds} секунд назад";
                }
            }
        }
    }
}
