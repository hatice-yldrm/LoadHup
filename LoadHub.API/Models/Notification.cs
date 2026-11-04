using System.ComponentModel.DataAnnotations;

namespace LoadHub.API.Models
{
    public class Notification
    {
        [Key]
        public int NotificationID { get; set; }

        public int UserID { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public DateTime NotificationDate { get; set; } = DateTime.Now;
    }
}