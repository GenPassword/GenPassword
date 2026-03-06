using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework.Legacy;
using PasswordGenerator.Data;
using PasswordGenerator.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PasswordGenerator.Entities;

namespace PasswordGenerator.Tests.Tests.Registration
{
    [TestFixture]
    public class RegistrationTests
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
        public async Task RegisterUser_ShouldAddUser_WhenEmailIsUnique()
        {
            var result = await service.RegisterUser("test@example.com", "Password123!");
            ClassicAssert.IsTrue(result);
            ClassicAssert.AreEqual(1, dbContext.Users.Count());
        }

        [Test]
        public async Task RegisterUser_ShouldThrow_WhenEmailExists()
        {
            dbContext.Users.Add(new Entities.User { Email = "test@example.com" });
            dbContext.SaveChanges();
            ClassicAssert.IsFalse(await service.RegisterUser("test@example.com", "Password123!"));
        }
        [Test]
        public async Task RegisterUser_ShouldThrow_WhenEmailLowerAndUpper()
        {
            dbContext.Users.Add(new Entities.User { Email = "test@example.com" });
            dbContext.SaveChanges();
            ClassicAssert.IsFalse(await service.RegisterUser("TEST@EXAMPLE.COM", "Password123!"));
        }
        [Test]
        public async Task RegisterUser_ShouldThrow_WhenEmailHaveSpace()
        {
            dbContext.Users.Add(new Entities.User { Email = "test@example.com" });
            dbContext.SaveChanges();
            ClassicAssert.IsFalse(await service.RegisterUser("    test@example.com    ", "Password123!"));
        }
        [Test]
        public async Task RegisterUser_CheckHashPassword()
        {
            await service.RegisterUser("test@example1.com", "Password123!");
            var user = dbContext.Users.First();
            var passwordHash = user.PasswordHash;
            ClassicAssert.IsFalse(passwordHash == "Password123!");
        }
        [Test]
        public async Task RegisterUser_ShouldThrow_WhenEmailOrPasswordIsEmpty()
        {
            Assert.ThrowsAsync<ArgumentException>(async () => await service.RegisterUser("", "Password123!"));
            Assert.ThrowsAsync<ArgumentException>(async () => await service.RegisterUser("test@example.com", ""));
        }
    }
}
