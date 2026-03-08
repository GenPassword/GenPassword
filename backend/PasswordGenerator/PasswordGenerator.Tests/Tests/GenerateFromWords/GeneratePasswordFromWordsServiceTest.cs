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
        private PasswordGeneratorService CreateService()
        {
            var analyzer = new PasswordAnalyzerService();
            var validator = new PasswordOptionsValidator();
            var mock = new Mock<IWordlistService>();
            mock.Setup(x => x.GetRandomWords(It.IsAny<int>()))
                .Returns(new[] { "tree", "fox", "moon" });
            return new PasswordGeneratorService(analyzer, validator, mock.Object);
        }

        [Test]
        public void GenerateFromWords_ReturnsPassword()
        {
            var service = CreateService();
            var request = new GeneratePasswordFromWordsRequest
            {
                WordCount = 3,
            };
            var password = service.GenerateFromWords(request);
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
            var password = service.GenerateFromWords(request);
            var countWordsInPassword = password.Split(request.Separator).Length;
            var separatorsCount = countWordsInPassword - 1;
            ClassicAssert.IsFalse(string.IsNullOrEmpty(password));
        }

        [Test] 
        public void The_Required_Number_Of_Words_Is_Generated()
        {
            var service = CreateService();
            for(int wordsCount = 1; wordsCount < 6; wordsCount++)
            {
                var request = new GeneratePasswordFromWordsRequest
                {
                    WordCount = wordsCount,
                };
                var password = service.GenerateFromWords(request);
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
            var password = service.GenerateFromWords(request);
            var wordsInPassword = password.Split(request.Separator);
            for (int i = 0; i < wordsInPassword.Length; i++)
            {
                if (!char.IsUpper(wordsInPassword[i][0]))
                    firstUpperChar = false;
            }
            ClassicAssert.IsTrue(firstUpperChar);
        }
    }
}
