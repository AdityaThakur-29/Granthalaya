import React, { useState, useEffect } from "react";
import {
  getBooks,
  getMembers,
  createReservation,
  issueBook,
  getTransactions,
  getReservations,
} from "@/data/store";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserCheck,
  Search,
  BookOpen,
  CheckCircle,
  Clock,
  Printer,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export function Assisted() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Kiosk Form 1: Visitor Hold Slip
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorBookId, setVisitorBookId] = useState("");
  const [latestToken, setLatestToken] = useState(null);

  // Kiosk Form 2: Express Member Issue
  const [expressMemberId, setExpressMemberId] = useState("");
  const [expressBookId, setExpressBookId] = useState("");

  const refreshData = () => {
    setBooks(getBooks());
    setMembers(getMembers());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleVisitorHold = (e) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorBookId) {
      toast.error("Please enter visitor name and select a book.");
      return;
    }

    const res = createReservation({
      bookId: visitorBookId,
      visitorName: `${visitorName.trim()} (${visitorPhone.trim() || "No phone"})`,
      notes: "Walk-in kiosk token",
    });

    const booked = books.find((b) => b.id === visitorBookId);

    const tokenReceipt = {
      tokenId: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      name: visitorName,
      phone: visitorPhone,
      bookTitle: booked?.title || "Book",
      author: booked?.author || "",
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };

    setLatestToken(tokenReceipt);
    toast.success(`Hold token ${tokenReceipt.tokenId} created for ${visitorName}!`);

    setVisitorName("");
    setVisitorPhone("");
    setVisitorBookId("");
    refreshData();
  };

  const handleExpressIssue = (e) => {
    e.preventDefault();
    if (!expressMemberId || !expressBookId) {
      toast.error("Please select both a registered member and a book.");
      return;
    }

    const res = issueBook(expressBookId, expressMemberId);
    if (!res) {
      toast.error("Could not issue. No physical copies available in shelf!");
      return;
    }

    const m = members.find((x) => x.id === expressMemberId);
    const b = books.find((x) => x.id === expressBookId);

    toast.success(`Express Issue complete: "${b?.title}" issued to ${m?.name}!`);
    setExpressBookId("");
    refreshData();
  };

  const availableBooks = books.filter((b) => b.availableCopies > 0);

  const searchedBooks = books.filter((b) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      (b.isbn && b.isbn.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/80 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Assisted Walk-in Kiosk
            </h1>
            <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full border border-purple-200">
              Citizen Self-Help
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Streamlined interface for non-digital patrons, walk-in visitors, and express counter loans.
          </p>
        </div>
      </div>

      {/* Quick Lookup Bar */}
      <Card className="border border-slate-200/90 bg-white shadow-2xs">
        <CardContent className="p-5">
          <Label className="text-xs font-semibold text-slate-700 mb-2 block">
            Instant Shelf Availability Scanner
          </Label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search catalogue in real-time (type 'Narayan', 'Gitanjali', 'Physics')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs bg-slate-50/50 border-slate-200"
            />
          </div>

          {searchQuery.trim() && (
            <div className="mt-3 border rounded-lg divide-y divide-slate-100 max-h-56 overflow-y-auto bg-slate-50/30">
              {searchedBooks.length === 0 ? (
                <p className="p-3 text-xs text-slate-400 italic text-center">
                  No matching titles found in the physical collection.
                </p>
              ) : (
                searchedBooks.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 flex items-center justify-between hover:bg-white text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{b.title}</span>
                      <span className="text-slate-500 ml-2">by {b.author}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Shelf Category: {b.category} | ISBN: {b.isbn || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-semibold ${
                          b.availableCopies > 0 ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {b.availableCopies} of {b.totalCopies} on shelf
                      </span>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          setVisitorBookId(b.id);
                          setExpressBookId(b.id);
                          toast.info(`Selected "${b.title}" in forms below.`);
                        }}
                        className="text-xs h-7 border-slate-200 cursor-pointer"
                      >
                        Select Title
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two Column Layout: Walk-in Visitor Hold Token vs Express Member Issue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form 1: Visitor Hold Token */}
        <Card className="border border-slate-200/90 bg-white shadow-2xs">
          <CardHeader className="p-5 pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-amber-500" />
              Walk-in Visitor Hold Token
            </CardTitle>
            <p className="text-xs text-slate-500">
              For visiting citizens without permanent library ID cards.
            </p>
          </CardHeader>
          <CardContent className="p-5">
            <form onSubmit={handleVisitorHold} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">Visitor Name *</Label>
                <Input
                  required
                  placeholder="e.g. Anand Kumar"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">
                  Mobile Number (for SMS confirmation)
                </Label>
                <Input
                  placeholder="+91 98230 XXXXX"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">
                  Select Book to Hold *
                </Label>
                <Select value={visitorBookId} onValueChange={setVisitorBookId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Choose title" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {availableBooks.map((b) => (
                      <SelectItem key={b.id} value={b.id} className="text-xs">
                        {b.title} ({b.availableCopies} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                size="sm"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs cursor-pointer h-9"
              >
                Generate Hold Slip & Queue
              </Button>
            </form>

            {/* Generated Token Slip Preview */}
            {latestToken && (
              <div className="mt-5 p-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Printer className="w-3.5 h-3.5 text-amber-700" />
                    Counter Hold Token
                  </span>
                  <span className="font-mono font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200">
                    {latestToken.tokenId}
                  </span>
                </div>
                <div className="space-y-1 text-slate-700">
                  <p>
                    <span className="text-slate-500">Citizen:</span>{" "}
                    <strong>{latestToken.name}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">Book Held:</span>{" "}
                    <strong>{latestToken.bookTitle}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">Generated:</span> {latestToken.time} today
                  </p>
                </div>
                <p className="text-[10px] text-amber-700 italic pt-1">
                  Present this token number at the pickup window within 48 hours.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form 2: Express Member Issue */}
        <Card className="border border-slate-200/90 bg-white shadow-2xs">
          <CardHeader className="p-5 pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Express 1-Click Member Issue
            </CardTitle>
            <p className="text-xs text-slate-500">
              Rapid checkout for registered patrons present in person.
            </p>
          </CardHeader>
          <CardContent className="p-5">
            <form onSubmit={handleExpressIssue} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">
                  Select Registered Patron *
                </Label>
                <Select value={expressMemberId} onValueChange={setExpressMemberId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Choose registered patron" />
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

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">
                  Select Book from In-Shelf Inventory *
                </Label>
                <Select value={expressBookId} onValueChange={setExpressBookId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Choose physical title" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {availableBooks.map((b) => (
                      <SelectItem key={b.id} value={b.id} className="text-xs">
                        {b.title} — {b.author} ({b.availableCopies} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-xs text-emerald-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Instant Physical Receipt
                </div>
                <p className="text-[11px] text-emerald-700">
                  Stock is automatically decremented and 14-day due date is logged.
                </p>
              </div>

              <Button
                type="submit"
                size="sm"
                disabled={availableBooks.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer h-9"
              >
                Instant Checkout Book
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
