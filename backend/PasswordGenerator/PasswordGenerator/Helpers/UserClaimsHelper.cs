using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace PasswordGenerator.Helpers
{
    public static class UserClaimsHelper
    {
        private const string NameIdentifierUri =
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

        public static int? TryGetUserId(ClaimsPrincipal user)
        {
            if (user?.Identity?.IsAuthenticated != true)
                return null;

            var claim = user.FindFirst(ClaimTypes.NameIdentifier)
                ?? user.FindFirst(JwtRegisteredClaimNames.Sub)
                ?? user.FindFirst("sub")
                ?? user.FindFirst("nameid")
                ?? user.FindFirst(NameIdentifierUri);

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
