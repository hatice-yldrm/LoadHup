namespace LoadHub.API.DTOs
{
    public class JobListDto
    {
        public int JobID { get; set; }

        public string CargoName { get; set; } = string.Empty;

        public string FromCity { get; set; } = string.Empty;

        public string ToCity { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string Status { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }
    }
}