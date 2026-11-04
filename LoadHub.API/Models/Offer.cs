namespace LoadHub.API.Models
{
    public class Offer
    {
        public int OfferID { get; set; }

        public int ListingID { get; set; }

        public int CarrierID { get; set; }

        public decimal Price { get; set; }

        public int VehicleCount { get; set; }

        public string DeliveryTime { get; set; } = string.Empty;

        public DateTime? OfferDate { get; set; }

        public string Status { get; set; } = "Bekliyor";
    }
}