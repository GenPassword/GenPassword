namespace PasswordGenerator.Models
{
    public class SaveSettingsRequest
    {
        public GeneratorType GeneratorType { get; set; }
        public string SettingsJson { get; set; } = "";
    }

    public enum GeneratorType
    {
        Random,
        Pin,
        Words
    }
}
