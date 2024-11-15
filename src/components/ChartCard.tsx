import { WellnessAction } from "@/lib/types";
import ProgressBars from "./WellnessTracker/ProgressBars";

interface ChartCardProps {
  actions: Record<string, WellnessAction[]>;
  chartData: any[];
}

export const ChartCard = ({ actions }: ChartCardProps) => {
  return <ProgressBars actions={actions} />;
};