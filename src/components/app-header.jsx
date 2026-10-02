import React from "react";
import { Menu, RotateCcw, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resetData } from "@/data/store";
import { toast } from "sonner";

export function AppHeader({ role, onDataReset, onRoleToggle, onMenuClick }) {
  const handleReset = () => {
    if (
      window.confirm(
        "Reset all library data back to default Indian seed records? Any custom additions will be restored."
      )
    ) {
      resetData();
      toast.success("Library data successfully reset to default Indian seed dataset!");
      if (onDataReset) onDataReset();
    }
  };

  return (
    <header className="h-14 border-b border-slate-200/80 bg-white/95 backdrop-blur-xs px-3 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* Left side: Hamburger (mobile) + Branch title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center -ml-1"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 truncate">
          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            <span className="hidden sm:inline">Central Town Library, Bhopal</span>
            <span className="sm:hidden font-bold">Granthalaya</span>
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <Badge
            variant="outline"
            className="hidden sm:inline-flex text-[11px] font-normal text-slate-600 bg-slate-50 border-slate-200"
          >
            Branch: <span className="font-mono font-medium ml-1">MP-BPL-04</span>
          </Badge>
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Reset Demo Data Button */}
        <Button
          variant="outline"
          size="xs"
          onClick={handleReset}
          className="text-xs text-slate-600 hover:text-slate-900 border-slate-200 h-8 px-2 sm:px-2.5 cursor-pointer flex items-center gap-1"
          title="Reset database to initial Indian demo books and members"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden xs:inline">Reset</span>
        </Button>

        {/* Role Toggle Button */}
        <Button
          variant={role === "librarian" ? "default" : "secondary"}
          size="xs"
          onClick={onRoleToggle}
          className="text-xs h-8 px-2.5 sm:px-3 cursor-pointer flex items-center gap-1.5 font-medium"
        >
          {role === "librarian" ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Librarian</span>
            </>
          ) : (
            <>
              <User className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Reader</span>
            </>
          )}
        </Button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
            {role === "librarian" ? "LB" : "AS"}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">
              {role === "librarian" ? "Rajesh Verma" : "Aarav Sharma"}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {role === "librarian" ? "Chief Librarian" : "Member #001"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
