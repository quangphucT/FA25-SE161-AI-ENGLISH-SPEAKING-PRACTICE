"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Plus, Save, X } from "lucide-react";

const Wallet = () => {
  const totals = {
    totalEarned: "23.000",
    currentBalance: "12.500",
    currency: "VND",
  };
  type Transaction = {
    id: string;
    amount: string;
    createdTransaction: string; // YYYY-MM-DD
    fk: string;
    wallet_id: string;
    bankName: string;
    accountNumber: string;
    reasonWithdrawReject?: string;
    transactionEnum: "Withdraw" | "Reject" | "Pending";
  };

  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [formData, setFormData] = useState<Transaction>({
    id: "",
    amount: "",
    createdTransaction: "",
    fk: "",
    wallet_id: "",
    bankName: "",
    accountNumber: "",
    reasonWithdrawReject: "",
    transactionEnum: "Pending",
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TX001",
      amount: "1,200,000",
      createdTransaction: "2024-01-22",
      fk: "RV001",
      wallet_id: "WAL001",
      bankName: "Vietcombank",
      accountNumber: "1234567890",
      reasonWithdrawReject: "",
      transactionEnum: "Pending",
    },
    {
      id: "TX002",
      amount: "850,000",
      createdTransaction: "2024-01-20",
      fk: "RV002",
      wallet_id: "WAL001",
      bankName: "Techcombank",
      accountNumber: "0987654321",
      reasonWithdrawReject: "",
      transactionEnum: "Withdraw",
    },
    {
      id: "TX003",
      amount: "1,500,000",
      createdTransaction: "2024-01-18",
      fk: "RV003",
      wallet_id: "WAL001",
      bankName: "BIDV",
      accountNumber: "1122334455",
      reasonWithdrawReject: "Hồ sơ thiếu thông tin",
      transactionEnum: "Reject",
    },
  ]);

  const openCreateModal = () => {
    setEditingTransaction(null);
    setFormData({
      id: "",
      amount: "",
      createdTransaction: "",
      fk: "",
      wallet_id: "",
      bankName: "",
      accountNumber: "",
      reasonWithdrawReject: "",
      transactionEnum: "Withdraw",
    });
    setIsAddingTransaction(true);
  };

  const openEditModal = (tx: Transaction) => {
    setEditingTransaction(tx);
    setFormData(tx);
    setIsAddingTransaction(true);
  };

  const handleCancel = () => {
    setIsAddingTransaction(false);
    setEditingTransaction(null);
  };

  const handleInputChange = (field: keyof Transaction, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (editingTransaction) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === editingTransaction.id ? formData : t))
      );
    } else {
      setTransactions((prev) => [formData, ...prev]);
    }
    setIsAddingTransaction(false);
    setEditingTransaction(null);
  };

  return (
    <div className="space-y-6">
      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Số tiền đã kiếm được
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totals.totalEarned} {totals.currency}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="text-purple-600"
                >
                  <path d="M9 11l3 3 8-8" />
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.34 0 2.6.29 3.74.82" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Số dư hiện tại
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totals.currentBalance} {totals.currency}
                </p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="text-emerald-600"
                >
                  <rect x="3" y="7" width="18" height="12" rx="2" ry="2" />
                  <path d="M7 7V5a2 2 0 0 1 2-2h9a3 3 0 0 1 3 3v1" />
                  <circle cx="17" cy="13" r="1" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviewer Transactions (similar to withdrawal requests) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Giao dịch của reviewer</CardTitle>
            <Button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-2xl font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Thêm giao dịch
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{tx.amount} VND</p>
                  <p className="text-sm text-gray-500">
                    {tx.bankName} - {tx.accountNumber}
                  </p>
                  <p className="text-xs text-gray-400">
                    Ngày tạo: {tx.createdTransaction}
                  </p>
                  {tx.reasonWithdrawReject && (
                    <p className="text-xs text-red-500">
                      Lý do từ chối: {tx.reasonWithdrawReject}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      tx.transactionEnum === "Pending"
                        ? "secondary"
                        : tx.transactionEnum === "Withdraw"
                        ? "default"
                        : tx.transactionEnum === "Reject"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {tx.transactionEnum}
                  </Badge>
                  {tx.transactionEnum === "Pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(tx)}
                    >
                      Sửa
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {isAddingTransaction && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                {editingTransaction
                  ? "Chỉnh sửa giao dịch"
                  : "Thêm giao dịch mới"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 ">
                <div className="space-y-2">
                  <Label
                    htmlFor="amount"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Amount of money you want to withdraw *
                  </Label>
                  <Input
                    id="amount"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    placeholder="VD: 1,000,000"
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bankName"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Bank name
                  </Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) =>
                      handleInputChange("bankName", e.target.value)
                    }
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="accountNumber"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Account number
                  </Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      handleInputChange("accountNumber", e.target.value)
                    }
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>
              </div>
              {/* <div className="space-y-2">
                <Label
                  htmlFor="reasonWithdrawReject"
                  className="text-sm font-semibold text-gray-700"
                >
                  reasonWithdrawReject
                </Label>
                <textarea
                  id="reasonWithdrawReject"
                  value={formData.reasonWithdrawReject}
                  onChange={(e) =>
                    handleInputChange("reasonWithdrawReject", e.target.value)
                  }
                  className="w-full h-24 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl p-3"
                  placeholder="Nhập lý do nếu có"
                />
              </div> */}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-medium"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingTransaction ? "Cập nhật" : "Thêm giao dịch"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
