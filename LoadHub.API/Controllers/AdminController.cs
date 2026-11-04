using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoadHub.API.Data;
using LoadHub.API.DTOs;
using LoadHub.API.Models;

namespace LoadHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly LoadHubDbContext _context;

        public AdminController(LoadHubDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(AdminLoginDto model)
        {
            var admin = await _context.Admins
             .FirstOrDefaultAsync(x =>
                 x.Email == model.Email &&
                 x.Password == model.Password
                  );

            if (admin == null)
            {
                return Unauthorized(new
                {
                    message = "Kullanıcı adı veya şifre hatalı."
                });
            }

            return Ok(new
            {
                message = "Admin girişi başarılı.",
                adminID = admin.AdminID,
                username = admin.Username,
                role = "admin"
            });
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalUsers =
                await _context.Users.CountAsync();

            var totalCompanies =
                await _context.Companies.CountAsync();

            var totalCarriers =
                await _context.Carriers.CountAsync();

            var totalListings =
                await _context.Listings.CountAsync();

            return Ok(new
            {
                totalUsers,
                totalCompanies,
                totalCarriers,
                totalListings
            });
        }


        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users =
                await _context.Users
                    .OrderByDescending(x => x.RegisterDate)
                    .ToListAsync();

            return Ok(users);
        }


        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(
            int id)
        {
            var user =
                await _context.Users
                    .FirstOrDefaultAsync(
                        x => x.UserID == id
                    );

            if (user == null)
            {
                return NotFound(new
                {
                    message = "Kullanıcı bulunamadı."
                });
            }

            var company =
                await _context.Companies
                    .FirstOrDefaultAsync(
                        x => x.UserID == id
                    );

            if (company != null)
            {
                return BadRequest(new
                {
                    message =
                        "Bu kullanıcıya bağlı şirket bulunmaktadır. Önce şirketi silmelisiniz."
                });
            }

            var carrier =
                await _context.Carriers
                    .FirstOrDefaultAsync(
                        x => x.UserID == id
                    );

            if (carrier != null)
            {
                return BadRequest(new
                {
                    message =
                        "Bu kullanıcıya bağlı nakliye firması bulunmaktadır. Önce nakliye firmasını silmelisiniz."
                });
            }

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Kullanıcı silindi."
            });
        }

        [HttpGet("companies")]
        public async Task<IActionResult> GetCompanies()
        {
            var companies =
                await (
                    from company in _context.Companies

                    join user in _context.Users
                        on company.UserID
                        equals user.UserID
                        into userGroup

                    from user in userGroup.DefaultIfEmpty()

                    select new
                    {
                        companyID =
                            company.CompanyID,

                        userID =
                            company.UserID,

                        companyName =
                            company.CompanyName,

                        taxNumber =
                            company.TaxNumber,

                        address =
                            company.Address,

                        city =
                            company.City,

                        phone =
                            company.Phone,

                        email =
                            company.Email,

                        fullName =
                            user != null
                                ? user.FullName
                                : ""
                    }
                )
                .ToListAsync();

            return Ok(companies);
        }

        [HttpDelete("companies/{id}")]
        public async Task<IActionResult> DeleteCompany(
            int id)
        {
            var company =
                await _context.Companies
                    .FirstOrDefaultAsync(
                        x => x.CompanyID == id
                    );

            if (company == null)
            {
                return NotFound(new
                {
                    message = "Şirket bulunamadı."
                });
            }

            var listings =
                await _context.Listings
                    .Where(x =>
                        x.CompanyID == id
                    )
                    .ToListAsync();

            if (listings.Any())
            {
                return BadRequest(new
                {
                    message =
                        "Bu şirkete ait ilanlar bulunmaktadır. Önce ilanları silmelisiniz."
                });
            }

            _context.Companies.Remove(company);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Şirket silindi."
            });
        }

        [HttpGet("carriers")]
        public async Task<IActionResult> GetCarriers()
        {
            var carriers =
                await (
                    from carrier in _context.Carriers

                    join user in _context.Users
                        on carrier.UserID
                        equals user.UserID
                        into userGroup

                    from user in userGroup.DefaultIfEmpty()

                    select new
                    {
                        carrierID =
                            carrier.CarrierID,

                        userID =
                            carrier.UserID,

                        companyName =
                            carrier.CompanyName,

                        phone =
                            carrier.Phone,

                        email =
                            carrier.Email,

                        vehicleCount =
                            carrier.VehicleCount,

                        fullName =
                            user != null
                                ? user.FullName
                                : ""
                    }
                )
                .ToListAsync();

            return Ok(carriers);
        }

        [HttpDelete("carriers/{id}")]
        public async Task<IActionResult> DeleteCarrier(
            int id)
        {
            var carrier =
                await _context.Carriers
                    .FirstOrDefaultAsync(
                        x => x.CarrierID == id
                    );

            if (carrier == null)
            {
                return NotFound(new
                {
                    message =
                        "Nakliye firması bulunamadı."
                });
            }

            _context.Carriers.Remove(carrier);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message =
                    "Nakliye firması silindi."
            });
        }

        [HttpGet("listings")]
        public async Task<IActionResult> GetListings()
        {
            var listings =
                await (
                    from listing in _context.Listings

                    join company in _context.Companies
                        on listing.CompanyID
                        equals company.CompanyID
                        into companyGroup

                    from company in companyGroup.DefaultIfEmpty()

                    select new
                    {
                        listingID =
                            listing.ListingID,

                        companyID =
                            listing.CompanyID,

                        companyName =
                            company != null
                                ? company.CompanyName
                                : "",

                        cargoName =
                            listing.CargoName,

                        fromCity =
                            listing.FromCity,

                        toCity =
                            listing.ToCity,

                        weight =
                            listing.Weight,

                        loadingDate =
                            listing.LoadingDate,

                        description =
                            listing.Description,

                        status =
                            listing.Status
                    }
                )
                .OrderByDescending(x => x.listingID)
                .ToListAsync();

            return Ok(listings);
        }

        [HttpDelete("listings/{id}")]
        public async Task<IActionResult> DeleteListing(
            int id)
        {
            var listing =
                await _context.Listings
                    .FirstOrDefaultAsync(
                        x => x.ListingID == id
                    );

            if (listing == null)
            {
                return NotFound(new
                {
                    message = "İlan bulunamadı."
                });
            }

            var offers =
                await _context.Offers
                    .Where(x =>
                        x.ListingID == id
                    )
                    .ToListAsync();

            if (offers.Any())
            {
                return BadRequest(new
                {
                    message =
                        "Bu ilana ait teklifler bulunmaktadır. İlan silinemiyor."
                });
            }

            _context.Listings.Remove(listing);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "İlan silindi."
            });
        }
    }
}