namespace Dazi.WorldClock.Core;

public sealed record ClockRow(
    CityDefinition City,
    DateTime LocalTime,
    TimeSpan DifferenceFromBase,
    bool IsBaseCity);

public sealed class ClockService
{
    public IReadOnlyList<ClockRow> GetRows(DateTimeOffset instant, AppSettings rawSettings)
    {
        var settings = SettingsValidator.Normalize(rawSettings);
        var baseCity = CityCatalog.Find(settings.BaseCityId)!;
        var baseZone = TimeZoneInfo.FindSystemTimeZoneById(baseCity.TimeZoneId);
        var baseOffset = baseZone.GetUtcOffset(instant);

        return settings.EnabledCityIds.Select(id =>
        {
            var city = CityCatalog.Find(id)!;
            var zone = TimeZoneInfo.FindSystemTimeZoneById(city.TimeZoneId);
            var localTime = TimeZoneInfo.ConvertTime(instant, zone).DateTime;
            return new ClockRow(
                city,
                localTime,
                zone.GetUtcOffset(instant) - baseOffset,
                city.Id == baseCity.Id);
        }).ToArray();
    }

    public static string FormatDifference(ClockRow row, AppLanguage language = AppLanguage.SimplifiedChinese)
    {
        if (row.IsBaseCity) return string.Empty;
        if (row.DifferenceFromBase == TimeSpan.Zero)
        {
            return language == AppLanguage.English ? "Same time" : "相同时间";
        }

        var value = row.DifferenceFromBase.Duration();
        var isEarlier = row.DifferenceFromBase > TimeSpan.Zero;
        var totalHours = (int)value.TotalHours;
        if (language == AppLanguage.English)
        {
            var direction = isEarlier ? "ahead" : "behind";
            return value.Minutes == 0
                ? $"{totalHours}h {direction}"
                : $"{totalHours}h {value.Minutes}m {direction}";
        }

        var chineseDirection = isEarlier ? "早" : "晚";
        return value.Minutes == 0
            ? $"{chineseDirection} {totalHours} 小时"
            : $"{chineseDirection} {totalHours} 小时 {value.Minutes} 分钟";
    }
}
