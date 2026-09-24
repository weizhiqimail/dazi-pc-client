namespace Dazi.WorldClock.Core;

public enum ClockLayout
{
    Horizontal,
    Vertical,
}

public enum DockEdge
{
    None,
    Left,
    Right,
    Top,
}

public enum AppLanguage
{
    SimplifiedChinese,
    English,
}

public sealed class WindowPlacement
{
    public int X { get; set; }
    public int Y { get; set; }
    public string? DisplayDeviceName { get; set; }
    public DockEdge DockEdge { get; set; } = DockEdge.Right;
}

public sealed class AppSettings
{
    public int Version { get; set; } = 1;
    public List<string> EnabledCityIds { get; set; } = ["shanghai", "tokyo", "new-york"];
    public string BaseCityId { get; set; } = "shanghai";
    public ClockLayout Layout { get; set; } = ClockLayout.Horizontal;
    public bool IsLocked { get; set; }
    public bool AlwaysOnTop { get; set; }
    public int OpacityPercent { get; set; } = 100;
    public AppLanguage Language { get; set; } = AppLanguage.SimplifiedChinese;
    public WindowPlacement Placement { get; set; } = new();

    public AppSettings Copy() => new()
    {
        Version = Version,
        EnabledCityIds = EnabledCityIds is null ? [] : [.. EnabledCityIds],
        BaseCityId = BaseCityId ?? string.Empty,
        Layout = Layout,
        IsLocked = IsLocked,
        AlwaysOnTop = AlwaysOnTop,
        OpacityPercent = OpacityPercent,
        Language = Language,
        Placement = Placement is null
            ? new WindowPlacement()
            : new WindowPlacement
            {
                X = Placement.X,
                Y = Placement.Y,
                DisplayDeviceName = Placement.DisplayDeviceName,
                DockEdge = Placement.DockEdge,
            },
    };

    public static AppSettings CreateDefault() => new();
}
