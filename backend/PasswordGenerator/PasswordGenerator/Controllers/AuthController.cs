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
        
        private readonly ILogger<AuthController> logger;
        private readonly AuthService authService;
        private readonly UpdateTokens updateTokens;
        private readonly IConfiguration configuration;
        private readonly IWebHostEnvironment environment;

        public AuthController(
            AuthService authService,
            UpdateTokens updateTokens,
            IConfiguration configuration,
            IWebHostEnvironment environment,
            ILogger<AuthController> logger)
        {
            this.authService = authService;
            this.updateTokens = updateTokens;
            this.configuration = configuration;
            this.environment = environment;
            this.logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserRequest registerUserRequest)
        {
            logger.LogInformation($"Register attempt started. Email: {registerUserRequest.Email}");
            if (!ModelState.IsValid)
            {
                logger.LogWarning($"Register failed due to invalid model state. Email: {registerUserRequest.Email}");
                return ValidationProblem(ModelState);
            }
            var email = registerUserRequest.Email;
            var password = registerUserRequest.Password;
            var result = await authService.RegisterUser(email, password);
            if (result)
            {
                logger.LogInformation($"User registered successfully. Email: {registerUserRequest.Email}");
                return Ok(new { message = "User registered" });
            }
            logger.LogWarning($"Register failed: email already exists. Email: {registerUserRequest.Email}");
            return Conflict(new { message = "Email уже существует" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserRequest loginUserRequest)
        {
            logger.LogInformation("Login attempt started. Email: {Email}", loginUserRequest.Email);
            if (!ModelState.IsValid)
            {
                logger.LogWarning($"Login failed due to invalid model state. Email: {loginUserRequest.Email}");
                return ValidationProblem(ModelState);
            }
            try
            {
                var userInDb = await authService.Login(loginUserRequest.Email, loginUserRequest.Password);

                logger.LogInformation($"Login successful. UserId: {userInDb.Id}, Email: {userInDb.Email}");

                var accessToken = GenerateJwtToken(userInDb);
                var refreshToken = await updateTokens.CreateRefreshTokenAsync(userInDb.Id);
                SetRefreshTokenCookie(refreshToken);
                return Ok(new { token = accessToken });
            }
            catch (AuthenticationException)
            {
                logger.LogWarning($"Login failed: invalid credentials. Email: {loginUserRequest.Email}, IP: {HttpContext.Connection.RemoteIpAddress?.ToString()}");
                return Unauthorized(new { message = "Неверный email или пароль" });
            }
            catch (ArgumentException ex)
            {
                logger.LogWarning(ex,
                    $"Login failed due to argument error. Email: {loginUserRequest.Email}");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            logger.LogInformation($"Обновление токена пользователя");
            var token = Request.Cookies[RefreshTokenCookieName];

            if (string.IsNullOrEmpty(token))
            {
                logger.LogWarning("Refresh token missing in request");
                return Unauthorized(new { message = "Пользователь не авторизован" });
            }

            var refreshToken = await updateTokens.GetValidTokenAsync(token);
            if (refreshToken == null)
            {
                logger.LogWarning("Invalid refresh token used");
                return Unauthorized(new { message = "Недействительный refresh token" });
            }

            var accessToken = GenerateJwtToken(refreshToken.User);
            var newRefreshToken = await updateTokens.RotateRefreshTokenAsync(refreshToken);
            SetRefreshTokenCookie(newRefreshToken);

            logger.LogInformation($"Token refreshed successfully. UserId: {refreshToken.UserId}");
            return Ok(new { token = accessToken });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> LogoutToken()
        {
            var token = Request.Cookies[RefreshTokenCookieName];
            logger.LogInformation($"Logout request received");
            if (!string.IsNullOrEmpty(token))
            {
                logger.LogInformation("Refresh token revoked");
                await updateTokens.RevokeRefreshTokenAsync(token);
            }

            Response.Cookies.Delete(RefreshTokenCookieName, BuildRefreshTokenCookieOptions(DateTime.UtcNow.AddDays(-1)));
            logger.LogInformation("User logged out successfully");
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
