using PasswordGenerator.Models.GeneratorSettings;

namespace PasswordGenerator.Services.Users.Settings
{
    public interface IUserSettingsService
    {
        Task SaveSettings(int  userId, SaveSettingsRequest saveSettingsRequest);
        Task<List<UserSettingDto>> GetAllSettings(int userId, GeneratorType generatorType);
        Task DeleteSettings(int userId, DeleteSettingsRequest deleteSettingsRequest);
    }
}
