using PasswordGenerator.Models.GeneratorSettings;

namespace PasswordGenerator.Services.Users
{
    public class UserSettingDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string SettingsJson { get; set; }
        public GeneratorType GeneratorType { get; set; }
    }
}
