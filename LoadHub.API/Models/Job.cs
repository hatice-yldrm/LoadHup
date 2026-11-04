namespace LoadHub.API.Models
{
    public class Job
    {
        public int JobID { get; set; }

        public int OfferID { get; set; }

        public int ListingID { get; set; }

        public int CompanyID { get; set; }

        public int CarrierID { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? FinishDate { get; set; }

        public string Status { get; set; } = "Aktif";
    }
}