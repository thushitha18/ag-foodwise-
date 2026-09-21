"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockFoodListings } from "@/lib/mock-data";
import { formatDateTime, discountPercent } from "@/lib/utils";
import { UrgencyBadge } from "@/components/food/UrgencyBadge";
import { Countdown } from "@/components/food/Countdown";
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronDown,
  BarChart2 } from "lucide-react";


export default function ProviderListingsPage() {
  const providerListings = mockFoodListings.filter((l) => l.providerId === "prov-1");
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredListings = providerListings.filter((l) => {
    const matchesSearch =
      !searchQuery ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "ALL" || l.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabs = [
    { key: "ALL", label: "All", icon: <Package className="w-3.5 h-3.5" />, count: providerListings.length },
    { key: "ACTIVE", label: "Active", icon: <CheckCircle2 className="w-3.5 h-3.5" />, count: providerListings.filter((l) => l.status === "ACTIVE").length },
    { key: "PARTIALLY_SOLD", label: "Selling", icon: <BarChart2 className="w-3.5 h-3.5" />, count: providerListings.filter((l) => l.status === "PARTIALLY_SOLD").length },
    { key: "RESCUE_PENDING", label: "Rescue", icon: <AlertCircle className="w-3.5 h-3.5" />, count: providerListings.filter((l) => l.status === "RESCUE_PENDING").length },
    { key: "EXPIRED", label: "Expired", icon: <XCircle className="w-3.5 h-3.5" />, count: providerListings.filter((l) => l.status === "EXPIRED").length },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "PARTIALLY_SOLD": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "SOLD_OUT": return "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
      case "RESCUE_PENDING": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
      case "RESCUED": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "EXPIRED": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/provider" className="text-slate-400 hover:text-emerald-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Listings</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage all your surplus food listings in one place
              </p>
            </div>
          </div>
          <Link
            href="/provider/food/new"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 w-fit"
          >
            <PlusCircle className="w-4 h-4" /> New Listing
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-300"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}
              >
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
            placeholder="Search listings by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>

        {/* Listings Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {filteredListings.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Package className="w-10 h-10 mx-auto opacity-50" />
              <p className="font-semibold">No listings found</p>
              <p className="text-xs">Adjust filters or create a new listing</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400">
                    <th className="text-left py-3 px-4 font-bold">Food Item</th>
                    <th className="text-left py-3 px-3 font-bold">Status</th>
                    <th className="text-left py-3 px-3 font-bold">Urgency</th>
                    <th className="text-right py-3 px-3 font-bold">Availability</th>
                    <th className="text-center py-3 px-3 font-bold">Qty Left</th>
                    <th className="text-left py-3 px-3 font-bold">Expires</th>
                    <th className="text-center py-3 px-3 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((listing) => (
                    <tr
                      key={listing.id}
                      className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center shrink-0">
                            <span className="text-lg">{listing.images?.[0]?.startsWith("http") ? "🍽️" : "🍽️"}</span>
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{listing.title}</div>
                            <div className="text-[11px] text-slate-400">{listing.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(listing.status)}`}>
                          {(listing.status || "ACTIVE").replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <UrgencyBadge urgencyLevel={listing.urgencyLevel} expiresAt={listing.expiresAt} />
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">🆓 FREE</span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {listing.remaining_quantity ?? listing.quantity}
                        </span>
                        <span className="text-slate-400">/{listing.quantity} {listing.unit}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <Countdown expiresAt={listing.expiresAt} />
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/food/${listing.id}`}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-600 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-600 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
