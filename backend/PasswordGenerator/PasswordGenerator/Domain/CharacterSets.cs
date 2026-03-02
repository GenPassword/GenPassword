namespace PasswordGenerator.Domain;

/// <summary>
/// Централизованные наборы символов для генерации паролей.
/// Не размазываем строки по всему коду.
/// </summary>
public static class CharacterSets
{
    public const string Lowercase = "abcdefghijklmnopqrstuvwxyz";
    public const string Uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    public const string Digits = "0123456789";
    public const string Special = "!@#$%^&*()_+-=[]{}|;:',.<>?/`~";

    /// <summary>
    /// Похожие символы (O0Il1) — исключаются при ExcludeSimilar
    /// </summary>
    public const string Similar = "O0Il1";

    /// <summary>
    /// Возвращает набор символов без похожих, если excludeSimilar = true
    /// </summary>
    public static string FilterSimilar(string chars, bool excludeSimilar) =>
        excludeSimilar ? string.Concat(chars.Where(c => !Similar.Contains(c))) : chars;
}
