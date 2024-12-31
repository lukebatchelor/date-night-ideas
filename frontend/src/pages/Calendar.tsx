// src/pages/Calendar.tsx
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addWeeks, addDays } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api, type DateNight } from '@/lib/api';

type DateNightWithRange = DateNight & {
  dateRange?: {
    start: Date;
    end: Date;
  };
};

export const CalendarPage = () => {
  const [dateNights, setDateNights] = useState<DateNightWithRange[]>([]);
  const [weeks, setWeeks] = useState<DateNightWithRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get next letter in sequence
  const getNextLetter = (prevLetter?: string): string => {
    if (!prevLetter) return 'A';
    const nextCharCode = prevLetter.charCodeAt(0) + 1;
    return nextCharCode > 90 ? 'A' : String.fromCharCode(nextCharCode);
  };

  // Generate all weeks when dateNights data changes
  useEffect(() => {
    const startDate = new Date('2024-12-23'); // Week 0
    const generatedWeeks: DateNightWithRange[] = [];

    for (let weekNumber = 0; weekNumber < 53; weekNumber++) {
      const weekStart = startOfWeek(addWeeks(startDate, weekNumber), { weekStartsOn: 1 });
      const weekEnd = addDays(weekStart, 6);
      
      // Try to find this week in our existing data
      const existingData = dateNights.find(dn => dn.weekNumber === weekNumber);
      if (existingData) {
        generatedWeeks.push({
          ...existingData,
          dateRange: { start: weekStart, end: weekEnd }
        });
        continue;
      }

      // If not found, generate the next letter based on previous week
      const previousWeek = weekNumber > 0 ? generatedWeeks[weekNumber - 1] : null;
      const nextLetter = previousWeek?.status === 'skipped' 
        ? previousWeek.letter || 'A'  // Keep same letter if previous week was skipped
        : getNextLetter(previousWeek?.letter);

      generatedWeeks.push({
        weekNumber,
        letter: nextLetter,
        status: 'pending',
        dateRange: { start: weekStart, end: weekEnd }
      });
    }

    setWeeks(generatedWeeks);
  }, [dateNights]);

  // Load date nights data
  useEffect(() => {
    const loadDateNights = async () => {
      try {
        const data = await api.getDateNights();
        setDateNights(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load date nights');
        setLoading(false);
      }
    };

    loadDateNights();
  }, []);

  const getStatusBadge = (status: DateNight['status']) => {
    const variants = {
      completed: 'default',
      planned: 'secondary',
      skipped: 'outline',
      pending: 'outline'
    };

    const labels = {
      completed: 'Completed',
      planned: 'Planned',
      skipped: 'Skipped',
      pending: 'Pending'
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-2xl font-bold">Date Night Calendar</h1>
      
      <div className="space-y-4">
        {weeks.map((week) => (
          <Card key={week.weekNumber}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">
                    Week {week.weekNumber} ({format(week.dateRange!.start, 'MMM dd')} - {format(week.dateRange!.end, 'MMM dd')})
                  </h2>
                  {getStatusBadge(week.status)}
                </div>

                <div className={cn(
                  "text-sm space-y-1",
                  week.status === 'skipped' && "text-muted-foreground"
                )}>
                  {week.status === 'completed' ? (
                    <div className="space-y-1">
                      <div className="font-medium">Letter {week.letter}: {week.dateIdea}</div>
                      <div className="text-muted-foreground">
                        Completed on {format(new Date(week.dateCompleted!), 'MMMM d, yyyy')}
                      </div>
                    </div>
                  ) : week.status === 'planned' ? (
                    <div className="space-y-1">
                      <div className="font-medium">Letter {week.letter}: {week.dateIdea}</div>
                      {week.plannedDate && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          Planned for {format(new Date(week.plannedDate), 'MMMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  ) : week.status === 'skipped' ? (
                    <div>Week skipped</div>
                  ) : (
                    <div className="text-muted-foreground">
                      Upcoming Letter: <span className="font-medium">{week.letter}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};