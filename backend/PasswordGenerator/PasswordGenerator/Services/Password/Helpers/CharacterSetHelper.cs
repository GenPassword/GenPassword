namespace PasswordGenerator.Services.Password.Helpers;

/// <summary>
/// Вспомогательные методы для выбора символов из набора.
/// </summary>
public static class CharacterSetHelper
{
    /// <summary>
    /// Выбирает случайный символ из строки.
    /// </summary>
    public static char GetRandomChar(string chars)
    {
        if (string.IsNullOrEmpty(chars))
            throw new InvalidOperationException("Пустой набор символов");

        return chars[CryptoRandomHelper.GetRandomIndex(chars.Length)];
    }

    /// <summary>
    /// Выбирает случайный символ из строки, исключая уже использованные, и добавляет его в список использованных.
    /// </summary>
    public static char PickAndRemove(string chars, List<char> used)
    {
        var available = chars.Except(used).ToList();

        if (available.Count == 0)
            throw new InvalidOperationException("Недостаточно уникальных символов для NoRepeats");

        var c = available[CryptoRandomHelper.GetRandomIndex(available.Count)];
        used.Add(c);

        return c;
    }
}