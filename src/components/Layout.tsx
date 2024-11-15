import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Topbar from "@/components/Topbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <main className="p-4 max-w-md mx-auto">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background">
        <div className="flex justify-around p-2 max-w-md mx-auto">
          <Link to="/" className="flex-1">
            <Button 
              variant="ghost" 
              className="w-full"
              data-active={location.pathname === '/'}
            >
              <BarChart className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/settings" className="flex-1">
            <Button 
              variant="ghost" 
              className="w-full"
              data-active={location.pathname === '/settings'}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
};