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

        public async Task<List<UserSettingDto>> GetAllSettings(int userId, GeneratorType generatorType)
        {
            var settings = await appDbContext.UserSettings
                .Where(s => s.UserId == userId && s.GeneratorType == generatorType)
                .ToListAsync();

            return settings.Select(s => new UserSettingDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    SettingsJson = s.SettingJson,
                    GeneratorType = s.GeneratorType
                }).ToList();
        }

        public async Task SaveSettings(int userId, SaveSettingsRequest saveSettingsRequest)
        {
            var parsedSettings = settingsFactory.ParseRequest(saveSettingsRequest);

            if (parsedSettings == null)
                throw new Exception("Invalid settings");

            var setting = await appDbContext.UserSettings
                .FirstOrDefaultAsync(s => s.UserId == userId && s.GeneratorType == saveSettingsRequest.GeneratorType && s.Name == saveSettingsRequest.Name);

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
                    UpdateAt = DateTime.Now,
                    Name = saveSettingsRequest.Name
                };
                await appDbContext.UserSettings.AddAsync(newSetting);
            }
            await appDbContext.SaveChangesAsync();
        }
    }
}
