namespace PasswordGenerator.Services.Password.Validator
{
    public interface IPasswordValidator
    {
        bool IsInvalidPassword(string password);
    }
}
