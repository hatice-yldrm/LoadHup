using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoadHub.API.Data;
using LoadHub.API.DTOs;

namespace LoadHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly LoadHubDbContext _context;

        public JobsController(LoadHubDbContext context)
        {
            _context = context;
        }

        [HttpGet("carrier/{carrierId}")]
        public async Task<IActionResult> GetCarrierJobs(int carrierId)
        {
            var jobs = await (
                from job in _context.Jobs
                join listing in _context.Listings
                    on job.ListingID equals listing.ListingID
                join offer in _context.Offers
                    on job.OfferID equals offer.OfferID
                where job.CarrierID == carrierId
                select new JobListDto
                {
                    JobID = job.JobID,
                    CargoName = listing.CargoName,
                    FromCity = listing.FromCity,
                    ToCity = listing.ToCity,
                    Price = offer.Price,
                    Status = job.Status,
                    StartDate = job.StartDate
                }
            ).ToListAsync();

            return Ok(jobs);
        }
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteJob(int id)
        {
            var job = await _context.Jobs
                .FirstOrDefaultAsync(x => x.JobID == id);

            if (job == null)
            {
                return NotFound(new
                {
                    message = "İş bulunamadı."
                });
            }

            job.Status = "Tamamlandı";
            job.FinishDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "İş başarıyla tamamlandı.",
                jobID = job.JobID,
                status = job.Status,
                finishDate = job.FinishDate
            });
        }

    }
}