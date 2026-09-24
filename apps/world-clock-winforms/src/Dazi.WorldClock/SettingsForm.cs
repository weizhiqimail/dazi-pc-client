using Dazi.WorldClock.Core;

namespace Dazi.WorldClock;

internal sealed class SettingsForm : Form
{
    private readonly CheckedListBox cityList = new();
    private readonly ComboBox baseCity = new();
    private readonly ComboBox language = new();
    private readonly TrackBar opacity = new();
    private readonly Label opacityValue = new();
    private readonly RadioButton horizontal = new() { AutoSize = true };
    private readonly RadioButton vertical = new() { AutoSize = true };
    private readonly CheckBox locked = new() { AutoSize = true };
    private readonly CheckBox alwaysOnTop = new() { AutoSize = true };
    private readonly GroupBox cityGroup = new();
    private readonly GroupBox layoutGroup = new();
    private readonly GroupBox behaviorGroup = new();
    private readonly Label baseLabel = new() { AutoSize = true };
    private readonly Label languageLabel = new() { AutoSize = true };
    private readonly Label opacityLabel = new() { AutoSize = true };
    private readonly Button up = new();
    private readonly Button down = new();
    private readonly Button reset = new();
    private readonly Button ok = new();
    private readonly Button cancel = new() { DialogResult = DialogResult.Cancel };
    private readonly Button applyButton = new();
    private readonly Action<AppSettings> apply;
    private AppSettings working;
    private bool loadingSettings;

    public SettingsForm(AppSettings settings, Action<AppSettings> apply)
    {
        this.apply = apply;
        working = settings.Copy();
        AutoScaleMode = AutoScaleMode.Dpi;
        ClientSize = new Size(640, 610);
        MinimumSize = new Size(656, 649);
        MaximizeBox = false;
        MinimizeBox = false;
        ShowInTaskbar = false;
        StartPosition = FormStartPosition.CenterScreen;
        var baseFont = SystemFonts.MessageBoxFont ?? Control.DefaultFont;
        Font = new Font(baseFont.FontFamily, baseFont.Size + 3.5f, FontStyle.Regular);

        BuildInterface();
        LoadSettings(working);
    }

    private void BuildInterface()
    {
        cityGroup.Location = new Point(14, 12);
        cityGroup.Size = new Size(612, 276);
        cityList.Location = new Point(16, 32);
        cityList.Size = new Size(468, 224);
        cityList.CheckOnClick = true;
        cityList.ItemCheck += (_, _) =>
        {
            if (!loadingSettings) BeginInvoke(RefreshBaseCities);
        };
        cityGroup.Controls.Add(cityList);

        up.Location = new Point(500, 34);
        up.Size = new Size(94, 38);
        down.Location = new Point(500, 82);
        down.Size = new Size(94, 38);
        up.Click += (_, _) => MoveSelected(-1);
        down.Click += (_, _) => MoveSelected(1);
        cityGroup.Controls.AddRange([up, down]);

        baseLabel.Location = new Point(16, 310);
        baseCity.DropDownStyle = ComboBoxStyle.DropDownList;
        baseCity.Location = new Point(142, 305);
        baseCity.Size = new Size(180, 31);

        languageLabel.Location = new Point(350, 310);
        language.DropDownStyle = ComboBoxStyle.DropDownList;
        language.Location = new Point(460, 305);
        language.Size = new Size(164, 31);
        language.Items.AddRange(["简体中文", "English"]);
        language.SelectedIndexChanged += (_, _) =>
        {
            if (!loadingSettings) ApplyLanguage(SelectedLanguage);
        };

        opacityLabel.Location = new Point(16, 359);
        opacity.Location = new Point(115, 345);
        opacity.Size = new Size(380, 50);
        opacity.Minimum = 40;
        opacity.Maximum = 100;
        opacity.TickFrequency = 10;
        opacity.SmallChange = 5;
        opacity.LargeChange = 10;
        opacity.ValueChanged += (_, _) => opacityValue.Text = $"{opacity.Value}%";
        opacityValue.Location = new Point(510, 356);
        opacityValue.Size = new Size(80, 30);

        layoutGroup.Location = new Point(14, 404);
        layoutGroup.Size = new Size(298, 91);
        horizontal.Location = new Point(22, 39);
        vertical.Location = new Point(155, 39);
        layoutGroup.Controls.AddRange([horizontal, vertical]);

        behaviorGroup.Location = new Point(328, 404);
        behaviorGroup.Size = new Size(298, 91);
        locked.Location = new Point(16, 29);
        alwaysOnTop.Location = new Point(16, 58);
        behaviorGroup.Controls.AddRange([locked, alwaysOnTop]);

        reset.Location = new Point(14, 550);
        reset.Size = new Size(120, 40);
        ok.Location = new Point(316, 550);
        ok.Size = new Size(96, 40);
        cancel.Location = new Point(422, 550);
        cancel.Size = new Size(96, 40);
        applyButton.Location = new Point(528, 550);
        applyButton.Size = new Size(96, 40);
        reset.Click += (_, _) => LoadSettings(AppSettings.CreateDefault());
        applyButton.Click += (_, _) => ApplyChanges();
        ok.Click += (_, _) => { if (ApplyChanges()) Close(); };

        AcceptButton = ok;
        CancelButton = cancel;
        Controls.AddRange([
            cityGroup,
            baseLabel,
            baseCity,
            languageLabel,
            language,
            opacityLabel,
            opacity,
            opacityValue,
            layoutGroup,
            behaviorGroup,
            reset,
            ok,
            cancel,
            applyButton,
        ]);
    }

    private AppLanguage SelectedLanguage =>
        language.SelectedIndex == 1 ? AppLanguage.English : AppLanguage.SimplifiedChinese;

    private void LoadSettings(AppSettings settings)
    {
        loadingSettings = true;
        working = SettingsValidator.Normalize(settings);
        language.SelectedIndex = working.Language == AppLanguage.English ? 1 : 0;
        cityList.Items.Clear();
        foreach (var id in OrderedCityIds(working))
        {
            var city = CityCatalog.Find(id)!;
            cityList.Items.Add(city, working.EnabledCityIds.Contains(id));
        }
        cityList.DisplayMember = working.Language == AppLanguage.English
            ? nameof(CityDefinition.EnglishName)
            : nameof(CityDefinition.ChineseName);
        horizontal.Checked = working.Layout == ClockLayout.Horizontal;
        vertical.Checked = working.Layout == ClockLayout.Vertical;
        locked.Checked = working.IsLocked;
        alwaysOnTop.Checked = working.AlwaysOnTop;
        opacity.Value = working.OpacityPercent;
        loadingSettings = false;
        ApplyLanguage(working.Language);
        RefreshBaseCities();
    }

    private void ApplyLanguage(AppLanguage selectedLanguage)
    {
        Text = UiText.Get(selectedLanguage, "SettingsTitle");
        cityGroup.Text = UiText.Get(selectedLanguage, "Cities");
        up.Text = UiText.Get(selectedLanguage, "MoveUp");
        down.Text = UiText.Get(selectedLanguage, "MoveDown");
        baseLabel.Text = UiText.Get(selectedLanguage, "BaseCity");
        languageLabel.Text = UiText.Get(selectedLanguage, "Language");
        opacityLabel.Text = UiText.Get(selectedLanguage, "Opacity");
        layoutGroup.Text = UiText.Get(selectedLanguage, "Layout");
        horizontal.Text = UiText.Get(selectedLanguage, "Horizontal");
        vertical.Text = UiText.Get(selectedLanguage, "Vertical");
        behaviorGroup.Text = UiText.Get(selectedLanguage, "WindowBehavior");
        locked.Text = UiText.Get(selectedLanguage, "Lock");
        alwaysOnTop.Text = UiText.Get(selectedLanguage, "TopMost");
        reset.Text = UiText.Get(selectedLanguage, "Reset");
        ok.Text = UiText.Get(selectedLanguage, "Ok");
        cancel.Text = UiText.Get(selectedLanguage, "Cancel");
        applyButton.Text = UiText.Get(selectedLanguage, "Apply");

        cityList.DisplayMember = selectedLanguage == AppLanguage.English
            ? nameof(CityDefinition.EnglishName)
            : nameof(CityDefinition.ChineseName);
        cityList.Refresh();
        RefreshBaseCities();
    }

    private static IEnumerable<string> OrderedCityIds(AppSettings settings) =>
        settings.EnabledCityIds.Concat(CityCatalog.All.Select(city => city.Id))
            .Distinct(StringComparer.Ordinal);

    private void RefreshBaseCities()
    {
        var selectedId = (baseCity.SelectedItem as CityDefinition)?.Id ?? working.BaseCityId;
        var enabled = cityList.CheckedItems.Cast<CityDefinition>().ToList();
        baseCity.DataSource = enabled;
        baseCity.DisplayMember = SelectedLanguage == AppLanguage.English
            ? nameof(CityDefinition.EnglishName)
            : nameof(CityDefinition.ChineseName);
        baseCity.SelectedItem = enabled.FirstOrDefault(city => city.Id == selectedId) ?? enabled.FirstOrDefault();
    }

    private void MoveSelected(int direction)
    {
        var oldIndex = cityList.SelectedIndex;
        var newIndex = oldIndex + direction;
        if (oldIndex < 0 || newIndex < 0 || newIndex >= cityList.Items.Count) return;
        var item = cityList.Items[oldIndex];
        var isChecked = cityList.GetItemChecked(oldIndex);
        cityList.Items.RemoveAt(oldIndex);
        cityList.Items.Insert(newIndex, item);
        cityList.SetItemChecked(newIndex, isChecked);
        cityList.SelectedIndex = newIndex;
    }

    private bool ApplyChanges()
    {
        var enabled = cityList.Items.Cast<CityDefinition>()
            .Where((_, index) => cityList.GetItemChecked(index))
            .Select(city => city.Id)
            .ToList();
        if (enabled.Count == 0)
        {
            MessageBox.Show(
                this,
                UiText.Get(SelectedLanguage, "AtLeastOneCity"),
                UiText.Get(SelectedLanguage, "AppName"),
                MessageBoxButtons.OK,
                MessageBoxIcon.Warning);
            return false;
        }

        working.EnabledCityIds = enabled;
        working.BaseCityId = (baseCity.SelectedItem as CityDefinition)?.Id ?? enabled[0];
        working.Layout = vertical.Checked ? ClockLayout.Vertical : ClockLayout.Horizontal;
        working.IsLocked = locked.Checked;
        working.AlwaysOnTop = alwaysOnTop.Checked;
        working.OpacityPercent = opacity.Value;
        working.Language = SelectedLanguage;
        apply(working.Copy());
        return true;
    }
}
