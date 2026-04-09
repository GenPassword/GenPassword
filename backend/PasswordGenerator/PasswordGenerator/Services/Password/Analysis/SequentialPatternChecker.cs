using System.Text;

namespace PasswordGenerator.Services.Password.Analysis
{
    public class SequentialPatternChecker
    {
        public static List<string> CheckPasswordToSequentialPattern(string password)
        {
            string[] sequentialPatterns = new[] {
                "1234567890",
                "qwertyuiop",
                "asdfghjkl",
                "zxcvbnm",
                "abcdifghijklmopqrstuvwxyz"
            };

            var parsPassword = ExtractionLetterAndNumberFromPass(password.ToLower());

            return sequentialPatterns
                .SelectMany(pattern => CheckPassword(pattern, parsPassword.letters)
                                        .Concat(CheckPassword(pattern, parsPassword.numbers)))
                .ToList();
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

        private static List<string> CheckPassword(string pattern, string pass)
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
                    repetitions = 1;
                    foundPatterns.Add(pass.Substring(startPatterns, repetitions));
                }
                    
            }
            return foundPatterns;
        }
    }
}
