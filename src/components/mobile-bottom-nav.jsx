import React from "react";
import { NavLink } from "react-router-dom";
import {
  BookOpen,
  CalendarClock,
  LayoutDashboard,
  Library,
  Repeat,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomNav({ role, pendingCount = 0 }) {
  const userItems = [
    { name: "Catalog", to: "/catalog", icon: BookOpen },
    { name: "My Holds", to: "/my-reservations", icon: CalendarClock },
    { name: "Kiosk", to: "/assisted", icon: UserCheck },
  ];

  const librarianItems = [
    { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { name: "Books", to: "/books", icon: Library },
    { name: "Circulation", to: "/transactions", icon: Repeat },
    {
      name: "Holds",
      to: "/reservations",
      icon: CalendarClock,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { name: "Kiosk", to: "/assisted", icon: UserCheck },
  ];

  const items = role === "librarian" ? librarianItems : userItems;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-sm select-none safe-area-pb">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-lg text-[10px] font-medium transition-colors relative min-h-[46px] cursor-pointer",
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              )
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
              {item.badge && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="truncate max-w-[65px]">{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
