namespace PasswordGenerator.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool EmailConfirmed { get; set; } = false;
        public DateTime? LastLogin { get; set; }
        public string Role { get; set; } = "User";
    }
}