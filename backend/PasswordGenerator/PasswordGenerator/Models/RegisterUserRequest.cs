using System.ComponentModel.DataAnnotations;

namespace PasswordGenerator.Models
{
    public class RegisterUserRequest
    {
        [Required (ErrorMessage = "Email обязателен")]
        [EmailAddress (ErrorMessage = "Email некоректен")]
        public string Email { get; set; } = string.Empty;

        [Required (ErrorMessage = "Пароль обязателен")]
        [MinLength (5, ErrorMessage = "Пароль должен быть минимум из 5 символов")]
        public string Password { get; set; } = string.Empty;
    }
}
