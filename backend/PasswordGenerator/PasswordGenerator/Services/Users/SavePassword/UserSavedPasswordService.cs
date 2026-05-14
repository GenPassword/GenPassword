using Microsoft.EntityFrameworkCore;
using PasswordGenerator.Data;
using PasswordGenerator.Entities;
using PasswordGenerator.Models;
using PasswordGenerator.Services.Users.Settings;

namespace PasswordGenerator.Services.Users.SavePassword
{
    public class UserSavedPasswordService : IUserSavedPasswordService
    {
        private readonly AppDbContext appDbContext;
        private readonly IEncryptionService encryptionService;
        
        public UserSavedPasswordService(AppDbContext appDbContext, IEncryptionService encryptionService)
        {
            this.appDbContext = appDbContext;
            this.encryptionService = encryptionService;
        }
        public async Task DeletePassword(int userId, DeletePasswordRequest deletePasswordRequest)
        {
            var delete = await appDbContext.UserSavesPasswords
                .FirstOrDefaultAsync(p => p.UserId == userId && p.Id == deletePasswordRequest.Id);
            if (delete != null)
            {
                appDbContext.UserSavesPasswords.Remove(delete);
                await appDbContext.SaveChangesAsync();
            }
            else
                return;
        }

        public async Task<List<UserSavedPasswordDto>> GetAllPassword(int userId)
        {
            var savedPassword = await appDbContext.UserSavesPasswords
                .Where(p => p.UserId == userId)
                .ToListAsync();
            
            return savedPassword
                .Select(s =>
                {
                    var encrypted = s.Password;
                    var plain = encryptionService.Decrypt(encrypted);
                    return new UserSavedPasswordDto
                    {
                        Description = s.Description,
                        Id = s.Id,
                        Password = plain,
                    };
                })
                .ToList();
        }

        public async Task SavePassword(int userId, SavePasswordRequest savePasswordRequest)
        {
            var password = savePasswordRequest.Password;
            var description = savePasswordRequest.Description;
            var id = savePasswordRequest.Id;
            var encrypted = encryptionService.Encrypt(password);

            var savedPassword = await appDbContext.UserSavesPasswords
                .FirstOrDefaultAsync(p => p.UserId == userId && p.Id == id);
            if (savedPassword != null)
            {
                savedPassword.UpdateAt = DateTime.UtcNow;
                savedPassword.Description = description;
                appDbContext.Update(savedPassword);
            }
            else
            {
                var userSavesPassword = new UserSavesPassword
                {
                    Description = description,
                    Id = id,
                    Password = encrypted,
                    CreateAt = DateTime.UtcNow,
                    UpdateAt = DateTime.UtcNow,
                    UserId = userId
                };
                await appDbContext.UserSavesPasswords.AddAsync(userSavesPassword);
            }
            await appDbContext.SaveChangesAsync();
        }
    }
}
