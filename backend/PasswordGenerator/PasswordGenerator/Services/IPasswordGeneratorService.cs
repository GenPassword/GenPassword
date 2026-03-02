using PasswordGenerator.Models;

namespace PasswordGenerator.Services;

public interface IPasswordGeneratorService
{
    GeneratePasswordResponse Generate(GeneratePasswordRequest request);
}
