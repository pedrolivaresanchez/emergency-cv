using DanaCrawler.Config;
using Microsoft.Extensions.Options;

namespace DanaCrawler;

internal sealed class Worker : BackgroundService
{
    private readonly AjudaDanaService _ajudaDanaService;
    private readonly IOptions<GoogleApiConfig> _googleConfig;
    private readonly ILogger<Worker> _logger;

    public Worker(AjudaDanaService ajudaDanaService, IOptions<GoogleApiConfig> googleConfig, ILogger<Worker> logger)
    {
        _ajudaDanaService = ajudaDanaService ?? throw new ArgumentNullException(nameof(ajudaDanaService));
        _googleConfig = googleConfig ?? throw new ArgumentNullException(nameof(googleConfig));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var helpRequests = await _ajudaDanaService.GetHelpRequestsWithTownsPaginated(stoppingToken);

            _logger.LogInformation("Got {Count} HelpRequests from AjudaDana.es", helpRequests.Count);

            await ExportToGoogleSheets(helpRequests);

            if (_logger.IsEnabled(LogLevel.Information))
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
            }

            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }

    private async Task ExportToGoogleSheets(List<HelpRequest> helpRequests)
    {
        var credentialsPath = _googleConfig.Value.CredentialsPath;
        var spreadsheetId = _googleConfig.Value.SpreadsheetId;

        var sheetsService = new GoogleSheetsService(credentialsPath, spreadsheetId);

        try
        {
            await sheetsService.InsertHelpRequests(helpRequests);
            //await sheetsService.FormatSheet();
            _logger.LogInformation("Data exported successfully!");
        }
        catch (Exception ex)
        {
            _logger.LogError("Error exporting data {Message}", ex.Message);
        }
    }
}