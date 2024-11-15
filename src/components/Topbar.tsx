import React from 'react';
import { Sun, Moon, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Topbar = () => {
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    // Set initial dark mode
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-2">
        <Activity className="w-6 h-6 text-primary" />
        <span className="text-xl font-semibold text-primary">Wellness</span>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default Topbar;