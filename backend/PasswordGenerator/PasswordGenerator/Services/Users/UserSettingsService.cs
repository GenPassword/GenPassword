using Microsoft.EntityFrameworkCore;
using PasswordGenerator.Data;
using PasswordGenerator.Entities;
using PasswordGenerator.Models.GeneratorSettings;

namespace PasswordGenerator.Services.Users
{
    public class UserSettingsService : IUserSettingsService
    {

        private readonly AppDbContext appDbContext;
        private readonly SettingsFactory settingsFactory;
        public UserSettingsService(AppDbContext appDbContext, SettingsFactory settingsFactory)
        {
            this.appDbContext = appDbContext;
            this.settingsFactory = settingsFactory;
        }

        public async Task<string> GetSettings(int userId, GeneratorType generatorType)
        {
            var settings = await appDbContext.UserSettings
                .FirstOrDefaultAsync(s => s.UserId == userId && s.GeneratorType == generatorType);

            if (settings != null)
            {
                return settings.SettingJson;
            }
            return null;   
        }

        public async Task SaveSettings(int userId, SaveSettingsRequest saveSettingsRequest)
        {
            var parsedSettings = settingsFactory.ParseRequest(saveSettingsRequest);

            if (parsedSettings == null)
                throw new Exception("Invalid settings");

            var setting = await appDbContext.UserSettings
                .FirstOrDefaultAsync(s => s.UserId == userId && s.GeneratorType == saveSettingsRequest.GeneratorType);

            if (setting != null)
            {
                setting.SettingJson = saveSettingsRequest.SettingsJson;
                setting.UpdateAt = DateTime.Now;
                appDbContext.Update(setting);
            }
            else
            {
                var newSetting = new UserSetting
                {
                    UserId = userId,
                    GeneratorType = saveSettingsRequest.GeneratorType,
                    SettingJson = saveSettingsRequest.SettingsJson,
                    CreateAt = DateTime.Now,
                    UpdateAt = DateTime.Now
                };
                await appDbContext.UserSettings.AddAsync(newSetting);
            }
            await appDbContext.SaveChangesAsync();
        }
    }
}
