using Newtonsoft.Json;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace DanaCrawler;

internal sealed class Town : BaseModel
{
    [Column("id")]
    public required int Id { get; init; }

    [Column("name")]
    public required string Name { get; init; }
}

[Table("help_requests")]
internal sealed class HelpRequest : BaseModel
{
    [PrimaryKey("id")]
    public int DbId { get; init; }

    public int Id => DbId;

    [Column("country_id")]
    public int CountryId { get; init; }

    [Column("type")]
    public string Type { get; init; }

    [Column("name")]
    public string Name { get; set; }

    [Column("location")]
    public string Location { get; init; }

    [Column("description")]
    public string Description { get; init; }

    [Column("urgency")]
    public string Urgency { get; init; }

    [Column("number_of_people")]
    public int? NumberOfPeople { get; init; }

    [Column("status")]
    public string Status { get; init; }

    [Column("latitude")]
    public string Latitude { get; init; }

    [Column("longitude")]
    public string Longitud { get; init; }

    [Column("help_type")]
    public List<string> HelpType { get; init; } = new();

    [Column("people_needed")]
    public int PeopleNeeded { get; init; }

    [Column("town_id")]
    public int? TownId { get; init; }

    [Column("contact_info")]
    public string ContactInfo { get; init; }

    [Column("created_at")]
    public DateTime CreatedAt { get; init; }

    [JsonProperty("towns")]
    public Town Town { get; set; }
}