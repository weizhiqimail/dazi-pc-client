namespace Dazi.WorldClock.Core;

public static class SettingsValidator
{
    public static AppSettings Normalize(AppSettings? source)
    {
        var settings = source?.Copy() ?? AppSettings.CreateDefault();
        var knownIds = CityCatalog.All.Select(city => city.Id).ToHashSet(StringComparer.Ordinal);
        settings.EnabledCityIds = settings.EnabledCityIds
            .Where(knownIds.Contains)
            .Distinct(StringComparer.Ordinal)
            .ToList();

        if (settings.EnabledCityIds.Count == 0)
        {
            settings.EnabledCityIds.Add("shanghai");
        }

        if (!settings.EnabledCityIds.Contains(settings.BaseCityId, StringComparer.Ordinal))
        {
            settings.BaseCityId = settings.EnabledCityIds[0];
        }

        settings.Version = 1;
        settings.OpacityPercent = Math.Clamp(settings.OpacityPercent, 40, 100);
        if (!Enum.IsDefined(settings.Language)) settings.Language = AppLanguage.SimplifiedChinese;
        settings.Placement ??= new WindowPlacement();
        return settings;
    }
}
