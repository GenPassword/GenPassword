namespace PasswordGenerator.Entities
{
    public class UserSavesPassword
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Password { get; set; }
        public string Description { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public DateTime UpdateAt { get; set; } = DateTime.Now;
        public User User { get; set; }
    }
}
