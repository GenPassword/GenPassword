using PasswordGenerator.Domain;
using PasswordGenerator.Models;
using PasswordGenerator.Services.Password.Analysis;
using PasswordGenerator.Services.Wordlist;

namespace PasswordGenerator.Services.Password.Generation
{
    public class PassphraseGeneratorService : IPassphraseGeneratorService
    {
        private readonly IWordlistService wordlistService;
        private readonly IPasswordAnalyzerService analyzer;

        public PassphraseGeneratorService(IWordlistService wordlistService,
            IPasswordAnalyzerService passwordAnalyzerService)
        {
            this.wordlistService = wordlistService;
            analyzer = passwordAnalyzerService;
        }

        public GeneratePasswordResponse Generate(GeneratePasswordFromWordsRequest request)
        {
            var words = wordlistService.GetRandomWords(request.WordCount);
            var processedWord = words.Select(x => ApplyCase(x, request.WordCase)).ToList();
            var separator = request.Separator ?? "";
            var password = string.Join(separator, processedWord);

            var alphabetCount = CountCharacterSets(request);

            var entropy = analyzer.CalculateEntropy(password, alphabetCount);
            var strengt = analyzer.GetStrengthLevel(entropy);

            var result = new GeneratePasswordResponse
            {
                Entropy = Math.Round(entropy, 2),
                Password = password,
                StrengthLevel = strengt
            };
            return result;
        }

        private string ApplyCase(string word, Case wordCase)
        {
            if (string.IsNullOrEmpty(word))
                return word;
            else if (wordCase == Case.Lower) 
                return word.ToLower();
            else if(wordCase == Case.Upper)
                return word.ToUpper();
            else
                return char.ToUpper(word[0]) + word.Substring(1).ToLower();
        }

        private int CountCharacterSets(GeneratePasswordFromWordsRequest request)
        {
            var alphabet = string.Empty;
            if (request.WordCase == Case.Lower)
                alphabet += CharacterSets.Lowercase;
            else if (request.WordCase == Case.Upper)
                alphabet += CharacterSets.Uppercase;
            else if (request.WordCase == Case.Capitalized)
                alphabet += CharacterSets.Lowercase + CharacterSets.Uppercase;

            if (request.Separator != null)
                alphabet += request.Separator;

            return alphabet.Length;
        }
    }
}
