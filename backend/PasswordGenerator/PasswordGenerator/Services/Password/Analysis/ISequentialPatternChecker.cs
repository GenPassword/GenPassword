namespace PasswordGenerator.Services.Password.Analysis
{
    public interface ISequentialPatternChecker
    {
        List<string> FindSequentialPatternInPassword(string password);
        bool CheckPasswordForBadPattern(string password);
    }
}
