using API.DTOs;
using API.entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class MessagesController(IMessagesRepository messageRepository, IUserRepository userRepository, IMapper mapper) : BaseApiController
    {
        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto messageDto)
        {
            var username = User.GetUsername();

            var sender = await userRepository.GetUserByUsernameAsync(username);
            var recipient = await userRepository.GetUserByUsernameAsync(messageDto.RecipientUsername);

            if (recipient == null || sender == null) { return BadRequest("cant not send"); }

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = messageDto.Content

            };

            messageRepository.AddMessage(message);

            if (await messageRepository.SaveAllAsync()) return Ok(mapper.Map<MessageDto>(message));

            return BadRequest("Failed to save message");


        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();

            var messages = await messageRepository.GetMesssagesForUser(messageParams);
            Response.AddPaginationHeader(messages);

            return Ok(messages);
        }

        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
        {
            var currentUsername = User.GetUsername();
            return Ok(await messageRepository.GetMessageThread(currentUsername, username));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();

            var message = await messageRepository.GetMessage(id);

            if (message == null) return BadRequest("message not found");

            if (message.SenderUsername != username && message.RecipientUsername != username)
                return Forbid("you are not allowed to do it");

            if (message.SenderUsername == username) message.SenderDeleted = true;
            if (message.RecipientUsername == username) message.RecipientDeleted = true;

            if (message is { SenderDeleted: true, RecipientDeleted: true })
            {
                messageRepository.DeleteMessage(message);
            }

            if (await messageRepository.SaveAllAsync())
            {
                return Ok();
            };

            return BadRequest("cant delete");
        }
    }
}
