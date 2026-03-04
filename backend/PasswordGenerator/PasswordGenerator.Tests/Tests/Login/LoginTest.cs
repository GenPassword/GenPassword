using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework.Legacy;
using PasswordGenerator.Data;
using PasswordGenerator.Entities;
using PasswordGenerator.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Authentication;
using System.Text;
using System.Threading.Tasks;

namespace PasswordGenerator.Tests.Tests.Login
{
    [TestFixture]
    public class LoginTest
    {
        private UserService service;
        private AppDbContext dbContext;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            dbContext = new AppDbContext(options);
            service = new UserService(dbContext, new PasswordHasher<User>());
        }
        [Test]
        public async Task Login_ShouldThrow_WhenUserDoesNotExist()
        {
            await Assert.ThrowsAsync<AuthenticationException>(async () => await service.Login("noemail@mail.com", "Password123!"));
        }

        [Test]
        public async Task Login_ShouldThrow_WhenPasswordIsIncorrect()
        {
            await service.RegisterUser("test@example1.com", "Password123!");
            await Assert.ThrowsAsync<AuthenticationException>(async () => await service.Login("test@example1.com", "123456"));
        }

        [Test]
        public async Task Login_ShouldReturnUser_WhenCredentialsAreCorrect()
        {
            await service.RegisterUser("test@example1.com", "Password123!");
            var login = await service.Login("test@example1.com", "Password123!");
            var email = login.Email;
            var id = login.Id;
            ClassicAssert.NotNull(login);
            ClassicAssert.AreEqual("test@example1.com", email);
            ClassicAssert.AreEqual(dbContext.Users.First().Id, id);
        }
    }
}
