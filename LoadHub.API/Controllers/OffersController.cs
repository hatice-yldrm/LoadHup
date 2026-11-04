using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoadHub.API.Data;
using LoadHub.API.DTOs;
using LoadHub.API.Models;

namespace LoadHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OffersController : ControllerBase
    {
        private readonly LoadHubDbContext _context;

        public OffersController(LoadHubDbContext context)
        {
            _context = context;
        }

       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Offer>>> GetOffers()
        {
            return await _context.Offers.ToListAsync();
        }

        [HttpPost]
        public async Task<IActionResult> CreateOffer(CreateOfferDto model)
        {
            var listing = await _context.Listings
                .FirstOrDefaultAsync(x => x.ListingID == model.ListingID);

            if (listing == null)
            {
                return NotFound(new
                {
                    message = "İlan bulunamadı."
                });
            }

            var offer = new Offer
            {
                ListingID = model.ListingID,
                CarrierID = model.CarrierID,
                Price = model.Price,
                VehicleCount = model.VehicleCount,
                DeliveryTime = model.DeliveryTime,
                OfferDate = DateTime.Now
            };

            _context.Offers.Add(offer);

            await _context.SaveChangesAsync();


            var company = await _context.Companies
                .FirstOrDefaultAsync(x =>
                    x.CompanyID == listing.CompanyID
                );

            if (company != null)
            {
                var companyUserId = company.UserID;

                _context.Notifications.Add(new Notification
                {
                    UserID = companyUserId,

                    Title = "Yeni Teklif",

                    Content =
                        "İlanınıza yeni bir teklif verildi.",

                    NotificationDate = DateTime.Now,

                    IsRead = false
                });

                await _context.SaveChangesAsync();
            }


            return Ok(new
            {
                message = "Teklif başarıyla oluşturuldu.",

                offerID = offer.OfferID
            });
        }
        
        [HttpPut("{id}/accept")]
        public async Task<IActionResult> AcceptOffer(int id)
        {
            var offer = await _context.Offers
                .FirstOrDefaultAsync(x => x.OfferID == id);

            if (offer == null)
            {
                return NotFound(new
                {
                    message = "Teklif bulunamadı."
                });
            }

           
            var listing = await _context.Listings
                .FirstOrDefaultAsync(x => x.ListingID == offer.ListingID);

            if (listing == null)
            {
                return NotFound(new
                {
                    message = "İlan bulunamadı."
                });
            }

           
            offer.Status = "Kabul Edildi";

           
            var job = new Job
            {
                OfferID = offer.OfferID,
                ListingID = offer.ListingID,
                CompanyID = listing.CompanyID,
                CarrierID = offer.CarrierID,
                StartDate = DateTime.Now,
                Status = "Aktif"
            };

            _context.Jobs.Add(job);

            await _context.SaveChangesAsync();



            var carrier = await _context.Carriers
                .FirstOrDefaultAsync(x =>
                    x.CarrierID == offer.CarrierID
                );

            if (carrier != null)
            {
                var carrierUserId = carrier.UserID;

                _context.Notifications.Add(new Notification
                {
                    UserID = carrierUserId,

                    Title = "Yeni İş",

                    Content =
                        "Teklifiniz kabul edildi ve size yeni bir iş atandı.",

                    NotificationDate = DateTime.Now,

                    IsRead = false
                });

                await _context.SaveChangesAsync();
            }


            return Ok(new
            {
                message = "Teklif kabul edildi ve iş oluşturuldu.",

                offerID = offer.OfferID,

                jobID = job.JobID
            });
        }


      
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectOffer(int id)
        {
            var offer = await _context.Offers
                .FirstOrDefaultAsync(x => x.OfferID == id);

            if (offer == null)
            {
                return NotFound(new
                {
                    message = "Teklif bulunamadı."
                });
            }

            offer.Status = "Reddedildi";

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Teklif reddedildi.",
                offerID = offer.OfferID,
                status = offer.Status
            });
        }
        [HttpGet("carrier/{carrierId}")]
        public async Task<IActionResult> GetCarrierOffers(int carrierId)
        {
            var offers = await _context.Offers
                .Where(x => x.CarrierID == carrierId)
                .ToListAsync();

            return Ok(offers);
        }
        [HttpGet("company/{companyId}")]
        public async Task<IActionResult> GetCompanyOffers(int companyId)
        {
            var offers = await (
                from offer in _context.Offers
                join listing in _context.Listings
                    on offer.ListingID equals listing.ListingID
                join carrier in _context.Carriers
                    on offer.CarrierID equals carrier.CarrierID
                where listing.CompanyID == companyId
                select new OfferListDto
                {
                    OfferID = offer.OfferID,
                    ListingID = offer.ListingID,
                    CarrierName = carrier.CompanyName,
                    Price = offer.Price,
                    VehicleCount = offer.VehicleCount,
                    DeliveryTime = offer.DeliveryTime,
                    Status = offer.Status,
                    OfferDate = offer.OfferDate
                }
            ).ToListAsync();

            return Ok(offers);
        }
    }
}