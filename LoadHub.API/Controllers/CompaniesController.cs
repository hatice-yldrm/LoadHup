using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoadHub.API.Data;
using LoadHub.API.Models;

namespace LoadHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private readonly LoadHubDbContext _context;

        public CompaniesController(LoadHubDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompany(int id)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(x => x.CompanyID == id);

            if (company == null)
                return NotFound();

            return Ok(company);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompany(int id, Company model)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(x => x.CompanyID == id);

            if (company == null)
                return NotFound();

            company.CompanyName = model.CompanyName;
            company.Phone = model.Phone;
            company.Email = model.Email;
            company.Address = model.Address;
            company.City = model.City;
            company.TaxNumber = model.TaxNumber;

            var result = await _context.SaveChangesAsync();

            return Ok(result);
        }
    }
}