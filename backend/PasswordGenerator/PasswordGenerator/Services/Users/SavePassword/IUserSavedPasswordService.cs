using PasswordGenerator.Models;
using PasswordGenerator.Models.GeneratorSettings;
using PasswordGenerator.Services.Users.Settings;

namespace PasswordGenerator.Services.Users.SavePassword
{
    public interface IUserSavedPasswordService
    {
        Task SavePassword(int userId, SavePasswordRequest savePasswordRequest);
        Task<List<UserSavedPasswordDto>> GetAllPassword(int userId);
        Task DeletePassword(int userId, DeletePasswordRequest deletePasswordRequest);
    }
}
