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
using Microsoft.Extensions.Configuration;

namespace PasswordGenerator.Tests.Tests.Login
{
    [TestFixture]
    public class LoginTest
    {
        private AuthService service;
        private AppDbContext dbContext;
        private UserService userService;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            dbContext = new AppDbContext(options);
            userService = new UserService(dbContext);
            service = new AuthService(dbContext, new PasswordHasher<User>(), userService);
        }
        [Test]
        public async Task Login_ShouldThrow_WhenUserDoesNotExist()
        {
            Assert.ThrowsAsync<AuthenticationException>(async () => await service.Login("noemail@mail.com", "Password123!"));
        }

        [Test]
        public async Task Login_ShouldThrow_WhenPasswordIsIncorrect()
        {
            await service.RegisterUser("test@example1.com", "Password123!");
            Assert.ThrowsAsync<AuthenticationException>(async () => await service.Login("test@example1.com", "123456"));
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

        [Test]
        public async Task Login_ShouldThrow_WhenUserDoesNotInBD()
        {
            Assert.ThrowsAsync<AuthenticationException>(async () => await service.Login("NotInBase@example1.com", "123456"));
        }

        [Test]
        public async Task Login_ShouldThrow_WhenEmailIsEmpty()
        {
            Assert.ThrowsAsync<ArgumentException>(async() => await service.Login("", "123456"));
            Assert.ThrowsAsync<ArgumentException>(async () => await service.Login(null, "123456"));
            Assert.ThrowsAsync<ArgumentException>(async () => await service.Login(" ", "123456"));
        }
        [Test]
        public async Task Login_ShouldThrow_WhenPasswordIsEmpty()
        {
            service.RegisterUser("test@example1.com", "Password123!");
            Assert.ThrowsAsync<ArgumentException>(async () => await service.Login("test@example1.com", ""));
            Assert.ThrowsAsync<ArgumentException>(async () => await service.Login("test@example1.com", null));
            Assert.ThrowsAsync<ArgumentException>(async () => await service.Login("test@example1.com", " "));
        }
        [Test]
        public async Task Login_ShouldReturnUser_WhenEmailHasDifferentCase()
        {
            await service.RegisterUser("test@example1.com", "Password123!");
            var login = await service.Login("Test@Example1.com", "Password123!");
            ClassicAssert.NotNull(login);
        }
    }
}
