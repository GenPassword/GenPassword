namespace PasswordGenerator.Models.GeneratorSettings
{
    public class PinGeneratorSettings : IGeneratorSettings
    {
        public int Length { get; set; }
        public bool NoRepeats { get; set; }
    }
}
