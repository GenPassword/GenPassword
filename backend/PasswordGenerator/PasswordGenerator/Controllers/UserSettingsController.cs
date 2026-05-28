using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PasswordGenerator.Data;
using PasswordGenerator.Entities;
using PasswordGenerator.Models.GeneratorSettings;
using PasswordGenerator.Services.Users.Settings;
using System.Security.Claims;

namespace PasswordGenerator.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserSettingsController : ControllerBase
    {
        private readonly IUserSettingsService userSettingsService;
        private readonly ILogger<UserSettingsController> logger;
        public UserSettingsController(IUserSettingsService userSettingsService, ILogger<UserSettingsController> logger)
        {
            this.userSettingsService = userSettingsService;
            this.logger = logger;
        }

        [HttpGet("{generatorType}")]
        public async Task<IActionResult> GetSettings(GeneratorType generatorType)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                logger.LogWarning("Get settings failed: missing user id claim");
                return Unauthorized();
            }
                
            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                logger.LogWarning($"Get settings failed: invalid user id format. ClaimValue: {userIdClaim.Value}");
                return Unauthorized();
            }

            logger.LogInformation($"User requested generator settings. UserId: {userId}, GeneratorType: {generatorType}");

            var settings = await userSettingsService.GetAllSettings(userId, generatorType);

            logger.LogInformation($"Generator settings returned successfully. UserId: {userId}, GeneratorType: {generatorType}, Count: {settings.Count()}");
            return Ok(new { Settings = settings });
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveSettings([FromBody] SaveSettingsRequest saveSettingsRequest)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                logger.LogWarning("Save settings failed: missing user id claim");
                return Unauthorized();
            }
                
            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                logger.LogWarning($"Save settings failed: invalid user id format. ClaimValue: {userIdClaim.Value}");
                return Unauthorized();
            }

            logger.LogInformation($"User started settings save operation. UserId: {userId}, GeneratorType: {saveSettingsRequest.GeneratorType}");

            await userSettingsService.SaveSettings(userId, saveSettingsRequest);
            logger.LogInformation($"Settings saved successfully. UserId: {userId}, GeneratorType: {saveSettingsRequest.GeneratorType}");
            return Ok(new { Message = "Настройки сохранены" });
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteSettings(DeleteSettingsRequest deleteSettingsRequest)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                logger.LogWarning("Delete settings failed: missing user id claim");
                return Unauthorized();
            }
                
            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                logger.LogWarning($"Delete settings failed: invalid user id format. ClaimValue: {userIdClaim.Value}");
                return Unauthorized();
            }

            logger.LogInformation($"User started settings delete operation. UserId: {userId}");

            await userSettingsService.DeleteSettings(userId, deleteSettingsRequest);

            logger.LogInformation($"Settings deleted successfully. UserId: {userId}");
            return Ok(new { Message = "Настройки удалены" });
        }
    }
}
