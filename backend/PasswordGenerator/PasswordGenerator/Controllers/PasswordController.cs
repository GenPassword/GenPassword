using Microsoft.AspNetCore.Mvc;
using PasswordGenerator.Models;
using PasswordGenerator.Services.Password.Generation;

namespace PasswordGenerator.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PasswordController : ControllerBase
{
    private readonly IPasswordGeneratorService _generator;
    private readonly IPassphraseGeneratorService passphraseGenerator;

    public PasswordController(IPasswordGeneratorService generator, IPassphraseGeneratorService passphraseGenerator)
    {
        _generator = generator;
        this.passphraseGenerator = passphraseGenerator;
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
        if (request == null)
            return BadRequest(new GeneratePasswordResponse { Message = "Тело запроса не может быть пустым." });

        var response = _generator.Generate(request);

        if (!string.IsNullOrEmpty(response.Message) && string.IsNullOrEmpty(response.Password))
            return BadRequest(response);

        return Ok(response);
    }

    [HttpPost("generate-from-words")]
    [ProducesResponseType(typeof(GeneratePasswordResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GenerateFromWords([FromBody] GeneratePasswordFromWordsRequest request)
    {
        if(request == null)
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
}
