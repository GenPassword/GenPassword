using PasswordGenerator.Domain;
using PasswordGenerator.Models;
using PasswordGenerator.Services.Password.Analysis;
using PasswordGenerator.Services.Password.Generation;
using PasswordGenerator.Services.Password.Helpers;
using PasswordGenerator.Validators;

namespace PasswordGenerator.Services;

/// <summary>
/// Генерация пароля с использованием криптографически стойкого RNG.
/// RandomNumberGenerator — не обычный Random!
/// </summary>
public partial class PasswordGeneratorService : IPasswordGeneratorService
{
    private readonly IPasswordAnalyzerService _analyzer;
    private readonly PasswordOptionsValidator _validator;

    public PasswordGeneratorService(
        IPasswordAnalyzerService analyzer,
        PasswordOptionsValidator validator)
    {
        _analyzer = analyzer;
        _validator = validator;
    }

    public GeneratePasswordResponse Generate(GeneratePasswordRequest request)
    {
        var validation = _validator.Validate(request); // Проверяет, валиден ли запрос
        if (!validation.IsValid)
            return new GeneratePasswordResponse
            {
                Password = string.Empty,
                Entropy = 0,
                StrengthLevel = StrengthLevel.VeryWeak,
                Message = string.Join(" ", validation.Errors) // Если не валиден, отправляет ошибку и делает сброс
            };

        var (charsByGroup, allChars) = BuildCharacterSets(request);
        var passwordChars = new char[request.Length];

        var usedChars = request.NoRepeats // Если запрошен пароль с уникальными символами, символы будут проверяться на повтор
            ? new List<char>() 
            : null;

        // 1. Добавляем обязательные символы
        var position = 0;

        var digits = charsByGroup.Digits;
        for (var i = 0; i < request.MinDigits && i < digits.Length; i++)
        {
            var c = request.NoRepeats
                ? CharacterSetHelper.PickAndRemove(digits, usedChars!)
                : CharacterSetHelper.GetRandomChar(digits);

            passwordChars[position++] = c;
        }

        var special = charsByGroup.Special;
        for (var i = 0; i < request.MinSpecial && i < special.Length; i++)
        {
            var c = request.NoRepeats
                ? CharacterSetHelper.PickAndRemove(special, usedChars!)
                : CharacterSetHelper.GetRandomChar(special);

            passwordChars[position++] = c;
        }

        // 2. Заполняем остаток случайными символами
        var remaining = request.Length - position;
        if (request.NoRepeats)
        {
            var pool = allChars.Except(usedChars!).ToList();
            for (var i = 0; i < remaining; i++)
            {
                var idx = CryptoRandomHelper.GetRandomIndex(pool.Count);
                var c = pool[idx];
                passwordChars[position++] = c;
                pool.RemoveAt(idx);
            }
        }
        else
        {
            for (var i = 0; i < remaining; i++)
                passwordChars[position++] = CharacterSetHelper.GetRandomChar(allChars);
        }

        // 3. Перемешиваем (Fisher-Yates)
        CryptoRandomHelper.Shuffle(passwordChars);

        var password = new string(passwordChars);
        var entropy = _analyzer.CalculateEntropy(password, allChars.Length);
        var strength = _analyzer.GetStrengthLevel(entropy);

        return new GeneratePasswordResponse
        {
            Password = password,
            Entropy = Math.Round(entropy, 2),
            StrengthLevel = strength
        };
    }

    private (CharGroups chars, string all) BuildCharacterSets(GeneratePasswordRequest request)
    {
        string GetFilteredSet(string charset, bool isEnabled) => isEnabled
            ? CharacterSets.FilterSimilar(charset, request.ExcludeSimilar)
            : string.Empty;

        var lower = GetFilteredSet(CharacterSets.Lowercase, request.IncludeLowercase);
        var upper = GetFilteredSet(CharacterSets.Uppercase, request.IncludeUppercase);
        var digits = GetFilteredSet(CharacterSets.Digits, request.IncludeDigits);
        var special = GetFilteredSet(CharacterSets.Special, request.IncludeSpecial);

        var all = lower + upper + digits + special;

        return (new CharGroups(lower, upper, digits, special), all);
    }
}
