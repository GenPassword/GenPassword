using Microsoft.EntityFrameworkCore;
using NUnit.Framework.Legacy;
using PasswordGenerator.Data;
using PasswordGenerator.Models.GeneratorSettings;
using PasswordGenerator.Services.Users;


namespace PasswordGenerator.Tests.Tests.UserSettings
{
    [TestFixture]
    public class UserSettingsServiceTests
    {
        private AppDbContext appDbContext = null!;
        private UserSettingsService service = null!;
        private SettingsFactory settingsFactory = new SettingsFactory();

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            appDbContext = new AppDbContext(options);
            service = new UserSettingsService(appDbContext, settingsFactory);
        }

        [Test]
        public async Task SaveSettings_ShouldCreateNewSettings_WhenUserHasNoSettings()
        {
            int userId = 1;
            GeneratorType generatorType = GeneratorType.Random;
            string settingsJson = "{ \"length\": 12 }";
            var request = MakeRequest(generatorType, settingsJson);
            await service.SaveSettings(userId, request);

            var saved = await appDbContext.UserSettings
                .FirstOrDefaultAsync(x => x.UserId == userId && x.GeneratorType == generatorType);

            Assert.That(saved, Is.Not.Null);
            Assert.That(settingsJson, Is.EqualTo(saved.SettingJson));
        }

        [Test]
        public async Task SaveSettings_ShouldUpdateExistingSettings_WhenSettingsAlreadyExist()
        {
            int userId = 1;
            GeneratorType generatorType = GeneratorType.Random;
            string settingsJson1 = "{ \"length\": 12 }";
            var request1 = MakeRequest(generatorType, settingsJson1);
            await service.SaveSettings(userId, request1);

            string settingsJson2 = "{ \"length\": 15 }";
            var request2 = MakeRequest(generatorType, settingsJson2);
            await service.SaveSettings(userId, request2);

            var saved = await appDbContext.UserSettings
                .FirstOrDefaultAsync(x => x.UserId == userId && x.GeneratorType == generatorType);
            Assert.That(saved, Is.Not.Null);
            Assert.That(settingsJson2, Is.EqualTo(saved.SettingJson));
        }

        [Test]
        public async Task GetSettings_ShouldReturnNull_WhenSettingsDoNotExist()
        {
            var getSetting = await service.GetSettings(1, GeneratorType.Random);
            Assert.That(getSetting, Is.Null);
        }

        [Test]
        public async Task GetSettings_ShouldReturnSettingsJson_WhenSettingsExist()
        {
            int userId = 1;
            GeneratorType generatorType = GeneratorType.Random;
            string settingsJson = "{ \"length\": 12 }";
            var request = MakeRequest(generatorType, settingsJson);
            await service.SaveSettings(userId, request);

            var getSetting = service.GetSettings(1, GeneratorType.Random);
            Assert.That(getSetting.Result, Is.Not.Null);
            Assert.That(settingsJson, Is.EqualTo(getSetting.Result));

        }

        [Test]
        public async Task GetSettings_ShouldReturnCorrectSettings_ForCorrectGeneratorType()
        {
            int userId = 1;
            GeneratorType generatorType1 = GeneratorType.Random;
            GeneratorType generatorType2 = GeneratorType.Words;
            string settingsJson1 = "{ \"length\": 12 }";
            string settingsJson2 = "{ \"length\": 3 }";
            var request1 = MakeRequest(generatorType1, settingsJson1);
            await service.SaveSettings(userId, request1);
            var request2 = MakeRequest(generatorType2, settingsJson2);
            await service.SaveSettings(userId, request2);

            var getSetting = await service.GetSettings(1, GeneratorType.Words);
            Assert.That(settingsJson2, Is.EqualTo(getSetting));
        }

        private SaveSettingsRequest MakeRequest(GeneratorType generatorType, string settingsJson)
        {
            return new SaveSettingsRequest
            {
                GeneratorType = generatorType,
                SettingsJson = settingsJson
            };
        }
    }
}
