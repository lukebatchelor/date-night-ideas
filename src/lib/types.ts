import { LucideIcon } from "lucide-react";

export interface WellnessAction {
  action: string;
  time: string;
  comment?: string;
}

export interface WellnessArea {
  label: string;
  icon: LucideIcon;
  color: string;
  defaultActions: string[];
  dailyGoal: number;
}

export interface ChartData {
  name: string;
  progress: number;
  fill: string;
}
