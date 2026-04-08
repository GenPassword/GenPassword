using System.Security.Cryptography;
using System.Runtime.Versioning;

namespace PasswordGenerator.Services.Wordlist
{
    public class WordlistService : IWordlistService
    {
        private readonly IReadOnlyList<string> words;
        public WordlistService(IWebHostEnvironment env)
        {
            var path = Path.Combine(env.ContentRootPath, "Resources", "wordlist-8192.txt");

            if(!File.Exists(path))
                throw new FileNotFoundException($"Нет файла по пути {path}");

            words = File.ReadAllLines(path)
                .Where(x => !string.IsNullOrWhiteSpace(x)).ToList();

            if (words.Count == 0) throw new InvalidOperationException("Словарь слов для пароля пуст");
        }
        public string GetRandomWord()
        {
            var index = RandomNumberGenerator.GetInt32(words.Count);
            return words[index];
        }

        public IEnumerable<string> GetRandomWords(int count)
        {
            if (count <= 0)
                throw new ArgumentException("Число слов только положительное");

            var result = new List<string>();
            for (int i = 0; i < count; i++)
            {
                yield return GetRandomWord();
            }
        }

        public int GetWordCount()
        {
            return words.Count;
        }
    }
}
