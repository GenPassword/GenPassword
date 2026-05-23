using System.Text.Json;

namespace PasswordGenerator.Services.Users.Settings
{
    internal static class SettingsJsonOptions
    {
        public static readonly JsonSerializerOptions Deserialize = new()
        {
            PropertyNameCaseInsensitive = true
        };
    }
}
