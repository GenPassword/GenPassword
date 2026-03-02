namespace PasswordGenerator.Services;

public interface IPasswordAnalyzerService
{
    double CalculateEntropy(string password, int alphabetSize);
    Models.StrengthLevel GetStrengthLevel(double entropy);
}
