namespace PasswordGenerator.Services;

public partial class PasswordGeneratorService
{
    private record CharGroups(string Lower, string Upper, string Digits, string Special);
}
