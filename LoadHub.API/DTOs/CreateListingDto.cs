namespace LoadHub.API.DTOs
{
    public class CreateListingDto
    {
        public int CompanyID { get; set; }

        public string CargoName { get; set; } = string.Empty;

        public string FromCity { get; set; } = string.Empty;

        public string ToCity { get; set; } = string.Empty;

        public decimal Weight { get; set; }

        public DateOnly LoadingDate { get; set; }

        public string? Description { get; set; }
    }
}