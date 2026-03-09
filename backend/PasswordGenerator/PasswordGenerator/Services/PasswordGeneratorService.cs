using System.Security.Cryptography;
using PasswordGenerator.Domain;
using PasswordGenerator.Models;
using PasswordGenerator.Validators;

namespace PasswordGenerator.Services;

/// <summary>
/// Генерация пароля с использованием криптографически стойкого RNG.
/// RandomNumberGenerator — не обычный Random!
/// </summary>
public class PasswordGeneratorService : IPasswordGeneratorService
{
    private readonly IPasswordAnalyzerService _analyzer;
    private readonly PasswordOptionsValidator _validator;
    private readonly IPassphraseGeneratorService passphraseGeneratorService;

    public PasswordGeneratorService(
        IPasswordAnalyzerService analyzer,
        PasswordOptionsValidator validator,
        IPassphraseGeneratorService passphraseGenerator)
    {
        _analyzer = analyzer;
        _validator = validator;
        passphraseGeneratorService = passphraseGenerator;
    }

    public GeneratePasswordResponse Generate(GeneratePasswordRequest request)
    {
        var validation = _validator.Validate(request);
        if (!validation.IsValid)
            return new GeneratePasswordResponse
            {
                Password = string.Empty,
                Entropy = 0,
                StrengthLevel = StrengthLevel.VeryWeak,
                Message = string.Join(" ", validation.Errors)
            };

        var (charsByGroup, allChars) = BuildCharacterSets(request);
        var passwordChars = new char[request.Length];
        var usedChars = request.NoRepeats ? new List<char>() : null;

        // 1. Добавляем обязательные символы
        var position = 0;

        var digits = charsByGroup.Digits;
        for (var i = 0; i < request.MinDigits && i < digits.Length; i++)
        {
            var c = request.NoRepeats ? PickAndRemove(digits, usedChars!) : GetRandomChar(digits);
            passwordChars[position++] = c;
        }

        var special = charsByGroup.Special;
        for (var i = 0; i < request.MinSpecial && i < special.Length; i++)
        {
            var c = request.NoRepeats ? PickAndRemove(special, usedChars!) : GetRandomChar(special);
            passwordChars[position++] = c;
        }

        // 2. Заполняем остаток случайными символами
        var remaining = request.Length - position;
        if (request.NoRepeats)
        {
            var pool = allChars.Except(usedChars!).ToList();
            for (var i = 0; i < remaining; i++)
            {
                var idx = GetRandomIndex(pool.Count);
                var c = pool[idx];
                passwordChars[position++] = c;
                pool.RemoveAt(idx);
            }
        }
        else
        {
            for (var i = 0; i < remaining; i++)
                passwordChars[position++] = GetRandomChar(allChars);
        }

        // 3. Перемешиваем (Fisher-Yates)
        Shuffle(passwordChars);

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
        var lower = request.IncludeLowercase ? CharacterSets.FilterSimilar(CharacterSets.Lowercase, request.ExcludeSimilar) : "";
        var upper = request.IncludeUppercase ? CharacterSets.FilterSimilar(CharacterSets.Uppercase, request.ExcludeSimilar) : "";
        var digits = request.IncludeDigits ? CharacterSets.FilterSimilar(CharacterSets.Digits, request.ExcludeSimilar) : "";
        var special = request.IncludeSpecial ? CharacterSets.FilterSimilar(CharacterSets.Special, request.ExcludeSimilar) : "";

        var all = lower + upper + digits + special;
        return (new CharGroups(lower, upper, digits, special), all);
    }

    private static char GetRandomChar(string chars)
    {
        if (chars.Length == 0) throw new InvalidOperationException("Пустой набор символов");
        return chars[GetRandomIndex(chars.Length)];
    }

    /// <summary>
    /// Выбирает случайный символ из строки, исключая уже использованные. Удаляет его из доступных.
    /// </summary>
    private static char PickAndRemove(string chars, List<char> used)
    {
        var available = chars.Except(used).ToList();
        if (available.Count == 0) throw new InvalidOperationException("Недостаточно уникальных символов для NoRepeats");
        var c = available[GetRandomIndex(available.Count)];
        used.Add(c);
        return c;
    }

    /// <summary>
    /// Криптографически стойкий случайный индекс [0, maxExclusive)
    /// </summary>
    private static int GetRandomIndex(int maxExclusive)
    {
        if (maxExclusive <= 0) return 0;
        return (int)(GetRandomUInt32() % (uint)maxExclusive);
    }

    private static uint GetRandomUInt32()
    {
        var bytes = new byte[4];
        RandomNumberGenerator.Fill(bytes);
        return BitConverter.ToUInt32(bytes, 0);
    }

    private static void Shuffle(Span<char> span)
    {
        for (var i = span.Length - 1; i > 0; i--)
        {
            var j = GetRandomIndex(i + 1);
            (span[i], span[j]) = (span[j], span[i]);
        }
    }

    private record CharGroups(string Lower, string Upper, string Digits, string Special);

    public GeneratePasswordResponse GenerateFromWords (GeneratePasswordFromWordsRequest request)
    {
        return passphraseGeneratorService.Generate(request);
    }
}
