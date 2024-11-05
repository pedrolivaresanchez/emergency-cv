namespace DanaCrawler.Config;

internal sealed class GoogleApiConfig
{
    public const string GoogleApi = "GoogleApi";

    public required string CredentialsPath { get; set; }

    public required string SpreadsheetId { get; set; }
}