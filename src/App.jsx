import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  initializeData,
  getRole,
  setRole,
  getReservations,
} from "@/data/store";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { Toaster } from "@/components/ui/sonner";

// Pages
import { Catalog } from "@/pages/user/Catalog";
import { BookDetail } from "@/pages/user/BookDetail";
import { MyReservations } from "@/pages/user/MyReservations";
import { Dashboard } from "@/pages/librarian/Dashboard";
import { Books } from "@/pages/librarian/Books";
import { Members } from "@/pages/librarian/Members";
import { Transactions } from "@/pages/librarian/Transactions";
import { Reservations } from "@/pages/librarian/Reservations";
import { Assisted } from "@/pages/librarian/Assisted";

import { MobileBottomNav } from "@/components/mobile-bottom-nav";

function AppLayout({ role, onRoleChange, onDataReset, refreshTrigger }) {
  const [pendingCount, setPendingCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const pending = getReservations().filter((r) => r.status === "pending").length;
    setPendingCount(pending);
  }, [refreshTrigger]);

  const handleRoleToggle = () => {
    const nextRole = role === "librarian" ? "user" : "librarian";
    onRoleChange(nextRole);
    navigate(nextRole === "librarian" ? "/dashboard" : "/catalog");
  };

  return (
    <div className="flex h-screen w-full bg-slate-50/60 overflow-hidden font-sans text-slate-900 antialiased">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <AppSidebar
        role={role}
        onRoleChange={onRoleChange}
        pendingReservationsCount={pendingCount}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <AppHeader
          role={role}
          onDataReset={onDataReset}
          onRoleToggle={handleRoleToggle}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        {/* Scrollable Page Body with padding bottom for mobile nav bar */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-6">
          <Routes>
            {/* Default Route */}
            <Route
              path="/"
              element={
                <Navigate to={role === "librarian" ? "/dashboard" : "/catalog"} replace />
              }
            />

            {/* User / Reader Routes */}
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:id" element={<BookDetail />} />
            <Route path="/my-reservations" element={<MyReservations />} />

            {/* Librarian Admin Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/members" element={<Members />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/assisted" element={<Assisted />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav role={role} pendingCount={pendingCount} />
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}

export default function App() {
  const [role, setRoleState] = useState("user");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Seed Indian library dataset on first startup
    initializeData();
    const storedRole = getRole();
    setRoleState(storedRole || "user");
  }, []);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setRoleState(newRole);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDataReset = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <BrowserRouter>
      <AppLayout
        role={role}
        onRoleChange={handleRoleChange}
        onDataReset={handleDataReset}
        refreshTrigger={refreshTrigger}
      />
    </BrowserRouter>
  );
}
