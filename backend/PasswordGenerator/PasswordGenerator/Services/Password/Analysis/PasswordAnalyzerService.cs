using PasswordGenerator.Models;

namespace PasswordGenerator.Services.Password.Analysis;

/// <summary>
/// Анализ пароля: энтропия и уровень стойкости.
/// </summary>
public class PasswordAnalyzerService : IPasswordAnalyzerService
{
    /// <summary>
    /// Энтропия в битах: log2(alphabetSize^length) = length * log2(alphabetSize)
    /// </summary>
    public double CalculateEntropy(string password, int alphabetSize)
    {
        if (alphabetSize <= 0 || password.Length == 0) return 0;
        return password.Length * Math.Log2(alphabetSize);
    }

    public StrengthLevel GetStrengthLevel(double entropy)
    {
        return entropy switch
        {
            < 28 => StrengthLevel.VeryWeak,
            < 36 => StrengthLevel.Weak,
            < 60 => StrengthLevel.Fair,
            < 128 => StrengthLevel.Strong,
            _ => StrengthLevel.VeryStrong
        };
    }
}
