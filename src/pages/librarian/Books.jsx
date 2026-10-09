import React, { useState, useEffect } from "react";
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  BookOpen,
  Edit2,
  Trash2,
  Layers,
  Filter,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES = [
  "Fiction",
  "Classic",
  "Biography",
  "History",
  "Poetry",
  "Mythology",
  "Non-Fiction",
  "Science",
  "Philosophy",
];

const PALETTE = [
  "#2563EB",
  "#DC2626",
  "#16A34A",
  "#D97706",
  "#7C3AED",
  "#DB2777",
  "#0891B2",
  "#EA580C",
];

export function Books() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Add / Edit Modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [totalCopies, setTotalCopies] = useState(3);
  const [coverColor, setCoverColor] = useState(PALETTE[0]);
  const [pdfUrl, setPdfUrl] = useState("");

  // Delete Alert state
  const [deletingId, setDeletingId] = useState(null);

  const refreshData = () => {
    setBooks(getBooks());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleOpenAdd = () => {
    setEditingBook(null);
    setTitle("");
    setAuthor("");
    setIsbn("");
    setCategory("Fiction");
    setTotalCopies(3);
    setCoverColor(PALETTE[Math.floor(Math.random() * PALETTE.length)]);
    setPdfUrl("");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn || "");
    setCategory(book.category || "Fiction");
    setTotalCopies(book.totalCopies || 1);
    setCoverColor(book.coverColor || PALETTE[0]);
    setPdfUrl(book.pdfUrl || "");
    setIsDialogOpen(true);
  };

  const handleSaveBook = (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      toast.error("Title and Author are required.");
      return;
    }

    const numCopies = parseInt(totalCopies, 10) || 1;

    if (editingBook) {
      // Calculate adjusted available copies
      const diff = numCopies - editingBook.totalCopies;
      const newAvailable = Math.max(0, (editingBook.availableCopies || 0) + diff);

      updateBook(editingBook.id, {
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        category,
        totalCopies: numCopies,
        availableCopies: newAvailable,
        coverColor,
        pdfUrl: pdfUrl.trim() || null,
      });
      toast.success(`Updated "${title}"!`);
    } else {
      addBook({
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        category,
        totalCopies: numCopies,
        coverColor,
        pdfUrl: pdfUrl.trim() || null,
      });
      toast.success(`Added "${title}" to library catalog!`);
    }

    setIsDialogOpen(false);
    refreshData();
  };

  const handleDeleteBook = () => {
    if (!deletingId) return;
    deleteBook(deletingId);
    toast.success("Book removed from catalogue.");
    setDeletingId(null);
    refreshData();
  };

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.isbn && b.isbn.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      categoryFilter === "all" || b.category === categoryFilter;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/80 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Book Inventory & Catalogue
            </h1>
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
              {books.length} Titles
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage catalogue, update physical copy counts, and catalog new acquisitions.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer shadow-xs h-9 sm:h-8 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add New Book
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 w-full sm:w-auto min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search titles, authors, ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Category:</span>
          {["all", ...CATEGORIES.slice(0, 5)].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium capitalize transition-colors cursor-pointer shrink-0 ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filteredBooks.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No books match this search"
          description="Try changing the search keyword or add a new title to the system."
          actionLabel="Clear Filter"
          onAction={() => {
            setSearchQuery("");
            setCategoryFilter("all");
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[700px]">
              <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Book Title
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Author
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Category
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  ISBN
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Copies (Avail / Total)
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((b) => {
                const isAvail = b.availableCopies > 0;
                return (
                  <TableRow key={b.id} className="hover:bg-slate-50/60">
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3.5 h-7 rounded-xs shrink-0 shadow-2xs"
                              style={{ backgroundColor: b.coverColor || "#2563EB" }}
                            />
                            <div>
                              <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                                {b.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-slate-400">
                                  Added: {formatDate(b.addedAt)}
                                </span>
                                {b.pdfUrl && (
                                  <a
                                    href={b.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-[10px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200"
                                    title="Read online copy"
                                  >
                                    <BookOpen className="w-2.5 h-2.5 mr-0.5" /> Read Online
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                    <TableCell className="text-xs text-slate-700 py-3 font-medium">
                      {b.author}
                    </TableCell>

                    <TableCell className="text-xs py-3">
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        {b.category}
                      </span>
                    </TableCell>

                    <TableCell className="text-xs font-mono text-slate-500 py-3">
                      {b.isbn || "—"}
                    </TableCell>

                    <TableCell className="text-xs py-3">
                      <span className="font-semibold text-slate-800">
                        <span className={isAvail ? "text-emerald-600" : "text-rose-600"}>
                          {b.availableCopies}
                        </span>{" "}
                        / {b.totalCopies}
                      </span>
                    </TableCell>

                    <TableCell className="py-3">
                      <StatusBadge
                        status={isAvail ? "available" : "out_of_stock"}
                        label={isAvail ? "In Stock" : "Checked Out"}
                      />
                    </TableCell>

                    <TableCell className="text-right py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleOpenEdit(b)}
                          className="text-xs text-slate-600 hover:text-blue-600 cursor-pointer h-7 w-7 p-0"
                          title="Edit Book"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setDeletingId(b.id)}
                          className="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer h-7 w-7 p-0"
                          title="Delete Book"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
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

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-900">
              {editingBook ? "Edit Book Record" : "Add New Book to Catalogue"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Fill in the book information to keep the digital inventory accurate.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveBook} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">Book Title *</Label>
              <Input
                required
                placeholder="e.g. Discovery of India"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">Author *</Label>
                <Input
                  required
                  placeholder="e.g. Jawaharlal Nehru"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">ISBN Code</Label>
                <Input
                  placeholder="978-XXXXXXXXXX"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">
                  E-Book / PDF URL (Read Online)
                </Label>
                <Input
                  type="url"
                  placeholder="https://... (Direct online PDF link)"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">Category</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">
                  Total Physical Copies *
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={totalCopies}
                  onChange={(e) => setTotalCopies(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Spine Color Theme */}
            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-medium text-slate-700">
                Spine Color Accent
              </Label>
              <div className="flex items-center gap-2">
                {PALETTE.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setCoverColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                      coverColor === color ? "scale-120 border-slate-900" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                {editingBook ? "Save Changes" : "Add to Library"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              Remove book from catalogue?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              This will remove the title and its records from the system. If copies are currently borrowed, ensure they are accounted for.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="text-xs cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBook}
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
