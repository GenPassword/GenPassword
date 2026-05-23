using System.ComponentModel.DataAnnotations;

namespace PasswordGenerator.Models.GeneratorSettings
{
    public class SaveSettingsRequest
    {
        [Required]
        public GeneratorType GeneratorType { get; set; }

        [Required]
        [MinLength(1)]
        public string Name { get; set; } = "";

        [Required]
        public string SettingsJson { get; set; } = "";
    }

    public enum GeneratorType
    {
        Random,
        Pin,
        Words
    }
}
