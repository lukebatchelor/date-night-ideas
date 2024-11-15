import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { WELLNESS_AREAS } from "@/lib/constants";

interface AddActionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedArea: string | null;
  customActions: Record<string, string[]>;
  onAddAction: (area: string, action: string, comment: string) => void;
  onAddCustomAction: (area: string, action: string) => void;
}

export const AddActionDialog = ({
  isOpen,
  onOpenChange,
  selectedArea,
  customActions,
  onAddAction,
  onAddCustomAction,
}: AddActionDialogProps) => {
  const [newAction, setNewAction] = useState("");
  const [comment, setComment] = useState("");
  const [area, setArea] = useState<string | null>(selectedArea);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Wellness Activity</DialogTitle>
        </DialogHeader>

        {!area && (
          <Select onValueChange={setArea}>
            <SelectTrigger>
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(WELLNESS_AREAS).map(
                ([key, { label, icon: Icon }]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </div>
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        )}

        {area && (
          <div className="space-y-4">
            <Select
              onValueChange={(value) => {
                onAddAction(area, value, comment);
                setComment("");
                setNewAction("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                {WELLNESS_AREAS[area].defaultActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
                {customActions[area]?.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                placeholder="New action"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
              />
              <Button
                onClick={() => {
                  onAddCustomAction(area, newAction);
                  setNewAction("");
                }}
              >
                Add
              </Button>
            </div>

            <Input
              type="time"
              defaultValue={new Date().toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              })}
            />

            <Textarea
              placeholder="Comments (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
