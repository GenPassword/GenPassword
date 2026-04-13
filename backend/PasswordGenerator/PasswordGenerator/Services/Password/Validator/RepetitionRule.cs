using PasswordGenerator.Services.Password.Analysis;
using PasswordGenerator.Services.Password.Validator;

public class RepetitionRule : IPasswordRule
{
    private readonly IRepetitionPatternChecker checker;

    public RepetitionRule(IRepetitionPatternChecker checker)
    {
        this.checker = checker;
    }

    public bool IsBroken(string password)
    {
        return checker.RepetitionChecker(password);
    }
}