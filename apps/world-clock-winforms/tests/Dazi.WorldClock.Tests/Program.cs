using Dazi.WorldClock.Core;

var tests = new (string Name, Action Run)[]
{
    ("默认设置有效", DefaultSettingsAreValid),
    ("非法设置自动修复", InvalidSettingsAreNormalized),
    ("上海和东京相差一小时", ShanghaiAndTokyoDifferByOneHour),
    ("纽约夏令时正确", NewYorkDaylightSavingIsApplied),
    ("伦敦夏令时正确", LondonDaylightSavingIsApplied),
    ("时差文案方向正确", DifferenceLabelsAreCorrect),
    ("配置可以往返保存", SettingsCanRoundTrip),
    ("空字段配置可以恢复", NullFieldsAreRecovered),
};

var failures = new List<string>();
foreach (var test in tests)
{
    try
    {
        test.Run();
        Console.WriteLine($"PASS {test.Name}");
    }
    catch (Exception exception)
    {
        failures.Add($"FAIL {test.Name}: {exception.Message}");
    }
}

foreach (var failure in failures) Console.Error.WriteLine(failure);
return failures.Count == 0 ? 0 : 1;

static void DefaultSettingsAreValid()
{
    var settings = SettingsValidator.Normalize(AppSettings.CreateDefault());
    Assert(settings.EnabledCityIds.SequenceEqual(["shanghai", "tokyo", "new-york"]), "默认城市错误");
    Assert(settings.BaseCityId == "shanghai", "默认基准城市错误");
}

static void InvalidSettingsAreNormalized()
{
    var settings = new AppSettings { EnabledCityIds = ["missing", "missing"], BaseCityId = "missing" };
    var normalized = SettingsValidator.Normalize(settings);
    Assert(normalized.EnabledCityIds.SequenceEqual(["shanghai"]), "空城市列表未恢复");
    Assert(normalized.BaseCityId == "shanghai", "基准城市未恢复");
}

static void ShanghaiAndTokyoDifferByOneHour()
{
    var settings = new AppSettings { EnabledCityIds = ["shanghai", "tokyo"], BaseCityId = "shanghai" };
    var rows = new ClockService().GetRows(new DateTimeOffset(2026, 1, 15, 0, 0, 0, TimeSpan.Zero), settings);
    Assert(rows.Single(row => row.City.Id == "tokyo").DifferenceFromBase == TimeSpan.FromHours(1), "东京时差错误");
}

static void NewYorkDaylightSavingIsApplied()
{
    var settings = new AppSettings { EnabledCityIds = ["new-york"], BaseCityId = "new-york" };
    var service = new ClockService();
    var winter = service.GetRows(new DateTimeOffset(2026, 1, 15, 12, 0, 0, TimeSpan.Zero), settings)[0];
    var summer = service.GetRows(new DateTimeOffset(2026, 7, 15, 12, 0, 0, TimeSpan.Zero), settings)[0];
    Assert(winter.LocalTime.Hour == 7, "纽约冬令时错误");
    Assert(summer.LocalTime.Hour == 8, "纽约夏令时错误");
}

static void LondonDaylightSavingIsApplied()
{
    var settings = new AppSettings { EnabledCityIds = ["london"], BaseCityId = "london" };
    var service = new ClockService();
    var winter = service.GetRows(new DateTimeOffset(2026, 1, 15, 12, 0, 0, TimeSpan.Zero), settings)[0];
    var summer = service.GetRows(new DateTimeOffset(2026, 7, 15, 12, 0, 0, TimeSpan.Zero), settings)[0];
    Assert(winter.LocalTime.Hour == 12, "伦敦冬令时错误");
    Assert(summer.LocalTime.Hour == 13, "伦敦夏令时错误");
}

static void DifferenceLabelsAreCorrect()
{
    var baseCity = CityCatalog.Find("shanghai")!;
    var targetCity = CityCatalog.Find("new-york")!;
    var baseRow = new ClockRow(baseCity, DateTime.MinValue, TimeSpan.Zero, true);
    var laterRow = new ClockRow(targetCity, DateTime.MinValue, TimeSpan.FromMinutes(330), false);
    var earlierRow = new ClockRow(targetCity, DateTime.MinValue, TimeSpan.FromHours(-12), false);
    Assert(ClockService.FormatDifference(baseRow) == string.Empty, "基准城市不应显示附加文字");
    Assert(ClockService.FormatDifference(laterRow) == "早 5 小时 30 分钟", "领先文案错误");
    Assert(ClockService.FormatDifference(earlierRow) == "晚 12 小时", "落后文案错误");
    Assert(ClockService.FormatDifference(earlierRow, AppLanguage.English) == "12h behind", "英文时差文案错误");
}

static void SettingsCanRoundTrip()
{
    var directory = Path.Combine(Path.GetTempPath(), "dazi-world-clock-tests", Guid.NewGuid().ToString("N"));
    var path = Path.Combine(directory, "settings.json");
    try
    {
        var store = new SettingsStore(path);
        var expected = new AppSettings
        {
            EnabledCityIds = ["paris", "london"],
            BaseCityId = "paris",
            Layout = ClockLayout.Vertical,
            IsLocked = true,
        };
        store.Save(expected);
        var actual = store.Load();
        Assert(actual.EnabledCityIds.SequenceEqual(expected.EnabledCityIds), "城市未保存");
        Assert(actual.Layout == ClockLayout.Vertical && actual.IsLocked, "设置未保存");
    }
    finally
    {
        if (Directory.Exists(directory)) Directory.Delete(directory, true);
    }
}

static void NullFieldsAreRecovered()
{
    var settings = new AppSettings
    {
        EnabledCityIds = null!,
        BaseCityId = null!,
        Placement = null!,
    };
    var normalized = SettingsValidator.Normalize(settings);
    Assert(normalized.EnabledCityIds.SequenceEqual(["shanghai"]), "空城市字段未恢复");
    Assert(normalized.BaseCityId == "shanghai", "空基准字段未恢复");
    Assert(normalized.Placement is not null, "空窗口位置未恢复");
}

static void Assert(bool condition, string message)
{
    if (!condition) throw new InvalidOperationException(message);
}
