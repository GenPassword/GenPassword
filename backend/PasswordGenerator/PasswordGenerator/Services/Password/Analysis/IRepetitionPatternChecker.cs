namespace PasswordGenerator.Services.Password.Analysis
{
    public interface IRepetitionPatternChecker
    {
        bool RepetitionChecker(string password);
    }
}
