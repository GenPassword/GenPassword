using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PasswordGenerator.Entities;
using PasswordGenerator.Models;
using PasswordGenerator.Services.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Authentication;
using System.Security.Claims;
using System.Text;

namespace PasswordGenerator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private const string RefreshTokenCookieName = "refreshToken";

        private readonly AuthService authService;
        private readonly UpdateTokens updateTokens;
        private readonly IConfiguration configuration;
        private readonly IWebHostEnvironment environment;

        public AuthController(
            AuthService authService,
            UpdateTokens updateTokens,
            IConfiguration configuration,
            IWebHostEnvironment environment)
        {
            this.authService = authService;
            this.updateTokens = updateTokens;
            this.configuration = configuration;
            this.environment = environment;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserRequest registerUserRequest)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }
            var email = registerUserRequest.Email;
            var password = registerUserRequest.Password;
            var result = await authService.RegisterUser(email, password);
            if(result)
                return Ok(new { message = "User registered" });
            return Conflict(new { message = "Email уже существует" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserRequest loginUserRequest)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }
            try
            {
                var userInBd = await authService.Login(loginUserRequest.Email, loginUserRequest.Password);
                var accessToken = GenerateJwtToken(userInBd);
                var refreshToken = await updateTokens.CreateRefreshTokenAsync(userInBd.Id);
                SetRefreshTokenCookie(refreshToken);
                return Ok(new { token = accessToken });
            }
            catch (AuthenticationException)
            {
                return Unauthorized(new { message = "Неверный email или пароль" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            var token = Request.Cookies[RefreshTokenCookieName];
            if (string.IsNullOrEmpty(token))
                return Unauthorized(new { message = "Пользователь не авторизован" });

            var refreshToken = await updateTokens.GetValidTokenAsync(token);
            if (refreshToken == null)
                return Unauthorized(new { message = "Недействительный refresh token" });

            var accessToken = GenerateJwtToken(refreshToken.User);
            var newRefreshToken = await updateTokens.RotateRefreshTokenAsync(refreshToken);
            SetRefreshTokenCookie(newRefreshToken);

            return Ok(new { token = accessToken });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> LogoutToken()
        {
            var token = Request.Cookies[RefreshTokenCookieName];
            if (!string.IsNullOrEmpty(token))
                await updateTokens.RevokeRefreshTokenAsync(token);

            Response.Cookies.Delete(RefreshTokenCookieName, BuildRefreshTokenCookieOptions(DateTime.UtcNow.AddDays(-1)));

            return Ok(new { message = "Вы вышли из аккаунта" });
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            Response.Cookies.Append(
                RefreshTokenCookieName,
                refreshToken,
                BuildRefreshTokenCookieOptions(DateTime.UtcNow.AddDays(7)));
        }

        private CookieOptions BuildRefreshTokenCookieOptions(DateTime expires)
        {
            return new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = expires,
                Path = "/"
            };
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
