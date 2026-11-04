using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoadHub.API.Models
{
    public class Listing
    {
        [Key]
        public int ListingID { get; set; }

        public int CompanyID { get; set; }

        public string CargoName { get; set; } = string.Empty;

        public string FromCity { get; set; } = string.Empty;

        public string ToCity { get; set; } = string.Empty;

        public decimal Weight { get; set; }

        public DateOnly LoadingDate { get; set; }

        public string? Description { get; set; }

        public string? Status { get; set; }
    }
}