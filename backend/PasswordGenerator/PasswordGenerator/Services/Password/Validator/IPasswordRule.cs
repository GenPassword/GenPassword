namespace PasswordGenerator.Services.Password.Validator
{
    public interface IPasswordRule
    {
        bool IsBroken(string password);
    }
}
