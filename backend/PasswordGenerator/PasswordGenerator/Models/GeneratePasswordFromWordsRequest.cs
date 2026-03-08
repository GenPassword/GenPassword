namespace PasswordGenerator.Models
{
    public class GeneratePasswordFromWordsRequest
    {
        public int WordCount { get; set; }
        public Case WordCase { get; set; } = Case.Lower;
        public char Separator { get; set; } = '-';
    }

    public enum Case
    {
        Lower,
        Upper,
        Capitalized
    }
}
