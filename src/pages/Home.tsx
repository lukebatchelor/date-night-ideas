import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ChartCard } from "@/components/ChartCard";
import { AddActionDialog } from "@/components/AddActionDialog";
import { getChartData } from "@/lib/utils";
import { WellnessAction } from "@/lib/types";

export const HomePage = ({
  actions,
  customActions,
  onAddAction,
  onAddCustomAction,
}: {
  actions: Record<string, WellnessAction[]>;
  customActions: Record<string, string[]>;
  onAddAction: (area: string, action: string, comment: string) => void;
  onAddCustomAction: (area: string, action: string) => void;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null);

  return (
    <div className="space-y-6 pb-24">
      <ChartCard actions={actions} chartData={getChartData(actions)} />
      
      <div className="flex justify-center">
        <Button
          onClick={() => {
            setSelectedArea(null);
            setIsOpen(true);
          }}
          className="rounded-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Action
        </Button>
      </div>

      <AddActionDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selectedArea={selectedArea}
        customActions={customActions}
        onAddAction={onAddAction}
        onAddCustomAction={onAddCustomAction}
      />
    </div>
  );
};