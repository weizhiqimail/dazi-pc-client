using System.Text.Json;
using System.Text.Json.Serialization;

namespace Dazi.WorldClock.Core;

public sealed class SettingsStore
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        Converters = { new JsonStringEnumConverter() },
    };

    public SettingsStore(string? filePath = null)
    {
        FilePath = filePath ?? Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "Dazi",
            "WorldClock",
            "settings.json");
    }

    public string FilePath { get; }

    public AppSettings Load()
    {
        if (!File.Exists(FilePath)) return AppSettings.CreateDefault();

        try
        {
            var json = File.ReadAllText(FilePath);
            var settings = JsonSerializer.Deserialize<AppSettings>(json, JsonOptions);
            if (settings is null || settings.Version != 1)
            {
                throw new JsonException("Unsupported settings version.");
            }
            return SettingsValidator.Normalize(settings);
        }
        catch (Exception ex) when (ex is JsonException or IOException or UnauthorizedAccessException)
        {
            TryBackupBrokenFile();
            return AppSettings.CreateDefault();
        }
    }

    public void Save(AppSettings rawSettings)
    {
        var settings = SettingsValidator.Normalize(rawSettings);
        var directory = Path.GetDirectoryName(FilePath)!;
        Directory.CreateDirectory(directory);
        var temporaryPath = FilePath + ".tmp";
        File.WriteAllText(temporaryPath, JsonSerializer.Serialize(settings, JsonOptions));
        File.Move(temporaryPath, FilePath, true);
    }

    private void TryBackupBrokenFile()
    {
        try
        {
            var backupPath = FilePath + $".broken-{DateTime.UtcNow:yyyyMMddHHmmss}";
            File.Move(FilePath, backupPath, true);
        }
        catch (IOException)
        {
            // A corrupt settings file must never prevent the clock from starting.
        }
        catch (UnauthorizedAccessException)
        {
            // Fall back to defaults even if the broken file cannot be moved.
        }
    }
}
