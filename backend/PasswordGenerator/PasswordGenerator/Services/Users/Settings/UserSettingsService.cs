using Microsoft.EntityFrameworkCore;
using PasswordGenerator.Data;
using PasswordGenerator.Entities;
using PasswordGenerator.Models.GeneratorSettings;

namespace PasswordGenerator.Services.Users.Settings
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
            if (saveSettingsRequest == null)
                throw new ArgumentNullException(nameof(saveSettingsRequest));

            if (string.IsNullOrWhiteSpace(saveSettingsRequest.Name))
                throw new ArgumentException("Имя пресета не может быть пустым.", nameof(saveSettingsRequest.Name));

            if (!Enum.IsDefined(typeof(GeneratorType), saveSettingsRequest.GeneratorType))
                throw new ArgumentException(
                    $"Недопустимый тип генератора: {saveSettingsRequest.GeneratorType}",
                    nameof(saveSettingsRequest.GeneratorType));

            settingsFactory.ParseRequest(saveSettingsRequest);

            var setting = await appDbContext.UserSettings
                .FirstOrDefaultAsync(s => s.UserId == userId && s.GeneratorType == saveSettingsRequest.GeneratorType && s.Name == saveSettingsRequest.Name);

            if (setting != null)
            {
                setting.SettingJson = saveSettingsRequest.SettingsJson;
                setting.UpdateAt = DateTime.UtcNow;
                appDbContext.Update(setting);
            }
            else
            {
                var newSetting = new UserSetting
                {
                    UserId = userId,
                    GeneratorType = saveSettingsRequest.GeneratorType,
                    SettingJson = saveSettingsRequest.SettingsJson,
                    CreateAt = DateTime.UtcNow,
                    UpdateAt = DateTime.UtcNow,
                    Name = saveSettingsRequest.Name.Trim()
                };
                await appDbContext.UserSettings.AddAsync(newSetting);
            }

            try
            {
                await appDbContext.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException(
                    $"Не удалось сохранить настройки в БД (userId={userId}, type={saveSettingsRequest.GeneratorType}, name='{saveSettingsRequest.Name}'). " +
                    "Проверьте, что применены миграции EF (колонка Name) и что пользователь существует.",
                    ex);
            }
        }

        public async Task DeleteSettings(int userId, DeleteSettingsRequest deleteSettingsRequest)
        {
            var setting = await appDbContext.UserSettings
                .FirstOrDefaultAsync(s => s.UserId == userId && s.Id == deleteSettingsRequest.Id);

            if (setting != null)
            {
                appDbContext.UserSettings.Remove(setting);
                await appDbContext.SaveChangesAsync();
            }
            else
            {
                return;
            }
        }
    }
}
