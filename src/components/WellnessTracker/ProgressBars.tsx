import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WELLNESS_AREAS } from "@/lib/constants";
import { WellnessAction } from "@/lib/types";

interface ProgressBarsProps {
  actions: Record<string, WellnessAction[]>;
}

const ProgressBars = ({ actions }: ProgressBarsProps) => {
  return (
    <Card>
      <CardHeader className="items-center pb-2">
        <CardTitle>Daily Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(WELLNESS_AREAS).map(([key, area]) => {
          const progress = ((actions[key]?.length || 0) / area.dailyGoal) * 100;
          const Icon = area.icon;
          
          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{area.label}</span>
                </div>
                <span className="text-muted-foreground">
                  {actions[key]?.length || 0} / {area.dailyGoal}
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