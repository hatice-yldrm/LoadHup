using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoadHub.API.Data;
using LoadHub.API.Models;
using LoadHub.API.DTOs;

namespace LoadHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly LoadHubDbContext _context;

        public UsersController(LoadHubDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }
        [HttpPost]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            var user = new User
            {
                FullName = model.FullName,
                Email = model.Email,
                Phone = model.Phone,
                Password = model.Password,
                Role = model.Role,
                RegisterDate = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            if (model.Role == "Company")
            {
                var company = new Company
                {
                    UserID = user.UserID,
                    CompanyName = model.CompanyName,
                    Phone = model.Phone,
                    Email = model.Email
                };

                _context.Companies.Add(company);
            }
            else if (model.Role == "Carrier")
            {
                var carrier = new Carrier
                {
                    UserID = user.UserID,
                    CompanyName = model.CompanyName,
                    Phone = model.Phone,
                    Email = model.Email,
                    VehicleCount = 0
                };

                _context.Carriers.Add(carrier);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Kayıt başarıyla oluşturuldu."
            });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x =>
                x.Email == model.Email &&
                x.Password == model.Password);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "E-posta veya şifre hatalı."
                });
            }

            int? carrierID = null;
            int? companyID = null;

            if (user.Role == "Carrier")
            {
                carrierID = await _context.Carriers
                    .Where(x => x.UserID == user.UserID)
                    .Select(x => (int?)x.CarrierID)
                    .FirstOrDefaultAsync();
            }

            if (user.Role == "Company")
            {
                companyID = await _context.Companies
                    .Where(x => x.UserID == user.UserID)
                    .Select(x => (int?)x.CompanyID)
                    .FirstOrDefaultAsync();
            }

            return Ok(new
            {
                user.UserID,
                user.FullName,
                user.Email,
                user.Phone,
                user.Role,
                CarrierID = carrierID,
                CompanyID = companyID
            });
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserID == id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto model)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserID == model.UserID);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "Kullanıcı bulunamadı."
                });
            }

            
            if (user.Password != model.CurrentPassword)
            {
                return BadRequest(new
                {
                    message = "Mevcut şifreniz hatalı."
                });
            }

          
            if (model.NewPassword != model.ConfirmPassword)
            {
                return BadRequest(new
                {
                    message = "Yeni şifreler eşleşmiyor."
                });
            }

            
            user.Password = model.NewPassword;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Şifreniz başarıyla güncellendi."
            });
        }
    }
}