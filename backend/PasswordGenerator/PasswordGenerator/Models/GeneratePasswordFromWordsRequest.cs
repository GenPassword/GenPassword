namespace PasswordGenerator.Models
{
    public class GeneratePasswordFromWordsRequest
    {
        public int WordCount { get; set; }
        public Case WordCase { get; set; } = Case.Lower;
        public string Separator { get; set; } = "";
    }

    public enum Case
    {
        Lower,
        Upper,
        Capitalized
    }
}
