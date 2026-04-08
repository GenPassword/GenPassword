using PasswordGenerator.Services.Wordlist;


namespace PasswordGenerator.Tests.Tests.Stubs
{
    public class WordlistServiceStub : IWordlistService
    {
        private readonly List<string> _words;
        private int _index;

        public WordlistServiceStub(IEnumerable<string> words)
        {
            _words = words.ToList();
            _index = 0;
        }

        public string GetRandomWord()
        {
            var word = _words[_index];
            _index = (_index + 1) % _words.Count;
            return word;
        }

        public IEnumerable<string> GetRandomWords(int count)
        {
            return _words.Take(count);
        }

        public int GetWordCount() => _words.Count;
    }
}
