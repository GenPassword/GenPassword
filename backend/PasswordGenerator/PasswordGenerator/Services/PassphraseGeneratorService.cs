using PasswordGenerator.Models;

namespace PasswordGenerator.Services
{
    public class PassphraseGeneratorService : IPassphraseGeneratorService
    {
        private readonly IWordlistService wordlistService;
        private readonly IPasswordAnalyzerService analyzer;

        public PassphraseGeneratorService(IWordlistService wordlistService,
            IPasswordAnalyzerService passwordAnalyzerService)
        {
            this.wordlistService = wordlistService;
            this.analyzer = passwordAnalyzerService;
        }

        public GeneratePasswordResponse Generate(GeneratePasswordFromWordsRequest request)
        {
            var words = wordlistService.GetRandomWords(request.WordCount);
            var processedWord = words.Select(x => ApplyCase(x, request.WordCase)).ToList();
            var separator = request.Separator ?? "";
            var password = string.Join(separator, processedWord);
            var entropy = analyzer.CalculateEntropy(password, wordlistService.GetWordCount());
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
    }
}
