using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PasswordGenerator.Data;
using PasswordGenerator.Entities;
using PasswordGenerator.Models.GeneratorSettings;
using PasswordGenerator.Services.Users;
using System.Security.Claims;

namespace PasswordGenerator.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserSettingsController : ControllerBase
    {
        private readonly IUserSettingsService userSettingsService;

        public UserSettingsController(IUserSettingsService userSettingsService)
        {
            this.userSettingsService = userSettingsService;
        }

        [HttpGet("{generatorType}")]
        public async Task<IActionResult> GetSettings(GeneratorType generatorType)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return Unauthorized();
            if (!int.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized();
            var settings = await userSettingsService.GetAllSettings(userId, generatorType);
            return Ok(new { Settings = settings });
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveSettings([FromBody] SaveSettingsRequest saveSettingsRequest)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            await userSettingsService.SaveSettings(userId, saveSettingsRequest);
            return Ok(new { Message = "Настройки сохранены" });
        }
    }
}
