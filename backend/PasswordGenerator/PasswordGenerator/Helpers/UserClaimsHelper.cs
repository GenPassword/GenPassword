using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace PasswordGenerator.Helpers
{
    public static class UserClaimsHelper
    {
        public static int? TryGetUserId(ClaimsPrincipal user)
        {
            var claim = user.FindFirst(ClaimTypes.NameIdentifier)
                ?? user.FindFirst(JwtRegisteredClaimNames.Sub)
                ?? user.FindFirst("nameid");

            if (claim == null || !int.TryParse(claim.Value, out var userId))
                return null;

            return userId;
        }

        public static string GetAvailableClaimTypes(ClaimsPrincipal user)
        {
            return string.Join(", ", user.Claims.Select(c => c.Type));
        }
    }
}
