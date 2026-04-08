namespace PasswordGenerator.Services.Password.Analysis;

public interface IPasswordAnalyzerService
{
    double CalculateEntropy(string password, int alphabetSize);
    Models.StrengthLevel GetStrengthLevel(double entropy);
}
