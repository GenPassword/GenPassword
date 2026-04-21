namespace PasswordGenerator.Services.RateLimiting
{
    public interface IRequestRateLimiter
    {
        public bool IsRequestAllowed(string key);
    }
}
