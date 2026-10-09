import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { BookOpen, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function BookCard({ book, onQuickReserve }) {
  const isAvailable = book.availableCopies > 0;
  const statusKey = isAvailable ? "available" : "out_of_stock";

  return (
    <Card className="flex flex-col justify-between border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden group">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Book Cover Image with Spine Fallback */}
          <div className="w-16 h-24 rounded-lg shrink-0 overflow-hidden shadow-xs border border-slate-200/90 bg-slate-100 group-hover:scale-102 transition-transform relative">
            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />
            )}
            <div
              className={cn(
                "w-full h-full flex flex-col justify-between p-2 rounded-lg",
                book.coverImage ? "hidden" : "flex"
              )}
              style={{
                backgroundColor: book.coverColor || "#2563EB",
              }}
            >
              <div className="w-full h-1 bg-white/40 rounded-full" />
              <BookOpen className="w-5 h-5 text-white/90 mx-auto" />
              <span className="text-[9px] font-bold text-white/90 uppercase tracking-tighter truncate text-center">
                {book.category?.slice(0, 3) || "LIB"}
              </span>
            </div>
          </div>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  {book.category}
                </span>
                {book.pdfUrl && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                    E-Book
                  </span>
                )}
              </div>
              <StatusBadge
                status={statusKey}
                label={isAvailable ? "Available" : "Checked Out"}
                showDot={false}
              />
            </div>

            <h3
              className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1"
              title={book.title}
            >
              {book.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
              by {book.author}
            </p>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] font-mono text-slate-400">
                ISBN: {book.isbn ? book.isbn.slice(-8) : "N/A"}
              </span>
              <span className="font-medium text-slate-700">
                <span className={isAvailable ? "text-emerald-600 font-semibold" : "text-rose-600"}>
                  {book.availableCopies}
                </span>{" "}
                / {book.totalCopies} copies
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to={`/catalog/${book.id}`}
            className="inline-flex items-center text-xs font-medium text-slate-600 hover:text-blue-600 h-8 px-2 rounded-lg transition-colors cursor-pointer"
          >
            View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>

          {book.pdfUrl && (
            <a
              href={book.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`Read ${book.title} online`}
              className="inline-flex items-center justify-center gap-1.5 text-xs h-8 px-2.5 rounded-lg border border-emerald-300 text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 hover:text-emerald-800 transition-colors font-medium cursor-pointer whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Read Online</span>
              <ExternalLink className="w-3 h-3 text-emerald-600/80 shrink-0" />
            </a>
          )}
        </div>

        {onQuickReserve && (
          <Button
            size="sm"
            variant={isAvailable ? "default" : "outline"}
            disabled={!isAvailable}
            onClick={() => onQuickReserve(book)}
            className="text-xs h-8 px-3 cursor-pointer shrink-0"
          >
            {isAvailable ? "Reserve" : "Unavailable"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
