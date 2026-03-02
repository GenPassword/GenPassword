using NUnit.Framework;
using PasswordGenerator.Domain;
using PasswordGenerator.Models;
using PasswordGenerator.Validators;

namespace PasswordGenerator.Tests.Validator;

[TestFixture]
public class PasswordOptionsValidatorTests
{
    private readonly PasswordOptionsValidator _validator = new();

    private static GeneratePasswordRequest CreateValidRequest() => new()
    {
        Length = 12,
        IncludeLowercase = true,
        IncludeUppercase = true,
        IncludeDigits = true,
        IncludeSpecial = false,
        MinDigits = 2,
        MinSpecial = 0
    };

    [Test]
    public void Validate_WithValidRequest_ShouldBeValid()
    {
        // Arrange
        var request = CreateValidRequest();

        // Act
        var result = _validator.Validate(request);

        // Assert
        Assert.That(result.IsValid, Is.True);
        Assert.That(result.Errors, Is.Empty);
    }

    [TestCase(1)]
    [TestCase(3)]
    [TestCase(65)]
    public void Validate_WithInvalidLength_ShouldReturnError(int length)
    {
        // Arrange
        var request = CreateValidRequest();
        request.Length = length;

        // Act
        var result = _validator.Validate(request);

        // Assert
        Assert.That(result.IsValid, Is.False);
        Assert.That(result.Errors, Has.One.Matches<string>(e =>
            e.Contains("Длина пароля должна быть от 4 до 64")));
    }

    [Test]
    public void Validate_WithoutAnyCharacterGroups_ShouldReturnError()
    {
        // Arrange
        var request = new GeneratePasswordRequest
        {
            Length = 12,
            IncludeLowercase = false,
            IncludeUppercase = false,
            IncludeDigits = false,
            IncludeSpecial = false
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        Assert.That(result.IsValid, Is.False);
        Assert.That(result.Errors, Has.One.Matches<string>(e =>
            e.Contains("Необходимо выбрать хотя бы одну группу символов")));
    }

    [Test]
    public void Validate_MinDigitsGreaterThanLength_ShouldReturnError()
    {
        // Arrange
        var request = CreateValidRequest();
        request.Length = 8;
        request.MinDigits = 9;

        // Act
        var result = _validator.Validate(request);

        // Assert
        Assert.That(result.IsValid, Is.False);
        Assert.That(result.Errors, Has.One.Matches<string>(e =>
            e.Contains("MinDigits не может превышать длину пароля")));
    }

    [Test]
    public void Validate_MinSpecialGreaterThanLength_ShouldReturnError()
    {
        // Arrange
        var request = CreateValidRequest();
        request.Length = 8;
        request.MinSpecial = 9;
        request.MinDigits = 0;

        // Act
        var result = _validator.Validate(request);

        // Assert
        Assert.That(result.IsValid, Is.False);
        Assert.That(result.Errors, Has.Some.Matches<string>(e =>
            e.Contains("MinSpecial не может превышать длину пароля")));
    }

    [Test]
    public void Validate_SumOfMinDigitsAndMinSpecialGreaterThanLength_ShouldReturnError()
    {
        // Arrange
        var request = CreateValidRequest();
        request.Length = 8;
        request.MinDigits = 5;
        request.MinSpecial = 4;

        // Act
        var result = _validator.Validate(request);

        // Assert
        Assert.That(result.IsValid, Is.False);
        Assert.That(result.Errors, Has.One.Matches<string>(e =>
            e.Contains("Сумма MinDigits и MinSpecial не может превышать длину пароля")));
    }

    [Test]
    public void Validate_NoRepeatsWithLengthGreaterThanAlphabet_ShouldReturnError()
    {
        // Arrange
        var request = new GeneratePasswordRequest
        {
            Length = CharacterSets.Lowercase.Length + 1,
            IncludeLowercase = true,
            IncludeUppercase = false,
            IncludeDigits = false,
            IncludeSpecial = false,
            NoRepeats = true
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        Assert.That(result.IsValid, Is.False);
        Assert.That(result.Errors, Has.One.Matches<string>(e =>
            e.Contains("NoRepeats") || e.Contains("длину не может превышать размер алфавита")));
    }

    [Test]
    public void Validate_WithExcludeSimilar_ShouldStillHaveNonZeroAlphabet_WhenGroupsSelected()
    {
        // Arrange
        var request = new GeneratePasswordRequest
        {
            Length = 10,
            IncludeLowercase = true,
            IncludeUppercase = true,
            IncludeDigits = true,
            IncludeSpecial = true,
            ExcludeSimilar = true,
            NoRepeats = true
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        Assert.That(result.IsValid, Is.True);
    }
}

