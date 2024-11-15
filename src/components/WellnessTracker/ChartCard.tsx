import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { RadialBar, RadialBarChart } from "recharts";
import { ChartTooltip } from "@/components/ui/chart";
import { WELLNESS_AREAS } from "@/lib/constants";
import { WellnessAction } from "@/lib/types";

interface ChartCardProps {
  actions: Record<string, WellnessAction[]>;
  chartData: any[];
}

const chartConfig = {
  progress: {
    label: "Progress",
  },
  hydration: {
    label: "Hydration",
    color: "hsl(var(--chart-1))",
  },
  nutrition: {
    label: "Nutrition",
    color: "hsl(var(--chart-2))",
  },
  movement: {
    label: "Movement",
    color: "hsl(var(--chart-3))",
  },
  sleep: {
    label: "Sleep",
    color: "hsl(var(--chart-4))",
  },
  mindfulness: {
    label: "Mindfulness",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export const ChartCard = ({ actions, chartData }: ChartCardProps) => {
  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle>Daily Progress</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          className="mx-auto aspect-square max-h-[300px]"
          config={chartConfig}
        >
          <RadialBarChart
            data={chartData}
            innerRadius="30%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar dataKey="progress" background />
            <ChartTooltip
              content={({ payload }) => {
                if (payload && payload.length) {
                  const data = payload[0].payload;
                  const area = WELLNESS_AREAS[data.name];
                  return (
                    <div className="rounded-lg bg-white p-2 shadow-md border">
                      <div className="font-bold">{area.label}</div>
                      <div>
                        {actions[data.name]?.length || 0} / {area.dailyGoal}{" "}
                        actions
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
