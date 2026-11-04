namespace LoadHub.API.DTOs
{
    public class OfferListDto
    {
        public int OfferID { get; set; }

        public int ListingID { get; set; }

        public string CarrierName { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public int VehicleCount { get; set; }

        public string DeliveryTime { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public DateTime? OfferDate { get; set; }
    }
}
