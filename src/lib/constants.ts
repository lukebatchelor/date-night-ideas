import { Droplet, Apple, Move, Moon, Brain } from "lucide-react";
import { WellnessArea } from "./types";

export const WELLNESS_AREAS: Record<string, WellnessArea> = {
  hydration: {
    label: "Hydration",
    icon: Droplet,
    color: "hsl(var(--chart-1))",
    defaultActions: ["Drink water", "Drink herbal tea"],
    dailyGoal: 8,
  },
  nutrition: {
    label: "Nutrition",
    icon: Apple,
    color: "hsl(var(--chart-2))",
    defaultActions: ["Eat fruits", "Eat vegetables", "Healthy meal"],
    dailyGoal: 5,
  },
  movement: {
    label: "Movement",
    icon: Move,
    color: "hsl(var(--chart-3))",
    defaultActions: ["Walk", "Exercise", "Stretch"],
    dailyGoal: 3,
  },
  sleep: {
    label: "Sleep",
    icon: Moon,
    color: "hsl(var(--chart-4))",
    defaultActions: ["Nap", "Early bedtime", "No screens before bed"],
    dailyGoal: 1,
  },
  mindfulness: {
    label: "Mindfulness",
    icon: Brain,
    color: "hsl(var(--chart-5))",
    defaultActions: ["Meditate", "Deep breathing", "Journaling"],
    dailyGoal: 3,
  },
};
