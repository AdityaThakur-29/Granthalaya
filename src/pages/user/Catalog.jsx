import React, { useState, useEffect } from "react";
import { getBooks, createReservation, getMembers } from "@/data/store";
import { BookCard } from "@/components/book-card";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function Catalog() {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Reservation Dialog state
  const [reservingBook, setReservingBook] = useState(null);
  const [memberId, setMemberId] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [notes, setNotes] = useState("");

  const refreshData = () => {
    setBooks(getBooks());
    setMembers(getMembers());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const categories = [
    "all",
    ...new Set(books.map((b) => b.category).filter(Boolean)),
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.isbn && book.isbn.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;

    const matchesAvailability = availableOnly ? book.availableCopies > 0 : true;

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const handleOpenReserve = (book) => {
    setReservingBook(book);
    setMemberId(members[0]?.id || "");
    setVisitorName("");
    setNotes("");
  };

  const handleConfirmReservation = (e) => {
    e.preventDefault();
    if (!reservingBook) return;

    if (!memberId && !visitorName.trim()) {
      toast.error("Please select a registered member or enter a visitor name.");
      return;
    }

    createReservation({
      bookId: reservingBook.id,
      memberId: memberId || null,
      visitorName: visitorName.trim() || null,
      notes: notes.trim(),
    });

    toast.success(`Reservation placed for "${reservingBook.title}"!`);
    setReservingBook(null);
    refreshData();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/80 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Library Catalog
            </h1>
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
              {books.length} Titles
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse and reserve classic literature, biographies, and regional Indian books.
          </p>
        </div>

        {/* Quick stat */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-left sm:text-right">
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Currently In-Shelf</span>
            <p className="text-base sm:text-lg font-bold text-emerald-600">
              {books.reduce((acc, b) => acc + (b.availableCopies || 0), 0)} Copies
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 sm:h-9 text-xs bg-slate-50/50 border-slate-200 focus:bg-white"
          />
        </div>

        {/* Category Pills & Availability */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center overflow-x-auto gap-1.5 py-1 scrollbar-none max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium capitalize transition-colors cursor-pointer shrink-0 min-h-[34px] flex items-center ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Button
            variant={availableOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setAvailableOnly(!availableOnly)}
            className="text-xs h-9 sm:h-8 border-slate-200 cursor-pointer shrink-0 w-full sm:w-auto"
          >
            {availableOnly ? "Showing Available Only" : "Show All Statuses"}
          </Button>
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No books match your criteria"
          description="Try clearing your search query or switching to another category."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery("");
            setSelectedCategory("all");
            setAvailableOnly(false);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onQuickReserve={handleOpenReserve}
            />
          ))}
        </div>
      )}

      {/* Quick Reserve Dialog */}
      <Dialog open={!!reservingBook} onOpenChange={(open) => !open && setReservingBook(null)}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Reserve Book
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Hold a copy of this book. The library team will prepare it for pickup.
            </DialogDescription>
          </DialogHeader>

          {reservingBook && (
            <form onSubmit={handleConfirmReservation} className="space-y-4 py-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <p className="text-xs font-bold text-slate-900">{reservingBook.title}</p>
                <p className="text-[11px] text-slate-500">by {reservingBook.author}</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">
                  {reservingBook.availableCopies} copy(ies) available right now
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">
                  Select Registered Member
                </Label>
                <Select value={memberId} onValueChange={setMemberId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Choose a member" />
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
                    OR Walk-in Visitor Name
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">
                  Visitor Name (If non-registered)
                </Label>
                <Input
                  placeholder="e.g. Ramesh Chandra"
                  value={visitorName}
                  onChange={(e) => {
                    setVisitorName(e.target.value);
                    if (e.target.value) setMemberId("");
                  }}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">
                  Special Notes / Preferred Pickup Time (Optional)
                </Label>
                <Input
                  placeholder="e.g. Will collect today after 4 PM"
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
                  onClick={() => setReservingBook(null)}
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Confirm Reservation
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
