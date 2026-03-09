using NUnit.Framework.Legacy;
using PasswordGenerator.Models;
using PasswordGenerator.Services;
using PasswordGenerator.Validators;
using System;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace PasswordGenerator.Tests.Tests.GenerateFromWords
{
    [TestFixture]
    public class GeneratePasswordFromWordsServiceTest
    {
        private PassphraseGeneratorService CreateService()
        {
            var testWords = new List<string> { "tree", "fox", "moon", "star" };
            var wordlistService = new WordlistServiceStub(testWords);

            var analyzer = new PasswordAnalyzerService();

            return new PassphraseGeneratorService(wordlistService, analyzer);
        }

        [Test]
        public void GenerateFromWords_ReturnsPassword()
        {
            var service = CreateService();
            var request = new GeneratePasswordFromWordsRequest
            {
                WordCount = 3,
            };
            var password = service.Generate(request);
            ClassicAssert.NotNull(password);
        }

        [Test]
        public void The_Specified_Separator_Is_Used()
        {
            var request = new GeneratePasswordFromWordsRequest
            {
                WordCount = 3,
            };
            var service = CreateService();
            var password = service.Generate(request).Password;
            var countWordsInPassword = password.Split(request.Separator).Length;
            var separatorsCount = countWordsInPassword - 1;
            ClassicAssert.AreEqual(separatorsCount, 2);
        }

        [Test] 
        public void The_Required_Number_Of_Words_Is_Generated()
        {
            var service = CreateService();
            for(int wordsCount = 1; wordsCount < 4; wordsCount++)
            {
                var request = new GeneratePasswordFromWordsRequest
                {
                    WordCount = wordsCount,
                };
                var password = service.Generate(request).Password;
                var countWordsInPassword = password.Split(request.Separator).Length;
                ClassicAssert.AreEqual(wordsCount, countWordsInPassword);
            }
        }

        [Test]
        public void GenerateFromWords_CapitalizesWords()
        {
            var service = CreateService();
            var firstUpperChar = true;
            var request = new GeneratePasswordFromWordsRequest
            {
                WordCount = 3,
                WordCase = Case.Capitalized
            };
            var password = service.Generate(request).Password;
            var wordsInPassword = password.Split(request.Separator);
            for (int i = 0; i < wordsInPassword.Length; i++)
            {
                if (!char.IsUpper(wordsInPassword[i][0]))
                    firstUpperChar = false;
            }
            ClassicAssert.IsTrue(firstUpperChar);
        }
    }

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
