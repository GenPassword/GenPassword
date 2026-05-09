using PasswordGenerator.Models.GeneratePassword;

namespace PasswordGenerator.Services.Password.Analysis;

public interface IPasswordAnalyzerService
{
    double CalculateEntropy(string password, int alphabetSize);
    StrengthLevel GetStrengthLevel(double entropy);
}
