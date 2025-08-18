"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const Payment = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("bKash");
  const [isSuccess, setIsSuccess] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    invoiceId: "",
    from: "",
    transId: "",
    amount: "",
    paymentMethod: "bKash",
  });

  useEffect(() => {
    // This code runs only on the client side
    const invoice = JSON.parse(sessionStorage.getItem("invoiceData"));
    const studentId = localStorage.getItem("studentId");

    setInvoiceData(invoice);
    setFormData((prev) => ({
      ...prev,
      studentId,
      invoiceId: invoice?._id || "",
      paymentMethod: activeTab,
    }));
  }, [activeTab]);

  const [copied, setCopied] = useState(false);

  const paymentNumbers = {
    bKash: "01816575225",
    Nagad: "01816575225",
  };

  const subtotal = invoiceData ? invoiceData.amount - invoiceData.paid : 0;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mutation = useMutation({
    mutationFn: () => api.post("/payment", formData),
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  // Copy icon SVG
  const CopyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 2h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 1c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4z"
        fill="currentColor"
      />
      <path d="M6 5h4v1H6V5zm0 2h4v1H6V7zm0 2h3v1H6V9z" fill="currentColor" />
    </svg>
  );

  // Check icon SVG
  const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M13.5 4.5L6 12l-3.5-3.5L4 7l2 2 6-6 1.5 1.5z"
        fill="currentColor"
      />
    </svg>
  );

  if (!invoiceData) {
    return (
      <div className="flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p>Loading payment information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center bg-gray-50 py-8 px-4">
      <Toaster position="bottom-center" />
      <div className="max-w-md mx-auto">
        {!isSuccess ? (
          <>
            {" "}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Complete Payment
              </h1>
              <p className="text-gray-600">
                Choose your preferred payment method
              </p>
            </div>
            {/* Payment Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Tabs */}
              <div className="flex">
                <button
                  onClick={() => setActiveTab("bKash")}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-semibold transition-colors ${
                    activeTab === "bKash"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  bKash
                </button>
                <button
                  onClick={() => setActiveTab("Nagad")}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-semibold transition-colors ${
                    activeTab === "Nagad"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Nagad
                </button>
              </div>

              {/* Payment Content */}
              <div className="p-6">
                {/* Subtotal */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ৳{subtotal}
                    </span>
                  </div>
                </div>

                {/* Payment Number */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send money to this{" "}
                    {activeTab === "bKash" ? "bKash" : "Nagad"} number
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                    <span className="flex-1 font-mono text-lg font-semibold text-gray-900">
                      {paymentNumbers[activeTab]}
                    </span>
                    <button
                      onClick={() => copyToClipboard(paymentNumbers[activeTab])}
                      className={`p-2 rounded-md transition-colors ${
                        copied
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-copy"
                      }`}
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-sm text-green-600 mt-1">
                      Number copied to clipboard!
                    </p>
                  )}
                </div>

                {/* Instructions */}
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    activeTab === "bKash"
                      ? "bg-pink-50 border border-pink-200"
                      : "bg-orange-50 border border-orange-200"
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Payment Instructions:
                  </h3>
                  <ol className="text-sm text-gray-700 space-y-1">
                    <li>
                      1. Open your {activeTab === "bKash" ? "bKash" : "Nagad"}{" "}
                      app
                    </li>
                    <li>2. Send Money to the number above</li>
                    <li>3. Enter amount: ৳{subtotal}</li>
                    <li>4. Complete the transaction</li>
                    <li>5. Fill the form below with transaction details</li>
                  </ol>
                </div>

                {/* Transaction Form */}
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your {activeTab === "bKash" ? "bKash" : "Nagad"} Number
                      </label>
                      <input
                        type="tel"
                        name="from"
                        value={formData.from}
                        onChange={handleInputChange}
                        placeholder="01XXXXXXXXX"
                        pattern="01[3-9][0-9]{8}"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="Enter Amount"
                        step="1"
                        min="1"
                        max={subtotal}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        name="transId"
                        value={formData.transId}
                        onChange={handleInputChange}
                        placeholder="Enter transaction ID"
                        pattern="[A-Za-z0-9]+"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <button
                      role="submit"
                      className={`w-full flex gap-3 justify-center cursor-pointer py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                        activeTab === "bKash"
                          ? "bg-pink-600 hover:bg-pink-700"
                          : "bg-orange-500 hover:bg-orange-600"
                      }`}
                    >
                      {mutation.isPending ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        "Confirm Payment"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg p-8 max-w-md mx-auto text-center">
            <div className="flex justify-center mb-6">
              <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="45" fill="#4CAF50" />
                <path
                  d="M30 50 L45 65 L70 35"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Request Successful
            </h2>
            <p className="text-gray-600 mb-6">
              Thanks for your payment request. Invoice status will be updated
              soon.
            </p>

            <button
              className="bg-gray-100 hover:bg-gray-200 font-medium py-1 cursor-pointer px-6 rounded-md transition-colors"
              onClick={() => router.back()}
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
