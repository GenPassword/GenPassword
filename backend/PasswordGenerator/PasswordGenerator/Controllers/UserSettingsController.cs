using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PasswordGenerator.Data;
using PasswordGenerator.Entities;
using PasswordGenerator.Models;
using PasswordGenerator.Services;
using System.Security.Claims;

namespace PasswordGenerator.Controllers
{
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
        public async Task<IActionResult> GetSettings(string generatorType)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var settingsJson = await userSettingsService.GetSettings(userId, generatorType);
            return Ok(new { Settings = settingsJson});
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveSettings([FromBody] SaveSettingsRequest saveSettingsRequest)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            await userSettingsService.SaveSettings(userId, saveSettingsRequest.GeneratorType, saveSettingsRequest.SettingsJson);
            return Ok(new { Message = "Настройки сохранены" });
        }
    }
}
