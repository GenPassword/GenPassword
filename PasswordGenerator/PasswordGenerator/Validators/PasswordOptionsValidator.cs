using PasswordGenerator.Domain;
using PasswordGenerator.Models;

namespace PasswordGenerator.Validators;

/// <summary>
/// Валидация настроек генерации пароля.
/// Проверяет конфликты и edge cases.
/// </summary>
public class PasswordOptionsValidator
{
    public ValidationResult Validate(GeneratePasswordRequest request)
    {
        var errors = new List<string>();
        // Длина: 4 ≤ Length ≤ 64
        if (request.Length < 4 || request.Length > 64)
            errors.Add("Длина пароля должна быть от 4 до 64 символов.");

        // Выбрана хотя бы одна группа
        if (!request.IncludeLowercase && !request.IncludeUppercase &&
            !request.IncludeDigits && !request.IncludeSpecial)
            errors.Add("Необходимо выбрать хотя бы одну группу символов.");

        // MinDigits ≤ Length
        if (request.MinDigits > request.Length)
            errors.Add("MinDigits не может превышать длину пароля.");

        // MinSpecial ≤ Length
        if (request.MinSpecial > request.Length)
            errors.Add("MinSpecial не может превышать длину пароля.");

        // MinDigits + MinSpecial ≤ Length
        if (request.MinDigits + request.MinSpecial > request.Length)
            errors.Add("Сумма MinDigits и MinSpecial не может превышать длину пароля.");

        // NoRepeats → длина ≤ размер алфавита (важный edge case!)
        if (request.NoRepeats)
        {
            var alphabetSize = GetAlphabetSize(request);
            if (request.Length > alphabetSize)
                errors.Add($"При NoRepeats длина не может превышать размер алфавита ({alphabetSize} символов).");
        }

        return errors.Count == 0 ? ValidationResult.Success() : ValidationResult.Failure([.. errors]);
    }

    /// <summary>
    /// Размер итогового алфавита (с учётом ExcludeSimilar)
    /// </summary>
    private static int GetAlphabetSize(GeneratePasswordRequest request)
    {
        var size = 0;
        if (request.IncludeLowercase) size += CharacterSets.FilterSimilar(CharacterSets.Lowercase, request.ExcludeSimilar).Length;
        if (request.IncludeUppercase) size += CharacterSets.FilterSimilar(CharacterSets.Uppercase, request.ExcludeSimilar).Length;
        if (request.IncludeDigits) size += CharacterSets.FilterSimilar(CharacterSets.Digits, request.ExcludeSimilar).Length;
        if (request.IncludeSpecial) size += CharacterSets.FilterSimilar(CharacterSets.Special, request.ExcludeSimilar).Length;
        return size;
    }
}
