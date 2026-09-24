using Dazi.WorldClock.Core;

namespace Dazi.WorldClock;

internal static class UiText
{
    private static readonly IReadOnlyDictionary<string, (string Chinese, string English)> Values =
        new Dictionary<string, (string, string)>(StringComparer.Ordinal)
        {
            ["AppName"] = ("世界时钟", "World Clock"),
            ["SettingsTitle"] = ("世界时钟设置", "World Clock Settings"),
            ["Cities"] = ("显示城市", "Displayed cities"),
            ["MoveUp"] = ("上移", "Move up"),
            ["MoveDown"] = ("下移", "Move down"),
            ["BaseCity"] = ("基准城市：", "Base city:"),
            ["Language"] = ("界面语言：", "Language:"),
            ["Opacity"] = ("透明度：", "Opacity:"),
            ["Layout"] = ("排列方向", "Layout"),
            ["Horizontal"] = ("横向", "Horizontal"),
            ["Vertical"] = ("纵向", "Vertical"),
            ["WindowBehavior"] = ("窗口行为", "Window behavior"),
            ["Lock"] = ("锁定窗口位置", "Lock window position"),
            ["TopMost"] = ("始终置顶", "Always on top"),
            ["Reset"] = ("恢复默认", "Restore defaults"),
            ["Ok"] = ("确定", "OK"),
            ["Cancel"] = ("取消", "Cancel"),
            ["Apply"] = ("应用", "Apply"),
            ["AtLeastOneCity"] = ("至少需要选择一个城市。", "Select at least one city."),
            ["HorizontalLayout"] = ("横向排列", "Horizontal layout"),
            ["VerticalLayout"] = ("纵向排列", "Vertical layout"),
            ["Settings"] = ("设置...", "Settings..."),
            ["Hide"] = ("隐藏时钟", "Hide clock"),
            ["Show"] = ("显示时钟", "Show clock"),
            ["Exit"] = ("退出", "Exit"),
        };

    public static string Get(AppLanguage language, string key)
    {
        var value = Values[key];
        return language == AppLanguage.English ? value.English : value.Chinese;
    }
}
