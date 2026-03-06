using Microsoft.AspNetCore.Mvc;
using PasswordGenerator.Models;
using PasswordGenerator.Services;

namespace PasswordGenerator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        
        private readonly AuthService authService;

        public AuthController(AuthService authService)
        {
            this.authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserRequest registerUserRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var email = registerUserRequest.Email;
            var password = registerUserRequest.Password;
            var result = await authService.RegisterUser(email, password);
            if(result)
                return Ok(new { message = "User registered" });
            return BadRequest("Email уже существует");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserRequest loginUserRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var user = await authService.Login(loginUserRequest.Email, loginUserRequest.Password);
                return Ok(new { user.Email, user.Id }); ;
            }
            catch
            {
                return BadRequest("Invalid credentials");
            }
        }
    }
}
