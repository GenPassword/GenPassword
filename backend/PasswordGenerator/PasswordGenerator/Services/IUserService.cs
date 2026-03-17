using PasswordGenerator.Entities;

namespace PasswordGenerator.Services
{
    public interface IUserService
    {
        public Task<User> GetUserByEmail(string email);
        public string GenerateUsername(string email);
    }
}
