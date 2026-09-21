"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { mockOrders } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";
import {
  ShoppingBag,
  QrCode,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Store,
  MapPin,
  Sparkles,
  Navigation } from "lucide-react";

export default function OrdersPage() {
  const [filter, setFilter] = useState("ALL");
  const [allOrders, setAllOrders] = useState(mockOrders);

  // Load user placed orders from localStorage and combine
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fw_user_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge unique by id
          const existingIds = new Set(parsed.map((p) => p.id));
          const rest = mockOrders.filter((o) => !existingIds.has(o.id));
          setAllOrders([...parsed, ...rest]);
        }
      }
    } catch {}
  }, []);

  const filteredOrders = allOrders.filter((order) => {
    if (filter === "ACTIVE") return order.status === "CONFIRMED" || order.status === "PREPARING" || order.status === "READY" || order.status === "READY_FOR_PICKUP";
    if (filter === "COMPLETED") return order.status === "COMPLETED";
    return true;
  });

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--cream)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: "var(--fw-border)" }}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#245C43] uppercase tracking-wider mb-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              Claimed Food Orders
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#163A2A]">
              My Food Claims
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Track your free food surplus claims and show digital verification passes at pickup counters.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-xs self-start">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === "ALL"
                  ? "bg-[#245C43] text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All ({allOrders.length})
            </button>
            <button
              onClick={() => setFilter("ACTIVE")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === "ACTIVE"
                  ? "bg-[#245C43] text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Active Claims
            </button>
            <button
              onClick={() => setFilter("COMPLETED")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === "COMPLETED"
                  ? "bg-[#245C43] text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-gray-200 text-center space-y-4">
              <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900">
                No orders found
              </h3>
              <p className="text-sm text-gray-500">
                You have no surplus food claims matching this filter.
              </p>
              <Link
                href="/explore"
                className="inline-block px-5 py-2.5 rounded-xl bg-[#245C43] text-white font-bold text-xs shadow"
              >
                Browse Free Food
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isReady = order.status === "READY" || order.status === "CONFIRMED" || order.status === "READY_FOR_PICKUP";
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isReady
                            ? "bg-amber-100 text-amber-900 border border-amber-200"
                            : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        #{order.id}
                      </span>
                      <span className="text-xs text-gray-400">
                        • {formatDateTime(order.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#163A2A]">
                      {order.listing?.title || "Surplus Meal Batch"}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1 font-semibold text-gray-700">
                        <Store className="w-3.5 h-3.5 text-[#245C43]" />
                        {order.provider?.name || "Community Food Donor"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {order.provider?.address || "Coimbatore"}
                      </span>
                      <span className="font-bold text-gray-800">
                        Portions: {order.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Right side: Free status & Action buttons */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-bold text-[#245C43] uppercase tracking-wide">
                        FREE TO CLAIM
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                        PIN: <strong className="text-gray-900 font-bold tracking-wider">{order.pickupPin}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/orders/${order.id}/track`}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors"
                        title="Live Tracking Map"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#245C43]" />
                        Track
                      </Link>
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#245C43] hover:bg-[#163A2A] text-white font-bold text-xs shadow-xs transition-all"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Pickup Pass
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
