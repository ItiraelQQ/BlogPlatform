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
                    return $"{days}д";
                }
                else if (hours > 0)
                {
                    return $"{hours}ч";
                }
                else if (minutes > 0)
                {
                    return $"{minutes}м";
                }
                else
                {
                    return $"{seconds}с";
                }
            }
        }
    }
}
