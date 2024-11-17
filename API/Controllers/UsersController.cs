using API.Data;
using API.entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{

    public class UsersController : BaseApiController
    {
        private readonly DataContext _context;
        public UsersController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<AppUser>> GetUsers()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public ActionResult<AppUser> GetUser(int id)
        {
            var user = _context.Users.Find(id);
            return Ok(user);
        }
    }
}
