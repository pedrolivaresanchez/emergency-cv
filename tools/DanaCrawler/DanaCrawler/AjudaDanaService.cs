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

        foreach (var helpRequest in helpRequests)
        {
            var statusMapping = helpRequest.CrmStatus switch
            {
                "active" => "active",
                "finished" => "finished",
                _ => "progress"
            };

            var update = await _supabaseClient.From<HelpRequest>()
                .Filter("id", Constants.Operator.Equals, helpRequest.DbId)
                .Set(x => new KeyValuePair<object, object?>(x.Status, statusMapping)) // For web
                .Set(x => new KeyValuePair<object, object?>(x.CrmStatus, helpRequest.CrmStatus))
                .Set(x => new KeyValuePair<object, object?>(x.Notes, helpRequest.Notes))
                .Set(x => new KeyValuePair<object, object?>(x.Avisos, helpRequest.Avisos))
                .Update();
        }
    }
}