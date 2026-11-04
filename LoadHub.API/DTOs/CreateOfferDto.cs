namespace LoadHub.API.DTOs
{
    public class CreateOfferDto
    {
        public int ListingID { get; set; }

        public int CarrierID { get; set; }

        public decimal Price { get; set; }

        public int VehicleCount { get; set; }

        public string DeliveryTime { get; set; } = string.Empty;
    }
}