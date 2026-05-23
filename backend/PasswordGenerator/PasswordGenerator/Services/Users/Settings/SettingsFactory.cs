using PasswordGenerator.Models;
using PasswordGenerator.Models.GeneratorSettings;
using System.Text.Json;

namespace PasswordGenerator.Services.Users.Settings
{
    public class SettingsFactory
    {
        public IGeneratorSettings ParseRequest(SaveSettingsRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.SettingsJson))
                throw new ArgumentException("SettingsJson пустой или не передан.", nameof(request.SettingsJson));

            var type = request.GeneratorType;
            var settings = request.SettingsJson;

            try
            {
                return type switch
                {
                    GeneratorType.Random => DeserializeOrThrow<RandomGeneratorSettings>(settings, type),
                    GeneratorType.Pin => DeserializeOrThrow<PinGeneratorSettings>(settings, type),
                    GeneratorType.Words => DeserializeOrThrow<WordGeneratorSettings>(settings, type),
                    _ => throw new NotSupportedException($"Тип генератора '{type}' не поддерживается.")
                };
            }
            catch (JsonException ex)
            {
                throw new JsonException(
                    $"Не удалось разобрать JSON настроек для {type}. Фрагмент: {Truncate(settings)}",
                    ex);
            }
        }

        private static T DeserializeOrThrow<T>(string json, GeneratorType type) where T : class, IGeneratorSettings
        {
            var result = JsonSerializer.Deserialize<T>(json, SettingsJsonOptions.Deserialize);
            if (result == null)
                throw new JsonException($"JSON настроек для {type} десериализовался в null. Фрагмент: {Truncate(json)}");

            return result;
        }

        private static string Truncate(string value, int maxLength = 120)
        {
            if (string.IsNullOrEmpty(value))
                return "(пусто)";

            return value.Length <= maxLength ? value : value[..maxLength] + "...";
        }
    }
}
