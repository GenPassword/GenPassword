using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PasswordGenerator.Helpers;
using PasswordGenerator.Models.GeneratorSettings;
using PasswordGenerator.Services.Users.Settings;
using System.Text.Json;

namespace PasswordGenerator.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserSettingsController : ControllerBase
    {
        private readonly IUserSettingsService userSettingsService;
        private readonly ILogger<UserSettingsController> logger;

        public UserSettingsController(
            IUserSettingsService userSettingsService,
            ILogger<UserSettingsController> logger)
        {
            this.userSettingsService = userSettingsService;
            this.logger = logger;
        }

        [HttpGet("{generatorType}")]
        public async Task<IActionResult> GetSettings(GeneratorType generatorType)
        {
            try
            {
                var userId = GetUserIdOrError(out var errorResult);
                if (errorResult != null)
                    return errorResult;

                var settings = await userSettingsService.GetAllSettings(userId!.Value, generatorType);
                return Ok(new { Settings = settings });
            }
            catch (Exception ex)
            {
                return HandleException(ex, "получении настроек");
            }
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveSettings([FromBody] SaveSettingsRequest? saveSettingsRequest)
        {
            try
            {
                if (saveSettingsRequest == null)
                    throw new ArgumentException("Тело запроса пустое или JSON не распознан.");

                if (!ModelState.IsValid)
                    throw new ArgumentException($"Невалидная модель: {string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage))}");

                var userId = GetUserIdOrError(out var errorResult);
                if (errorResult != null)
                    return errorResult;

                await userSettingsService.SaveSettings(userId!.Value, saveSettingsRequest);
                return Ok(new { Message = "Настройки сохранены" });
            }
            catch (Exception ex)
            {
                return HandleException(ex, "сохранении настроек");
            }
        }

        [HttpPost("delete")]
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteSettings([FromBody] DeleteSettingsRequest? deleteSettingsRequest)
        {
            try
            {
                if (deleteSettingsRequest == null)
                    throw new ArgumentException("Тело запроса пустое или JSON не распознан.");

                var userId = GetUserIdOrError(out var errorResult);
                if (errorResult != null)
                    return errorResult;

                await userSettingsService.DeleteSettings(userId!.Value, deleteSettingsRequest);
                return Ok(new { Message = "Настройки удалены" });
            }
            catch (Exception ex)
            {
                return HandleException(ex, "удалении настроек");
            }
        }

        private int? GetUserIdOrError(out IActionResult? errorResult)
        {
            errorResult = null;
            var userId = UserClaimsHelper.TryGetUserId(User);

            if (userId != null)
                return userId;

            var claimTypes = UserClaimsHelper.GetAvailableClaimTypes(User);
            logger.LogWarning("Не удалось получить userId из JWT. Доступные claims: {Claims}", claimTypes);
            errorResult = Unauthorized(new
            {
                message = "Не удалось определить пользователя из токена. Войдите снова.",
                debug = $"Claims в токене: {claimTypes}"
            });
            return null;
        }

        private IActionResult HandleException(Exception ex, string action)
        {
            logger.LogError(ex, "Ошибка при {Action}", action);

            var message = ex switch
            {
                ArgumentException => ex.Message,
                JsonException => ex.Message,
                InvalidOperationException => ex.Message,
                UnauthorizedAccessException => ex.Message,
                _ => $"Ошибка при {action}: {ex.Message}"
            };

            var statusCode = ex switch
            {
                ArgumentException => StatusCodes.Status400BadRequest,
                JsonException => StatusCodes.Status400BadRequest,
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                _ => StatusCodes.Status500InternalServerError
            };

            return StatusCode(statusCode, new { message });
        }
    }
}
