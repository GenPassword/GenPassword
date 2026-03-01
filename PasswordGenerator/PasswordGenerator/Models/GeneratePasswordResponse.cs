namespace PasswordGenerator.Models;

public class GeneratePasswordResponse
{
    public string Password { get; set; } = string.Empty;
    public double Entropy { get; set; }
    public StrengthLevel StrengthLevel { get; set; }
    public string? Message { get; set; }
}
