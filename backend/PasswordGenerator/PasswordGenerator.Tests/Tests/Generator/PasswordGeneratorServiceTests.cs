using PasswordGenerator.Domain;
using PasswordGenerator.Models;
using PasswordGenerator.Services;
using PasswordGenerator.Services.Password.Analysis;
using PasswordGenerator.Validators;


namespace PasswordGenerator.Tests.Generator;

[TestFixture]
public class PasswordGeneratorServiceTests
{
    private PasswordGeneratorService CreateService()
    {
        var analyzer = new PasswordAnalyzerService();
        var validator = new PasswordOptionsValidator();
        return new PasswordGeneratorService(analyzer, validator);
    }

    [TestCase(4)]
    [TestCase(16)]
    [TestCase(64)]
    public void Generate_ShouldReturnPassword_WithRequestedLength(int length)
    {
        // Arrange
        var service = CreateService();
        var request = new GeneratePasswordRequest
        {
            Length = length,
            IncludeLowercase = true,
            IncludeUppercase = false,
            IncludeDigits = false,
            IncludeSpecial = false
        };

        // Act
        var result = service.Generate(request);

        // Assert
        Assert.That(result.Password, Is.Not.Empty);
        Assert.That(result.Password.Length, Is.EqualTo(length));
        Assert.That(result.Message, Is.Null.Or.Empty);
    }

    [Test]
    public void Generate_WithExcludeSimilar_ShouldNotContainSimilarCharacters()
    {
        // Arrange
        var service = CreateService();
        var request = new GeneratePasswordRequest
        {
            Length = 32,
            IncludeLowercase = true,
            IncludeUppercase = true,
            IncludeDigits = true,
            IncludeSpecial = true,
            ExcludeSimilar = true
        };

        // Act
        var result = service.Generate(request);

        // Assert
        foreach (var c in CharacterSets.Similar)
        {
            Assert.That(result.Password.Contains(c), Is.False,
                $"Password should not contain similar character '{c}' when ExcludeSimilar is true.");
        }
    }

    [Test]
    public void Generate_WithNoRepeats_ShouldProducePasswordWithoutDuplicateCharacters()
    {
        // Arrange
        var service = CreateService();
        var request = new GeneratePasswordRequest
        {
            Length = 10,
            IncludeLowercase = true,
            IncludeUppercase = false,
            IncludeDigits = false,
            IncludeSpecial = false,
            NoRepeats = true
        };

        // Act
        var result = service.Generate(request);

        // Assert
        var distinctCount = result.Password.Distinct().Count();
        Assert.That(distinctCount, Is.EqualTo(result.Password.Length),
            "Password should not contain repeated characters when NoRepeats is true.");
    }

    [Test]
    public void Generate_WithNoRepeatsAndLengthGreaterThanAlphabet_ShouldReturnValidationError()
    {
        // Arrange
        var service = CreateService();
        var length = CharacterSets.Lowercase.Length + 1;

        var request = new GeneratePasswordRequest
        {
            Length = length,
            IncludeLowercase = true,
            IncludeUppercase = false,
            IncludeDigits = false,
            IncludeSpecial = false,
            NoRepeats = true
        };

        // Act
        var result = service.Generate(request);

        // Assert
        Assert.That(result.Password, Is.Empty);
        Assert.That(result.Entropy, Is.EqualTo(0));
        Assert.That(result.StrengthLevel, Is.EqualTo(StrengthLevel.VeryWeak));
        Assert.That(result.Message, Does.Contain("NoRepeats").IgnoreCase);
    }

    [Test]
    public void Generate_WithMinDigits_ShouldContainAtLeastSpecifiedNumberOfDigits()
    {
        // Arrange
        var service = CreateService();
        const int minDigits = 3;
        var request = new GeneratePasswordRequest
        {
            Length = 12,
            IncludeLowercase = true,
            IncludeUppercase = false,
            IncludeDigits = true,
            IncludeSpecial = false,
            MinDigits = minDigits
        };

        // Act
        var result = service.Generate(request);

        // Assert
        var digitCount = result.Password.Count(char.IsDigit);
        Assert.That(digitCount, Is.GreaterThanOrEqualTo(minDigits));
    }

    [Test]
    public void Generate_WithMinSpecial_ShouldContainAtLeastSpecifiedNumberOfSpecialCharacters()
    {
        // Arrange
        var service = CreateService();
        const int minSpecial = 2;
        var request = new GeneratePasswordRequest
        {
            Length = 12,
            IncludeLowercase = true,
            IncludeUppercase = false,
            IncludeDigits = false,
            IncludeSpecial = true,
            MinSpecial = minSpecial
        };

        // Act
        var result = service.Generate(request);

        // Assert
        var specialCount = result.Password.Count(c => CharacterSets.Special.Contains(c));
        Assert.That(specialCount, Is.GreaterThanOrEqualTo(minSpecial));
    }

    [Test]
    public void Generate_WithInvalidLength_ShouldReturnErrorResult()
    {
        // Arrange
        var service = CreateService();
        var request = new GeneratePasswordRequest
        {
            Length = 1,
            IncludeLowercase = true
        };

        // Act
        var result = service.Generate(request);

        // Assert
        Assert.That(result.Password, Is.Empty);
        Assert.That(result.Entropy, Is.EqualTo(0));
        Assert.That(result.StrengthLevel, Is.EqualTo(StrengthLevel.VeryWeak));
        Assert.That(result.Message, Is.Not.Null.And.Not.Empty);
    }

    [Test]
    public void Generate_WithSameSettings_ShouldProduceDifferentPasswords_MostOfTheTime()
    {
        // Arrange
        var service = CreateService();
        var request = new GeneratePasswordRequest
        {
            Length = 16,
            IncludeLowercase = true,
            IncludeUppercase = true,
            IncludeDigits = true,
            IncludeSpecial = false
        };

        // Act
        var first = service.Generate(request).Password;
        var passwords = Enumerable.Range(0, 10)
            .Select(_ => service.Generate(request).Password)
            .ToList();

        // Assert
        Assert.That(passwords.Any(p => p != first),
            "Expected at least one generated password to differ from the first one.");
    }
}

