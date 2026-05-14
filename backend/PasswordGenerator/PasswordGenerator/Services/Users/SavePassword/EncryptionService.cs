using System.Security.Cryptography;
using System.Text;

namespace PasswordGenerator.Services.Users.SavePassword
{
    public class EncryptionService : IEncryptionService
    {
        private readonly byte[] key;

        public EncryptionService(string secretKey)
        {
            var sha = SHA256.Create();
            key = sha.ComputeHash(Encoding.UTF8.GetBytes(secretKey));
        }
        public string Decrypt(string encryptedText)
        {
            var allBytes = Convert.FromBase64String(encryptedText);

            var aes = Aes.Create();
            aes.Key = key;

            var iv = new byte[16];
            var cipherBytes = new byte[allBytes.Length - 16];

            Buffer.BlockCopy(allBytes, 0, iv, 0, iv.Length);
            Buffer.BlockCopy(allBytes, iv.Length, cipherBytes, 0, cipherBytes.Length);
            aes.IV = iv;

            var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

            var dataBytes = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);

            return Encoding.UTF8.GetString(dataBytes);

        }

        public string Encrypt(string plainText)
        {
            var dataBytes = Encoding.UTF8.GetBytes(plainText);

            var aes = Aes.Create();

            aes.Key = key;
            aes.GenerateIV();
            var iv = aes.IV;

            var encryptor = aes.CreateEncryptor(aes.Key, iv);

            var cipherBytes = encryptor.TransformFinalBlock(dataBytes, 0, dataBytes.Length);
            var resultBytes = new byte[iv.Length + cipherBytes.Length];
            Buffer.BlockCopy(iv, 0, resultBytes, 0, iv.Length);
            Buffer.BlockCopy(cipherBytes, 0, resultBytes, iv.Length, cipherBytes.Length);

            return Convert.ToBase64String(resultBytes);
        }
    }
}
