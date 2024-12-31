import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from "@/components/Layout";
import { DateIdeasPage } from "@/pages/DateIdeas";
import { CalendarPage } from "@/pages/Calendar";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/ideas" replace />} />
          <Route path="/ideas" element={<DateIdeasPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}