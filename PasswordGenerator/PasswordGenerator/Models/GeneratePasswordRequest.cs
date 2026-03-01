namespace PasswordGenerator.Models;

public class GeneratePasswordRequest
{
    public int Length { get; set; }
    public bool IncludeLowercase { get; set; } = true;
    public bool IncludeUppercase { get; set; } = true;
    public bool IncludeDigits { get; set; } = true;
    public bool IncludeSpecial { get; set; }

    /// <summary>
    /// Исключить похожие символы (O0, Il1)
    /// </summary>
    public bool ExcludeSimilar { get; set; }

    /// <summary>
    /// Запретить повторяющиеся символы
    /// </summary>
    public bool NoRepeats { get; set; }

    public int MinDigits { get; set; }
    public int MinSpecial { get; set; }
}
