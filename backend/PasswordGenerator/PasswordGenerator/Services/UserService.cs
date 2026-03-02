using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PasswordGenerator.Data;
using PasswordGenerator.Entities;

namespace PasswordGenerator.Services
{
    public class UserService
    {
        private readonly AppDbContext appDbContext;
        private readonly IPasswordHasher<User> passwordHasher;

        public UserService(AppDbContext appDbContext, IPasswordHasher<User> passwordHasher)
        {
            this.appDbContext = appDbContext;
            this.passwordHasher = passwordHasher;
        }

        public async Task<bool> RegisterUser(string email, string password)
        {
            email = email.ToLower().Trim();
            var emailInBd = GetUserByEmail(email);
            if (! await emailInBd)
            {
                var user = new User
                {
                    Email = email,
                    Username = GenerateUsername(email),
                    CreatedAt = DateTime.UtcNow,
                    EmailConfirmed = false,
                    LastLogin = null,
                    Role = "User"
                };
                var passwordHash = passwordHasher.HashPassword(user, password);
                user.PasswordHash = passwordHash;
                user.CreatedAt = DateTime.UtcNow;
                appDbContext.Users.Add(user);
                await appDbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> GetUserByEmail(string email)
        {
            return await appDbContext.Users.AnyAsync(user => user.Email == email);
        }

        private string GenerateUsername(string email)
        {
            var prefix = email.Split('@')[0];
            var randomNum = new Random().Next(100, 999);
            return prefix + randomNum;
        }
    }
}
