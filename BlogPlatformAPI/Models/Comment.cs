using BlogPlatformAPI.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
namespace BlogPlatformAPI.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime PostedAt { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; }
        public ApplicationUser User { get; set; }

        public string TimeAgo
        {
            get
            {
                var timeDifference = DateTime.UtcNow - PostedAt;

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
