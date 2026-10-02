import React, { useState, useEffect } from "react";
import {
  getTransactions,
  getBooks,
  getMembers,
  issueBook,
  returnBook,
  renewBook,
} from "@/data/store";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Repeat,
  Plus,
  Search,
  CheckCircle,
  RefreshCw,
  Clock,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { formatDate, isOverdue, getDaysRemaining } from "@/lib/utils";
import { toast } from "sonner";

export function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  // New Issue Modal state
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const refreshData = () => {
    setTransactions(getTransactions());
    setBooks(getBooks());
    setMembers(getMembers());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleOpenIssue = () => {
    const availableBooks = books.filter((b) => b.availableCopies > 0);
    setSelectedBookId(availableBooks[0]?.id || "");
    setSelectedMemberId(members[0]?.id || "");
    setIsIssueModalOpen(true);
  };

  const handleConfirmIssue = (e) => {
    e.preventDefault();
    if (!selectedBookId || !selectedMemberId) {
      toast.error("Please select both a book and a registered member.");
      return;
    }

    const result = issueBook(selectedBookId, selectedMemberId);
    if (!result) {
      toast.error("Unable to issue book. No copies available!");
      return;
    }

    const b = books.find((x) => x.id === selectedBookId);
    const m = members.find((x) => x.id === selectedMemberId);
    toast.success(`"${b?.title}" successfully issued to ${m?.name}!`);

    setIsIssueModalOpen(false);
    refreshData();
  };

  const handleReturn = (txnId) => {
    const success = returnBook(txnId);
    if (success) {
      toast.success("Book received and returned to shelf inventory!");
      refreshData();
    } else {
      toast.error("Failed to return book.");
    }
  };

  const handleRenew = (txnId) => {
    const success = renewBook(txnId);
    if (success) {
      toast.success("Loan renewed for 14 additional days!");
      refreshData();
    } else {
      toast.error("Failed to renew loan.");
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    const book = books.find((b) => b.id === txn.bookId);
    const member = members.find((m) => m.id === txn.memberId);
    const overdue = txn.status === "active" && isOverdue(txn.dueDate);

    // Tab filter
    if (activeTab === "active" && txn.status !== "active") return false;
    if (activeTab === "overdue" && (!overdue || txn.status !== "active")) return false;
    if (activeTab === "returned" && txn.status !== "returned") return false;

    // Search filter
    const q = searchQuery.toLowerCase();
    const matchBook = book?.title?.toLowerCase().includes(q);
    const matchMember = member?.name?.toLowerCase().includes(q);
    const matchPhone = member?.phone?.toLowerCase().includes(q);

    return matchBook || matchMember || matchPhone || !q;
  });

  const availableBooksForIssue = books.filter((b) => b.availableCopies > 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/80 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Circulation Desk
            </h1>
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
              {transactions.filter((t) => t.status === "active").length} Active Loans
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Book issue desk, returns receiving, and 14-day loan renewals.
          </p>
        </div>

        <Button
          onClick={handleOpenIssue}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer shadow-xs h-9 sm:h-8 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Issue Book to Member
        </Button>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "active", label: "Active Loans" },
            { id: "overdue", label: "Overdue Only" },
            { id: "returned", label: "Returned History" },
            { id: "all", label: "All Transactions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 min-h-[32px] ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by book or member..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200"
          />
        </div>
      </div>

      {/* Circulation Table */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="No circulation records found"
          description="There are currently no transactions matching this filter."
          actionLabel={activeTab !== "all" ? "View All Records" : "Issue First Book"}
          onAction={() => {
            if (activeTab !== "all") setActiveTab("all");
            else handleOpenIssue();
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[720px]">
              <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Book Issued
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Borrower Member
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Issue Date
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Due Date / Timeline
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">
                  Circulation Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((txn) => {
                const book = books.find((b) => b.id === txn.bookId);
                const member = members.find((m) => m.id === txn.memberId);
                const overdue = txn.status === "active" && isOverdue(txn.dueDate);
                const daysRemaining = getDaysRemaining(txn.dueDate);
                const isActive = txn.status === "active";

                return (
                  <TableRow key={txn.id} className="hover:bg-slate-50/60">
                    <TableCell className="py-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                          {book ? book.title : "Unknown Title"}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {book ? `Author: ${book.author}` : "—"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="py-3">
                      <div>
                        <p className="text-xs font-medium text-slate-800">
                          {member ? member.name : "Member"}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {member ? member.phone : "—"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-slate-600 py-3">
                      {formatDate(txn.issuedAt)}
                    </TableCell>

                    <TableCell className="py-3">
                      <div>
                        <p
                          className={`text-xs font-medium ${
                            overdue ? "text-rose-600 font-semibold" : "text-slate-800"
                          }`}
                        >
                          {formatDate(txn.dueDate)}
                        </p>
                        {isActive && (
                          <span
                            className={`text-[10px] font-medium ${
                              overdue
                                ? "text-rose-500 font-semibold"
                                : daysRemaining <= 3
                                ? "text-amber-600"
                                : "text-slate-400"
                            }`}
                          >
                            {overdue
                              ? `Overdue by ${Math.abs(daysRemaining)} days`
                              : `${daysRemaining} days remaining`}
                          </span>
                        )}
                        {!isActive && (
                          <span className="text-[10px] text-slate-400">
                            Returned on {formatDate(txn.returnedAt)}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-3">
                      <StatusBadge
                        status={overdue ? "overdue" : txn.status}
                        label={overdue ? "Overdue" : txn.status === "active" ? "Issued" : "Returned"}
                      />
                    </TableCell>

                    <TableCell className="text-right py-3">
                      {isActive ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => handleRenew(txn.id)}
                            className="text-xs h-7 border-slate-200 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                            title="Extend 14 days"
                          >
                            <RefreshCw className="w-3 h-3 mr-1 text-slate-400" /> Renew
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => handleReturn(txn.id)}
                            className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" /> Return Book
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Complete</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </div>
        </div>
      )}

      {/* Issue Book Modal */}
      <Dialog open={isIssueModalOpen} onOpenChange={setIsIssueModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-900">
              Circulate / Issue Book
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Record a 14-day book loan for a registered library patron.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmIssue} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">
                Select Book from Shelf *
              </Label>
              {availableBooksForIssue.length === 0 ? (
                <p className="text-xs text-rose-600">No copies available in shelf!</p>
              ) : (
                <Select value={selectedBookId} onValueChange={setSelectedBookId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select available book" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {availableBooksForIssue.map((b) => (
                      <SelectItem key={b.id} value={b.id} className="text-xs">
                        {b.title} — {b.author} ({b.availableCopies} left)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">
                Select Registered Member *
              </Label>
              <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Choose borrower" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="text-xs">
                      {m.name} ({m.phone})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs text-blue-900">
              <div className="flex items-center gap-2 font-semibold">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Standard Loan Period: 14 Days</span>
              </div>
              <p className="text-[11px] text-blue-700 mt-1">
                Due date will automatically be set to {formatDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString())}.
              </p>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsIssueModalOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={availableBooksForIssue.length === 0}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Confirm Issue
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
