using PasswordGenerator.Models.GeneratePassword;

namespace PasswordGenerator.Services.Password.Generation
{
    public interface IPassphraseGeneratorService
    {
        GeneratePasswordResponse Generate(GeneratePasswordFromWordsRequest request);
    }
}
