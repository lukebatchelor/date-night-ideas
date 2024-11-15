import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { WellnessAction, ChartData } from "./types";
import { WELLNESS_AREAS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChartData(
  actions: Record<string, WellnessAction[]>
): ChartData[] {
  return Object.entries(WELLNESS_AREAS).map(([key, area]) => ({
    name: key,
    progress: Math.min(
      ((actions[key]?.length || 0) / area.dailyGoal) * 100,
      100
    ),
    fill: area.color,
  }));
}

export function loadTodayActions(): Record<string, WellnessAction[]> {
  const today = new Date().toDateString();
  const savedActions = localStorage.getItem(today);
  return savedActions ? JSON.parse(savedActions) : {};
}

export function loadCustomActions(): Record<string, string[]> {
  const savedCustomActions = localStorage.getItem("customActions");
  return savedCustomActions ? JSON.parse(savedCustomActions) : {};
}

export function saveActions(actions: Record<string, WellnessAction[]>): void {
  const today = new Date().toDateString();
  localStorage.setItem(today, JSON.stringify(actions));
}

export function saveCustomActions(
  customActions: Record<string, string[]>
): void {
  localStorage.setItem("customActions", JSON.stringify(customActions));
}
