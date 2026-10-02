import React from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = FolderOpen,
  title = "No items found",
  description = "There are no records matching your criteria.",
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 my-4",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="cursor-pointer">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
