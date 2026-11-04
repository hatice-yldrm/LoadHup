using Microsoft.EntityFrameworkCore;
using LoadHub.API.Models;

namespace LoadHub.API.Data
{
    public class LoadHubDbContext : DbContext
    {
        public LoadHubDbContext(DbContextOptions<LoadHubDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Company> Companies { get; set; }

        public DbSet<Carrier> Carriers { get; set; }

        public DbSet<Listing> Listings { get; set; }

        public DbSet<Offer> Offers { get; set; }

        public DbSet<Job> Jobs { get; set; }

        public DbSet<Message> Messages { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        public DbSet<Admin> Admins { get; set; }
    }
}