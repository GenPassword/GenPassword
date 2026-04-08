using PasswordGenerator.Models;
using PasswordGenerator.Services.Password.Analysis;
using PasswordGenerator.Services.Password.Generation;
using PasswordGenerator.Tests.Tests.Stubs;

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
            var password = service.Generate(request).Password;
            Assert.That(password, Is.Not.Null);
        }

        [Test]
        public void The_Specified_Separator_Is_Used()
        {
            var request = new GeneratePasswordFromWordsRequest
            {
                WordCount = 3,
                Separator = "-"
            };
            var service = CreateService();
            var password = service.Generate(request).Password;
            var countWordsInPassword = password.Split(request.Separator).Length;
            var separatorsCount = countWordsInPassword - 1;
            Assert.That(separatorsCount, Is.EqualTo(2));
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
                    Separator = "-"
                };
                var password = service.Generate(request).Password;
                var countWordsInPassword = password.Split(request.Separator).Length;
                Assert.That(wordsCount, Is.EqualTo(countWordsInPassword));
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
            Assert.That(firstUpperChar, Is.True);
        }

        [Test]
        public void GenerateFromWords_LowerWords()
        {
            var service = CreateService();
            var request = new GeneratePasswordFromWordsRequest
            {
                WordCount = 3,
                WordCase = Case.Lower
            };
            var password = service.Generate(request).Password;
            var lowerChar = CheckWords(password, request.Separator, char.IsLower);
            
            Assert.That(lowerChar, Is.True);
        }

        [Test]
        public void GenerateFromWords_UpperWords()
        {
            var service = CreateService();
            var request = new GeneratePasswordFromWordsRequest
            {
                WordCount = 3,
                WordCase = Case.Upper
            };
            var password = service.Generate(request).Password;
            var upperChar = CheckWords(password, request.Separator, char.IsUpper);

            Assert.That(upperChar, Is.True);
        }

        private bool CheckWords(string password, string separator, Func<char, bool> charCheck)
        {
            var words = password.Split(separator);
            foreach(var word in words)
            {
                foreach(var c in word)
                {
                    if (!charCheck(c))
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        [Test]
        public void GenerateFromWords_UserSeparator()
        {
            var service = CreateService();
            var request = new GeneratePasswordFromWordsRequest
            {
                WordCount = 3,
                WordCase = Case.Upper,
                Separator = ":"
            };
            var password = service.Generate(request).Password;
            var words = password.Split(':');
            var separatorInPass = password.Contains(":");
            var wordCount = words.Count();
            Assert.That(separatorInPass && wordCount == 3, Is.True);
        }

        [Test]
        public void GenerateFromWords_OneWordInPass()
        {
            var service = CreateService();
            var request = new GeneratePasswordFromWordsRequest
            {
                WordCount = 1,
                WordCase = Case.Upper,
                Separator = "-"
            };
            var password = service.Generate(request).Password;
            var words = password.Split(request.Separator);
            var separatorInPass = password.Contains(request.Separator);
            var wordCount = words.Count();
            Assert.That(!separatorInPass && wordCount == 1, Is.True);
        }

        [Test]
        public void GenerateFromWords_ZeroWordInPass()
        {
            var service = CreateService();
            var request = new GeneratePasswordFromWordsRequest
            {
                WordCount = 0,
                WordCase = Case.Upper,
            };
            var password = service.Generate(request).Password;
            Assert.That(password, Is.Empty);
        }

        [Test]
        public void GenerateFromWords_EntropyMoreThanZero()
        {
            var service = CreateService();
            var request1 = new GeneratePasswordFromWordsRequest
            {
                WordCount = 2,
                WordCase = Case.Upper,
            };
            var request2 = new GeneratePasswordFromWordsRequest
            {
                WordCount = 4,
                WordCase = Case.Upper,
            };
            var entropy1 = service.Generate(request1).Entropy;
            var entropy2 = service.Generate(request2).Entropy;
            Assert.That(entropy1 > 0 && entropy2 > 0, Is.True);

        }

        [Test]
        public void GenerateFromWords_EntropyMoreThanMoreWords()
        {
            var service = CreateService();
            var request1 = new GeneratePasswordFromWordsRequest
            {
                WordCount = 2,
                WordCase = Case.Upper,
            };
            var request2 = new GeneratePasswordFromWordsRequest
            {
                WordCount = 4,
                WordCase = Case.Upper,
            };
            var entropy1 = service.Generate(request1).Entropy;
            var entropy2 = service.Generate(request2).Entropy;

            Assert.That(entropy2 > entropy1, Is.True);

        }
    }
}
