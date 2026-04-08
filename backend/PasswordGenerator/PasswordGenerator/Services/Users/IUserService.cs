using PasswordGenerator.Entities;

namespace PasswordGenerator.Services.Users
{
    public interface IUserService
    {
        public Task<User> GetUserByEmail(string email);
        public string GenerateUsername(string email);
    }
}
