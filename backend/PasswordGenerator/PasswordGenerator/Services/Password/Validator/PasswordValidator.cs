using PasswordGenerator.Services.Password.Analysis;

namespace PasswordGenerator.Services.Password.Validator
{
    public class PasswordValidator : IPasswordValidator
    {
        private readonly IEnumerable<IPasswordRule> rules;


        public PasswordValidator(IEnumerable<IPasswordRule> rules)
        {
            this.rules = rules.ToList();
        }

        public bool IsInvalidPassword(string password)
        {
            return rules.Any(rule => rule.IsBroken(password));
        }
    }
}
