namespace PasswordGenerator.Services
{
    public interface IWordlistService
    {
        string GetRandomWord();
        IEnumerable<string> GetRandomWords(int count);
        int GetWordCount();
    }
}
