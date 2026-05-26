using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PasswordGenerator.Entities;
using PasswordGenerator.Models;
using PasswordGenerator.Models.GeneratorSettings;
using PasswordGenerator.Services.Users.SavePassword;
using PasswordGenerator.Services.Users.Settings;
using System.Security.Claims;

namespace PasswordGenerator.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserSavedPasswordController : ControllerBase
    {
        private readonly IUserSavedPasswordService savedPasswordService;
        private readonly ILogger<UserSavedPasswordController> logger;

        public UserSavedPasswordController(IUserSavedPasswordService savedPasswordService, ILogger<UserSavedPasswordController> logger)
        {
            this.savedPasswordService = savedPasswordService;
            this.logger = logger;
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveUserPassword(SavePasswordRequest savePasswordRequest)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                logger.LogWarning("Save password failed: missing user id claim");
                return Unauthorized();
            }
                
            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                logger.LogWarning($"Save password failed: invalid user id format. ClaimValue: {userIdClaim.Value}");
                return Unauthorized();
            }

            logger.LogInformation($"User started password save operation. UserId: {userId}");
            await savedPasswordService.SavePassword(userId, savePasswordRequest);
            logger.LogInformation($"Password saved successfully. UserId: {userId}");
            return Ok(new { Message = "Пароль сохранен" });
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteUserPassword(DeletePasswordRequest deletePasswordRequest)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                logger.LogWarning("Delete password failed: missing user id claim");
                return Unauthorized();
            }
                
            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                logger.LogWarning($"Delete password failed: invalid user id format. ClaimValue: {userIdClaim.Value}");
                return Unauthorized();
            }

            logger.LogInformation($"User started password delete operation. UserId: {userId}");

            await savedPasswordService.DeletePassword(userId, deletePasswordRequest);

            logger.LogInformation($"Password deleted successfully. UserId: {userId}");
            return Ok(new { Message = "Пароль удален" });
        }

        [HttpGet("getSaves")]
        public async Task<IActionResult> GetSettings()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                logger.LogWarning("Get saved passwords failed: missing user id claim");
                return Unauthorized();
            }
                
            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                logger.LogWarning($"Get saved passwords failed: invalid user id format. ClaimValue: {userIdClaim.Value}");
                return Unauthorized();
            }

            logger.LogInformation($"User requested saved passwords. UserId: {userId}");

            var passwordDtos = await savedPasswordService.GetAllPassword(userId);

            logger.LogInformation($"Saved passwords returned successfully. UserId: {userId}, Count: {passwordDtos.Count()}");
            return Ok(new { saves = passwordDtos });
        }

    }
}
