using Microsoft.AspNetCore.Mvc;
using PasswordGenerator.Models;
using PasswordGenerator.Services.Password.Generation;
using PasswordGenerator.Services.RateLimiting;

namespace PasswordGenerator.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PasswordController : ControllerBase
{
    private readonly IPasswordGeneratorService generator;
    private readonly IPassphraseGeneratorService passphraseGenerator;
    private readonly IRequestRateLimiter rateLimiter;
    private static int countRequest = 0;

    public PasswordController(IPasswordGeneratorService generator, IPassphraseGeneratorService passphraseGenerator, IRequestRateLimiter rateLimiter)
    {
        this.generator = generator;
        this.passphraseGenerator = passphraseGenerator;
        this.rateLimiter = rateLimiter;
    }

    /// <summary>
    /// Генерирует пароль по настройкам.
    /// Контроллер только принимает JSON, вызывает сервис, возвращает ответ.
    /// </summary>
    [HttpPost("generate")]
    [ProducesResponseType(typeof(GeneratePasswordResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Generate([FromBody] GeneratePasswordRequest request)
    {
        var key = GetClientKey();
        Console.Write("User: " + key + " ");
        Console.WriteLine("Запрос номер " + countRequest++);


        if (request == null)
            return BadRequest(new GeneratePasswordResponse { Message = "Тело запроса не может быть пустым." });

        var response = generator.Generate(request);

        if (!string.IsNullOrEmpty(response.Message) && string.IsNullOrEmpty(response.Password))
            return BadRequest(response);

        return Ok(response);
    }

    [HttpPost("generate-from-words")]
    [ProducesResponseType(typeof(GeneratePasswordResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GenerateFromWords([FromBody] GeneratePasswordFromWordsRequest request)
    {
        var key = GetClientKey();
        Console.Write("User ip: " + key + " ");
        Console.WriteLine("Запрос номер " + countRequest++);


        if (request == null)
        {
            return BadRequest(new GeneratePasswordResponse { Message = "Тело запроса не может быть пустым." });
        }
        var result = passphraseGenerator.Generate(request);

        if(!string.IsNullOrEmpty(result.Message) && string.IsNullOrEmpty(result.Password))
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    private string GetClientKey()
    {
        if (User?.Identity?.IsAuthenticated == true)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if(!string.IsNullOrEmpty(userId))
                return "user:" + userId;
        }
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        return string.IsNullOrEmpty(ip) ? "anonym" : "ip:" + ip;
    }
}
