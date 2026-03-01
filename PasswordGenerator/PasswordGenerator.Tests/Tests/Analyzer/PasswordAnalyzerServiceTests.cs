using NUnit.Framework;
using PasswordGenerator.Models;
using PasswordGenerator.Services;

namespace PasswordGenerator.Tests.Analyzer;

[TestFixture]
public class PasswordAnalyzerServiceTests
{
    private readonly PasswordAnalyzerService _analyzer = new();

    [Test]
    public void CalculateEntropy_WithSimpleValues_ShouldMatchFormula()
    {
        // Arrange
        const string password = "abcd"; // length = 4
        const int alphabetSize = 2;

        // Act
        var entropy = _analyzer.CalculateEntropy(password, alphabetSize);

        // Assert
        var expected = password.Length * Math.Log2(alphabetSize);
        Assert.That(entropy, Is.EqualTo(expected).Within(1e-10));
    }

    [Test]
    public void CalculateEntropy_WithZeroAlphabetOrEmptyPassword_ShouldReturnZero()
    {
        // Arrange
        const string password = "";
        const int alphabetSize = 0;

        // Act
        var entropy1 = _analyzer.CalculateEntropy(password, 10);
        var entropy2 = _analyzer.CalculateEntropy("abc", alphabetSize);

        // Assert
        Assert.That(entropy1, Is.EqualTo(0));
        Assert.That(entropy2, Is.EqualTo(0));
    }

    [TestCase(10, StrengthLevel.VeryWeak)]
    [TestCase(30, StrengthLevel.Weak)]
    [TestCase(40, StrengthLevel.Fair)]
    [TestCase(80, StrengthLevel.Strong)]
    [TestCase(130, StrengthLevel.VeryStrong)]
    public void GetStrengthLevel_ShouldReturnExpectedLevel(double entropy, StrengthLevel expected)
    {
        // Act
        var level = _analyzer.GetStrengthLevel(entropy);

        // Assert
        Assert.That(level, Is.EqualTo(expected));
    }
}

