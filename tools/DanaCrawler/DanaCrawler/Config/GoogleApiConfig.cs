namespace DanaCrawler.Config;

internal sealed class GoogleApiConfig
{
    public const string GoogleApi = "GoogleApi";

    public required string CredentialsPath { get; init; }

    public required string SpreadsheetId { get; init; }
}