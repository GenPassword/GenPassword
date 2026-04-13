using PasswordGenerator.Services.Password.Validator;

namespace PasswordGenerator.Services.Password.Analysis
{
    public class RepetitionPatternChecker : IRepetitionPatternChecker
    {
        private const int MinLenght = 3;

        public bool RepetitionChecker(string password)
        {
            var pass = password.ToLower();

            var len = 1;
            for (var i = 0; i < pass.Length - 1; i++)
            {
                if (pass[i] == pass[i + 1])
                {
                    len++;
                    if (len >= MinLenght)
                        return true;
                }
                else
                    len = 1;                
            }
            return false;
        }
    }
}
