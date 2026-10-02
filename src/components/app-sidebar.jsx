import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  Library,
  Users,
  Repeat,
  CalendarClock,
  Compass,
  UserCheck,
  Shield,
  User,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function AppSidebar({ role, onRoleChange, pendingReservationsCount = 0 }) {
  const navigate = useNavigate();

  const userNav = [
    {
      name: "Book Catalog",
      to: "/catalog",
      icon: BookOpen,
      badge: null,
    },
    {
      name: "My Reservations",
      to: "/my-reservations",
      icon: CalendarClock,
      badge: null,
    },
  ];

  const librarianNavManagement = [
    {
      name: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Book Inventory",
      to: "/books",
      icon: Library,
      badge: null,
    },
    {
      name: "Member Directory",
      to: "/members",
      icon: Users,
      badge: null,
    },
  ];

  const librarianNavOperations = [
    {
      name: "Circulation Desk",
      to: "/transactions",
      icon: Repeat,
      badge: null,
    },
    {
      name: "Reservation Desk",
      to: "/reservations",
      icon: CalendarClock,
      badge: pendingReservationsCount > 0 ? pendingReservationsCount : null,
      badgeVariant: "amber",
    },
    {
      name: "Assisted Walk-in Kiosk",
      to: "/assisted",
      icon: UserCheck,
      badge: "Kiosk",
      badgeVariant: "blue",
    },
  ];

  const handleRoleToggle = () => {
    const nextRole = role === "librarian" ? "user" : "librarian";
    onRoleChange(nextRole);
    if (nextRole === "librarian") {
      navigate("/dashboard");
    } else {
      navigate("/catalog");
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col h-screen shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-tight truncate">
            Granthalaya
          </h1>
          <p className="text-[11px] text-slate-500 font-medium">
            Local Library Digital System
          </p>
        </div>
      </div>

      {/* Role Switcher Pill */}
      <div className="p-3 mx-3 my-2 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          {role === "librarian" ? (
            <Shield className="w-4 h-4 text-blue-600" />
          ) : (
            <User className="w-4 h-4 text-emerald-600" />
          )}
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Active Mode
            </div>
            <div className="text-xs font-semibold text-slate-800 capitalize">
              {role === "librarian" ? "Librarian Admin" : "Reader / Member"}
            </div>
          </div>
        </div>
        <Button
          size="xs"
          variant="outline"
          onClick={handleRoleToggle}
          className="text-[11px] h-7 px-2.5 bg-white hover:bg-slate-100 border-slate-200 font-medium cursor-pointer shadow-2xs"
        >
          Switch
        </Button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {/* User Navigation / Public Section */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Reader Services
          </div>
          <nav className="space-y-0.5">
            {userNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group",
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Librarian Sections */}
        {role === "librarian" && (
          <>
            <div>
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Management
              </div>
              <nav className="space-y-0.5">
                {librarianNavManagement.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group",
                          isActive
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div>
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Operations
              </div>
              <nav className="space-y-0.5">
                {librarianNavOperations.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group",
                          isActive
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.2 rounded-full border",
                            item.badgeVariant === "amber"
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : "bg-blue-100 text-blue-800 border-blue-200"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </>
        )}

        {/* Quick Kiosk link for reader mode too */}
        {role === "user" && (
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Assisted Access
            </div>
            <NavLink
              to="/assisted"
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group",
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Walk-in Kiosk</span>
              </div>
              <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-slate-300">
                Self-Help
              </Badge>
            </NavLink>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium text-slate-700">Digital Library MVP</span>
          <span className="text-[10px] text-slate-400 font-mono">v1.0 (IN)</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
          Designed for Indian Municipal & District Public Libraries.
        </p>
      </div>
    </aside>
  );
}
