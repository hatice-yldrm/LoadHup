using System.ComponentModel.DataAnnotations;

namespace LoadHub.API.Models
{
    public class Carrier
    {
        [Key]
        public int CarrierID { get; set; }

        public int UserID { get; set; }

        public string CompanyName { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public int VehicleCount { get; set; }
    }
}