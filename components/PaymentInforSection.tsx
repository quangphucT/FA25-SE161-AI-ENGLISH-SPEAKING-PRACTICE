import { Wallet } from 'lucide-react'
import React from 'react'

const PaymentInforSection = () => {
  return (
   <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2">
                      Thanh toán an toàn & nhanh chóng
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700 shadow-sm">
                        💳 PayOS
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      ✨ Coin sẽ được cộng vào tài khoản{" "}
                      <span className="font-semibold text-blue-600">
                        ngay lập tức
                      </span>{" "}
                      sau khi thanh toán thành công
                    </p>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default PaymentInforSection
