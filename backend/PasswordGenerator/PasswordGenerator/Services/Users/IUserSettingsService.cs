using PasswordGenerator.Models.GeneratorSettings;

namespace PasswordGenerator.Services.Users
{
    public interface IUserSettingsService
    {
        Task SaveSettings(int  userId, SaveSettingsRequest saveSettingsRequest);
        Task<string> GetAllSettings(int userId, GeneratorType generatorType);
    }
}
