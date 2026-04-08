using PasswordGenerator.Models;

namespace PasswordGenerator.Services.Password.Generation;

public interface IPasswordGeneratorService
{
    GeneratePasswordResponse Generate(GeneratePasswordRequest request);
}
