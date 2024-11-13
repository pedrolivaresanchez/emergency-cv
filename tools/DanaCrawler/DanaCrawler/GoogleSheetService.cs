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
            "Created At", "ID", "Avisos", "Status", "Town","Description", "Help Types",  "Number of People",
            "Name", "Location", "ContactInfo", "People Needed", "Notes"
        };

        var rows = new List<IList<object>> { headerRow };
        rows.AddRange(requests.OrderBy(x => x.Id).Where(x => x.Type == "necesita").Select(request => new List<object>
        {
            request.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
            $"=HYPERLINK(\"https://ajudadana.es/solicitudes/{request.Id}\"; \"{request.Id}\")",
            request.Avisos ?? "",
            request.CrmStatus ?? "",
            request.Town?.Name ?? "",
            request.Description ?? "",
            string.Join(", ", request.HelpType ?? []),
            request.NumberOfPeople ?? 0,
            request.Name ?? "",
            request.Location ?? "",
            request.ContactInfo ?? "",
            request.PeopleNeeded,
            request.Notes ?? "",
        }));

        var valueRange = new ValueRange
        {
            Values = rows
        };

        var updateRequest = _sheetsService.Spreadsheets.Values.Update(
            valueRange,
            _spreadsheetId,
            $"{sheetName}!A1:M"
        );
        updateRequest.ValueInputOption = SpreadsheetsResource.ValuesResource.UpdateRequest.ValueInputOptionEnum.USERENTERED;

        await updateRequest.ExecuteAsync();
    }

    public async Task<List<HelpRequest>> GetSheetHelpRequests()
    {
        var getRequest = _sheetsService.Spreadsheets.Values.Get(_spreadsheetId, "NecesitaCRMV2 Hoja de Trabajo - 12/11!A1:M");

        var rows = await getRequest.ExecuteAsync();

        var helpRequests = new List<HelpRequest>();
        for (var i = 0; i < rows.Values.Count; i++)
        {
            if (i == 0) continue;

            var rowsValue = rows.Values[i];
            try
            {
                helpRequests.Add(new HelpRequest
                {
                    CreatedAt = string.IsNullOrEmpty(rowsValue[0]?.ToString())
                        ? DateTime.MinValue
                        : DateTime.Parse(rowsValue[0].ToString()),
                    DbId = string.IsNullOrEmpty(rowsValue[1]?.ToString())
                        ? 0
                        : int.Parse(rowsValue[1].ToString().Split(";")[0]),
                    Avisos = rowsValue[2]?.ToString() ?? "",
                    CrmStatus = rowsValue[3]?.ToString() ?? "",
                    Town = new Town
                    {
                        Id = 0,
                        Name = rowsValue[4]?.ToString() ?? ""
                    },
                    Description = rowsValue[5]?.ToString() ?? "",
                    HelpType = string.IsNullOrEmpty(rowsValue[6]?.ToString())
                        ? new List<string>()
                        : rowsValue[6].ToString().Split(",").ToList(),
                    NumberOfPeople = string.IsNullOrEmpty(rowsValue[7]?.ToString())
                        ? 0
                        : int.Parse(rowsValue[7].ToString()),
                    Name = rowsValue[8]?.ToString() ?? "",
                    Location = rowsValue[9]?.ToString() ?? "",
                    ContactInfo = rowsValue[10]?.ToString() ?? "",
                    PeopleNeeded = string.IsNullOrEmpty(rowsValue[11]?.ToString())
                        ? 0
                        : int.Parse(rowsValue[11].ToString()),
                    Notes = rowsValue.Count >= 13 ? rowsValue[12]?.ToString() ?? "" : "",
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        return helpRequests;
    }
}