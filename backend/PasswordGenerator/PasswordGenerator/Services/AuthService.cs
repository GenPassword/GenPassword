using Microsoft.AspNetCore.Identity;
using PasswordGenerator.Data;
using PasswordGenerator.Entities;
using System.Security.Authentication;

namespace PasswordGenerator.Services
{
    public class AuthService
    {
        private readonly AppDbContext appDbContext;
        private readonly IPasswordHasher<User> passwordHasher;
        private readonly UserService userService;
        public AuthService(AppDbContext appDbContext, IPasswordHasher<User> passwordHasher, UserService userService)
        {
            this.appDbContext = appDbContext;
            this.passwordHasher = passwordHasher;
            this.userService = userService;
        }


        public async Task<bool> RegisterUser(string email, string password)
        {
            if (string.IsNullOrEmpty(email))
                throw new ArgumentException("Email не может быть пустым", nameof(email));

            if (string.IsNullOrEmpty(password))
                throw new ArgumentException("Пароль не может быть пустым", nameof(password));

            email = email.ToLower().Trim();
            var userInBd = await userService.GetUserByEmail(email);

            if (userInBd == null)
            {
                var user = new User
                {
                    Email = email,
                    Username = userService.GenerateUsername(email),
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

        public async Task<User> Login(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email не может быть пустым", nameof(email));

            email = email.ToLower().Trim();

            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("password");

            var userInBd = await userService.GetUserByEmail(email);
            if (userInBd == null) throw new AuthenticationException("User not in bd");

            if(passwordHasher.VerifyHashedPassword(userInBd, userInBd.PasswordHash, password) == PasswordVerificationResult.Failed)
            {
                throw new AuthenticationException("Password is wrong");
            }
            else
            {
                userInBd.LastLogin = DateTime.UtcNow;
                appDbContext.Update(userInBd);
                await appDbContext.SaveChangesAsync();
                return userInBd;
            }
        }
    }
}
