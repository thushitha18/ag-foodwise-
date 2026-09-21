"use client";

import React from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend } from "recharts";
import { dailyAnalytics, categoryBreakdown, providerAnalytics } from "@/lib/mock-data";
import {
  ArrowLeft,
  TrendingUp,
  Leaf,
  BarChart3,
  PieChart as PieChartIcon,
  Sparkles,
  Download,
  ShoppingBag,
  CheckCircle2,
  Clock,
  AlertTriangle } from "lucide-react";

export default function ProviderAnalyticsPage() {
  const chartData = dailyAnalytics.slice(-14).map((d) => ({
    date: d.date.split("-").slice(1).join("/"),
    posted: Math.round(d.mealsRescued * 1.15),
    claimed: d.mealsRescued,
    donated: d.mealsDonated,
    remaining: Math.max(0, Math.round(d.mealsRescued * 0.15) - d.mealsDonated) }));

  const COLORS = ["#163A2A", "#245C43", "#7FA88A", "#C8DCCB", "#E8C7C0"];

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <Link
            href="/provider"
            className="inline-flex items-center gap-1.5 font-bold hover:text-[#245C43] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Provider Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[#245C43] font-bold">Past 30 Days</span>
            <button
              onClick={() => alert("Report exported to CSV.")}
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-gray-900"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-[#163A2A]">
            Surplus & Redistribution Analytics
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Real-time surplus clearance, community claim rates, and hunger relief metrics.
          </p>
        </div>

        {/* Top Summary KPI Cards (Per Requirement 29: No Revenue) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border shadow-xs space-y-1" style={{ borderColor: "var(--fw-border)" }}>
            <div className="text-xs font-bold text-gray-400 uppercase">Food Posted</div>
            <div className="text-2xl sm:text-3xl font-black text-[#163A2A]">
              2,680 portions
            </div>
            <div className="text-[11px] text-[#245C43] font-semibold">100% Free surplus</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-xs space-y-1" style={{ borderColor: "var(--fw-border)" }}>
            <div className="text-xs font-bold text-gray-400 uppercase">Food Claimed</div>
            <div className="text-2xl sm:text-3xl font-black text-[#245C43]">
              {providerAnalytics.totalSurplusMealsSold} portions
            </div>
            <div className="text-[11px] text-gray-500">Claim Rate: 92.4%</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-xs space-y-1" style={{ borderColor: "var(--fw-border)" }}>
            <div className="text-xs font-bold text-gray-400 uppercase">Food Rescued & Donated</div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-700">
              {providerAnalytics.totalDonatedMeals} portions
            </div>
            <div className="text-[11px] text-indigo-600 font-semibold">Sent to verified NGOs</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-xs space-y-1" style={{ borderColor: "var(--fw-border)" }}>
            <div className="text-xs font-bold text-gray-400 uppercase">Waste Avoided</div>
            <div className="text-2xl sm:text-3xl font-black text-teal-700">
              {providerAnalytics.wasteReductionKg.toFixed(0)} kg
            </div>
            <div className="text-[11px] text-teal-700 font-bold">UN SDG 12.3 Aligned</div>
          </div>
        </div>

        {/* Secondary Operational Metrics Row (Requirement 29) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Remaining Surplus</div>
            <div className="text-xl font-black text-[#163A2A] mt-1">42 portions</div>
            <span className="text-[10px] text-gray-500">Across 3 active batches</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Average Time to Claim</div>
            <div className="text-xl font-black text-[#245C43] mt-1">38 minutes</div>
            <span className="text-[10px] text-gray-500">Rapid local turnaround</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Rescue Activations</div>
            <div className="text-xl font-black text-indigo-700 mt-1">18 dispatches</div>
            <span className="text-[10px] text-gray-500">To Coimbatore shelters</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Expired Batches</div>
            <div className="text-xl font-black text-emerald-800 mt-1">0 batches</div>
            <span className="text-[10px] text-emerald-700 font-bold">100% Diverted</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Daily Trend Area Chart */}
          <div className="lg:col-span-8 bg-white rounded-3xl border p-6 shadow-xs space-y-4" style={{ borderColor: "var(--fw-border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-[#163A2A] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#245C43]" />
                  Daily Food Clearance & Claim Trends (Portions)
                </h3>
                <p className="text-xs text-gray-500">
                  Visualizing food portions posted, claimed, and donated over the last 14 days
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorClaimed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#245C43" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#245C43" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDonated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Area
                    type="monotone"
                    dataKey="claimed"
                    name="Portions Claimed"
                    stroke="#245C43"
                    fillOpacity={1}
                    fill="url(#colorClaimed)"
                  />
                  <Area
                    type="monotone"
                    dataKey="donated"
                    name="NGO Rescued"
                    stroke="#6366f1"
                    fillOpacity={1}
                    fill="url(#colorDonated)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown Donut */}
          <div className="lg:col-span-4 bg-white rounded-3xl border p-6 shadow-xs space-y-4" style={{ borderColor: "var(--fw-border)" }}>
            <div>
              <h3 className="font-black text-base text-[#163A2A] flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-[#245C43]" />
                Surplus by Category
              </h3>
              <p className="text-xs text-gray-500">
                Redistributed food volume by cuisine
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
