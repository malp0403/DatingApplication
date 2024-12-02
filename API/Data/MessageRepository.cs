using API.DTOs;
using API.entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessagesRepository(DataContext context, IMapper mapper) : IMessagesRepository
    {
        void IMessagesRepository.AddMessage(Message message)
        {
            context.Messages.Add(message);
        }

        void IMessagesRepository.DeleteMessage(Message message)
        {
            context.Messages.Remove(message);
        }

        async Task<Message?> IMessagesRepository.GetMessage(int id)
        {
            return await context.Messages.FindAsync(id);

        }

        async Task<IEnumerable<MessageDto>> IMessagesRepository.GetMessageThread(string currentUsername, string recipientUsername)
        {
            var messages = await context.Messages
                .Include(x => x.Sender).ThenInclude(x => x.Photos)
                .Include(x => x.Recipient).ThenInclude(x => x.Photos)
                .Where(x =>
                    x.RecipientUsername == currentUsername && x.SenderUsername == recipientUsername && !x.RecipientDeleted ||
                    x.SenderUsername == currentUsername && x.RecipientUsername == recipientUsername && !x.SenderDeleted
                ).OrderBy(x => x.MessageSent)
                .ToListAsync();

            var unreadMessages = messages.Where(x => x.DateRead == null && x.RecipientUsername == currentUsername).ToList();

            if(unreadMessages.Count != 0)
            {
                unreadMessages.ForEach(x => x.DateRead = DateTime.UtcNow);
                await context.SaveChangesAsync();
            }

            return mapper.Map<IEnumerable<MessageDto>>(messages);




        }

        async Task<PagedList<MessageDto>> IMessagesRepository.GetMesssagesForUser(MessageParams messageParams)
        {
            var query = context.Messages
                .OrderByDescending(x => x.MessageSent)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(x => x.Recipient.UserName == messageParams.Username && !x.RecipientDeleted ),
                "Outbox" => query.Where(x => x.Sender.UserName == messageParams.Username && !x.SenderDeleted),
                _ => query.Where(x => x.Recipient.UserName == messageParams.Username && x.DateRead == null && ! x.RecipientDeleted)
            };

            var messages = query.ProjectTo<MessageDto>(mapper.ConfigurationProvider);

            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber,messageParams.PageSize);
        }

        async Task<bool> IMessagesRepository.SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}
