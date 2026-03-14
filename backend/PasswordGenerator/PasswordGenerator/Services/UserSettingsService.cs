
using Microsoft.EntityFrameworkCore;
using PasswordGenerator.Data;
using PasswordGenerator.Entities;

namespace PasswordGenerator.Services
{
    public class UserSettingsService : IUserSettingsService
    {

        private readonly AppDbContext appDbContext;

        public UserSettingsService(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public async Task<string> GetSettings(int userId, string generatorType)
        {
            var settings = await appDbContext.UserSettings
                .FirstOrDefaultAsync(s => s.UserId == userId && s.GeneratorType == generatorType);

            if (settings != null)
            {
                return settings.SettingJson;
            }
            return null;   
        }

        public async Task SaveSettings(int userId, string generatorType, string settingsJson)
        {
            var setting = await appDbContext.UserSettings
                .FirstOrDefaultAsync(s => s.UserId == userId && s.GeneratorType == generatorType);

            if (setting != null)
            {
                setting.SettingJson = settingsJson;
                setting.UpdateAt = DateTime.Now;
                appDbContext.Update(setting);
            }
            else
            {
                var newSetting = new UserSetting
                {
                    UserId = userId,
                    GeneratorType = generatorType,
                    SettingJson = settingsJson,
                    CreateAt = DateTime.Now,
                    UpdateAt = DateTime.Now
                };
                await appDbContext.UserSettings.AddAsync(newSetting);
            }
            await appDbContext.SaveChangesAsync();
        }
    }
}
