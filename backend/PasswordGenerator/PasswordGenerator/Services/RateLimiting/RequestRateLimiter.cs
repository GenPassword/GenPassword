namespace PasswordGenerator.Services.RateLimiting
{
    public class RequestRateLimiter : IRequestRateLimiter
    {
        private readonly Dictionary<string, Queue<DateTime>> requestsByKey = new();
        private readonly object _lock = new();

        private const int MaxRequests = 4;
        private readonly TimeSpan timeWindow = TimeSpan.FromSeconds(2);

        public bool IsRequestAllowed(string key)
        {
            if (string.IsNullOrEmpty(key))
                key = "anonym";

            var now = DateTime.UtcNow;
            var threshold = now - timeWindow;

            lock (_lock)
            {
                if (!requestsByKey.TryGetValue(key, out var queue))
                {
                    queue = new Queue<DateTime>();
                    requestsByKey[key] = queue;
                }

                while (queue.Count > 0 && queue.Peek() < threshold)
                {
                    queue.Dequeue();
                }

                if (queue.Count >= MaxRequests)
                    return false;

                queue.Enqueue(now);
                Console.WriteLine(requestsByKey.Count);
                return true;
            }
        }
    }
}