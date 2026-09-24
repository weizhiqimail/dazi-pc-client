using Dazi.WorldClock.Core;

namespace Dazi.WorldClock;

internal sealed class ClockCard : Panel
{
    private static readonly Color HeaderColor = Color.FromArgb(238, 238, 235);
    private static readonly Color CardColor = Color.FromArgb(250, 250, 248);
    private static readonly Color SecondaryTextColor = Color.FromArgb(91, 91, 88);
    private readonly Label cityLabel;
    private readonly Label dateLabel;
    private readonly Label timeLabel;
    private readonly Label differenceLabel;

    public ClockCard()
    {
        Size = new Size(178, 116);
        Margin = new Padding(6);
        Padding = Padding.Empty;
        BorderStyle = BorderStyle.FixedSingle;
        BackColor = CardColor;

        cityLabel = CreateLabel(FontStyle.Bold, 0, 26, 12.25f);
        cityLabel.BackColor = HeaderColor;
        cityLabel.ForeColor = Color.FromArgb(178, 65, 58);
        dateLabel = CreateLabel(FontStyle.Regular, 31, 22, 11.25f);
        dateLabel.ForeColor = SecondaryTextColor;
        timeLabel = CreateLabel(FontStyle.Bold, 54, 31, 16.25f);
        timeLabel.ForeColor = Color.FromArgb(35, 35, 33);
        differenceLabel = CreateLabel(FontStyle.Regular, 87, 24, 11.25f);
        differenceLabel.BackColor = Color.FromArgb(255, 246, 202);
        differenceLabel.ForeColor = Color.FromArgb(120, 55, 49);
    }

    public void Update(ClockRow row, AppLanguage language)
    {
        cityLabel.Text = row.City.GetDisplayName(language);
        dateLabel.Text = row.LocalTime.ToString("yyyy-MM-dd");
        timeLabel.Text = row.LocalTime.ToString("HH:mm:ss");
        differenceLabel.Text = ClockService.FormatDifference(row, language);
    }

    private Label CreateLabel(FontStyle style, int top, int height, float size)
    {
        var baseFont = SystemFonts.MessageBoxFont ?? Control.DefaultFont;
        var label = new Label
        {
            AutoSize = false,
            Location = new Point(0, top),
            Size = new Size(176, height),
            Font = new Font(baseFont.FontFamily, size, style),
            TextAlign = ContentAlignment.MiddleCenter,
        };
        Controls.Add(label);
        return label;
    }
}
