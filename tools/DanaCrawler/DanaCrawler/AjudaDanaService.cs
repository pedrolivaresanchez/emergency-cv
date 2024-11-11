using DanaCrawler.Config;
using Microsoft.Extensions.Options;
using Supabase.Postgrest;
using Client = Supabase.Client;

namespace DanaCrawler;

internal sealed class AjudaDanaService
{
    private readonly Client _supabaseClient;
    private readonly IOptions<SupabaseConfig> _config;
    private readonly ILogger<AjudaDanaService> _logger;

    public AjudaDanaService(Supabase.Client supabaseClient, IOptions<SupabaseConfig> config, ILogger<AjudaDanaService> logger)
    {
        _supabaseClient = supabaseClient ?? throw new ArgumentNullException(nameof(supabaseClient));
        _config = config ?? throw new ArgumentNullException(nameof(config));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<List<HelpRequest>> GetHelpRequestsWithTownsPaginated(CancellationToken stoppingToken)
    {
        var allRecords = new List<HelpRequest>();
        int pageSize = 1000;
        int currentPage = 0;
        bool hasMore = true;

        while (hasMore)
        {
            var response = await _supabaseClient
                .From<HelpRequest>()
                .Select("*, towns(*)")
                .Range(currentPage * pageSize, (currentPage + 1) * pageSize - 1)
                .Get(stoppingToken);

            var pageRecords = response.Models;

            if (pageRecords.Any())
            {
                allRecords.AddRange(pageRecords);
                currentPage++;
            }
            else
            {
                hasMore = false;
            }
        }

        return allRecords;
    }

    public async Task SyncCrmStatusWithDb(List<HelpRequest> helpRequests)
    {
        await _supabaseClient.Auth.SignIn(_config.Value.ServiceAccountEmail, _config.Value.ServiceAccountPassword);
        var dbRequest = await _supabaseClient.From<HelpRequest>()
            .Select("*")
            .Where(request => request.Type == "necesita")
            .Get();

        helpRequests = RemoveDuplicatesKeepLongest(helpRequests, x => x.Description, x => x.Id);
        foreach (var helpRequest in helpRequests)
        {
            if (string.IsNullOrWhiteSpace(helpRequest.Description)) continue;

            var matchingRequests = dbRequest.Models
                .Where(x => !string.IsNullOrWhiteSpace(x.Description) &&
                            x.CreatedAt == helpRequest.CreatedAt.AddHours(1) &&
                            NormalizeString(helpRequest.Description).Contains(NormalizeString(x.Description)))
                .ToList();

            if (matchingRequests.Count == 0)
            {
                matchingRequests = dbRequest.Models
                    .Where(x => !string.IsNullOrWhiteSpace(x.Description) &&
                                helpRequest.Description.Split(" ").Length - x.Description.Split(" ").Length <= 20 &&
                                NormalizeString(helpRequest.Description).Contains(NormalizeString(x.Description)))
                    .ToList();
            }

            if (matchingRequests.Count == 0)
            {
                _logger.LogWarning("No matching requests for Id {Id} with description {Description}", helpRequest.Id, helpRequest.Description);
                continue;
            }

            if (matchingRequests.Count > 1)
            {
                _logger.LogError("HAY MAS DE UNO ERNESTO JDOER PUTA SALBAGUARDA, QUE HAGO AHORA?");
                _logger.LogError("Cannot update models with description {Description} and Ids = {Ids}", helpRequest.Description,
                    string.Join(", ", matchingRequests.Select(x => x.Id)));
                continue;
            }

            var matchingRequest = matchingRequests.FirstOrDefault();
            if (matchingRequest != null)
            {
                var update = _supabaseClient.From<HelpRequest>()
                    .Filter("id", Constants.Operator.Equals, matchingRequest.DbId)
                    .Set(x => new KeyValuePair<object, object?>(x.CrmStatus, helpRequest.Status));

                    update.Set(x => new KeyValuePair<object, object?>(x.Notes, helpRequest.Description.Replace(matchingRequest.Description, string.Empty).Trim()));

                await update.Update();
            }
        }
    }

    public List<T> RemoveDuplicatesKeepLongest<T>(List<T> list, Func<T, string> descriptionSelector, Func<T, int> comparisonKey)
    {
        return list
            .GroupBy(item => comparisonKey(item))
            .Select(group => group
                .OrderByDescending(item => descriptionSelector(item).Length)
                .First())
            .ToList();
    }

    private static string NormalizeString(string input)
    {
        // Remove all whitespace characters and line breaks
        return new string(input.Where(c => !char.IsWhiteSpace(c)).ToArray());
    }


    private static double CalculateSimilarity(string source, string target)
    {
        if (string.IsNullOrEmpty(source) || string.IsNullOrEmpty(target)) return 0;

        source = source.ToLower();
        target = target.ToLower();

        if (source.Contains(target)) return 1;

        double maxSimilarity = 0;
        int targetLength = target.Length;
        int windowSize = targetLength + (targetLength / 2);

        for (int i = 0; i <= source.Length - targetLength; i++)
        {
            int endIndex = Math.Min(i + windowSize, source.Length);
            string substring = source.Substring(i, endIndex - i);
            double similarity = ComputeStringSimilarity(substring, target);
            maxSimilarity = Math.Max(maxSimilarity, similarity);
        }

        return maxSimilarity;
    }

    private static double ComputeStringSimilarity(string s1, string s2)
    {
        var distance = LevenshteinDistance(s1, s2);
        var maxLength = Math.Max(s1.Length, s2.Length);
        return 1 - ((double)distance / maxLength);
    }

    private static int LevenshteinDistance(string s1, string s2)
    {
        int[,] matrix = new int[s1.Length + 1, s2.Length + 1];

        for (int i = 0; i <= s1.Length; i++)
            matrix[i, 0] = i;

        for (int j = 0; j <= s2.Length; j++)
            matrix[0, j] = j;

        for (int i = 1; i <= s1.Length; i++)
        {
            for (int j = 1; j <= s2.Length; j++)
            {
                int cost = (s1[i - 1] == s2[j - 1]) ? 0 : 1;

                matrix[i, j] = Math.Min(
                    Math.Min(matrix[i - 1, j] + 1, matrix[i, j - 1] + 1),
                    matrix[i - 1, j - 1] + cost
                );
            }
        }

        return matrix[s1.Length, s2.Length];
    }
}