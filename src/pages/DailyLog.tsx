import React from 'react';
import { DailyLog } from '@/components/DailyLog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { WellnessAction } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DailyLogPageProps {
  actions: Record<string, WellnessAction[]>;
  onDeleteAction: (area: string, index: number) => void;
}

export const DailyLogPage = ({ actions, onDeleteAction }: DailyLogPageProps) => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const inputRef = React.useRef<HTMLInputElement>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const getActionsForDate = () => {
    const dateString = selectedDate.toDateString();
    const savedActions = localStorage.getItem(dateString);
    return savedActions ? JSON.parse(savedActions) : {};
  };

  const dateActions = getActionsForDate();
  const hasActions = Object.values(dateActions).some(actions => actions.length > 0);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => changeDate(-1)}
          className="text-muted-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="relative w-48">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-lg font-medium">{formatDate(selectedDate)}</span>
          </div>
          <Input
            ref={inputRef}
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className={cn(
              "appearance-none bg-transparent border-none text-center font-medium text-lg hover:bg-accent cursor-pointer opacity-0",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "w-full h-10"
            )}
          />
        </div>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => changeDate(1)}
          className="text-muted-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {hasActions ? (
        <DailyLog actions={dateActions} onDeleteAction={onDeleteAction} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Daily Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mb-4" />
              <p className="text-center">No activities logged for this day. Add some wellness activities to track your progress!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};