using System.ComponentModel.DataAnnotations;

namespace LoadHub.API.Models
{
    public class Company
    {
        [Key]
        public int CompanyID { get; set; }

        public int UserID { get; set; }

        public string CompanyName { get; set; }

        public string TaxNumber { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }
    }
}