namespace Dazi.WorldClock.Core;

public sealed record CityDefinition(string Id, string ChineseName, string EnglishName, string TimeZoneId)
{
    public string GetDisplayName(AppLanguage language) =>
        language == AppLanguage.English ? EnglishName : ChineseName;
}

public static class CityCatalog
{
    public static IReadOnlyList<CityDefinition> All { get; } =
    [
        new("shanghai", "上海", "Shanghai", "China Standard Time"),
        new("tokyo", "东京", "Tokyo", "Tokyo Standard Time"),
        new("new-york", "纽约", "New York", "Eastern Standard Time"),
        new("chicago", "芝加哥", "Chicago", "Central Standard Time"),
        new("los-angeles", "洛杉矶", "Los Angeles", "Pacific Standard Time"),
        new("london", "伦敦", "London", "GMT Standard Time"),
        new("paris", "巴黎", "Paris", "Romance Standard Time"),
    ];

    public static CityDefinition? Find(string id) =>
        All.FirstOrDefault(city => string.Equals(city.Id, id, StringComparison.Ordinal));
}
