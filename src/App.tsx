import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/Home";
import { SettingsPage } from "@/pages/Settings";
import { DailyLogPage } from "@/pages/DailyLog";
import { WellnessAction } from "@/lib/types";
import { loadTodayActions, loadCustomActions, saveActions, saveCustomActions } from "@/lib/utils";
import { formatDateKey, loadDailyLogs } from "@/lib/dateUtils";

export default function App() {
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
      [area]: [...(actions[area] || []), { action, time: currentTime, comment }],
    };
    saveActions(newActions);
    setActions(newActions);
  };

  const handleDeleteAction = (area: string, index: number, dateString?: string) => {
    const date = dateString || formatDateKey(new Date());
    const logs = loadDailyLogs();
    const currentActions = logs[date] || {};
    
    const newActions = {
      ...currentActions,
      [area]: currentActions[area].filter((_: any, i: number) => i !== index)
    };
    
    logs[date] = newActions;
    localStorage.setItem('dailyLogs', JSON.stringify(logs));
    
    if (date === formatDateKey(new Date())) {
      setActions(newActions);
    }
  };

  const handleAddCustomAction = (area: string, action: string) => {
    if (!action.trim()) return;
    const updatedCustomActions = {
      ...customActions,
      [area]: [...(customActions[area] || []), action],
    };
    saveCustomActions(updatedCustomActions);
    setCustomActions(updatedCustomActions);
  };

  const handleDeleteCustomAction = (area: string, index: number) => {
    const updatedCustomActions = {
      ...customActions,
      [area]: customActions[area].filter((_, i) => i !== index)
    };
    saveCustomActions(updatedCustomActions);
    setCustomActions(updatedCustomActions);
  };

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage
                actions={actions}
                customActions={customActions}
                onAddAction={handleAddAction}
              />
            } 
          />
          <Route 
            path="/daily" 
            element={
              <DailyLogPage
                actions={actions}
                onDeleteAction={handleDeleteAction}
              />
            } 
          />
          <Route 
            path="/settings" 
            element={
              <SettingsPage 
                customActions={customActions}
                onAddCustomAction={handleAddCustomAction}
                onDeleteCustomAction={handleDeleteCustomAction}
              />
            } 
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};