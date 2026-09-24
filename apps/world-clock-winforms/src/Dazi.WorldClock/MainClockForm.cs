using Dazi.WorldClock.Core;
using System.Runtime.InteropServices;

namespace Dazi.WorldClock;

internal sealed class MainClockForm : Form
{
    private const int WmNcHitTest = 0x0084;
    private const int WmExitSizeMove = 0x0232;
    private const int WmNcLeftButtonDown = 0x00A1;
    private const int HtCaption = 2;
    private const int SnapDistance = 16;
    private readonly ClockService clockService = new();
    private readonly FlowLayoutPanel clockPanel;
    private readonly System.Windows.Forms.Timer timer;
    private readonly Action<AppSettings> placementChanged;
    private readonly Dictionary<string, ClockCard> cards = [];
    private readonly ContextMenuStrip contextMenu;
    private ToolStripMenuItem horizontalMenuItem = null!;
    private ToolStripMenuItem verticalMenuItem = null!;
    private ToolStripMenuItem opacityMenuItem = null!;
    private ToolStripMenuItem lockedMenuItem = null!;
    private ToolStripMenuItem topMostMenuItem = null!;
    private ToolStripMenuItem settingsMenuItem = null!;
    private ToolStripMenuItem hideMenuItem = null!;
    private ToolStripMenuItem exitMenuItem = null!;
    private AppSettings settings;
    private bool applyingPlacement;

    public MainClockForm(AppSettings settings, Action<AppSettings> placementChanged)
    {
        this.settings = SettingsValidator.Normalize(settings);
        this.placementChanged = placementChanged;
        Text = "世界时钟";
        FormBorderStyle = FormBorderStyle.None;
        ShowInTaskbar = false;
        StartPosition = FormStartPosition.Manual;
        AutoScaleMode = AutoScaleMode.Dpi;
        BackColor = Color.FromArgb(207, 207, 202);
        Padding = new Padding(1);
        KeyPreview = true;

        clockPanel = new FlowLayoutPanel
        {
            AutoSize = true,
            AutoSizeMode = AutoSizeMode.GrowAndShrink,
            BackColor = Color.FromArgb(207, 207, 202),
            Location = new Point(1, 1),
            Margin = Padding.Empty,
            Padding = new Padding(5),
            WrapContents = false,
        };
        Controls.Add(clockPanel);

        contextMenu = BuildContextMenu();
        ContextMenuStrip = contextMenu;

        timer = new System.Windows.Forms.Timer { Interval = 1000 };
        timer.Tick += (_, _) => RefreshTimes();
        timer.Start();

        ApplySettings(this.settings);
    }

    public event Action? SettingsRequested;
    public event Action? ExitRequested;
    public event Action<AppSettings>? SettingsChangeRequested;

    protected override CreateParams CreateParams
    {
        get
        {
            const int WsExToolWindow = 0x00000080;
            var parameters = base.CreateParams;
            parameters.ExStyle |= WsExToolWindow;
            return parameters;
        }
    }

    public void ApplySettings(AppSettings newSettings)
    {
        settings = SettingsValidator.Normalize(newSettings);
        TopMost = settings.AlwaysOnTop;
        Opacity = settings.OpacityPercent / 100d;
        Text = UiText.Get(settings.Language, "AppName");
        ApplyContextMenuLanguage();
        RebuildCards();
        RefreshTimes();
        RestorePlacement();
    }

    public void ShowAndActivate()
    {
        if (!Visible) Show();
        WindowState = FormWindowState.Normal;
        Activate();
    }

    protected override void OnFormClosing(FormClosingEventArgs e)
    {
        if (e.CloseReason == CloseReason.UserClosing)
        {
            e.Cancel = true;
            Hide();
            return;
        }
        base.OnFormClosing(e);
    }

    protected override void WndProc(ref Message message)
    {
        base.WndProc(ref message);
        if (message.Msg == WmNcHitTest && !settings.IsLocked && (int)message.Result == 1)
        {
            message.Result = HtCaption;
        }
        else if (message.Msg == WmExitSizeMove && !settings.IsLocked)
        {
            SnapToNearestEdge();
            SavePlacement();
        }
    }

    private void RebuildCards()
    {
        clockPanel.SuspendLayout();
        clockPanel.Controls.Clear();
        cards.Clear();
        clockPanel.FlowDirection = settings.Layout == ClockLayout.Horizontal
            ? FlowDirection.LeftToRight
            : FlowDirection.TopDown;

        foreach (var cityId in settings.EnabledCityIds)
        {
            var card = new ClockCard();
            RegisterDragSurface(card);
            cards.Add(cityId, card);
            clockPanel.Controls.Add(card);
        }

        clockPanel.ResumeLayout(true);
        clockPanel.PerformLayout();
        var preferredSize = clockPanel.GetPreferredSize(Size.Empty);
        ClientSize = new Size(preferredSize.Width + 2, preferredSize.Height + 2);
    }

    private void RegisterDragSurface(Control control)
    {
        control.ContextMenuStrip = contextMenu;
        control.MouseDown += BeginWindowDrag;
        foreach (Control child in control.Controls) RegisterDragSurface(child);
    }

    private ContextMenuStrip BuildContextMenu()
    {
        var menu = new ContextMenuStrip { Font = new Font(SystemFonts.MenuFont ?? Control.DefaultFont, FontStyle.Regular) };
        horizontalMenuItem = new ToolStripMenuItem(string.Empty, null, (_, _) => ChangeLayout(ClockLayout.Horizontal));
        verticalMenuItem = new ToolStripMenuItem(string.Empty, null, (_, _) => ChangeLayout(ClockLayout.Vertical));
        opacityMenuItem = new ToolStripMenuItem();
        foreach (var percent in new[] { 60, 80, 100 })
        {
            opacityMenuItem.DropDownItems.Add($"{percent}%", null, (_, _) => ChangeOpacity(percent));
        }
        lockedMenuItem = new ToolStripMenuItem(string.Empty, null, (_, _) => ChangeBooleanSetting(isLocked: !settings.IsLocked));
        topMostMenuItem = new ToolStripMenuItem(string.Empty, null, (_, _) => ChangeBooleanSetting(alwaysOnTop: !settings.AlwaysOnTop));
        settingsMenuItem = new ToolStripMenuItem(string.Empty, null, (_, _) => SettingsRequested?.Invoke());
        hideMenuItem = new ToolStripMenuItem(string.Empty, null, (_, _) => Hide());
        exitMenuItem = new ToolStripMenuItem(string.Empty, null, (_, _) => ExitRequested?.Invoke());

        menu.Items.AddRange([
            horizontalMenuItem,
            verticalMenuItem,
            opacityMenuItem,
            new ToolStripSeparator(),
            lockedMenuItem,
            topMostMenuItem,
            new ToolStripSeparator(),
            settingsMenuItem,
            hideMenuItem,
            new ToolStripSeparator(),
            exitMenuItem,
        ]);
        menu.Opening += (_, _) =>
        {
            horizontalMenuItem.Checked = settings.Layout == ClockLayout.Horizontal;
            verticalMenuItem.Checked = settings.Layout == ClockLayout.Vertical;
            foreach (ToolStripMenuItem item in opacityMenuItem.DropDownItems)
            {
                item.Checked = item.Text == $"{settings.OpacityPercent}%";
            }
            lockedMenuItem.Checked = settings.IsLocked;
            topMostMenuItem.Checked = settings.AlwaysOnTop;
        };
        return menu;
    }

    private void ApplyContextMenuLanguage()
    {
        horizontalMenuItem.Text = UiText.Get(settings.Language, "HorizontalLayout");
        verticalMenuItem.Text = UiText.Get(settings.Language, "VerticalLayout");
        opacityMenuItem.Text = UiText.Get(settings.Language, "Opacity").TrimEnd('：', ':');
        lockedMenuItem.Text = UiText.Get(settings.Language, "Lock");
        topMostMenuItem.Text = UiText.Get(settings.Language, "TopMost");
        settingsMenuItem.Text = UiText.Get(settings.Language, "Settings");
        hideMenuItem.Text = UiText.Get(settings.Language, "Hide");
        exitMenuItem.Text = UiText.Get(settings.Language, "Exit");
    }

    private void ChangeLayout(ClockLayout layout)
    {
        var changed = settings.Copy();
        changed.Layout = layout;
        SettingsChangeRequested?.Invoke(changed);
    }

    private void ChangeBooleanSetting(bool? isLocked = null, bool? alwaysOnTop = null)
    {
        var changed = settings.Copy();
        if (isLocked.HasValue) changed.IsLocked = isLocked.Value;
        if (alwaysOnTop.HasValue) changed.AlwaysOnTop = alwaysOnTop.Value;
        SettingsChangeRequested?.Invoke(changed);
    }

    private void ChangeOpacity(int percent)
    {
        var changed = settings.Copy();
        changed.OpacityPercent = percent;
        SettingsChangeRequested?.Invoke(changed);
    }

    private void BeginWindowDrag(object? sender, MouseEventArgs eventArgs)
    {
        if (settings.IsLocked || eventArgs.Button != MouseButtons.Left) return;
        ReleaseCapture();
        SendMessage(Handle, WmNcLeftButtonDown, HtCaption, 0);
    }

    private void RefreshTimes()
    {
        foreach (var row in clockService.GetRows(DateTimeOffset.Now, settings))
        {
            cards[row.City.Id].Update(row, settings.Language);
        }
    }

    private void RestorePlacement()
    {
        applyingPlacement = true;
        try
        {
            var screen = Screen.AllScreens.FirstOrDefault(candidate =>
                candidate.DeviceName == settings.Placement.DisplayDeviceName) ?? Screen.PrimaryScreen!;
            var area = screen.WorkingArea;
            Location = settings.Placement.DockEdge switch
            {
                DockEdge.Left => new Point(area.Left, Math.Clamp(settings.Placement.Y, area.Top, area.Bottom - Height)),
                DockEdge.Right => new Point(area.Right - Width, Math.Clamp(settings.Placement.Y, area.Top, area.Bottom - Height)),
                DockEdge.Top => new Point(Math.Clamp(settings.Placement.X, area.Left, area.Right - Width), area.Top),
                _ when settings.Placement.X != 0 || settings.Placement.Y != 0 =>
                    new Point(settings.Placement.X, settings.Placement.Y),
                _ => new Point(area.Right - Width, area.Top + 24),
            };
            EnsureVisible();
        }
        finally
        {
            applyingPlacement = false;
        }
    }

    private void EnsureVisible()
    {
        var screen = Screen.FromRectangle(Bounds);
        var area = screen.WorkingArea;
        Location = new Point(
            Math.Clamp(Left, area.Left, Math.Max(area.Left, area.Right - Width)),
            Math.Clamp(Top, area.Top, Math.Max(area.Top, area.Bottom - Height)));
    }

    private void SnapToNearestEdge()
    {
        var area = Screen.FromRectangle(Bounds).WorkingArea;
        var leftDistance = Math.Abs(Left - area.Left);
        var rightDistance = Math.Abs(Right - area.Right);
        var topDistance = Math.Abs(Top - area.Top);
        var nearest = Math.Min(leftDistance, Math.Min(rightDistance, topDistance));

        settings.Placement.DockEdge = nearest > SnapDistance
            ? DockEdge.None
            : nearest == leftDistance ? DockEdge.Left
            : nearest == rightDistance ? DockEdge.Right
            : DockEdge.Top;

        Location = settings.Placement.DockEdge switch
        {
            DockEdge.Left => new Point(area.Left, Top),
            DockEdge.Right => new Point(area.Right - Width, Top),
            DockEdge.Top => new Point(Left, area.Top),
            _ => Location,
        };
        EnsureVisible();
    }

    private void SavePlacement()
    {
        if (applyingPlacement) return;
        settings.Placement.X = Left;
        settings.Placement.Y = Top;
        settings.Placement.DisplayDeviceName = Screen.FromRectangle(Bounds).DeviceName;
        placementChanged(settings.Copy());
    }

    [DllImport("user32.dll")]
    private static extern bool ReleaseCapture();

    [DllImport("user32.dll")]
    private static extern IntPtr SendMessage(IntPtr windowHandle, int message, int wParam, int lParam);
}
