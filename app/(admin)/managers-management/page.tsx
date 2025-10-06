
"use client";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

// Type definitions
interface Package {
  name: string;
  duration: string;
  price: string;
  status: 'Active' | 'Completed' | 'Expired';
}

interface Achievement {
  name: string;
  description: string;
  points: number;
  icon: string;
  date: string;
  requirement: string;
}

interface Manager {
  id: string;
  fullName: string;
  email: string;
  status: 'Active' | 'Inactive';
  phoneNumber: string;
  
}

const sampleManagers: Manager[] = [
  {
    id: "L001",
    fullName: "Nguyễn Văn An",
    email: "nguyenvanan@gmail.com",
    status: "Active",
    phoneNumber: "0909090909",
   
  },
  {
    id: "L002",
    fullName: "Trần Thị Bình",
    email: "tranthibinh@email.com",
    status: "Active",
    phoneNumber: "0909090909",
    
  },
  {
    id: "L003",
    fullName: "Lê Minh Cường",
    email: "leminhcuong@yahoo.com",
    status: "Inactive",
    phoneNumber: "0909090909",
    
  },
  {
    id: "L004",
    fullName: "Phạm Thu Dung",
    email: "phamthudung@hotmail.com",
    status: "Active",
    phoneNumber: "0909090909",
    
  },
  {
    id: "L005",
    fullName: "Hoàng Văn Em",
    email: "hoangvanem@gmail.com",
    status: "Inactive",
    phoneNumber: "0909090909",
  },
  {
    id: "L006",
    fullName: "Đỗ Thị Hoa",
    email: "dothihoa@gmail.com",
    status: "Active",
    phoneNumber: "0909090909",
    
  },
  {
    id: "L007",
    fullName: "Vũ Minh Khôi",
    email: "vuminhkhoi@yahoo.com",
    status: "Active",
   
    phoneNumber: "0909090909",
    
  },
  {
    id: "L008",
    fullName: "Bùi Thị Lan",
    email: "buithilan@outlook.com",
    status: "Active",
    phoneNumber: "0909090909",
  },
  {
    id: "L009",
    fullName: "Ngô Văn Minh",
    email: "ngovanminh@gmail.com",
    status: "Active",
    phoneNumber: "0909090909",
    
    
  },
    
  
];

const ManagerManagement = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'block' | 'unblock'>('block');
  const [ManagerToAction, setManagerToAction] = useState<Manager | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filter Managers by search and status
  const filteredManagers = sampleManagers.filter(Manager => {
    const matchesName = Manager.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || Manager.status === statusFilter;
    return matchesName && matchesStatus;
  });

  const handleSelectRow = (idx: number) => {
    setSelectedRows(selectedRows.includes(idx)
      ? selectedRows.filter(i => i !== idx)
      : [...selectedRows, idx]);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredManagers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredManagers.map((_, idx) => idx));
    }
  };

  const handleViewDetails = (Manager: Manager) => {
    setSelectedManager(Manager);
    setShowDetailsModal(true);
  };

  const handleBlockUnblock = (Manager: Manager, action: 'block' | 'unblock') => {
    setManagerToAction(Manager);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    // Here you would make the API call to block/unblock the user
    console.log(`${actionType}ing user:`, ManagerToAction);
    setShowConfirmDialog(false);
    setManagerToAction(null);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      setOpenDropdownId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </Button>
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-[250px]"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
       
      </div>
      
      <div className="overflow-x-auto rounded-xl border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f7f9fa]">
              <TableHead>
                <Checkbox
                  checked={selectedRows.length === filteredManagers.length && filteredManagers.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Manager ID</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredManagers.map((Manager, idx) => (
              <TableRow key={Manager.id} className="hover:bg-[#f0f7e6]">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(idx)}
                    onCheckedChange={() => handleSelectRow(idx)}
                    aria-label={`Select row ${idx}`}
                  />
                </TableCell>
                <TableCell className="font-medium text-blue-600">{Manager.id}</TableCell>
                <TableCell className="font-medium">{Manager.fullName}</TableCell>
                <TableCell className="text-gray-600">{Manager.email}</TableCell>
                <TableCell className="text-gray-600">{Manager.phoneNumber}</TableCell>
                
                <TableCell>
                  <Badge 
                    variant={Manager.status === "Active" ? "default" : "secondary"} 
                    className={Manager.status === "Active" ? "bg-green-600 text-white" : "bg-gray-400 text-white"}
                  >
                    {Manager.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="relative dropdown-container">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setOpenDropdownId(openDropdownId === Manager.id ? null : Manager.id)}
                      className="p-1 h-8 w-8 cursor-pointer"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="19" cy="12" r="1"/>
                        <circle cx="5" cy="12" r="1"/>
                      </svg>
                    </Button>
                    
                    {openDropdownId === Manager.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10 ">
                        <div className="py-1 ">
                          <button
                            onClick={() => {
                              handleBlockUnblock(Manager, Manager.status === 'Active' ? 'block' : 'unblock');
                              setOpenDropdownId(null);
                            }}
                            className={`block cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              Manager.status === 'Active' ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            {Manager.status === 'Active' ? (
                              <>
                                <svg width="16" height="16" className="inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <rect x="3" y="11" width="18" height="10" rx="2"/>
                                  <circle cx="12" cy="16" r="1"/>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                Chặn 
                              </>
                            ) : (
                              <>
                                <svg width="16" height="16" className="inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <rect x="3" y="11" width="18" height="10" rx="2"/>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                Unblock User
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination & Info */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div>ACTIVE ManagerS: {filteredManagers.filter(l => l.status === "Active").length}/{filteredManagers.length}</div>
        <div>Rows per page: <span className="font-semibold">10</span> &nbsp; 1-10 of {filteredManagers.length}</div>
      </div>

    

      {/* Confirm Dialog */}
      {showConfirmDialog && ManagerToAction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Confirm {actionType === 'block' ? 'Block' : 'Unblock'} User
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {actionType} <strong>{ManagerToAction.fullName}</strong>? 
              {actionType === 'block' 
                ? ' This will prevent them from accessing the platform.' 
                : ' This will restore their access to the platform.'}
            </p>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmDialog(false)} className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmAction}
                className={actionType === 'block' ? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-green-600 hover:bg-green-700 cursor-pointer'}
              >
                {actionType === 'block' ? 'Block User' : 'Unblock User'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerManagement;
