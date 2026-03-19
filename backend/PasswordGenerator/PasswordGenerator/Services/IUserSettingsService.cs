using PasswordGenerator.Models;

namespace PasswordGenerator.Services
{
    public interface IUserSettingsService
    {
        Task SaveSettings(int  userId, GeneratorType generatorType, string settingsJson);
        Task<string> GetSettings(int userId, GeneratorType generatorType);
    }
}
