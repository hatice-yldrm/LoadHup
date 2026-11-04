using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoadHub.API.Models
{
    public class Message
    {
        [Key]
        public int MessageID { get; set; }

        public int SenderID { get; set; }

        public int ReceiverID { get; set; }

        [Column("Message")]
        public string Content { get; set; } = string.Empty;

        public DateTime? MessageDate { get; set; }
    }
}