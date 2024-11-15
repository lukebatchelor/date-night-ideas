import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ChartCard } from "../ChartCard";
import { AddActionDialog } from "./AddActionDialog";
import { BottomNav, SettingsPage } from "./BottomNav";
import { WellnessAction } from "@/lib/types";
import {
  getChartData,
  loadTodayActions,
  loadCustomActions,
  saveActions,
  saveCustomActions,
} from "@/lib/utils";

export const WellnessTracker = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [actions, setActions] = useState<Record<string, WellnessAction[]>>({});
  const [customActions, setCustomActions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setActions(loadTodayActions());
    setCustomActions(loadCustomActions());
  }, []);

  const handleAddAction = (area: string, action: string, comment: string) => {
    const currentTime = new Date().toLocaleTimeString();
    const newActions = {
      ...actions,
      [area]: [
        ...(actions[area] || []),
        { action, time: currentTime, comment },
      ],
    };
    saveActions(newActions);
    setActions(newActions);
    setIsOpen(false);
  };

  const handleAddCustomAction = (area: string, action: string) => {
    if (!action.trim()) return;
    const updatedCustomActions = {
      ...customActions,
      [area]: [...(customActions[area] || []), action],
    };
    saveCustomActions(updatedCustomActions);
    setCustomActions(updatedCustomActions);
    handleAddAction(area, action, "");
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'daily':
        return (
          <>
            <ChartCard actions={actions} chartData={getChartData(actions)} />
            <div className="flex justify-center p-4">
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
          </>
        );
      case 'settings':
        return <SettingsPage customActions={customActions} />;
      default:
        return <div className="p-4 text-center">Home Page Content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {renderContent()}
        
        <AddActionDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          selectedArea={selectedArea}
          customActions={customActions}
          onAddAction={handleAddAction}
          onAddCustomAction={handleAddCustomAction}
        />

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};