using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoadHub.API.Data;
using LoadHub.API.Models;

namespace LoadHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly LoadHubDbContext _context;

        public NotificationsController(LoadHubDbContext context)
        {
            _context = context;
        }


        [HttpGet("{userId}")]
        public async Task<IActionResult> GetNotifications(int userId)
        {
            var notifications =
                await _context.Notifications
                    .Where(x => x.UserID == userId)
                    .OrderByDescending(x => x.NotificationDate)
                    .ToListAsync();

            return Ok(notifications);
        }


        [HttpGet("count/{userId}")]
        public async Task<IActionResult> GetUnreadCount(int userId)
        {
            var count =
                await _context.Notifications
                    .CountAsync(x =>
                        x.UserID == userId &&
                        !x.IsRead
                    );

            return Ok(count);
        }


        [HttpPut("{notificationId}")]
        public async Task<IActionResult> MarkAsRead(
            int notificationId)
        {
            var notification =
                await _context.Notifications
                    .FirstOrDefaultAsync(
                        x => x.NotificationID == notificationId
                    );

            if (notification == null)
            {
                return NotFound(
                    "Bildirim bulunamadı."
                );
            }

            notification.IsRead = true;

            await _context.SaveChangesAsync();

            return Ok(notification);
        }



        [HttpPut("read-all/{userId}")]
        public async Task<IActionResult> MarkAllAsRead(
            int userId)
        {
            var notifications =
                await _context.Notifications
                    .Where(x =>
                        x.UserID == userId &&
                        !x.IsRead
                    )
                    .ToListAsync();

            foreach (var notification
                in notifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();

            return Ok(
                new
                {
                    message =
                        "Tüm bildirimler okundu."
                }
            );
        }


        [HttpPost]
        public async Task<IActionResult> CreateNotification(
            Notification model)
        {
            model.NotificationDate =
                DateTime.Now;

            model.IsRead = false;

            _context.Notifications.Add(model);

            await _context.SaveChangesAsync();

            return Ok(model);
        }



        [HttpDelete("{notificationId}")]
        public async Task<IActionResult> DeleteNotification(
            int notificationId)
        {
            var notification =
                await _context.Notifications
                    .FirstOrDefaultAsync(
                        x =>
                            x.NotificationID ==
                            notificationId
                    );

            if (notification == null)
            {
                return NotFound(
                    "Bildirim bulunamadı."
                );
            }

            _context.Notifications.Remove(
                notification
            );

            await _context.SaveChangesAsync();

            return Ok(
                new
                {
                    message =
                        "Bildirim silindi."
                }
            );
        }
    }
}