using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;

namespace DanaCrawler;

internal sealed class GoogleSheetsService
{
    private static readonly string[] Scopes = { SheetsService.Scope.Spreadsheets };
    private readonly SheetsService _sheetsService;
    private readonly string _spreadsheetId;

    public GoogleSheetsService(string credentialsJsonPath, string spreadsheetId)
    {
        var credential = GoogleCredential.FromFile(credentialsJsonPath)
            .CreateScoped(Scopes);

        _sheetsService = new SheetsService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = "DanaCrawler"
        });

        _spreadsheetId = spreadsheetId;
    }

    public async Task InsertHelpRequests(List<HelpRequest> requests)
    {
        await InsertNeedsRequestsAsync(requests);
        await InsertOffersRequestsAsync(requests);
    }

    private async Task InsertOffersRequestsAsync(List<HelpRequest> requests)
    {
        var sheetName = "OfreceCRMV2";
        var clearRequest = _sheetsService.Spreadsheets.Values.Clear(
            new ClearValuesRequest(),
            _spreadsheetId,
            $"{sheetName}!A1:ZZ"
        );
        await clearRequest.ExecuteAsync();

        var headerRow = new List<object>
        {
            "Created At", "ID", "Status", "Town","Description", "Help Types", "L", "M", "X", "J", "V", "S", "D",
            "Vehicle", "Number of People", "Name", "Location", "ContactInfo", "People Needed",
        };

        var offerRequests = requests.Where(x => x.Type == "ofrece");

        var rows = new List<IList<object>> { headerRow };
        rows.AddRange(offerRequests.OrderBy(x => x.Id).Select(request => new List<object>
        {
            request.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
            request.Id,
            //request.Type ?? "",
            request.Status ?? "",
            request.Town?.Name ?? "",
            request.Description ?? "",
            string.Join(", ", request.HelpType ?? []),
            request.Resources != null ? request.Resources.Availability.Contains("Lunes") ? "X" : "" : "",
            request.Resources != null ? request.Resources.Availability.Contains("Martes") ? "X" : "" : "",
            request.Resources != null ? request.Resources.Availability.Contains("Miércoles") ? "X" : "" : "",
            request.Resources != null ? request.Resources.Availability.Contains("Jueves") ? "X" : "" : "",
            request.Resources != null ? request.Resources.Availability.Contains("Viernes") ? "X" : "" : "",
            request.Resources != null ? request.Resources.Availability.Contains("Sábado") ? "X" : "" : "",
            request.Resources != null ? request.Resources.Availability.Contains("Domingo") ? "X" : "" : "",
            request.Resources?.Vehicle ?? "NO",
            request.NumberOfPeople ?? 0,
            request.Name ?? "",
            request.Location ?? "",
            request.ContactInfo ?? "",
            //request.Urgency ?? "",
            //request.Latitude ?? "",
            //request.Longitud ?? "",
            request.PeopleNeeded,
        }));


        var valueRange = new ValueRange
        {
            Values = rows
        };

        var updateRequest = _sheetsService.Spreadsheets.Values.Update(
            valueRange,
            _spreadsheetId,
            $"{sheetName}!A1:S"
        );
        updateRequest.ValueInputOption = SpreadsheetsResource.ValuesResource.UpdateRequest.ValueInputOptionEnum.USERENTERED;

        await updateRequest.ExecuteAsync();
    }

    private async Task InsertNeedsRequestsAsync(List<HelpRequest> requests)
    {
        string sheetName = "NecesitaCRMV2";
        var clearRequest = _sheetsService.Spreadsheets.Values.Clear(
            new ClearValuesRequest(),
            _spreadsheetId,
            $"{sheetName}!A2:ZZ"
        );
        await clearRequest.ExecuteAsync();

        var headerRow = new List<object>
        {
            "Created At", "ID", "Status", "Town","Description", "Help Types",  "Number of People",
            "Name", "Location", "ContactInfo", "People Needed",
        };

        var rows = new List<IList<object>> { headerRow };
        rows.AddRange(requests.OrderBy(x => x.Id).Where(x => x.Type == "necesita").Select(request => new List<object>
        {
            request.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
            request.Id,
            //request.Type ?? "",
            request.Status ?? "",
            request.Town?.Name ?? "",
            request.Description ?? "",
            string.Join(", ", request.HelpType ?? []),
            request.NumberOfPeople ?? 0,
            request.Name ?? "",
            request.Location ?? "",
            request.ContactInfo ?? "",
            //request.Urgency ?? "",
            //request.Latitude ?? "",
            //request.Longitud ?? "",
            request.PeopleNeeded,
        }));

        var valueRange = new ValueRange
        {
            Values = rows
        };

        var updateRequest = _sheetsService.Spreadsheets.Values.Update(
            valueRange,
            _spreadsheetId,
            $"{sheetName}!A1:K"
        );
        updateRequest.ValueInputOption = SpreadsheetsResource.ValuesResource.UpdateRequest.ValueInputOptionEnum.USERENTERED;

        await updateRequest.ExecuteAsync();
    }
}