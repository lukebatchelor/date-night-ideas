import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WELLNESS_AREAS } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export const SettingsPage = ({ 
  customActions 
}: { 
  customActions: Record<string, string[]> 
}) => {
  const [goals, setGoals] = React.useState(() => {
    const saved = localStorage.getItem('wellnessGoals');
    return saved ? JSON.parse(saved) : Object.entries(WELLNESS_AREAS).reduce((acc, [key, area]) => ({
      ...acc,
      [key]: area.dailyGoal
    }), {});
  });
  
  const [unsavedChanges, setUnsavedChanges] = React.useState(false);
  const [tempGoals, setTempGoals] = React.useState(goals);

  const handleGoalChange = (area: string, value: string) => {
    const newGoals = { ...tempGoals, [area]: parseInt(value) || 0 };
    setTempGoals(newGoals);
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    setGoals(tempGoals);
    localStorage.setItem('wellnessGoals', JSON.stringify(tempGoals));
    setUnsavedChanges(false);
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
                  value={tempGoals[key]}
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
        <CardContent className="space-y-6">
          {Object.entries(WELLNESS_AREAS).map(([key, area]) => {
            const actions = customActions[key] || [];
            if (actions.length === 0) return null;
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <area.icon className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">{area.label}</h3>
                </div>
                <Separator />
                <ul className="space-y-1 pt-2">
                  {actions.map((action, index) => (
                    <li key={index} className="text-sm text-muted-foreground pl-6">
                      • {action}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {unsavedChanges && (
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t">
          <div className="max-w-md mx-auto">
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};