namespace DanaCrawler.Config;

internal sealed class SupabaseConfig
{
    public const string Supabase = "Supabase";

    public required string Url { get; init; }

    public required string ApiKey { get; init; }
}