import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/Home";
import { SettingsPage } from "@/pages/Settings";
import { DailyLogPage } from "@/pages/DailyLog";
import { WellnessAction } from "@/lib/types";
import { loadTodayActions, loadCustomActions, saveActions, saveCustomActions } from "@/lib/utils";

export default function App() {
  const [actions, setActions] = useState<Record<string, WellnessAction[]>>({});
  const [customActions, setCustomActions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setActions(loadTodayActions());
    setCustomActions(loadCustomActions());
  }, []);

  const handleAddAction = (area: string, action: string, comment: string) => {
    const currentTime = new Date().toLocaleTimeString();
    const today = new Date().toDateString();
    const newActions = {
      ...actions,
      [area]: [...(actions[area] || []), { action, time: currentTime, comment }],
    };
    localStorage.setItem(today, JSON.stringify(newActions));
    setActions(newActions);
  };

  const handleDeleteAction = (area: string, index: number, dateString?: string) => {
    const date = dateString || new Date().toDateString();
    const currentActions = JSON.parse(localStorage.getItem(date) || '{}');
    const newActions = {
      ...currentActions,
      [area]: currentActions[area].filter((_: any, i: number) => i !== index)
    };
    localStorage.setItem(date, JSON.stringify(newActions));
    if (date === new Date().toDateString()) {
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