import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getReservations,
  getBooks,
  getMembers,
  updateReservation,
} from "@/data/store";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CalendarClock, BookOpen, Trash2, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const refreshData = () => {
    setReservations(getReservations());
    setBooks(getBooks());
    setMembers(getMembers());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleCancelReservation = () => {
    if (!cancellingId) return;
    updateReservation(cancellingId, { status: "cancelled" });
    toast.success("Reservation cancelled successfully.");
    setCancellingId(null);
    refreshData();
  };

  const filteredReservations = reservations.filter((r) => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              My Reservations
            </h1>
            <span className="text-xs bg-amber-50 text-amber-700 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
              {reservations.filter((r) => r.status === "pending").length} Pending Holds
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track your book hold requests and pickup readiness.
          </p>
        </div>

        <Link
          to="/catalog"
          className="inline-flex items-center text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 rounded-lg transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Browse More Books
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {["all", "pending", "approved", "cancelled"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition-colors cursor-pointer ${
              statusFilter === st
                ? "bg-slate-900 text-white font-semibold shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Table view */}
      {filteredReservations.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No reservations found"
          description="You haven't requested any book holds yet. Browse the catalog and reserve your favorite titles."
          actionLabel="Explore Catalog"
          onAction={() => (window.location.href = "/catalog")}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Book Details
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Requested For
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Hold Date
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Notes
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((r) => {
                const book = books.find((b) => b.id === r.bookId);
                const member = members.find((m) => m.id === r.memberId);
                const isPending = r.status === "pending";

                return (
                  <TableRow key={r.id} className="hover:bg-slate-50/60">
                    <TableCell className="py-3">
                      <div>
                        <Link
                          to={`/catalog/${r.bookId}`}
                          className="font-semibold text-xs text-slate-900 hover:text-blue-600 transition-colors"
                        >
                          {book ? book.title : "Unknown Title"}
                        </Link>
                        <p className="text-[11px] text-slate-400">
                          {book ? `by ${book.author}` : "—"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-slate-700 py-3">
                      {r.visitorName || (member ? member.name : "Member")}
                      {r.visitorName && (
                        <span className="text-[10px] text-slate-400 block">
                          (Walk-in Visitor)
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-xs text-slate-600 py-3">
                      {formatDate(r.reservedAt)}
                    </TableCell>

                    <TableCell className="py-3">
                      <StatusBadge status={r.status} />
                    </TableCell>

                    <TableCell className="text-xs text-slate-500 py-3 max-w-[180px] truncate">
                      {r.notes || "—"}
                    </TableCell>

                    <TableCell className="text-right py-3">
                      {isPending && (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setCancellingId(r.id)}
                          className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" /> Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Confirmation Alert Dialog */}
      <AlertDialog
        open={!!cancellingId}
        onOpenChange={(open) => !open && setCancellingId(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              Cancel this reservation?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              This action will release your hold on the book copy for other readers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="text-xs cursor-pointer">
              Keep Reservation
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelReservation}
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
            >
              Yes, Cancel Hold
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
