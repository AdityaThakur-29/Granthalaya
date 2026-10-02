import React, { useState, useEffect } from "react";
import {
  getMembers,
  addMember,
  updateMember,
  getTransactions,
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
  Users,
  Plus,
  Search,
  Edit2,
  Phone,
  Mail,
  UserCheck,
  UserX,
} from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";
import { toast } from "sonner";

export function Members() {
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const refreshData = () => {
    setMembers(getMembers());
    setTransactions(getTransactions());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setName("");
    setEmail("");
    setPhone("+91 ");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (m) => {
    setEditingMember(m);
    setName(m.name);
    setEmail(m.email || "");
    setPhone(m.phone || "");
    setIsDialogOpen(true);
  };

  const handleSaveMember = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and Phone number are required.");
      return;
    }

    if (editingMember) {
      updateMember(editingMember.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      toast.success(`Updated member "${name}"!`);
    } else {
      addMember({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      toast.success(`Registered new member "${name}"!`);
    }

    setIsDialogOpen(false);
    refreshData();
  };

  const handleToggleStatus = (m) => {
    const nextStatus = m.status === "active" ? "inactive" : "active";
    updateMember(m.id, { status: nextStatus });
    toast.success(`Member status set to ${nextStatus}.`);
    refreshData();
  };

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.phone && m.phone.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Member Directory
            </h1>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {members.length} Patrons
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registered citizens, contact records, and active borrowing limits.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Register Member
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by member name, phone (+91), or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200"
          />
        </div>
      </div>

      {/* Table */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members match search"
          description="Try a different query or register a new reader."
          actionLabel="Clear Search"
          onAction={() => setSearchQuery("")}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Patron Name
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Phone
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Email
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Joined Date
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-600">
                  Current Loans
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
              {filteredMembers.map((m) => {
                const activeLoansCount = transactions.filter(
                  (t) => t.memberId === m.id && t.status === "active"
                ).length;

                return (
                  <TableRow key={m.id} className="hover:bg-slate-50/60">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200">
                          {getInitials(m.name)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            {m.name}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400">
                            ID: {m.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-slate-700 py-3 font-mono">
                      {m.phone || "—"}
                    </TableCell>

                    <TableCell className="text-xs text-slate-600 py-3">
                      {m.email || "—"}
                    </TableCell>

                    <TableCell className="text-xs text-slate-600 py-3">
                      {formatDate(m.memberSince)}
                    </TableCell>

                    <TableCell className="text-xs py-3">
                      <span
                        className={`font-semibold ${
                          activeLoansCount > 0 ? "text-blue-600" : "text-slate-400"
                        }`}
                      >
                        {activeLoansCount} book(s)
                      </span>
                    </TableCell>

                    <TableCell className="py-3">
                      <StatusBadge
                        status={m.status || "active"}
                        label={m.status === "inactive" ? "Inactive" : "Active Member"}
                      />
                    </TableCell>

                    <TableCell className="text-right py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleOpenEdit(m)}
                          className="text-xs text-slate-600 hover:text-blue-600 cursor-pointer h-7 w-7 p-0"
                          title="Edit Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleToggleStatus(m)}
                          className={`text-xs cursor-pointer h-7 px-2 ${
                            m.status === "inactive"
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          }`}
                          title="Toggle Active / Inactive"
                        >
                          {m.status === "inactive" ? (
                            <UserCheck className="w-3.5 h-3.5" />
                          ) : (
                            <UserX className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Register / Edit Member Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-900">
              {editingMember ? "Edit Member Information" : "Register New Patron"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Register citizens for lending privileges at the local library branch.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveMember} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">Full Name *</Label>
              <Input
                required
                placeholder="e.g. Vikramaditya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">
                Phone Number (with WhatsApp/SMS) *
              </Label>
              <Input
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">
                Email Address (Optional)
              </Label>
              <Input
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-xs"
              />
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
                {editingMember ? "Update Record" : "Register Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
