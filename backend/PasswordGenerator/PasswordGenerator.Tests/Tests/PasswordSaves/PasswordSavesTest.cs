using Microsoft.EntityFrameworkCore;
using PasswordGenerator.Data;
using PasswordGenerator.Models;
using PasswordGenerator.Models.GeneratorSettings;
using PasswordGenerator.Services.Users.SavePassword;
using PasswordGenerator.Services.Users.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PasswordGenerator.Tests.Tests.PasswordSaves
{
    public class FakeEncryptionService : IEncryptionService
    {
        public string Encrypt(string text) => text;
        public string Decrypt(string text) => text;
    }

    [TestFixture]
    public class PasswordSavesTest
    {
        private AppDbContext appDbContext = null!;
        private IUserSavedPasswordService service = null!;
        private IEncryptionService encryptionService = new FakeEncryptionService();

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            appDbContext = new AppDbContext(options);
            service = new UserSavedPasswordService(appDbContext, encryptionService);
        }

        [Test]
        public async Task SavePassword()
        {
            var userId = 1;
            var request = new SavePasswordRequest
            {
                Password = "abc123",
                Description = "Github",
                Id = 1
            };
            await service.SavePassword(userId, request);

            var saved = await appDbContext.UserSavesPasswords
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId && x.Id == request.Id);

            Assert.That(saved, Is.Not.Null);
            Assert.That(saved.Password, Is.EqualTo("abc123"));
            Assert.That(saved.Description, Is.EqualTo("Github"));
        }

        [Test]
        public async Task GetAllPassword()
        {
            var userId = 1;
            var request1 = new SavePasswordRequest
            {
                Password = "abc123",
                Description = "Github",
            };
            var request2 = new SavePasswordRequest
            {
                Password = "sadxcz",
                Description = "Gmail",
            };
            await service.SavePassword(userId, request1);
            await service.SavePassword(userId, request2);

            var saved = await service.GetAllPassword(userId);

            Assert.That(saved, Is.Not.Null);
            Assert.That(saved.Count, Is.EqualTo(2));
        }

        [Test]
        public async Task DeletePassword_RemovesFromDatabase()
        {
            var userId = 1;

            await service.SavePassword(userId, new SavePasswordRequest
            {
                Password = "abc123",
                Description = "Github"
            });

            var saved = await appDbContext.UserSavesPasswords.FirstAsync();

            await service.DeletePassword(userId, new DeletePasswordRequest
            {
                Id = saved.Id
            });

            var fromDb = await appDbContext.UserSavesPasswords
                .FirstOrDefaultAsync(x => x.Id == saved.Id);

            Assert.That(fromDb, Is.Null);
        }

        [Test]
        public async Task DeletePassword_CannotDeleteOtherUsersPassword()
        {
            await service.SavePassword(1, new SavePasswordRequest
            {
                Password = "abc123",
                Description = "Github"
            });

            var saved = await appDbContext.UserSavesPasswords.FirstAsync();

            await service.DeletePassword(2, new DeletePasswordRequest
            {
                Id = saved.Id
            });

            var stillExists = await appDbContext.UserSavesPasswords
                .FirstOrDefaultAsync(x => x.Id == saved.Id);

            Assert.That(stillExists, Is.Not.Null);
        }

        [Test]
        public async Task GetAllPassword_ReturnsOnlyUserPasswords()
        {
            await service.SavePassword(1, new SavePasswordRequest
            {
                Password = "abc123",
                Description = "Github"
            });

            await service.SavePassword(1, new SavePasswordRequest
            {
                Password = "zzz999",
                Description = "Gmail"
            });

            await service.SavePassword(2, new SavePasswordRequest
            {
                Password = "shouldnotsee",
                Description = "Other user"
            });

            var result = await service.GetAllPassword(1);

            Assert.That(result.Count, Is.EqualTo(2));
        }
    }
}
