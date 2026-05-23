using System.Text.Json.Serialization;

namespace PasswordGenerator.Models.GeneratorSettings
{
    public class RandomGeneratorSettings : IGeneratorSettings
    {
        public int Length { get; set; }
        public bool IncludeLowercase { get; set; }
        public bool IncludeUppercase { get; set; }
        public bool IncludeDigits { get; set; }
        public bool IncludeSpecial { get; set; }
        public bool ExcludeSimilar { get; set; }
        public bool NoRepeats { get; set; }

        [JsonPropertyName("digitsCount")]
        public int MinDigits { get; set; }

        [JsonPropertyName("specialCount")]
        public int MinSpecial { get; set; }
    }
}
