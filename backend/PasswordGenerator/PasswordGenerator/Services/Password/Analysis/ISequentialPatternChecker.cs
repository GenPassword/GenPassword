namespace PasswordGenerator.Services.Password.Analysis
{
    public interface ISequentialPatternChecker
    {
        List<string> CheckPasswordToSequentialPattern(string password);
        bool CheckPasswordForBadPattern(string password);
    }
}
