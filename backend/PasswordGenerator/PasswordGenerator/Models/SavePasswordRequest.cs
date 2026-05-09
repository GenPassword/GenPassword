namespace PasswordGenerator.Models
{
    public class SavePasswordRequest
    {
        public int Id { get; set; }
        public string Password { get; set; }
        public string Description { get; set; }
    }
}
