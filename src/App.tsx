import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/Home";
import { SettingsPage } from "@/pages/Settings";
import { WellnessAction } from "@/lib/types";
import { loadTodayActions, loadCustomActions, saveActions, saveCustomActions } from "@/lib/utils";

function App() {
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

  const handleAddCustomAction = (area: string, action: string) => {
    if (!action.trim()) return;
    const updatedCustomActions = {
      ...customActions,
      [area]: [...(customActions[area] || []), action],
    };
    saveCustomActions(updatedCustomActions);
    setCustomActions(updatedCustomActions);
    handleAddAction(area, action, "");
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
                onAddCustomAction={handleAddCustomAction}
              />
            } 
          />
          <Route 
            path="/settings" 
            element={<SettingsPage customActions={customActions} />} 
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;