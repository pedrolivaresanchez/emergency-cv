using System.Diagnostics;
using DanaCrawler.Config;
using Microsoft.Extensions.Options;
using Serilog.Context;

namespace DanaCrawler;

internal sealed class Worker : BackgroundService
{
    private readonly AjudaDanaService _ajudaDanaService;
    private readonly GoogleSheetsService _googleSheetsService;
    private readonly ILogger<Worker> _logger;

    public Worker(AjudaDanaService ajudaDanaService, GoogleSheetsService googleSheetsService, IOptions<GoogleApiConfig> googleConfig,
        ILogger<Worker> logger)
    {
        _ajudaDanaService = ajudaDanaService ?? throw new ArgumentNullException(nameof(ajudaDanaService));
        _googleSheetsService = googleSheetsService ?? throw new ArgumentNullException(nameof(googleSheetsService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (LogContext.PushProperty("dd_trace_id", Guid.NewGuid()))
            {
                var stopwatch = Stopwatch.StartNew();
                {
                    var helpRequests = await _googleSheetsService.GetSheetHelpRequests();
                    _logger.LogInformation("Syncing {Count} HelpRequests from the google sheet", helpRequests.Count);
                    await _ajudaDanaService.SyncCrmStatusWithDb(helpRequests);
                }

                {
                    var helpRequests = await _ajudaDanaService.GetHelpRequestsWithTownsPaginated(stoppingToken);
                    _logger.LogInformation("Got {Count} HelpRequests from AjudaDana.es", helpRequests.Count);
                    await ExportToGoogleSheets(helpRequests);
                }

                _logger.LogInformation("Worker took: {time}", stopwatch.ToString());
            }

            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }

    private async Task ExportToGoogleSheets(List<HelpRequest> helpRequests)
    {
        try
        {
            await _googleSheetsService.InsertHelpRequests(helpRequests);
            //await sheetsService.FormatSheet();
            _logger.LogInformation("Data exported successfully!");
        }
        catch (Exception ex)
        {
            _logger.LogError("Error exporting data {Message}", ex.Message);
        }
    }
}