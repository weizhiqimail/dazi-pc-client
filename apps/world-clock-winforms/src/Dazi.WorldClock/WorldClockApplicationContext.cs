using Dazi.WorldClock.Core;

namespace Dazi.WorldClock;

internal sealed class WorldClockApplicationContext : ApplicationContext
{
    private readonly SettingsStore store = new();
    private readonly MainClockForm mainForm;
    private readonly NotifyIcon trayIcon;
    private readonly RegisteredWaitHandle instanceSignal;
    private readonly Icon appIcon;
    private ToolStripMenuItem showMenuItem = null!;
    private ToolStripMenuItem settingsMenuItem = null!;
    private ToolStripMenuItem lockedMenuItem = null!;
    private ToolStripMenuItem topMostMenuItem = null!;
    private ToolStripMenuItem exitMenuItem = null!;
    private AppSettings settings;
    private SettingsForm? settingsForm;
    private bool exiting;

    public WorldClockApplicationContext(SingleInstanceCoordinator singleInstance)
    {
        settings = store.Load();
        appIcon = new Icon(
            Icon.ExtractAssociatedIcon(Application.ExecutablePath) ?? SystemIcons.Application,
            new Size(32, 32));
        mainForm = new MainClockForm(settings, SavePlacement);
        mainForm.Icon = appIcon;
        mainForm.SettingsRequested += OpenSettings;
        mainForm.SettingsChangeRequested += ApplySettings;
        mainForm.ExitRequested += ExitApplication;
        mainForm.FormClosed += (_, _) => { if (exiting) ExitThread(); };

        trayIcon = new NotifyIcon
        {
            Icon = appIcon,
            Text = UiText.Get(settings.Language, "AppName"),
            Visible = true,
            ContextMenuStrip = BuildTrayMenu(),
        };
        trayIcon.Click += (_, e) =>
        {
            if (e is MouseEventArgs { Button: MouseButtons.Left }) mainForm.ShowAndActivate();
        };

        instanceSignal = ThreadPool.RegisterWaitForSingleObject(
            singleInstance.ShowEvent,
            (_, _) => mainForm.BeginInvoke(mainForm.ShowAndActivate),
            null,
            Timeout.Infinite,
            false);

        mainForm.Show();
    }

    protected override void Dispose(bool disposing)
    {
        if (disposing)
        {
            instanceSignal.Unregister(null);
            trayIcon.Visible = false;
            trayIcon.Dispose();
            settingsForm?.Dispose();
            mainForm.Dispose();
            appIcon.Dispose();
        }
        base.Dispose(disposing);
    }

    private ContextMenuStrip BuildTrayMenu()
    {
        var menu = new ContextMenuStrip();
        showMenuItem = new ToolStripMenuItem(string.Empty, null, (_, _) => ToggleMainWindow());
        settingsMenuItem = new ToolStripMenuItem(string.Empty, null, (_, _) => OpenSettings());
        lockedMenuItem = new ToolStripMenuItem(string.Empty, null, (_, _) => ToggleLocked()) { CheckOnClick = false };
        topMostMenuItem = new ToolStripMenuItem(string.Empty, null, (_, _) => ToggleAlwaysOnTop()) { CheckOnClick = false };
        exitMenuItem = new ToolStripMenuItem(string.Empty, null, (_, _) => ExitApplication());
        menu.Opening += (_, _) =>
        {
            lockedMenuItem.Checked = settings.IsLocked;
            topMostMenuItem.Checked = settings.AlwaysOnTop;
            ApplyTrayLanguage();
        };
        menu.Items.Add(showMenuItem);
        menu.Items.Add(settingsMenuItem);
        menu.Items.Add(lockedMenuItem);
        menu.Items.Add(topMostMenuItem);
        menu.Items.Add(new ToolStripSeparator());
        menu.Items.Add(exitMenuItem);
        ApplyTrayLanguage();
        return menu;
    }

    private void ApplyTrayLanguage()
    {
        showMenuItem.Text = UiText.Get(settings.Language, mainForm.Visible ? "Hide" : "Show");
        settingsMenuItem.Text = UiText.Get(settings.Language, "Settings");
        lockedMenuItem.Text = UiText.Get(settings.Language, "Lock");
        topMostMenuItem.Text = UiText.Get(settings.Language, "TopMost");
        exitMenuItem.Text = UiText.Get(settings.Language, "Exit");
    }

    private void ToggleMainWindow()
    {
        if (mainForm.Visible) mainForm.Hide();
        else mainForm.ShowAndActivate();
    }

    private void OpenSettings()
    {
        if (settingsForm is { IsDisposed: false })
        {
            settingsForm.Activate();
            return;
        }

        settingsForm = new SettingsForm(settings, ApplySettings);
        settingsForm.Icon = appIcon;
        settingsForm.FormClosed += (_, _) => settingsForm = null;
        settingsForm.Show();
        settingsForm.Activate();
    }

    private void ToggleLocked()
    {
        var changed = settings.Copy();
        changed.IsLocked = !changed.IsLocked;
        ApplySettings(changed);
    }

    private void ToggleAlwaysOnTop()
    {
        var changed = settings.Copy();
        changed.AlwaysOnTop = !changed.AlwaysOnTop;
        ApplySettings(changed);
    }

    private void ApplySettings(AppSettings changed)
    {
        settings = SettingsValidator.Normalize(changed);
        store.Save(settings);
        trayIcon.Text = UiText.Get(settings.Language, "AppName");
        ApplyTrayLanguage();
        mainForm.ApplySettings(settings);
    }

    private void SavePlacement(AppSettings changed)
    {
        settings.Placement = changed.Placement;
        store.Save(settings);
    }

    private void ExitApplication()
    {
        exiting = true;
        trayIcon.Visible = false;
        settingsForm?.Close();
        mainForm.Dispose();
        ExitThread();
    }
}
