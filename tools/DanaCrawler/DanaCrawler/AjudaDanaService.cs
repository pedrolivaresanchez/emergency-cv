using Supabase;

namespace DanaCrawler;

internal sealed class AjudaDanaService
{
    private readonly Client _supabaseClient;

    public AjudaDanaService(Supabase.Client supabaseClient)
    {
        _supabaseClient = supabaseClient ?? throw new ArgumentNullException(nameof(supabaseClient));
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
}