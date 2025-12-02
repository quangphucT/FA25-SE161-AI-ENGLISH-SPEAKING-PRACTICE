"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReviewerCoinWithdraw } from "@/features/reviewer/hooks/useReviewerCoin";
import { useReviewReviewWallet } from "@/features/reviewer/hooks/useReviewReview";

import { 
  Plus, 
  Save, 
  X, 
  Wallet as WalletIcon, 
  TrendingUp, 
  DollarSign, 
  Loader2, 
  AlertCircle, 
  CreditCard, 
  Calendar,
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";

const Wallet = () => {
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

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch wallet data from API
  const { data: walletData, isLoading, error } = useReviewReviewWallet(pageNumber, pageSize);
  const withdrawMutation = useReviewerCoinWithdraw();

  // Map API response to totals format
  const totals = useMemo(() => {
    if (!walletData?.isSucess || !walletData?.data) {
      return {
        totalEarned: "0",
        currentBalance: "0",
        currency: "VND",
      };
    }
    
    const data = walletData.data;
    return {
      totalEarned: (data.totalEarnedMoney || 0).toLocaleString("en-US"),
      currentBalance: (data.currentBalanceMoney || 0).toLocaleString("en-US"),
      currency: "VND",
    };
  }, [walletData]);

  // Map API data to Transaction format
  const transactions = useMemo(() => {
    if (!walletData?.isSucess || !walletData?.data?.transactions?.items) return [];
    
    return walletData.data.transactions.items.map((item) => {
      // Map status: "Pending" -> "Pending", "Withdraw" -> "Withdraw", "Reject" -> "Reject"
      let transactionEnum: "Withdraw" | "Reject" | "Pending" = "Pending";
      if (item.status === "Withdraw") {
        transactionEnum = "Withdraw";
      } else if (item.status === "Reject") {
        transactionEnum = "Reject";
      } else {
        transactionEnum = "Pending";
      }

      return {
        id: item.orderCode,
        amount: (item.money || 0).toLocaleString("en-US"),
        createdTransaction: new Date(item.createdAt).toLocaleDateString("en-US"),
        fk: item.orderCode,
        wallet_id: item.orderCode,
        bankName: item.bankName || "",
        accountNumber: item.accountNumber || "",
        reasonWithdrawReject: transactionEnum === "Reject" ? item.description : undefined,
        transactionEnum,
      } as Transaction;
    });
  }, [walletData]);

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

  const handleSubmit = async () => {
    if (editingTransaction) {
      // Edit is not supported via API, only create new withdrawal
      setIsAddingTransaction(false);
      setEditingTransaction(null);
      return;
    }

    // Parse coin amount from input (user enters coin, not money)
    const coinAmount = parseInt(formData.amount);
    if (isNaN(coinAmount) || coinAmount <= 0) {
      return;
    }

    if (!formData.bankName || !formData.accountNumber) {
      return;
    }

    try {
      await withdrawMutation.mutateAsync({
        coin: coinAmount,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
      });
      // History will be automatically refetched by the hook's onSuccess
      setIsAddingTransaction(false);
      setEditingTransaction(null);
      // Reset form
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
    } catch (error) {
      // Error is handled by mutation hook via toast
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Total earned
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {totals.totalEarned} {totals.currency}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {(walletData?.data?.totalEarnedCoin || 0).toLocaleString("en-US")} coin
                  </Badge>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                  <WalletIcon className="w-4 h-4" />
                  Current balance
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {totals.currentBalance} {totals.currency}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {(walletData?.data?.currentBalanceCoin || 0).toLocaleString("en-US")} coin
                  </Badge>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <WalletIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviewer Transactions (similar to withdrawal requests) */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader className=" ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Reviewer transactions</CardTitle>
            </div>
            <Button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add transaction
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-600 font-medium">Loading data...</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-lg font-semibold text-red-600 mb-2">Failed to load data</p>
              <p className="text-sm text-gray-600">{error.message}</p>
            </div>
          )}
          {!isLoading && !error && transactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-600 mb-2">No transactions yet</p>
              <p className="text-sm text-gray-500">Start by creating your first transaction</p>
            </div>
          )}
          {!isLoading && !error && transactions.length > 0 && (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      tx.transactionEnum === "Withdraw" 
                        ? "bg-green-100" 
                        : tx.transactionEnum === "Reject"
                        ? "bg-red-100"
                        : "bg-yellow-100"
                    }`}>
                      {tx.transactionEnum === "Withdraw" ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : tx.transactionEnum === "Reject" ? (
                        <XCircle className="w-6 h-6 text-red-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-xl font-bold text-gray-900">{tx.amount} VND</p>
                        <Badge
                          className={`text-xs font-semibold ${
                            tx.transactionEnum === "Withdraw"
                              ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
                              : tx.transactionEnum === "Reject"
                              ? "bg-red-100 text-red-800 hover:bg-red-200 border-red-300"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300"
                          }`}
                        >
                          {tx.transactionEnum === "Withdraw" ? "Withdrawn" : tx.transactionEnum === "Reject" ? "Rejected" : "Pending"}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="w-4 h-4" />
                          <span>{tx.bankName || "Not provided"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CreditCard className="w-4 h-4" />
                          <span>{tx.accountNumber || "Not provided"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>Created on: {tx.createdTransaction}</span>
                        </div>
                        {tx.reasonWithdrawReject && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs text-red-700 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Rejection reason: {tx.reasonWithdrawReject}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {isAddingTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200">
            <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                {editingTransaction
                  ? "Edit transaction"
                  : "Add new transaction"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-10 w-10 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6 bg-white">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="amount"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    Coins to withdraw *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    placeholder="e.g., 100"
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all"
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>💡</span>
                    Enter the number of coins you want to withdraw (1 coin = 1000 VND)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bankName"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    Bank name *
                  </Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) =>
                      handleInputChange("bankName", e.target.value)
                    }
                    placeholder="e.g., Vietcombank, Techcombank..."
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="accountNumber"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Account number *
                  </Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      handleInputChange("accountNumber", e.target.value)
                    }
                    placeholder="e.g., 1234567890"
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all"
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
                  placeholder="Enter a reason if needed"
                />
              </div> */}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 rounded-b-2xl">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-semibold transition-all"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={withdrawMutation.isPending}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {withdrawMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingTransaction ? "Update" : "Add transaction"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
