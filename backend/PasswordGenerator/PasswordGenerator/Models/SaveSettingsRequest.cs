namespace PasswordGenerator.Models
{
    public class SaveSettingsRequest
    {
        public string GeneratorType { get; set; } = "";
        public string SettingsJson { get; set; } = "";
    }
}
