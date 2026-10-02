import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getBooks,
  getMembers,
  getTransactions,
  getReservations,
} from "@/data/store";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Search,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Repeat,
  Library,
  Users,
  Compass,
  Building2,
  PhoneCall,
} from "lucide-react";

export function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setBooks(getBooks());
    setMembers(getMembers());
    setTransactions(getTransactions());
  }, []);

  const totalCopies = books.reduce((acc, b) => acc + (b.totalCopies || 0), 0);
  const availableCopies = books.reduce((acc, b) => acc + (b.availableCopies || 0), 0);
  const activeLoans = transactions.filter((t) => t.status === "active").length;

  // Featured 3-4 top Indian books
  const featuredBooks = books.slice(0, 3);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/catalog");
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50/50 border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12 sm:pb-20">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Mumbai Initiative Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Brihanmumbai Municipal Corporation (BMC) · Digital Library Initiative</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Modernizing Local Libraries for the{" "}
            <span className="text-blue-600 underline decoration-blue-300 decoration-wavy decoration-2">
              Citizens of Mumbai
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transforming municipal paper registers and manual catalogues into a fast, transparent digital network. Instant book reservations, real-time shelf tracking, and assisted walk-in kiosks across all 24 Mumbai wards.
          </p>

          {/* Hero Instant Catalog Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto bg-white p-2 rounded-2xl border border-slate-200/90 shadow-md flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by title, author, or ISBN (e.g. 'The Guide', 'Kalam')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11 text-xs sm:text-sm border-0 bg-transparent focus-visible:ring-0 shadow-none"
              />
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm rounded-xl cursor-pointer shrink-0"
            >
              Search Catalog
            </Button>
          </form>

          {/* Quick Action Badges / CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs h-9 border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
            >
              <Link to="/catalog">
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Browse All Books
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs h-9 border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
            >
              <Link to="/assisted">
                <UserCheck className="w-3.5 h-3.5 mr-1.5 text-purple-600" /> Walk-in Kiosk
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs h-9 border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
            >
              <Link to="/dashboard">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Librarian Portal
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Live Mumbai Network Counters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="text-center p-3 border-r border-slate-100 last:border-r-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">{books.length}</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Catalogued Titles</div>
          </div>
          <div className="text-center p-3 border-r border-slate-100 last:border-r-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{availableCopies}</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Copies In-Shelf Now</div>
          </div>
          <div className="text-center p-3 border-r border-slate-100 last:border-r-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">{members.length}</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Registered Patrons</div>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">24</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Mumbai Wards Covered</div>
          </div>
        </div>
      </section>

      {/* 3. Featured Literature Highlights */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Collection Spotlight</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              Featured Indian Literary Classics
            </h2>
            <p className="text-xs text-slate-500">
              Handpicked literary treasures available for circulation at the Central Mumbai Reading Room.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer -ml-2 sm:ml-0">
            <Link to="/catalog">
              View All {books.length} Books <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onQuickReserve={(b) => navigate(`/catalog/${b.id}`)}
            />
          ))}
        </div>
      </section>

      {/* 4. The Digital Transformation Story: Before vs After */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Impact & Modernization</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            How Granthalaya Transforms Public Libraries
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Moving away from fragile paper registers and physical queues into a seamless community service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="border border-slate-200/90 bg-white shadow-2xs hover:shadow-sm transition-shadow">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Paperless Catalogue</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Physical index cards are replaced with instant search by author, title, or ISBN. Patrons know exact shelf availability before visiting.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Real-time shelf inventory
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/90 bg-white shadow-2xs hover:shadow-sm transition-shadow">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Repeat className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">1-Click Circulation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manual register ledgers are digitized. Issues, returns, and 14-day loan renewals happen in 1 click with automated overdue detection.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Automated due date alerts
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/90 bg-white shadow-2xs hover:shadow-sm transition-shadow">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Assisted Walk-in Kiosk</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Designed for senior citizens and non-digital walk-ins. Generate queue slips and physical hold tokens at the front desk without an app account.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Inclusive for all citizens
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. Central Mumbai Branch & Ward Reading Rooms */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Badge className="bg-blue-600 text-white border-none text-[11px] font-semibold px-2.5 py-0.5">
                Headquarters Branch
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Mumbai Central Public Library (Fort Campus)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Located near Town Hall in South Mumbai's historic heritage district. Serving students, researchers, and book lovers across Greater Mumbai since 1804.
              </p>

              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Shahid Bhagat Singh Road, Fort, Ward A, Mumbai, Maharashtra 400001</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Mon – Sat: 8:00 AM – 8:00 PM | Sun: 10:00 AM – 4:00 PM</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Branch Desk Helpline: +91 22 2266 1234</span>
                </div>
              </div>
            </div>

            {/* Ward Reading Centers Grid */}
            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Connected Ward Reading Rooms
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60">
                  <p className="font-semibold text-white">Dadar West Reading Room</p>
                  <p className="text-[11px] text-slate-400">Near Shivaji Park, Ward G/North</p>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60">
                  <p className="font-semibold text-white">Bandra Civic Library</p>
                  <p className="text-[11px] text-slate-400">Hill Road, Ward H/West</p>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60">
                  <p className="font-semibold text-white">Andheri East Study Hall</p>
                  <p className="text-[11px] text-slate-400">Near Metro Station, Ward K/East</p>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60">
                  <p className="font-semibold text-white">Chembur Community Center</p>
                  <p className="text-[11px] text-slate-400">Diamond Garden, Ward M/West</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4 pt-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
          Ready to experience the digital public library?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Explore our Indian literature collection or switch to Librarian Admin mode to see live circulation in action.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm h-10 px-6 rounded-xl cursor-pointer"
          >
            <Link to="/catalog">
              Browse Online Catalog <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-slate-200 text-xs sm:text-sm h-10 px-6 rounded-xl bg-white hover:bg-slate-50 cursor-pointer"
          >
            <Link to="/assisted">
              Assisted Counter Kiosk
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
