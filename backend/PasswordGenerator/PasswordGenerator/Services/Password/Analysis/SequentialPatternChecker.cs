using PasswordGenerator.Services.Password.Analysis;
using PasswordGenerator.Services.Password.Validator;

public class SequentialPatternChecker : ISequentialPatternChecker
{
    private readonly string[] basePatterns = new[]
    {
        "1234567890",
        "abcdefghijklmnopqrstuvwxyz",
        "qwertyuiop",
        "asdfghjkl",
        "zxcvbnm"
    };

    private readonly List<Dictionary<char, int>> patternMaps;

    public SequentialPatternChecker()
    {
        patternMaps = new List<Dictionary<char, int>>();

        foreach (var pattern in basePatterns)
        {
            AddPattern(pattern);
            AddPattern(new string(pattern.Reverse().ToArray()));
        }
    }

    private void AddPattern(string pattern)
    {
        var map = new Dictionary<char, int>();
        for (int i = 0; i < pattern.Length; i++)
            map[pattern[i]] = i;

        patternMaps.Add(map);
    }

    public List<string> FindSequentialPatternInPassword(string password)
    {
        var pass = password.ToLower();
        var result = new List<string>();

        foreach (var map in patternMaps)
        {
            result.AddRange(FindInSinglePattern(pass, map));
        }

        return result;
    }

    public bool CheckPasswordForBadPattern(string password)
    {
        var pass = password.ToLower();

        foreach (var map in patternMaps)
        {
            if (HasInSinglePattern(pass, map))
                return true;
        }

        return false;
    }

    private List<string> FindInSinglePattern(string pass, Dictionary<char, int> map)
    {
        var result = new List<string>();

        var start = -1;
        var length = 1;

        for (int i = 0; i < pass.Length - 1; i++)
        {
            var current = pass[i];
            var next = pass[i + 1];

            if (char.IsLetter(current) != char.IsLetter(next) &&
                char.IsDigit(current) != char.IsDigit(next))
            {
                TryAdd(pass, result, start, length);
                length = 1;
                continue;
            }

            if (map.TryGetValue(current, out int index1) &&
                map.TryGetValue(next, out int index2) &&
                index2 == index1 + 1)
            {
                if (length == 1)
                    start = i;

                length++;
            }
            else
            {
                TryAdd(pass, result, start, length);
                length = 1;
            }
        }
        TryAdd(pass, result, start, length);

        return result;
    }

    private bool HasInSinglePattern(string pass, Dictionary<char, int> map)
    {
        var length = 1;

        for (int i = 0; i < pass.Length - 1; i++)
        {
            var current = pass[i];
            var next = pass[i + 1];

            if (char.IsLetter(current) != char.IsLetter(next) &&
                char.IsDigit(current) != char.IsDigit(next))
            {
                length = 1;
                continue;
            }

            if (map.TryGetValue(current, out int index1) &&
                map.TryGetValue(next, out int index2) &&
                index2 == index1 + 1)
            {
                length++;
                if (length >= 4)
                    return true;
            }
            else
            {
                length = 1;
            }
        }

        return false;
    }

    private void TryAdd(string pass, List<string> result, int start, int length)
    {
        if (length >= 4 && start != -1)
        {
            result.Add(pass.Substring(start, length));
        }
    }
}