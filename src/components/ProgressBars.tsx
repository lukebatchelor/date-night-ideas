import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WELLNESS_AREAS } from "@/lib/constants";
import { WellnessAction } from "@/lib/types";
import { useState, useEffect } from "react";

interface ProgressBarsProps {
  actions: Record<string, WellnessAction[]>;
}

const ProgressBars = ({ actions }: ProgressBarsProps) => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('wellnessGoals');
    return saved ? JSON.parse(saved) : Object.entries(WELLNESS_AREAS).reduce((acc, [key, area]) => ({
      ...acc,
      [key]: area.dailyGoal
    }), {});
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('wellnessGoals');
      if (saved) {
        setGoals(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Card>
      <CardHeader className="items-center pb-2">
        <CardTitle>Daily Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(WELLNESS_AREAS).map(([key, area]) => {
          const progress = ((actions[key]?.length || 0) / goals[key]) * 100;
          const Icon = area.icon;
          
          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{area.label}</span>
                </div>
                <span className="text-muted-foreground">
                  {actions[key]?.length || 0} / {goals[key]}
                </span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-300 rounded-full"
                  style={{ 
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: area.color
                  }} 
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ProgressBars;