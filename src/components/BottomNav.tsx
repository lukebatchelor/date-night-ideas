import React from 'react';
import { BarChart, Settings, Home } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WELLNESS_AREAS } from '@/lib/constants';

const BottomNav = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
      <nav className="flex justify-around p-2">
        <Button variant="ghost" onClick={() => onTabChange('home')} className={activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'}>
          <Home className="w-5 h-5" />
        </Button>
        <Button variant="ghost" onClick={() => onTabChange('daily')} className={activeTab === 'daily' ? 'text-primary' : 'text-muted-foreground'}>
          <BarChart className="w-5 h-5" />
        </Button>
        <Button variant="ghost" onClick={() => onTabChange('settings')} className={activeTab === 'settings' ? 'text-primary' : 'text-muted-foreground'}>
          <Settings className="w-5 h-5" />
        </Button>
      </nav>
    </div>
  );
};

const SettingsPage = ({ customActions }) => {
  const [goals, setGoals] = React.useState(() => {
    const saved = localStorage.getItem('wellnessGoals');
    return saved ? JSON.parse(saved) : Object.entries(WELLNESS_AREAS).reduce((acc, [key, area]) => ({
      ...acc,
      [key]: area.dailyGoal
    }), {});
  });

  const handleGoalChange = (area: string, value: string) => {
    const newGoals = { ...goals, [area]: parseInt(value) || 0 };
    setGoals(newGoals);
    localStorage.setItem('wellnessGoals', JSON.stringify(newGoals));
  };

  return (
    <div className="space-y-6 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>Daily Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(WELLNESS_AREAS).map(([key, area]) => {
            const Icon = area.icon;
            return (
              <div key={key} className="flex items-center gap-4">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span className="flex-grow">{area.label}</span>
                <Input
                  type="number"
                  min="1"
                  value={goals[key]}
                  onChange={(e) => handleGoalChange(key, e.target.value)}
                  className="w-20"
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(customActions).map(([area, actions]) => (
              <div key={area} className="space-y-2">
                <h3 className="font-semibold">{WELLNESS_AREAS[area].label}</h3>
                <ul className="space-y-1">
                  {actions.map((action, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { BottomNav, SettingsPage };