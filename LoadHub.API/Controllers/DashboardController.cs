using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoadHub.API.Data;

namespace LoadHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly LoadHubDbContext _context;

        public DashboardController(LoadHubDbContext context)
        {
            _context = context;
        }

        [HttpGet("carrier/{carrierId}")]
        public async Task<IActionResult> GetCarrierDashboard(int carrierId)
        {
            var offerCount = await _context.Offers
                .CountAsync(x => x.CarrierID == carrierId);

            var waitingOffers = await _context.Offers
                .CountAsync(x => x.CarrierID == carrierId && x.Status == "Bekliyor");

            var acceptedOffers = await _context.Offers
                .CountAsync(x => x.CarrierID == carrierId && x.Status == "Kabul Edildi");

            var completedOffers = await _context.Offers
                .CountAsync(x => x.CarrierID == carrierId && x.Status == "Tamamlandı");

            return Ok(new
            {
                offerCount,
                waitingOffers,
                activeJobs = acceptedOffers,
                completedJobs = completedOffers
            });
        }
        [HttpGet("company/{companyId}")]
        public async Task<IActionResult> GetCompanyDashboard(int companyId)
        {
            var listingCount = await _context.Listings
                .CountAsync(x => x.CompanyID == companyId);

            var activeListingCount = await _context.Listings
                .CountAsync(x => x.CompanyID == companyId &&
                                 x.Status == "Aktif");

            var offerCount = await (
                from offer in _context.Offers
                join listing in _context.Listings
                    on offer.ListingID equals listing.ListingID
                where listing.CompanyID == companyId
                select offer
            ).CountAsync();

            var completedJobCount = await _context.Jobs
                .CountAsync(x => x.CompanyID == companyId &&
                                 x.Status == "Tamamlandı");

            return Ok(new
            {
                listingCount,
                activeListingCount,
                offerCount,
                completedJobCount
            });
        }
        [HttpGet("company/{companyId}/recent-listings")]
        public async Task<IActionResult> GetRecentListings(int companyId)
        {
            var listings = await _context.Listings
                .Where(x => x.CompanyID == companyId)
                .OrderByDescending(x => x.ListingID)
                .Take(5)
                .Select(x => new
                {
                    x.ListingID,
                    x.FromCity,
                    x.ToCity,
                    x.Status
                })
                .ToListAsync();

            return Ok(listings);
        }
        [HttpGet("company/{companyId}/recent-offers")]
        public async Task<IActionResult> GetRecentOffers(int companyId)
        {
            var offers = await (
                from offer in _context.Offers
                join listing in _context.Listings
                    on offer.ListingID equals listing.ListingID
                join carrier in _context.Carriers
                    on offer.CarrierID equals carrier.CarrierID
                where listing.CompanyID == companyId
                orderby offer.OfferDate descending
                select new
                {
                    carrier.CompanyName,
                    offer.Price
                }
            ).Take(5).ToListAsync();

            return Ok(offers);
        }
    }
}