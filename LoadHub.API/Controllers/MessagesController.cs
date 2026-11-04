using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoadHub.API.Data;
using LoadHub.API.Models;

namespace LoadHub.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly LoadHubDbContext _context;

        public MessagesController(LoadHubDbContext context)
        {
            _context = context;
        }

      
        [HttpGet("{senderId}/{receiverId}")]
        public async Task<IActionResult> GetConversation(int senderId, int receiverId)
        {
            var messages = await _context.Messages
                .Where(x =>
                    (x.SenderID == senderId && x.ReceiverID == receiverId) ||
                    (x.SenderID == receiverId && x.ReceiverID == senderId))
                .OrderBy(x => x.MessageDate)
                .ToListAsync();

            return Ok(messages);
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage(Message model)
        {
            model.MessageDate = DateTime.Now;

            _context.Messages.Add(model);

            await _context.SaveChangesAsync();
            _context.Notifications.Add(new Notification
            {
                UserID = model.ReceiverID,
                Title = "Yeni Mesaj",
                Content = "Size yeni bir mesaj gönderildi.",
                NotificationDate = DateTime.Now
            });

            await _context.SaveChangesAsync();

            return Ok(model);
        }
        
        [HttpGet("conversations/{userId}")]
        public async Task<IActionResult> GetConversations(int userId)
        {
            var users = await _context.Messages
                .Where(x =>
                    x.SenderID == userId ||
                    x.ReceiverID == userId)
                .OrderByDescending(x => x.MessageDate)
                .ToListAsync();

            var conversations = users
                .GroupBy(x =>
                    x.SenderID == userId
                        ? x.ReceiverID
                        : x.SenderID)
                .Select(g => g.First())
                .ToList();

            return Ok(conversations);
        }
    }
}