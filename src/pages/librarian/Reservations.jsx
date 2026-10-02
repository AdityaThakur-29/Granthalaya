import React, { useState, useEffect } from "react";
import {
  getReservations,
  getBooks,
  getMembers,
  updateReservation,
  issueBook,
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
  CalendarClock,
  CheckCircle,
  XCircle,
  ArrowRight,
  BookOpen,
  Repeat,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");

  const refreshData = () => {
    setReservations(getReservations());
    setBooks(getBooks());
    setMembers(getMembers());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleApprove = (id) => {
    updateReservation(id, { status: "approved" });
    toast.success("Reservation approved! Hold shelf reserved.");
    refreshData();
  };

  const handleReject = (id) => {
    updateReservation(id, { status: "rejected" });
    toast.error("Reservation request declined.");
    refreshData();
  };

  const handleConvertToIssue = (res) => {
    if (!res.memberId) {
      toast.error("Cannot issue directly to unregistered visitor. Please register member first.");
      return;
    }

    const success = issueBook(res.bookId, res.memberId);
    if (success) {
      updateReservation(res.id, { status: "approved" });
      toast.success("Converted hold into active 14-day loan!");
      refreshData();
    } else {
      toast.error("Failed to issue book. No copies available!");
    }
  };

  const filteredReservations = reservations.filter((r) => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/80 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Reservation Approval Desk
            </h1>
            <span className="text-xs bg-amber-50 text-amber-700 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
              {reservations.filter((r) => r.status === "pending").length} Awaiting Approval
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review hold requests, approve for shelf hold, or issue directly to patron at desk.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none max-w-full">
        {[
          { id: "pending", label: "Pending Approvals" },
          { id: "approved", label: "Approved / Ready" },
          { id: "rejected", label: "Rejected" },
          { id: "all", label: "All Holds" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 min-h-[32px] ${
              statusFilter === tab.id
                ? "bg-slate-900 text-white font-semibold shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {filteredReservations.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No reservations in this status"
          description="There are currently no hold requests matching the selected category."
          actionLabel={statusFilter !== "all" ? "View All Holds" : null}
          onAction={() => setStatusFilter("all")}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[650px]">
              <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Requested Book
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Requester
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Stock Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Hold Placed At
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Current Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">
                  Desk Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((r) => {
                const book = books.find((b) => b.id === r.bookId);
                const member = members.find((m) => m.id === r.memberId);
                const isPending = r.status === "pending";
                const isApproved = r.status === "approved";
                const hasCopies = book && book.availableCopies > 0;

                return (
                  <TableRow key={r.id} className="hover:bg-slate-50/60">
                    <TableCell className="py-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                          {book ? book.title : "Book"}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {book ? `Author: ${book.author}` : "—"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-slate-700 py-3">
                      <p className="font-semibold text-slate-800">
                        {r.visitorName || (member ? member.name : "Member")}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {r.visitorName ? "Walk-in Guest" : member?.phone || ""}
                      </p>
                    </TableCell>

                    <TableCell className="text-xs py-3">
                      {book ? (
                        <span
                          className={`font-semibold ${
                            hasCopies ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {book.availableCopies} available
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell className="text-xs text-slate-600 py-3">
                      {formatDate(r.reservedAt)}
                    </TableCell>

                    <TableCell className="py-3">
                      <StatusBadge status={r.status} />
                    </TableCell>

                    <TableCell className="text-right py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {isPending && (
                          <>
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => handleReject(r.id)}
                              className="text-xs h-7 text-rose-600 border-slate-200 hover:bg-rose-50 cursor-pointer"
                            >
                              <XCircle className="w-3 h-3 mr-1" /> Reject
                            </Button>
                            <Button
                              size="xs"
                              onClick={() => handleApprove(r.id)}
                              className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" /> Approve
                            </Button>
                          </>
                        )}

                        {(isPending || isApproved) && r.memberId && hasCopies && (
                          <Button
                            size="xs"
                            variant="secondary"
                            onClick={() => handleConvertToIssue(r)}
                            className="text-xs h-7 bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                            title="Issue now at circulation counter"
                          >
                            <Repeat className="w-3 h-3 mr-1" /> Quick-Issue
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </div>
        </div>
      )}
    </div>
  );
}
