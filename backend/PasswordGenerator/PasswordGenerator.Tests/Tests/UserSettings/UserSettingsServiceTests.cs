using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using PasswordGenerator.Data;
using PasswordGenerator.Models.GeneratorSettings;
using PasswordGenerator.Services.Users.Settings;
using System.Text.Json;

namespace PasswordGenerator.Tests.Tests.UserSettings
{
    [TestFixture]
    public class UserSettingsServiceTests
    {
        private AppDbContext appDbContext = null!;
        private IUserSettingsService service = null!;
        private SettingsFactory settingsFactory = new SettingsFactory();

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            appDbContext = new AppDbContext(options);
            service = new UserSettingsService(appDbContext, settingsFactory);
        }

        [Test]
        public async Task SaveSettings_ShouldCreateNewPreset_WhenNotExists()
        {
            var userId = 1;
            var request = MakeRequest(GeneratorType.Random, "Fast", "{ \"length\": 12 }");

            await service.SaveSettings(userId, request);

            var saved = await appDbContext.UserSettings
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.GeneratorType == GeneratorType.Random &&
                    x.Name == "Fast");

            Assert.That(saved, Is.Not.Null);
            Assert.That(saved!.SettingJson, Is.EqualTo("{ \"length\": 12 }"));
        }

        [Test]
        public async Task SaveSettings_ShouldUpdateExistingPreset_WhenSameName()
        {
            var userId = 1;

            var request1 = MakeRequest(GeneratorType.Random, "Fast", "{ \"length\": 12 }");
            await service.SaveSettings(userId, request1);

            var request2 = MakeRequest(GeneratorType.Random, "Fast", "{ \"length\": 20 }");
            await service.SaveSettings(userId, request2);

            var saved = await appDbContext.UserSettings
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.GeneratorType == GeneratorType.Random &&
                    x.Name == "Fast");

            Assert.That(saved, Is.Not.Null);
            Assert.That(saved!.SettingJson, Is.EqualTo("{ \"length\": 20 }"));
        }

        [Test]
        public async Task SaveSettings_ShouldCreateMultiplePresets_ForSameGeneratorType()
        {
            var userId = 1;

            await service.SaveSettings(userId,
                MakeRequest(GeneratorType.Random, "Fast", "{ \"length\": 8 }"));

            await service.SaveSettings(userId,
                MakeRequest(GeneratorType.Random, "Secure", "{ \"length\": 20 }"));

            var all = await appDbContext.UserSettings
                .Where(x => x.UserId == userId && x.GeneratorType == GeneratorType.Random)
                .ToListAsync();

            Assert.That(all.Count, Is.EqualTo(2));
        }

        [Test]
        public async Task GetAllSettings_ShouldReturnEmptyList_WhenNoSettings()
        {
            var result = await service.GetAllSettings(1, GeneratorType.Random);

            Assert.That(result, Is.Empty);
        }

        [Test]
        public async Task GetAllSettings_ShouldReturnAllPresets()
        {
            var userId = 1;

            await service.SaveSettings(userId,
                MakeRequest(GeneratorType.Random, "Fast", "{ \"length\": 8 }"));

            await service.SaveSettings(userId,
                MakeRequest(GeneratorType.Random, "Secure", "{ \"length\": 20 }"));

            var result = await service.GetAllSettings(userId, GeneratorType.Random);

            Assert.That(result.Count, Is.EqualTo(2));
            Assert.That(result.Any(x => x.Name == "Fast"), Is.True);
            Assert.That(result.Any(x => x.Name == "Secure"), Is.True);
        }

        [Test]
        public async Task GetAllSettings_ShouldFilterByGeneratorType()
        {
            var userId = 1;

            await service.SaveSettings(userId,
                MakeRequest(GeneratorType.Random, "Fast", "{ \"length\": 8 }"));

            await service.SaveSettings(userId,
                MakeRequest(GeneratorType.Words, "WordsPreset", "{ \"count\": 3 }"));

            var result = await service.GetAllSettings(userId, GeneratorType.Words);

            Assert.That(result.Count, Is.EqualTo(1));
            Assert.That(result[0].Name, Is.EqualTo("WordsPreset"));
        }

        [Test]
        public async Task SaveSettings_ShouldThrowException_WhenJsonInvalid()
        {
            var userId = 1;

            var request = MakeRequest(GeneratorType.Random, "Bad", "{ \"length\": ");

            Assert.ThrowsAsync<JsonException>(async () =>
            {
                await service.SaveSettings(userId, request);
            });

            var saved = appDbContext.UserSettings
                .FirstOrDefault(x => x.UserId == userId);

            Assert.That(saved, Is.Null);
        }

        private SaveSettingsRequest MakeRequest(
            GeneratorType generatorType,
            string name,
            string settingsJson)
        {
            return new SaveSettingsRequest
            {
                GeneratorType = generatorType,
                Name = name,
                SettingsJson = settingsJson
            };
        }

        [Test]
        public async Task DeleteSettings_ShouldRemovePreset_WhenExists()
        {
            var userId = 1;

            var request = MakeRequest(GeneratorType.Random, "Fast", "{ \"length\": 8 }");
            await service.SaveSettings(userId, request);

            var saved = await appDbContext.UserSettings.FirstAsync();

            var deleteRequest = new DeleteSettingsRequest
            {
                Id = saved.Id
            };

            await service.DeleteSettings(userId, deleteRequest);

            var deleted = await appDbContext.UserSettings
                .FirstOrDefaultAsync(x => x.Id == saved.Id);

            Assert.That(deleted, Is.Null);
        }
        [Test]
        public async Task DeleteSettings_ShouldDoNothing_WhenNotFound()
        {
            var userId = 1;

            var deleteRequest = new DeleteSettingsRequest
            {
                Id = 999
            };

            await service.DeleteSettings(userId, deleteRequest);

            Assert.Pass("No exception should be thrown");
        }

        [Test]
        public async Task DeleteSettings_ShouldNotDeleteOtherUserSettings()
        {
            var user1 = 1;
            var user2 = 2;

            var request = MakeRequest(GeneratorType.Random, "Fast", "{ \"length\": 8 }");

            await service.SaveSettings(user1, request);

            var saved = await appDbContext.UserSettings.FirstAsync();

            var deleteRequest = new DeleteSettingsRequest
            {
                Id = saved.Id
            };

            await service.DeleteSettings(user2, deleteRequest);

            var stillExists = await appDbContext.UserSettings
                .FirstOrDefaultAsync(x => x.Id == saved.Id);

            Assert.That(stillExists, Is.Not.Null);
        }
    }
}