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
        var headerRow = new List<object>
        {
            "ID", "Type", "Name", "Location", "Description",
            "Urgency", "Number of People", "Status", "Latitude", "Longitude",
            "ContactInfo", "Help Types", "People Needed", "Town", "Created At"
        };

        var rows = new List<IList<object>> { headerRow };
        rows.AddRange(requests.OrderBy(x => x.Id).Select(request => new List<object>
        {
            request.Id,
            request.Type ?? "",
            request.Name ?? "",
            request.Location ?? "",
            request.Description ?? "",
            request.Urgency ?? "",
            request.NumberOfPeople ?? 0,
            request.Status ?? "",
            request.Latitude ?? "",
            request.Longitud ?? "",
            request.ContactInfo ?? "",
            string.Join(", ", request.HelpType ?? []),
            request.PeopleNeeded,
            request.Town?.Name ?? "",
            request.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss")
        }));

        var valueRange = new ValueRange
        {
            Values = rows
        };

        var updateRequest = _sheetsService.Spreadsheets.Values.Update(
            valueRange,
            _spreadsheetId,
            "RAW!A1:O"
        );
        updateRequest.ValueInputOption = SpreadsheetsResource.ValuesResource.UpdateRequest.ValueInputOptionEnum.USERENTERED;

        await updateRequest.ExecuteAsync();
    }

    public async Task FormatSheet()
    {
        var requests = new List<Request>
        {
            new Request
            {
                RepeatCell = new RepeatCellRequest
                {
                    Range = new GridRange
                    {
                        SheetId = 0,
                        StartRowIndex = 0,
                        EndRowIndex = 1
                    },
                    Cell = new CellData
                    {
                        UserEnteredFormat = new CellFormat
                        {
                            BackgroundColor = new Color { Red = 0.8f, Green = 0.8f, Blue = 0.8f },
                            TextFormat = new TextFormat
                            {
                                Bold = true
                            }
                        }
                    },
                    Fields = "userEnteredFormat(backgroundColor,textFormat)"
                }
            },
            new Request
            {
                AutoResizeDimensions = new AutoResizeDimensionsRequest
                {
                    Dimensions = new DimensionRange
                    {
                        SheetId = 0,
                        Dimension = "COLUMNS",
                        StartIndex = 0,
                        EndIndex = 15
                    }
                }
            },
            new Request
            {
                UpdateSheetProperties = new UpdateSheetPropertiesRequest
                {
                    Properties = new SheetProperties
                    {
                        SheetId = 0,
                        GridProperties = new GridProperties
                        {
                            FrozenRowCount = 1
                        }
                    },
                    Fields = "gridProperties.frozenRowCount"
                }
            }
        };

        var batchUpdateRequest = new BatchUpdateSpreadsheetRequest
        {
            Requests = requests
        };

        await _sheetsService.Spreadsheets.BatchUpdate(
            batchUpdateRequest,
            _spreadsheetId
        ).ExecuteAsync();
    }
}