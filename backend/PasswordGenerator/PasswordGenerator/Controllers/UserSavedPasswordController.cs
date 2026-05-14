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

        public UserSavedPasswordController(IUserSavedPasswordService savedPasswordService)
        {
            this.savedPasswordService = savedPasswordService;
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveUserPassword(SavePasswordRequest savePasswordRequest)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return Unauthorized();
            if (!int.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized();
            await savedPasswordService.SavePassword(userId, savePasswordRequest);
            return Ok(new { Message = "Пароль сохранен" });
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteUserPassword(DeletePasswordRequest deletePasswordRequest)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return Unauthorized();
            if (!int.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized();
            await savedPasswordService.DeletePassword(userId, deletePasswordRequest);
            return Ok(new { Message = "Пароль удален" });
        }

        [HttpGet("getSaves")]
        public async Task<IActionResult> GetSettings()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return Unauthorized();
            if (!int.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized();
            var passwordDtos = await savedPasswordService.GetAllPassword(userId);
            return Ok(new { saves = passwordDtos });
        }

    }
}
