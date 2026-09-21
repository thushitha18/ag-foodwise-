"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockOrders } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";
import {
  ShoppingBag,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  QrCode,
  User,
  MapPin,
  Phone,
  ChevronRight,
  Filter,
  AlertCircle } from "lucide-react";
import { OrderStatus } from "@/types";


export default function ProviderOrdersPage() {
  const providerOrders = mockOrders.filter((o) => o.providerId === "prov-1");
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = providerOrders.filter((o) => {
    const matchesSearch =
      !searchQuery ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.pickupCode?.toLowerCase().includes(searchQuery.toLowerCase());
    const tabStatuses = {
      ALL: [],
      PENDING: [OrderStatus.PENDING],
      CONFIRMED: [OrderStatus.CONFIRMED, OrderStatus.PREPARING],
      READY: [OrderStatus.READY_FOR_PICKUP, OrderStatus.READY],
      COMPLETED: [OrderStatus.COMPLETED, OrderStatus.PICKED_UP],
      CANCELLED: [OrderStatus.CANCELLED, OrderStatus.NO_SHOW] };
    const matchesTab = activeTab === "ALL" || tabStatuses[activeTab].includes(o.status);
    return matchesSearch && matchesTab;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING": return { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-800 dark:text-amber-400", icon: <Clock className="w-3 h-3" /> };
      case "CONFIRMED":
      case "PREPARING": return { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-400", icon: <Package className="w-3 h-3" /> };
      case "READY_FOR_PICKUP":
      case "READY": return { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-800 dark:text-emerald-400", icon: <CheckCircle2 className="w-3 h-3" /> };
      case "COMPLETED":
      case "PICKED_UP": return { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-800 dark:text-green-400", icon: <CheckCircle2 className="w-3 h-3" /> };
      case "CANCELLED":
      case "NO_SHOW": return { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-800 dark:text-red-400", icon: <XCircle className="w-3 h-3" /> };
      default: return { bg: "bg-slate-100", text: "text-slate-600", icon: <Clock className="w-3 h-3" /> };
    }
  };

  const tabs = [
    { key: "ALL", label: "All Orders", count: providerOrders.length },
    { key: "PENDING", label: "Pending", count: providerOrders.filter((o) => o.status === OrderStatus.PENDING).length },
    { key: "CONFIRMED", label: "In Progress", count: providerOrders.filter((o) => [OrderStatus.CONFIRMED, OrderStatus.PREPARING].includes(o.status)).length },
    { key: "READY", label: "Ready", count: providerOrders.filter((o) => [OrderStatus.READY_FOR_PICKUP, OrderStatus.READY].includes(o.status)).length },
    { key: "COMPLETED", label: "Completed", count: providerOrders.filter((o) => [OrderStatus.COMPLETED, OrderStatus.PICKED_UP].includes(o.status)).length },
    { key: "CANCELLED", label: "Cancelled", count: providerOrders.filter((o) => [OrderStatus.CANCELLED, OrderStatus.NO_SHOW].includes(o.status)).length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/provider" className="text-slate-400 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Incoming Orders</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track and manage customer pickups for your surplus listings
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Today's Orders", value: providerOrders.length, color: "text-blue-600" },
            { label: "Ready for Pickup", value: providerOrders.filter((o) => ["READY_FOR_PICKUP", "READY"].includes(o.status)).length, color: "text-emerald-600" },
            { label: "Portions Claimed", value: providerOrders.reduce((s, o) => s + o.quantity, 0), color: "text-amber-600" },
            { label: "Completion Rate", value: "94%", color: "text-green-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase">{stat.label}</div>
              <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-300"
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.key ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID, food name, or pickup code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>

        {/* Order Cards */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 py-16 text-center text-slate-400 space-y-2">
              <ShoppingBag className="w-10 h-10 mx-auto opacity-50" />
              <p className="font-semibold">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const style = getStatusStyle(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-slate-900 dark:text-white text-base">
                            {order.listing?.title || "Food Order"}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${style.bg} ${style.text}`}>
                            {style.icon}
                            {(order.status).replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {order.consumer?.name || "Customer"}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDateTime(order.createdAt)}</span>
                          <span>Qty: <strong>{order.quantity}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-black text-emerald-600">FREE</div>
                        <div className="text-[10px] text-slate-400">Pickup PIN: <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{order.pickupPin}</span></div>
                      </div>
                      <Link
                        href={`/orders/${order.id}`}
                        className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
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
