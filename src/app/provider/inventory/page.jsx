"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockInventory } from "@/lib/mock-data";
import {
  ArrowLeft,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  PlusCircle,
  TrendingDown,
  BarChart2,
  RefreshCcw,
  Edit3 } from "lucide-react";

export default function ProviderInventoryPage() {
  const [inventory, setInventory] = useState(mockInventory);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = inventory.filter(
    (item) =>
      !searchQuery ||
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const normalCount = inventory.filter((i) => i.status === "NORMAL").length;
  const lowCount = inventory.filter((i) => i.status === "LOW_STOCK").length;
  const outCount = inventory.filter((i) => i.status === "OUT_OF_STOCK").length;

  const getStockIcon = (status) => {
    switch (status) {
      case "NORMAL": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "LOW_STOCK": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "OUT_OF_STOCK": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStockBarWidth = (item) => {
    const pct = Math.min(100, (item.quantity / (item.reorder_level * 3)) * 100);
    return pct;
  };

  const getStockBarColor = (status) => {
    switch (status) {
      case "NORMAL": return "bg-emerald-500";
      case "LOW_STOCK": return "bg-amber-500";
      case "OUT_OF_STOCK": return "bg-red-500";
      default: return "bg-slate-400";
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
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">Inventory Tracker</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Monitor stock levels and predict surplus before it happens
              </p>
            </div>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 w-fit">
            <PlusCircle className="w-4 h-4" /> Add Ingredient
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Normal Stock
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{normalCount}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Low Stock
            </div>
            <div className="text-2xl font-black text-amber-600 mt-1">{lowCount}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
              <XCircle className="w-3.5 h-3.5 text-red-500" /> Out of Stock
            </div>
            <div className="text-2xl font-black text-red-600 mt-1">{outCount}</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>

        {/* Inventory Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400">
                  <th className="text-left py-3 px-4 font-bold">Ingredient</th>
                  <th className="text-left py-3 px-3 font-bold">Category</th>
                  <th className="text-left py-3 px-3 font-bold">Stock Level</th>
                  <th className="text-center py-3 px-3 font-bold">Qty</th>
                  <th className="text-center py-3 px-3 font-bold">Reorder At</th>
                  <th className="text-center py-3 px-3 font-bold">Status</th>
                  <th className="text-center py-3 px-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {getStockIcon(item.status)}
                        <span className="font-bold text-slate-900 dark:text-white">{item.item_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">{item.category}</td>
                    <td className="py-3.5 px-3">
                      <div className="w-full max-w-[120px]">
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${getStockBarColor(item.status)}`}
                            style={{ width: `${getStockBarWidth(item)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-400">
                      {item.reorder_level} {item.unit}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          item.status === "NORMAL"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : item.status === "LOW_STOCK"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {item.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-600 transition-colors"
                          title="Edit quantity"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Reorder"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Surplus Prediction Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                <span className="font-black text-lg">AI Surplus Predictor</span>
              </div>
              <p className="text-indigo-100 text-sm max-w-lg">
                Based on your inventory levels and historical patterns, our ML model predicts potential surplus for tomorrow.
                Pre-list surplus batches before they happen.
              </p>
            </div>
            <Link
              href="/provider/ai"
              className="px-6 py-3 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow hover:bg-indigo-50 transition-all flex items-center gap-2 w-fit shrink-0"
            >
              <BarChart2 className="w-4 h-4" /> View Predictions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
