using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PasswordGenerator.Entities;
using PasswordGenerator.Models;
using PasswordGenerator.Services.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PasswordGenerator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        
        private readonly AuthService authService;
        private readonly IConfiguration configuration;

        public AuthController(AuthService authService, IConfiguration configuration)
        {
            this.authService = authService;
            this.configuration = configuration;
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
                var userInBd = await authService.Login(loginUserRequest.Email, loginUserRequest.Password);
                var token = GenerateJwtToken(userInBd);
                return Ok(new { token });
            }
            catch
            {
                return BadRequest("Invalid credentials");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
            };
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
