export function formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  export function loadDailyLogs(): Record<string, any> {
    const savedLogs = localStorage.getItem('dailyLogs');
    const logs = savedLogs ? JSON.parse(savedLogs) : {};
    return Object.keys(logs)
      .sort((a, b) => b.localeCompare(a))
      .reduce((obj: Record<string, any>, key) => {
        obj[key] = logs[key];
        return obj;
      }, {});
  }