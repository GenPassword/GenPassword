namespace PasswordGenerator.Services.Wordlist
{
    public interface IWordlistService
    {
        string GetRandomWord();
        IEnumerable<string> GetRandomWords(int count);
        int GetWordCount();
    }
}
