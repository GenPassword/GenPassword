namespace PasswordGenerator.Services
{
    public interface IUserSettingsService
    {
        Task SaveSettings(int  userId, string generatorType, string settingsJson);
        Task<string> GetSettings(int userId, string generatorType);
    }
}
