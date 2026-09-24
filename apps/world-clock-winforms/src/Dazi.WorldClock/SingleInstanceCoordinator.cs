namespace Dazi.WorldClock;

internal sealed class SingleInstanceCoordinator : IDisposable
{
    private const string MutexName = "Local\\Dazi.WorldClock.Singleton";
    private const string ShowEventName = "Local\\Dazi.WorldClock.Show";
    private readonly Mutex mutex;
    private readonly EventWaitHandle showEvent;

    public SingleInstanceCoordinator()
    {
        mutex = new Mutex(true, MutexName, out var createdNew);
        IsFirstInstance = createdNew;
        showEvent = new EventWaitHandle(false, EventResetMode.AutoReset, ShowEventName);
    }

    public bool IsFirstInstance { get; }
    public WaitHandle ShowEvent => showEvent;

    public void SignalFirstInstance() => showEvent.Set();

    public void Dispose()
    {
        showEvent.Dispose();
        if (IsFirstInstance) mutex.ReleaseMutex();
        mutex.Dispose();
    }
}
