import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WellnessAction, ChartData } from "./types";
import { WELLNESS_AREAS } from "./constants";
import { formatDateKey, loadDailyLogs } from "./dateUtils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChartData(
  actions: Record<string, WellnessAction[]>
): ChartData[] {
  const savedGoals = localStorage.getItem('wellnessGoals');
  const goals = savedGoals ? JSON.parse(savedGoals) : null;

  const unnormalisedData = Object.entries(WELLNESS_AREAS)
    .map(([key, area]) => ({
      name: key,
      progress: ((actions[key]?.length || 0) / (goals?.[key] || area.dailyGoal)) * 100,
      fill: area.color,
    }))
  const maxProgress = unnormalisedData.reduce((cur, next) => Math.max(cur, next.progress), 0);
  const normalisedData = unnormalisedData.map(({progress,...rest}) => ({
    ...rest,
    progress,
    normalisedProgress: progress * maxProgress / 100,
  }));
  return normalisedData;
}

export function loadTodayActions(): Record<string, WellnessAction[]> {
  const today = formatDateKey(new Date());
  const logs = loadDailyLogs();
  return logs[today] || {};
}

export function loadCustomActions(): Record<string, string[]> {
  const savedCustomActions = localStorage.getItem("customActions");
  return savedCustomActions ? JSON.parse(savedCustomActions) : {};
}

export function saveActions(actions: Record<string, WellnessAction[]>): void {
  const today = formatDateKey(new Date());
  const logs = loadDailyLogs();
  logs[today] = actions;
  localStorage.setItem('dailyLogs', JSON.stringify(logs));
}

export function saveCustomActions(
  customActions: Record<string, string[]>
): void {
  localStorage.setItem("customActions", JSON.stringify(customActions));
}