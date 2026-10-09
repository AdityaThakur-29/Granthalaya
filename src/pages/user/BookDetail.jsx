import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getBookById,
  getTransactions,
  getReservations,
  getMembers,
  createReservation,
} from "@/data/store";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Hash,
  Layers,
  Clock,
  User,
  ShieldAlert,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

export function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [members, setMembers] = useState([]);
  const [activeTxns, setActiveTxns] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);

  // Reservation dialog
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [notes, setNotes] = useState("");

  const refreshData = () => {
    const b = getBookById(id);
    if (!b) {
      toast.error("Book not found");
      navigate("/catalog");
      return;
    }
    setBook(b);
    setMembers(getMembers());

    // Filter transactions and reservations for this book
    const txns = getTransactions().filter(
      (t) => t.bookId === id && t.status === "active"
    );
    setActiveTxns(txns);

    const res = getReservations().filter(
      (r) => r.bookId === id && r.status === "pending"
    );
    setPendingReservations(res);
  };

  useEffect(() => {
    refreshData();
  }, [id]);

  if (!book) return null;

  const isAvailable = book.availableCopies > 0;

  const handleReserve = (e) => {
    e.preventDefault();
    if (!selectedMemberId && !visitorName.trim()) {
      toast.error("Please specify a member or visitor name");
      return;
    }

    createReservation({
      bookId: book.id,
      memberId: selectedMemberId || null,
      visitorName: visitorName.trim() || null,
      notes: notes.trim(),
    });

    toast.success(`Book reserved successfully for ${visitorName || "registered member"}!`);
    setIsReserveOpen(false);
    refreshData();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-5 sm:space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/catalog"
          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-900 -ml-2 px-2 py-1 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Catalog
        </Link>
      </div>

      {/* Main Detail Header Card */}
      <Card className="border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <CardContent className="p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
            {/* Book Cover Image with Spine Fallback */}
            <div className="w-36 h-52 sm:w-40 sm:h-56 rounded-xl shrink-0 overflow-hidden shadow-md border border-slate-200/90 bg-slate-100 mx-auto md:mx-0 relative">
              {book.coverImage && (
                <img
                  src={book.coverImage.replace("-M.jpg", "-L.jpg")}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    if (e.currentTarget.src.includes("-L.jpg")) {
                      e.currentTarget.src = book.coverImage;
                    } else {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove("hidden");
                    }
                  }}
                />
              )}
              <div
                className={cn(
                  "w-full h-full flex flex-col justify-between p-4 rounded-xl border border-black/10",
                  book.coverImage ? "hidden" : "flex"
                )}
                style={{ backgroundColor: book.coverColor || "#2563EB" }}
              >
                <div className="w-full h-1.5 bg-white/40 rounded-full" />
                <div className="text-center space-y-2">
                  <BookOpen className="w-8 h-8 text-white/90 mx-auto" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                    {book.category}
                  </p>
                </div>
                <div className="text-[9px] text-white/70 font-mono text-center">
                  GRANTHALAYA
                </div>
              </div>
            </div>

            {/* Info details */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {book.category}
                  </span>
                  {book.pdfUrl && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" /> Digital E-Book Available
                    </span>
                  )}
                </div>
                <StatusBadge
                  status={isAvailable ? "available" : "out_of_stock"}
                  label={
                    isAvailable
                      ? `${book.availableCopies} Copies Available`
                      : "All Copies Checked Out"
                  }
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {book.title}
                </h1>
                <p className="text-sm font-medium text-slate-600 mt-1">
                  Author: <span className="text-slate-900">{book.author}</span>
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-y border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    ISBN
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-700">
                    {book.isbn || "Not Catalogued"}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Total Copies
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {book.totalCopies} units
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Currently In-Shelf
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isAvailable ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {book.availableCopies} available
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Catalog Date
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {formatDate(book.addedAt)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 flex-wrap">
                {book.pdfUrl && (
                  <a
                    href={book.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-10 sm:h-9 px-4 rounded-lg shadow-xs font-medium cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span>Read Book Online</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
                  </a>
                )}
                <Button
                  onClick={() => setIsReserveOpen(true)}
                  disabled={!isAvailable}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-10 sm:h-9 px-5 cursor-pointer justify-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Reserve Physical Copy
                </Button>
                <Link
                  to="/assisted"
                  className="inline-flex items-center justify-center text-xs font-medium h-10 sm:h-9 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                >
                  Issue at Kiosk
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Digital E-Book Highlight Banner */}
      {book.pdfUrl && (
        <Card className="border border-emerald-200 bg-gradient-to-r from-emerald-50/70 via-white to-blue-50/40 shadow-xs">
          <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> Digital E-Book Edition Available
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Read "{book.title}" Online
              </h3>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                A digitized online edition of this book is available for free reading. Open the full text immediately in your browser without waiting for physical shelf returns.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-10 px-4 rounded-lg shadow-xs font-medium cursor-pointer w-full sm:w-auto shrink-0 transition-colors whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Read Book Online</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Copy Status / Active Circulation Insight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Active Issues */}
        <Card className="border border-slate-200/90 bg-white shadow-2xs">
          <CardContent className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Active Borrowings ({activeTxns.length})
            </h3>
            {activeTxns.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No active loans for this title currently. All physical copies are on shelf.
              </p>
            ) : (
              <div className="space-y-2.5">
                {activeTxns.map((txn) => {
                  const member = members.find((m) => m.id === txn.memberId);
                  return (
                    <div
                      key={txn.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {member ? member.name : "Member"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Issued on {formatDate(txn.issuedAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 block">Due Date</span>
                        <span className="font-medium text-slate-800">
                          {formatDate(txn.dueDate)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Queued Reservations */}
        <Card className="border border-slate-200/90 bg-white shadow-2xs">
          <CardContent className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              Pending Reservations ({pendingReservations.length})
            </h3>
            {pendingReservations.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No pending reservations for this book. Ready for immediate checkout!
              </p>
            ) : (
              <div className="space-y-2.5">
                {pendingReservations.map((r) => {
                  const member = members.find((m) => m.id === r.memberId);
                  return (
                    <div
                      key={r.id}
                      className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {r.visitorName || (member ? member.name : "Member")}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Requested on {formatDate(r.reservedAt)}
                        </p>
                      </div>
                      <StatusBadge status="pending" label="Waiting Approval" />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reservation Dialog */}
      <Dialog open={isReserveOpen} onOpenChange={setIsReserveOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-900">
              Hold "{book.title}"
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Submit a hold request for pickup at the front circulation desk.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReserve} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">
                Registered Library Member
              </Label>
              <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Choose registered member" />
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold">
                  OR New Visitor
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">
                Visitor Full Name
              </Label>
              <Input
                placeholder="e.g. Sumanth Deshmukh"
                value={visitorName}
                onChange={(e) => {
                  setVisitorName(e.target.value);
                  if (e.target.value) setSelectedMemberId("");
                }}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">
                Pickup Notes
              </Label>
              <Input
                placeholder="e.g. Collecting Saturday morning"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsReserveOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Confirm Hold
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
