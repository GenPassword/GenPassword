namespace PasswordGenerator.Models.GeneratorSettings
{
    public class WordGeneratorSettings : IGeneratorSettings
    {
        public int WordCount { get; set; }
        public Case WordCase { get; set; } = Case.Lower;
        public string Separator { get; set; } = "";
    }
}
