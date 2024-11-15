import { useState } from "react";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ChartCard } from "@/components/ChartCard";
import { AddActionDialog } from "@/components/AddActionDialog";
import { DailyLog } from "@/components/DailyLog";
import { getChartData } from "@/lib/utils";
import { WellnessAction } from "@/lib/types";

export const HomePage = ({
  actions,
  customActions,
  onAddAction,
  onAddCustomAction,
  onDeleteAction,
}: {
  actions: Record<string, WellnessAction[]>;
  customActions: Record<string, string[]>;
  onAddAction: (area: string, action: string, comment: string) => void;
  onAddCustomAction: (area: string, action: string) => void;
  onDeleteAction: (area: string, index: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [goals] = useState(() => {
    const saved = localStorage.getItem('wellnessGoals');
    return saved ? JSON.parse(saved) : {};
  });

  const handleAddAction = (area: string, action: string, comment: string) => {
    onAddAction(area, action, comment);
    const newCount = (actions[area]?.length || 0) + 1;
    if (newCount >= (goals[area] || 0)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
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

      <DailyLog actions={actions} onDeleteAction={onDeleteAction} />

      <AddActionDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selectedArea={selectedArea}
        customActions={customActions}
        onAddAction={handleAddAction}
      />
    </div>
  );
};