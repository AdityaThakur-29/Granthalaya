import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getBooks,
  getMembers,
  getTransactions,
  getReservations,
} from "@/data/store";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  CheckCircle,
  Repeat,
  AlertTriangle,
  CalendarClock,
  Users,
  Plus,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { formatDate, isOverdue } from "@/lib/utils";

export function Dashboard() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    setBooks(getBooks());
    setMembers(getMembers());
    setTransactions(getTransactions());
    setReservations(getReservations());
  }, []);

  const totalTitles = books.length;
  const totalPhysicalCopies = books.reduce((acc, b) => acc + (b.totalCopies || 0), 0);
  const totalAvailableCopies = books.reduce((acc, b) => acc + (b.availableCopies || 0), 0);
  const activeTxns = transactions.filter((t) => t.status === "active");
  const overdueTxns = activeTxns.filter((t) => isOverdue(t.dueDate));
  const pendingReservations = reservations.filter((r) => r.status === "pending");
  const totalMembers = members.length;

  const recentTransactions = [...transactions].reverse().slice(0, 5);
  const pendingQueue = reservations.filter((r) => r.status === "pending").slice(0, 5);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-7">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Librarian Command Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time branch statistics, circulation metrics, and operational queue.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/transactions"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium h-8 px-3 rounded-lg transition-colors cursor-pointer"
          >
            <Repeat className="w-3.5 h-3.5 mr-1.5" /> Issue / Return
          </Link>
          <Link
            to="/books"
            className="inline-flex items-center text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-8 px-3 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Book
          </Link>
          <Link
            to="/assisted"
            className="inline-flex items-center text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-8 px-3 rounded-lg transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 mr-1" /> Walk-in Kiosk
          </Link>
        </div>
      </div>

      {/* Overdue Warning Alert Banner if any overdue */}
      {overdueTxns.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-900">
                Action Required: {overdueTxns.length} Overdue Book(s)
              </h4>
              <p className="text-[11px] text-rose-700">
                Some borrowers have crossed their 14-day loan window. Check circulation desk to follow up.
              </p>
            </div>
          </div>
          <Link
            to="/transactions"
            className="inline-flex items-center text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white h-7 px-3 rounded-md transition-colors cursor-pointer"
          >
            Review Overdues
          </Link>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Catalog Titles"
          value={totalTitles}
          subtitle={`${totalPhysicalCopies} total copies`}
          icon={BookOpen}
          color="blue"
        />

        <StatCard
          title="In Shelf"
          value={totalAvailableCopies}
          subtitle="Available for loan"
          icon={CheckCircle}
          color="emerald"
          badgeText="Ready"
          badgeVariant="success"
        />

        <StatCard
          title="Active Loans"
          value={activeTxns.length}
          subtitle="Currently issued"
          icon={Repeat}
          color="purple"
        />

        <StatCard
          title="Overdue Loans"
          value={overdueTxns.length}
          subtitle="Past 14-day limit"
          icon={AlertTriangle}
          color="rose"
          badgeText={overdueTxns.length > 0 ? "Alert" : "All Clear"}
          badgeVariant={overdueTxns.length > 0 ? "destructive" : "success"}
        />

        <StatCard
          title="Pending Holds"
          value={pendingReservations.length}
          subtitle="Awaiting clearance"
          icon={CalendarClock}
          color="amber"
          badgeText={pendingReservations.length > 0 ? "Needs Review" : "Zero"}
        />

        <StatCard
          title="Members"
          value={totalMembers}
          subtitle="Registered patrons"
          icon={Users}
          color="slate"
        />
      </div>

      {/* Two Column Section: Recent Transactions & Pending Holds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Circulation */}
        <Card className="border border-slate-200/90 bg-white shadow-2xs">
          <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900">
              Recent Transactions
            </CardTitle>
            <Link
              to="/transactions"
              className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/70">
                <TableRow>
                  <TableHead className="text-[11px] font-semibold text-slate-500">Book</TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-500">Member</TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-500">Due Date</TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-500">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((txn) => {
                  const book = books.find((b) => b.id === txn.bookId);
                  const member = members.find((m) => m.id === txn.memberId);
                  const overdue = txn.status === "active" && isOverdue(txn.dueDate);

                  return (
                    <TableRow key={txn.id} className="hover:bg-slate-50/60">
                      <TableCell className="py-2.5">
                        <p className="text-xs font-semibold text-slate-800 truncate max-w-[170px]">
                          {book ? book.title : "Book"}
                        </p>
                        <p className="text-[10px] text-slate-400 capitalize">{txn.type}</p>
                      </TableCell>
                      <TableCell className="text-xs text-slate-700 py-2.5">
                        {member ? member.name : "Member"}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 py-2.5">
                        {formatDate(txn.dueDate)}
                      </TableCell>
                      <TableCell className="py-2.5">
                        <StatusBadge
                          status={overdue ? "overdue" : txn.status}
                          label={overdue ? "Overdue" : txn.status}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pending Reservations Queue */}
        <Card className="border border-slate-200/90 bg-white shadow-2xs">
          <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900">
              Pending Hold Approvals
            </CardTitle>
            <Link
              to="/reservations"
              className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Approval Desk <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {pendingQueue.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 italic">
                No pending holds in queue. All clear!
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/70">
                  <TableRow>
                    <TableHead className="text-[11px] font-semibold text-slate-500">Book</TableHead>
                    <TableHead className="text-[11px] font-semibold text-slate-500">Requester</TableHead>
                    <TableHead className="text-[11px] font-semibold text-slate-500">Requested</TableHead>
                    <TableHead className="text-[11px] font-semibold text-slate-500 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingQueue.map((r) => {
                    const book = books.find((b) => b.id === r.bookId);
                    const member = members.find((m) => m.id === r.memberId);

                    return (
                      <TableRow key={r.id} className="hover:bg-slate-50/60">
                        <TableCell className="py-2.5">
                          <p className="text-xs font-semibold text-slate-800 truncate max-w-[170px]">
                            {book ? book.title : "Book"}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {book ? `${book.availableCopies} available` : ""}
                          </p>
                        </TableCell>
                        <TableCell className="text-xs text-slate-700 py-2.5">
                          {r.visitorName || (member ? member.name : "Member")}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 py-2.5">
                          {formatDate(r.reservedAt)}
                        </TableCell>
                        <TableCell className="text-right py-2.5">
                          <Link
                            to="/reservations"
                            className="inline-flex items-center text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-7 px-2.5 rounded-md transition-colors cursor-pointer"
                          >
                            Review
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
