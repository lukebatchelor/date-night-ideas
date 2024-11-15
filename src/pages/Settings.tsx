import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WELLNESS_AREAS } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Check, Trash2 } from "lucide-react";

interface CustomActionEditorProps {
  area: string;
  onSave: (action: string) => void;
  onCancel: () => void;
}

const CustomActionEditor: React.FC<CustomActionEditorProps> = ({ area, onSave, onCancel }) => {
  const [value, setValue] = React.useState('');

  return (
    <div className="flex items-center gap-2">
      <Input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`New ${WELLNESS_AREAS[area].label.toLowerCase()} action`}
        className="flex-grow"
      />
      <Button size="icon" variant="ghost" onClick={() => onSave(value)} disabled={!value.trim()}>
        <Check className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" onClick={onCancel}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const SettingsPage = ({ 
  customActions,
  onAddCustomAction,
  onDeleteCustomAction 
}: { 
  customActions: Record<string, string[]>;
  onAddCustomAction: (area: string, action: string) => void;
  onDeleteCustomAction: (area: string, index: number) => void;
}) => {
  const [goals, setGoals] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('wellnessGoals');
    return saved ? JSON.parse(saved) : Object.entries(WELLNESS_AREAS).reduce((acc, [key, area]) => ({
      ...acc,
      [key]: area.dailyGoal
    }), {});
  });
  
  const [editingArea, setEditingArea] = React.useState<string | null>(null);
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

  const handleAddCustomAction = (area: string, action: string) => {
    onAddCustomAction(area, action);
    setEditingArea(null);
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
          {Object.entries(WELLNESS_AREAS).map(([key, area]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center gap-2">
                <area.icon className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">{area.label}</h3>
              </div>
              <Separator />
              <ul className="space-y-2 pt-2">
                {customActions[key]?.map((action, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground pl-6">
                    <span className="flex-grow">• {action}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDeleteCustomAction(key, index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
                <li className="pl-6">
                  {editingArea === key ? (
                    <CustomActionEditor
                      area={key}
                      onSave={(action) => handleAddCustomAction(key, action)}
                      onCancel={() => setEditingArea(null)}
                    />
                  ) : (
                    <Button
                      variant="ghost"
                      className="text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setEditingArea(key)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add custom action
                    </Button>
                  )}
                </li>
              </ul>
            </div>
          ))}
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