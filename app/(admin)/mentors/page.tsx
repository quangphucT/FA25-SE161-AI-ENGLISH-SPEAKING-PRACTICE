
"use client";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const sampleAccounts = [
  {
    name: "Kadin Herwitz",
    email: "kadin.herwitz@example.com",
    description: "Lorem ipsum dolor sit amet, consectetur...",
    rate: 70,
    balance: -270,
    deposit: 500,
    status: "Active",
  },
  {
    name: "Cristofer Korsgaard",
    email: "cristofer.korsgaard@example.com",
    description: "Lorem ipsum dolor sit amet, consectetur...",
    rate: 70,
    balance: 270,
    deposit: 500,
    status: "Active",
  },
  {
    name: "Omar Workman",
    email: "omar.workman@example.com",
    description: "Lorem ipsum dolor sit amet, consectetur...",
    rate: 80,
    balance: -20,
    deposit: 500,
    status: "Inactive",
  },
   {
    name: "Kadin Herwitz",
    email: "kadin.herwitz@example.com",
    description: "Lorem ipsum dolor sit amet, consectetur...",
    rate: 70,
    balance: -270,
    deposit: 500,
    status: "Active",
  },
  {
    name: "Cristofer Korsgaard",
    email: "cristofer.korsgaard@example.com",
    description: "Lorem ipsum dolor sit amet, consectetur...",
    rate: 70,
    balance: 270,
    deposit: 500,
    status: "Active",
  },
  {
    name: "Omar Workman",
    email: "omar.workman@example.com",
    description: "Lorem ipsum dolor sit amet, consectetur...",
    rate: 80,
    balance: -20,
    deposit: 500,
    status: "Inactive",
  },
  {
    name: "Tatiana Westervelt",
    email: "tatiana.westervelt@example.com",
    description: "Lorem ipsum dolor sit amet, consectetur...",
    rate: 70,
    balance: 600,
    deposit: 500,
    status: "Inactive",
  },
  {
    name: "Cristofer Korsgaard",
    email: "cristofer.korsgaard@example.com",
    description: "Lorem ipsum dolor sit amet, consectetur...",
    rate: 70,
    balance: 270,
    deposit: 500,
    status: "Active",
  },
  {
    name: "Omar Workman",
    email: "omar.workman@example.com",
    description: "Lorem ipsum dolor sit amet, consectetur...",
    rate: 80,
    balance: -20,
    deposit: 500,
    status: "Inactive",
  },
  {
    name: "Tatiana Westervelt",
    email: "tatiana.westervelt@example.com",
    description: "Lorem ipsum dolor sit amet, consectetur...",
    rate: 70,
    balance: 600,
    deposit: 500,
    status: "Inactive",
  },
];

const MentorManagement = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  // Filter accounts by search
  const filteredAccounts = sampleAccounts.filter(
    acc => acc.name.toLowerCase().includes(search.toLowerCase()) || acc.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectRow = (idx: number) => {
    setSelectedRows(selectedRows.includes(idx)
      ? selectedRows.filter(i => i !== idx)
      : [...selectedRows, idx]);
  };
  const handleSelectAll = () => {
    if (selectedRows.length === filteredAccounts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredAccounts.map((_, idx) => idx));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </Button>
          <Input
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-[220px]"
          />
        </div>
        <Button className="bg-[#1976d2] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#1565c0]">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline mr-2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
          Add Customer
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f7f9fa]">
              <TableHead>
                <Checkbox
                  checked={selectedRows.length === filteredAccounts.length && filteredAccounts.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Deposit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.map((acc, idx) => (
              <TableRow key={idx} className="hover:bg-[#f0f7e6]">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(idx)}
                    onCheckedChange={() => handleSelectRow(idx)}
                    aria-label={`Select row ${idx}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {acc.name}
                  <div className="text-xs text-gray-400">{acc.email}</div>
                </TableCell>
                <TableCell>{acc.description}</TableCell>
                <TableCell>{acc.rate} <span className="text-xs text-gray-400">INR</span></TableCell>
                <TableCell className={acc.balance < 0 ? "text-red-600" : "text-green-600"}>{acc.balance} <span className="text-xs text-gray-400">INR</span></TableCell>
                <TableCell>{acc.deposit} <span className="text-xs text-gray-400">INR</span></TableCell>
                <TableCell>
                  <Badge variant={acc.status === "Active" ? "default" : "secondary"} className={acc.status === "Active" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"}>
                    {acc.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-center space-x-2">
                  <Button variant="ghost" size="icon" aria-label="Edit"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg></Button>
                  <Button variant="ghost" size="icon" aria-label="Delete"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/></svg></Button>
                  <Button variant="ghost" size="icon" aria-label="More"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination & Info */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div>ACTIVE CUSTOMERS: {filteredAccounts.filter(a => a.status === "Active").length}/{filteredAccounts.length}</div>
        <div>Rows per page: <span className="font-semibold">10</span> &nbsp; 1-10 of {filteredAccounts.length}</div>
      </div>
    </div>
  );
};

export default MentorManagement;
