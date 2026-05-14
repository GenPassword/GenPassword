namespace PasswordGenerator.Services.Users.SavePassword
{
    public interface IEncryptionService
    {
        string Encrypt(string str);
        string Decrypt(string str);
    }
}
