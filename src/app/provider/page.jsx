"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockFoodListings, mockOrders, providerAnalytics } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";
import { UrgencyBadge } from "@/components/food/UrgencyBadge";
import { Countdown } from "@/components/food/Countdown";
import {
  Store,
  PlusCircle,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  QrCode,
  CheckCircle2,
  Clock,
  BarChart2,
  ShieldCheck,
  Check } from "lucide-react";

export default function ProviderDashboard() {
  const providerListings = mockFoodListings.filter((l) => l.providerId === "prov-1");
  const [verifyPin, setVerifyPin] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(null);

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (verifyPin.length === 4) {
      setVerificationSuccess(`Order verified successfully! Hand over claimed food portions.`);
      setVerifyPin("");
    } else {
      setVerificationSuccess("Please enter the 4-digit verification PIN presented on claimant's phone.");
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="bg-[#163A2A] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-900/40">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-300">
                Commercial Kitchen Operations
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-emerald-200 border border-white/10">
                <ShieldCheck className="w-3 h-3" /> FSSAI Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Taj Coromandel Kitchen Portal
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Connect edible surplus food directly with community members and registered relief organizations.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/provider/food/new"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Post Surplus Food
            </Link>
            <Link
              href="/provider/analytics"
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <BarChart2 className="w-4 h-4" />
              Surplus Analytics
            </Link>
          </div>
        </div>

        {/* Counter QR / PIN Verification Fast Action Bar */}
        <div className="bg-white rounded-2xl p-5 border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#245C43] flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#163A2A]">
                  Counter Pickup Claim Verification
                </h3>
                <p className="text-xs text-gray-500">
                  Enter 4-digit PIN presented on customer’s phone to confirm collection
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyPin} className="flex items-center gap-2">
              <input
                type="text"
                maxLength={4}
                value={verifyPin}
                onChange={(e) => setVerifyPin(e.target.value)}
                placeholder="PIN (e.g. 7841)"
                className="w-32 px-3 py-2 text-center text-sm font-mono font-bold tracking-widest bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#245C43]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#245C43] hover:bg-[#163A2A] text-white font-bold text-xs shadow-xs"
              >
                Verify & Hand Over
              </button>
            </form>
          </div>

          {verificationSuccess && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{verificationSuccess}</span>
            </div>
          )}
        </div>

        {/* Key Metrics Grid (Portions, Claim Rate, Waste Diverted - Zero Revenue) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border shadow-xs space-y-1" style={{ borderColor: "var(--fw-border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">Food Distributed</span>
              <ShoppingBag className="w-4 h-4 text-[#245C43]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#163A2A]">
              2,450 portions
            </div>
            <div className="text-[11px] text-[#245C43] font-bold">+18% this month</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-xs space-y-1" style={{ borderColor: "var(--fw-border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">Portions Claimed</span>
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">
              {providerAnalytics.totalSurplusMealsSold}
            </div>
            <div className="text-[11px] text-gray-500">92% community claim rate</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-xs space-y-1" style={{ borderColor: "var(--fw-border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">Food Rescued & Donated</span>
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-700">
              {providerAnalytics.totalDonatedMeals} meals
            </div>
            <div className="text-[11px] text-gray-500">Transferred to shelter partners</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-xs space-y-1" style={{ borderColor: "var(--fw-border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">Waste Avoided</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-teal-700">
              {providerAnalytics.wasteReductionKg.toFixed(0)} kg
            </div>
            <div className="text-[11px] text-emerald-700 font-bold">94.8% circular efficiency</div>
          </div>
        </div>

        {/* Active Surplus Listings Table */}
        <div className="bg-white rounded-2xl border shadow-xs p-6 space-y-4" style={{ borderColor: "var(--fw-border)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#163A2A]">
                Active Surplus Batches On Marketplace ({providerListings.length})
              </h2>
              <p className="text-xs text-gray-500">
                Available for free pickup with automated rescue trigger
              </p>
            </div>

            <Link
              href="/provider/food/new"
              className="text-xs font-bold text-[#245C43] hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Post Another Batch
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b text-gray-400 uppercase font-semibold" style={{ borderColor: "var(--fw-border)" }}>
                <tr>
                  <th className="pb-3">Batch / Item</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Quantity Left</th>
                  <th className="pb-3">Claim Status</th>
                  <th className="pb-3">Urgency Status</th>
                  <th className="pb-3">Pickup Window</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--fw-border)" }}>
                {providerListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="py-3 font-bold text-[#163A2A]">
                      {listing.title}
                    </td>
                    <td className="py-3 text-gray-500">{listing.category}</td>
                    <td className="py-3 font-bold text-gray-800">
                      {listing.quantity} {listing.unit}
                    </td>
                    <td className="py-3">
                      <span className="font-black text-[#245C43]">
                        FREE TO CLAIM
                      </span>
                    </td>
                    <td className="py-3">
                      <UrgencyBadge urgencyLevel={listing.urgencyLevel} expiresAt={listing.expiresAt} />
                    </td>
                    <td className="py-3 text-gray-500">
                      <Countdown expiresAt={listing.expiresAt} />
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <Link
                        href={`/food/${listing.id}`}
                        className="text-[#245C43] hover:underline font-bold"
                      >
                        Preview
                      </Link>
                      <button
                        type="button"
                        onClick={() => alert("Marked batch as Rescue NGO Priority!")}
                        className="text-indigo-600 hover:underline font-bold"
                      >
                        Push to NGO
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Predictive Demand Notification */}
        <div className="bg-[#FAF7F0] rounded-2xl p-6 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#245C43] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#163A2A]">
                AI Kitchen Demand Forecast & Surplus Prediction
              </h3>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                Our model predicts a <strong>24% surplus in dinner rice and breads</strong> this evening after 8:30 PM. Pre-listing them at 4:00 PM improves clearance probability to 96%.
              </p>
            </div>
          </div>
          <Link
            href="/provider/food/new"
            className="px-4 py-2.5 rounded-xl bg-[#245C43] hover:bg-[#163A2A] text-white text-xs font-bold shadow shrink-0"
          >
            Pre-list Suggested Batch →
          </Link>
        </div>
      </div>
    </div>
  );
}
