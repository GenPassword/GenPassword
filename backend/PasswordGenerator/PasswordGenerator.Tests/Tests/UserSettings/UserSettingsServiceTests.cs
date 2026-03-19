using Microsoft.EntityFrameworkCore;
using NUnit.Framework.Legacy;
using PasswordGenerator.Data;
using PasswordGenerator.Models;
using PasswordGenerator.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PasswordGenerator.Tests.Tests.UserSettings
{
    [TestFixture]
    public class UserSettingsServiceTests
    {
        private AppDbContext appDbContext = null!;
        private UserSettingsService service = null!;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            appDbContext = new AppDbContext(options);
            service = new UserSettingsService(appDbContext);
        }

        [Test]
        public async Task SaveSettings_ShouldCreateNewSettings_WhenUserHasNoSettings()
        {
            int userId = 1;
            GeneratorType generatorType = GeneratorType.Random;
            string settingsJson = "{ \"length\": 12 }";
            await service.SaveSettings(userId, generatorType, settingsJson);

            var saved = await appDbContext.UserSettings
                .FirstOrDefaultAsync(x => x.UserId == userId && x.GeneratorType == generatorType);

            ClassicAssert.IsNotNull(saved);
            ClassicAssert.AreEqual(settingsJson, saved.SettingJson);
        }

        [Test]
        public async Task SaveSettings_ShouldUpdateExistingSettings_WhenSettingsAlreadyExist()
        {
            int userId = 1;
            GeneratorType generatorType = GeneratorType.Random;
            string settingsJson1 = "{ \"length\": 12 }";
            await service.SaveSettings(userId, generatorType, settingsJson1);

            string settingsJson2 = "{ \"length\": 15 }";
            await service.SaveSettings(userId, generatorType, settingsJson2);

            var saved = await appDbContext.UserSettings
                .FirstOrDefaultAsync(x => x.UserId == userId && x.GeneratorType == generatorType);
            ClassicAssert.IsNotNull(saved);
            ClassicAssert.AreEqual(settingsJson2, saved.SettingJson);
        }

        [Test]
        public async Task GetSettings_ShouldReturnNull_WhenSettingsDoNotExist()
        {
            var getSetting = await service.GetSettings(1, GeneratorType.Random);
            ClassicAssert.IsNull(getSetting);
        }

        [Test]
        public async Task GetSettings_ShouldReturnSettingsJson_WhenSettingsExist()
        {
            int userId = 1;
            GeneratorType generatorType = GeneratorType.Random;
            string settingsJson = "{ \"length\": 12 }";
            await service.SaveSettings(userId, generatorType, settingsJson);

            var getSetting = service.GetSettings(1, GeneratorType.Random);
            ClassicAssert.IsNotNull(getSetting.Result);
            ClassicAssert.AreEqual(settingsJson, getSetting.Result);
        }

        [Test]
        public async Task GetSettings_ShouldReturnCorrectSettings_ForCorrectGeneratorType()
        {
            int userId = 1;
            GeneratorType generatorType1 = GeneratorType.Random;
            GeneratorType generatorType2 = GeneratorType.Words;
            string settingsJson1 = "{ \"length\": 12 }";
            string settingsJson2 = "{ \"length\": 3 }";
            await service.SaveSettings(userId, generatorType1, settingsJson1);
            await service.SaveSettings(userId, generatorType2, settingsJson2);

            var getSetting = await service.GetSettings(1, GeneratorType.Words);
            ClassicAssert.AreEqual(settingsJson2, getSetting);
        }
    }
}
