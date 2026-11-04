using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoadHub.API.Data;
using LoadHub.API.Models;
using LoadHub.API.DTOs;
using LoadHub.API.DTOs;

namespace LoadHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarriersController : ControllerBase
    {
        private readonly LoadHubDbContext _context;

        public CarriersController(LoadHubDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCarrier(int id)
        {
            var carrier = await _context.Carriers
                .FirstOrDefaultAsync(x => x.CarrierID == id);

            if (carrier == null)
                return NotFound();

            return Ok(carrier);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCarrier(int id, Carrier model)
        {
            var carrier = await _context.Carriers
                .FirstOrDefaultAsync(x => x.CarrierID == id);

            if (carrier == null)
                return NotFound();

            carrier.CompanyName = model.CompanyName;
            carrier.Email = model.Email;
            carrier.Phone = model.Phone;
            carrier.VehicleCount = model.VehicleCount;

            await _context.SaveChangesAsync();

            return Ok(carrier);
        }
        [HttpPut("{id}/ChangePassword")]
        public async Task<IActionResult> ChangePassword(
    int id,
    ChangePasswordDto model)
        {
            var carrier = await _context.Carriers
                .FirstOrDefaultAsync(x => x.CarrierID == id);

            if (carrier == null)
            {
                return NotFound("Firma bulunamadı.");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserID == carrier.UserID);

            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            if (user.Password != model.CurrentPassword)
            {
                return BadRequest(new
                {
                    message = "Mevcut şifre yanlış."
                });
            }

            user.Password = model.NewPassword;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Şifre başarıyla güncellendi."
            });
        }
    }
}