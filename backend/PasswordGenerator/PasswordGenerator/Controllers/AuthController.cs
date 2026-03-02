using Microsoft.AspNetCore.Mvc;
using PasswordGenerator.Models;
using PasswordGenerator.Services;

namespace PasswordGenerator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        
        private readonly UserService userService;

        public AuthController(UserService userService)
        {
            this.userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterUserRequest registerUserRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var email = registerUserRequest.Email;
            var password = registerUserRequest.Password;
            var result = await userService.RegisterUser(email, password);
            if(result)
                return Ok();
            return BadRequest("Email уже существует");
        }
    }
}
