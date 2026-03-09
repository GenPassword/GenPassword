using PasswordGenerator.Models;

namespace PasswordGenerator.Services
{
    public interface IPassphraseGeneratorService
    {
        GeneratePasswordResponse Generate(GeneratePasswordFromWordsRequest request);
    }
}
