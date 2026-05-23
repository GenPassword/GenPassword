using Microsoft.EntityFrameworkCore;
using PasswordGenerator.Data;
using PasswordGenerator.Entities;
using System.Security.Cryptography;

namespace PasswordGenerator.Services.Auth
{
    public class UpdateTokens
    {
        private const int RefreshTokenLifetimeDays = 7;

        private readonly AppDbContext appDbContext;

        public UpdateTokens(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public async Task<string> CreateRefreshTokenAsync(int userId)
        {
            var tokenValue = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

            var refreshToken = new RefreshToken
            {
                Token = tokenValue,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(RefreshTokenLifetimeDays),
                IsRevoked = false
            };

            appDbContext.RefreshTokens.Add(refreshToken);
            await appDbContext.SaveChangesAsync();

            return tokenValue;
        }

        public async Task<RefreshToken?> GetValidTokenAsync(string token)
        {
            return await appDbContext.RefreshTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t =>
                    t.Token == token &&
                    !t.IsRevoked &&
                    t.ExpiresAt > DateTime.UtcNow);
        }

        public async Task<string> RotateRefreshTokenAsync(RefreshToken refreshToken)
        {
            refreshToken.IsRevoked = true;
            return await CreateRefreshTokenAsync(refreshToken.UserId);
        }

        public async Task RevokeRefreshTokenAsync(string token)
        {
            var refreshToken = await appDbContext.RefreshTokens
                .FirstOrDefaultAsync(t => t.Token == token);

            if (refreshToken == null)
                return;

            refreshToken.IsRevoked = true;
            await appDbContext.SaveChangesAsync();
        }
    }
}
