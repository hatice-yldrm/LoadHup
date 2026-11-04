using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoadHub.API.Data;
using LoadHub.API.DTOs;
using LoadHub.API.Models;

namespace LoadHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListingsController : ControllerBase
    {
        private readonly LoadHubDbContext _context;

        public ListingsController(LoadHubDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetListings(
            string? fromCity,
            string? toCity,
            string? cargoName,
            int page = 1,
            int pageSize = 6)
        {
            var query = _context.Listings.AsQueryable();

            if (!string.IsNullOrWhiteSpace(fromCity))
            {
                query = query.Where(x => x.FromCity == fromCity);
            }

            if (!string.IsNullOrWhiteSpace(toCity))
            {
                query = query.Where(x => x.ToCity == toCity);
            }

            if (!string.IsNullOrWhiteSpace(cargoName))
            {
                query = query.Where(x => x.CargoName == cargoName);
            }

            var totalCount = await query.CountAsync();

            var listings = await query
                .OrderByDescending(x => x.ListingID)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                totalCount,
                page,
                pageSize,
                listings
            });
        }


        [HttpPost]
        public async Task<IActionResult> Create(CreateListingDto model)
        {
            var listing = new Listing
            {
                CompanyID = model.CompanyID,
                CargoName = model.CargoName,
                FromCity = model.FromCity,
                ToCity = model.ToCity,
                Weight = model.Weight,
                LoadingDate = model.LoadingDate,
                Description = model.Description,
                Status = "Aktif"
            };

            _context.Listings.Add(listing);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "İlan oluşturuldu."
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Listing>> GetListing(int id)
        {
            var listing = await _context.Listings
                .FirstOrDefaultAsync(x => x.ListingID == id);

            if (listing == null)
            {
                return NotFound();
            }

            return Ok(listing);
        }


        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestListings()
        {
            var listings = await _context.Listings
                .Where(x => x.Status == "Aktif")
                .OrderByDescending(x => x.ListingID)
                .Take(3)
                .ToListAsync();

            return Ok(listings);
        }
    }
}