import React from "react";
import { Search, RotateCcw, ShieldCheck, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resetData } from "@/data/store";
import { toast } from "sonner";

export function AppHeader({ role, onDataReset, onRoleToggle }) {
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
    <header className="h-14 border-b border-slate-200/80 bg-white/95 backdrop-blur-xs px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-800">
          Central Town Library, Bhopal
        </span>
        <span className="text-slate-300">|</span>
        <Badge
          variant="outline"
          className="text-[11px] font-normal text-slate-600 bg-slate-50 border-slate-200"
        >
          Branch Code: <span className="font-mono font-medium ml-1">MP-BPL-04</span>
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        {/* Reset Demo Data Button */}
        <Button
          variant="outline"
          size="xs"
          onClick={handleReset}
          className="text-xs text-slate-600 hover:text-slate-900 border-slate-200 h-7 px-2.5 cursor-pointer flex items-center gap-1.5"
          title="Reset database to initial Indian demo books and members"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Demo</span>
        </Button>

        {/* Role Toggle Button */}
        <Button
          variant={role === "librarian" ? "default" : "secondary"}
          size="xs"
          onClick={onRoleToggle}
          className="text-xs h-7 px-3 cursor-pointer flex items-center gap-1.5 font-medium"
        >
          {role === "librarian" ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Librarian Mode</span>
            </>
          ) : (
            <>
              <User className="w-3.5 h-3.5" />
              <span>Reader Mode</span>
            </>
          )}
        </Button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
            {role === "librarian" ? "LB" : "AS"}
          </div>
          <div className="hidden md:block text-left">
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
