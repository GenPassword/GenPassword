using Microsoft.EntityFrameworkCore.Query.Internal;
using System.Text;

namespace PasswordGenerator.Services.Password.Analysis
{
    public class SequentialPatternChecker : ISequentialPatternChecker
    {
        private string[] sequentialPatterns = new[] {
                "1234567890",
                "qwertyuiop",
                "asdfghjkl",
                "zxcvbnm",
                "abcdefghijklmnopqrstuvwxyz"
            };
        private string[] allPatterns;

        public SequentialPatternChecker()
        {
            allPatterns = GetReversAndBasicPattern();
        }

        public List<string> FindSequentialPatternInPassword(string password)
        {
            var parsPassword = ExtractionLetterAndNumberFromPass(password.ToLower());

            return allPatterns
                .SelectMany(pattern => FindSequentialPatterns(pattern, parsPassword.letters)
                                        .Concat(FindSequentialPatterns(pattern, parsPassword.numbers)))
                .ToList();
        }

        public bool CheckPasswordForBadPattern(string password)
        {
            var parsPassword = ExtractionLetterAndNumberFromPass(password.ToLower());

            return allPatterns
                .Any(pattern =>
                {
                    return HasSequentialPattern(pattern, parsPassword.numbers) || HasSequentialPattern(pattern, parsPassword.letters);
                });
        }

        private string[] GetReversAndBasicPattern()
        {
            return sequentialPatterns
                .SelectMany(pattern =>
                {
                    var reversPattern = new string(pattern.Reverse().ToArray());
                    return new[] {pattern, reversPattern};
                })
                .ToArray();
        }

        private static (string numbers, string letters) ExtractionLetterAndNumberFromPass(string pass)
        {
            var allNumberFromPass = new StringBuilder();
            var allLetterToPass = new StringBuilder();
            foreach (var symbol in pass)
            {
                if (char.IsDigit(symbol))
                    allNumberFromPass.Append(symbol);
                else if (char.IsLetter(symbol))
                    allLetterToPass.Append(symbol);
            }
            return (allNumberFromPass.ToString(), allLetterToPass.ToString());
        }

        private static List<string> FindSequentialPatterns(string pattern, string pass)
        {
            var repetitions = 1;
            var startPatterns = -1;
            var foundPatterns = new List<string>();
            for (var i = 0; i < pass.Length - 1; i++)
            {
                var index1 = pattern.IndexOf(pass[i]);
                var index2 = pattern.IndexOf(pass[i + 1]);
                if (index1 != -1 && index2 != -1 && index2 == index1 + 1)
                {
                    if (repetitions == 1)
                        startPatterns = i;
                    repetitions++;
                }           
                else
                    repetitions = 1;
                if (repetitions >= 4)
                {
                    foundPatterns.Add(pass.Substring(startPatterns, repetitions));
                    repetitions = 1;
                }
                    
            }
            return foundPatterns;
        }

        private static bool HasSequentialPattern(string pattern, string pass)
        {
            return FindSequentialPatterns(pattern, pass).Any();
        }
    }
}
