using DanaCrawler;
using DanaCrawler.Config;
using Microsoft.Extensions.Options;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.Datadog.Logs;
using Supabase;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.Configure<SupabaseConfig>(builder.Configuration.GetSection(SupabaseConfig.Supabase));
builder.Services.Configure<GoogleApiConfig>(builder.Configuration.GetSection(GoogleApiConfig.GoogleApi));
builder.Services.AddSingleton<AjudaDanaService>();

builder.Services.AddSerilog((services, logConfiguration) =>
    logConfiguration
        .MinimumLevel.Information()
        .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
        .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .WriteTo.DatadogLogs(
            apiKey: "test",
            source: "dana-crawler",
            service: "dana-crawler-service",
            host: Environment.MachineName,
            configuration: new DatadogConfiguration
            {
                Url = "https://http-intake.logs.datadoghq.eu"
            }
        ));

builder.Services.AddHostedService<Worker>();

builder.Services.AddSingleton(provider =>
{
    var config = provider.GetRequiredService<IOptions<SupabaseConfig>>().Value;

    return new Supabase.Client(config!.Url, config.ApiKey, new SupabaseOptions
    {
        AutoRefreshToken = true,
        AutoConnectRealtime = true,
    });
});

var host = builder.Build();
await host.RunAsync();