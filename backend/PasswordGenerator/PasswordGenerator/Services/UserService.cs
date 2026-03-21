using Microsoft.EntityFrameworkCore;
using PasswordGenerator.Data;
using PasswordGenerator.Entities;

namespace PasswordGenerator.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext appDbContext;

        public UserService(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var normEmail = email.ToLower().Trim();
            var result = await appDbContext.Users.FirstOrDefaultAsync(x => x.Email == normEmail);
            return result;
        }

        public string GenerateUsername(string email)
        {
            var prefix = email.Split('@')[0];
            var randomNum = new Random().Next(100, 999);
            return prefix + randomNum;
        }
    }
}
