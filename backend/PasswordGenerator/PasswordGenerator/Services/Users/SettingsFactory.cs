using PasswordGenerator.Models;
using PasswordGenerator.Models.GeneratorSettings;
using System.Text.Json;

namespace PasswordGenerator.Services.Users
{
    public class SettingsFactory
    {
        public IGeneratorSettings? ParseRequest(SaveSettingsRequest request)
        {
            var type = request.GeneratorType;
            var settings = request.SettingsJson;
            switch (type)
            {
                case GeneratorType.Random:      
                    return JsonSerializer.Deserialize<RandomGeneratorSettings>(settings);
                case GeneratorType.Pin:
                    return JsonSerializer.Deserialize<PinGeneratorSettings>(settings);
                case GeneratorType.Words:
                    return JsonSerializer.Deserialize<WordGeneratorSettings>(settings);
                default:
                    throw new InvalidCastException($"{type} is not supported.");
            }
        }
    }
}
