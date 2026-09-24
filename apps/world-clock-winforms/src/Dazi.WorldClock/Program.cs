namespace Dazi.WorldClock;

internal static class Program
{
    [STAThread]
    private static void Main()
    {
        using var singleInstance = new SingleInstanceCoordinator();
        if (!singleInstance.IsFirstInstance)
        {
            singleInstance.SignalFirstInstance();
            return;
        }

        ApplicationConfiguration.Initialize();
        using var context = new WorldClockApplicationContext(singleInstance);
        Application.Run(context);
    }
}
