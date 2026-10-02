import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeVariant = "default",
  color = "blue",
  className,
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    slate: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <Card
      className={cn(
        "border border-slate-200/80 bg-white shadow-xs hover:shadow-sm transition-shadow duration-200",
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                {value}
              </span>
              {badgeText && (
                <span
                  className={cn(
                    "text-[11px] font-medium px-2 py-0.5 rounded-full border",
                    badgeVariant === "destructive"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : badgeVariant === "success"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  )}
                >
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 pt-0.5">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div
              className={cn(
                "p-2.5 rounded-xl border flex items-center justify-center shrink-0",
                colorMap[color] || colorMap.blue
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
