using PasswordGenerator.Services.Password.Analysis;
using PasswordGenerator.Services.Password.Validator;

public class SequentialRule : IPasswordRule
{
    private readonly ISequentialPatternChecker checker;

    public SequentialRule(ISequentialPatternChecker checker)
    {
        this.checker = checker;
    }

    public bool IsBroken(string password)
    {
        return checker.CheckPasswordForBadPattern(password);
    }
}