using API.DTOs;
using API.entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IMessagesRepository
    {
        void AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<Message?> GetMessage(int id);
        Task<PagedList<MessageDto>> GetMesssagesForUser(MessageParams messageParams);
        Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername);
        Task<bool> SaveAllAsync();
    }
}
