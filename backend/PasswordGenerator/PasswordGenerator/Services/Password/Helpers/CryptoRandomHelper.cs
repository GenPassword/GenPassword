using System.Security.Cryptography;

namespace PasswordGenerator.Services.Password.Helpers;

/// <summary>
/// Криптографически стойкие вспомогательные методы для работы со случайными числами.
/// </summary>
public static class CryptoRandomHelper
{
    /// <summary>
    /// Возвращает криптографически случайное 32-битное беззнаковое целое.
    /// </summary>
    public static uint GetRandomUInt32()
    {
        var bytes = new byte[4];
        RandomNumberGenerator.Fill(bytes);
        return BitConverter.ToUInt32(bytes, 0);
    }

    /// <summary>
    /// Возвращает криптографически случайный индекс в диапазоне [0, maxExclusive).
    /// </summary>
    public static int GetRandomIndex(int maxExclusive)
    {
        if (maxExclusive <= 1)
            return 0;

        return (int)(GetRandomUInt32() % (uint)maxExclusive);
    }

    /// <summary>
    /// Перемешивает элементы Span<char> алгоритмом Фишера-Йетса.
    /// </summary>
    public static void Shuffle(Span<char> span)
    {
        for (var i = span.Length - 1; i > 0; i--)
        {
            var j = GetRandomIndex(i + 1);
            (span[i], span[j]) = (span[j], span[i]);
        }
    }
}