import React from 'react';
import { BarChart, Settings, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomNavProps {
  activeTab: 'home' | 'daily' | 'settings';
  onTabChange: (tab: 'home' | 'daily' | 'settings') => void;
}


const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
      <nav className="flex justify-around p-2">
        <Button variant="ghost" onClick={() => onTabChange('home')} className={activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'}>
          <Home className="w-5 h-5" />
        </Button>
        <Button variant="ghost" onClick={() => onTabChange('daily')} className={activeTab === 'daily' ? 'text-primary' : 'text-muted-foreground'}>
          <BarChart className="w-5 h-5" />
        </Button>
        <Button variant="ghost" onClick={() => onTabChange('settings')} className={activeTab === 'settings' ? 'text-primary' : 'text-muted-foreground'}>
          <Settings className="w-5 h-5" />
        </Button>
      </nav>
    </div>
  );
};



export { BottomNav };