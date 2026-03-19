using PasswordGenerator.Models;

namespace PasswordGenerator.Entities
{
    public class UserSetting
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public GeneratorType GeneratorType { get; set; }
        public string SettingJson { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public DateTime UpdateAt { get; set; } = DateTime.Now;

        public User User { get; set; }
    }
}
