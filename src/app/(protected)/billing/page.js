"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  AlertCircle,
  Clock,
  CheckCircle,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

// StatusBadge component for reusability
function StatusBadge({ status }) {
  return (
    <span
      className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${
        status === "Paid"
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          : status === "Unpaid"
          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      }
    `}
    >
      {status}
    </span>
  );
}

const Billing = () => {
  const { data: billingData } = useQuery({
    queryKey: ["billing"],
    queryFn: async () => {
      const response = await api.get("/student-invoices");
      return response.data.payload;
    },
  });

  return (
    <div className="space-y-6 p-4 md:p-6 dark:bg-gray-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-200/30 dark:bg-green-800/30 rounded-xl">
          <CreditCard className="h-6 w-6 text-primary dark:text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-black text-card-foreground dark:text-white">
          Billing
        </h1>
      </div>

      {/* Billing Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-red-200 dark:border-red-700 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-red-500 rounded-lg w-fit mx-auto mb-2">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-black text-red-600 dark:text-red-400">
              {billingData?.unpaidInvoices ?? 0}
            </div>
            <div className="text-sm font-semibold text-red-600 dark:text-red-300">
              Unpaid Invoices
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-700 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-blue-500 rounded-lg w-fit mx-auto mb-2">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {billingData?.subtotal ?? 0}
            </div>
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-300">
              Subtotal
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-green-500 rounded-lg w-fit mx-auto mb-2">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-black text-green-600 dark:text-green-400">
              {billingData?.totalPaid}
            </div>
            <div className="text-sm font-semibold text-green-600 dark:text-green-300">
              Total Paid
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-200 dark:border-yellow-700 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-yellow-500 rounded-lg w-fit mx-auto mb-2">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400">
              {billingData?.totalDue}
            </div>
            <div className="text-sm font-semibold text-yellow-600 dark:text-yellow-300">
              Total Due
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-border/50 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-black">
            <CreditCard className="h-6 w-6 text-primary" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="overflow-hidden hidden md:block rounded-lg border border-gray-200 dark:border-gray-700 border-border dark:border-border-dark shadow-sm">
              {/* Desktop Table */}
              <table className="hidden md:table min-w-full divide-y divide-gray-200 dark:divide-gray-700 divide-border dark:divide-border-dark">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Invoice ID
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Month
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Due
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Due Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-border divide-gray-200 dark:divide-gray-700 dark:divide-border-dark">
                  {billingData?.invoices?.length ? (
                    (billingData?.invoices || []).map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-primary dark:text-primary-dark">
                          #{invoice._id.slice(-6)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {new Date(invoice.month).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                          ৳{invoice.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                          ৳{(invoice.amount - invoice.paid).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {new Date(invoice.dueDate).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "long",
                            }
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <StatusBadge status={invoice.status} />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {invoice.status === "Unpaid" && (
                            <Button
                              size="sm"
                              className="w-full cursor-pointer md:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                            >
                              Pay Now
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">
                        <div className="text-center py-12 w-full">
                          <div className="w-16 h-16 bg-muted dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-muted-foreground dark:text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-muted-foreground dark:text-gray-400 mb-2">
                            No invoice found
                          </h3>
                          <p className="text-sm text-muted-foreground dark:text-gray-500">
                            Student billing information will appear here
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {billingData?.invoices?.length ? (
                (billingData?.invoices || []).map((invoice) => (
                  <div
                    key={invoice._id}
                    className="p-4 bg-white border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-lg shadow border border-border dark:border-border-dark"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary dark:text-primary-dark">
                        #{invoice._id.slice(-6)}
                      </span>
                      <StatusBadge status={invoice.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Month
                        </p>
                        <p className="font-medium dark:text-white">
                          {new Date(invoice.month).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Amount
                        </p>
                        <p className="font-medium dark:text-white">
                          ৳{invoice.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Due</p>
                        <p className="font-medium dark:text-white">
                          ৳{(invoice.amount - invoice.paid).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Due Date
                        </p>
                        <p className="font-medium dark:text-white">
                          {new Date(invoice.dueDate).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "long",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {invoice.status === "Unpaid" && (
                      <Button
                        size="sm"
                        className="w-full bg-green-600 cursor-pointer hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                      >
                        Pay Now
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground dark:text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-muted-foreground dark:text-gray-400 mb-2">
                    No invoice found
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-500">
                    Student billing information will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
