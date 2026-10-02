import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_CONFIGS = {
  // Book / Copy status
  available: {
    label: "Available",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    dotColor: "bg-emerald-500",
  },
  issued: {
    label: "Issued",
    className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    dotColor: "bg-blue-500",
  },
  reserved: {
    label: "Reserved",
    className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    dotColor: "bg-amber-500",
  },
  out_of_stock: {
    label: "Out of Stock",
    className: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
    dotColor: "bg-rose-500",
  },

  // Transaction status
  active: {
    label: "Active",
    className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    dotColor: "bg-blue-500",
  },
  overdue: {
    label: "Overdue",
    className: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 animate-pulse",
    dotColor: "bg-rose-500",
  },
  returned: {
    label: "Returned",
    className: "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
    dotColor: "bg-slate-400",
  },

  // Reservation status
  pending: {
    label: "Pending Approval",
    className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    dotColor: "bg-amber-500",
  },
  approved: {
    label: "Approved / Ready",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    dotColor: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
    dotColor: "bg-rose-500",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
    dotColor: "bg-slate-400",
  },

  // Member status
  inactive: {
    label: "Inactive",
    className: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200",
    dotColor: "bg-slate-400",
  },
};

export function StatusBadge({ status, label, showDot = true, className }) {
  const normalizedKey = (status || "").toLowerCase().replace(/[\s-]/g, "_");
  const config = STATUS_CONFIGS[normalizedKey] || {
    label: label || status || "Unknown",
    className: "bg-slate-100 text-slate-700 border-slate-200",
    dotColor: "bg-slate-400",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border transition-colors",
        config.className,
        className
      )}
    >
      {showDot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dotColor)}
        />
      )}
      <span>{label || config.label}</span>
    </Badge>
  );
}
