import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Check } from "lucide-react";
import { WELLNESS_AREAS } from "@/lib/constants";
import { WellnessAction } from "@/lib/types";

interface DailyLogProps {
  actions: Record<string, WellnessAction[]>;
  onDeleteAction: (area: string, index: number) => void;
}

export const DailyLog = ({ actions, onDeleteAction }: DailyLogProps) => {
  const [goals] = React.useState(() => {
    const saved = localStorage.getItem('wellnessGoals');
    return saved ? JSON.parse(saved) : {};
  });

  // Helper function to parse time string into Date object
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Process actions while tracking counts
  const allActions = Object.entries(actions).flatMap(([area, areaActions]) => {
    const targetGoal = goals[area] || WELLNESS_AREAS[area].dailyGoal;
    let actionsWithCounts = [];
    for (let i = 0; i < areaActions.length; i++) {
      const currentCount = i + 1;
      actionsWithCounts.push({
        ...areaActions[i],
        area,
        areaDetails: WELLNESS_AREAS[area],
        index: i,
        currentCount,
        targetGoal,
        isGoalMet: currentCount === targetGoal
      });
    }
    return actionsWithCounts;
  }).sort((b, a) => {
    const timeA = parseTime(a.time);
    const timeB = parseTime(b.time);
    return timeA.getTime() - timeB.getTime();
  });

  if (allActions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {allActions.map((action) => {
          const Icon = action.areaDetails.icon;
          const formattedTime = action.time;
          const hasMetGoal = action.currentCount >= action.targetGoal;
          
          return (
            <div 
              key={`${action.area}-${action.index}-${action.time}`}
              className={`relative flex items-center justify-between gap-4 p-3 rounded-lg border bg-card ${
                action.isGoalMet ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              <Badge 
                variant="outline" 
                className={`absolute -top-2 -right-2 bg-background flex items-center gap-1 ${
                  hasMetGoal ? 'text-primary border-primary' : 'text-muted-foreground'
                }`}
              >
                {action.currentCount} / {action.targetGoal}
                {hasMetGoal && <Check className="h-3 w-3" />}
              </Badge>
              <div className="flex items-center gap-3 min-h-[40px]">
                <Icon className="w-5 h-5 flex-shrink-0" style={{ color: action.areaDetails.color }} />
                <div className="space-y-1">
                  <div className="font-medium">{action.action}</div>
                  <div className="text-sm text-muted-foreground">{formattedTime}</div>
                  {action.comment && (
                    <div className="text-sm text-muted-foreground">{action.comment}</div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                onClick={() => onDeleteAction(action.area, action.index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};