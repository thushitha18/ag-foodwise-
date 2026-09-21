"use client";

import React from "react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  Building,
  Clock,
  Users,
  Award,
  Star,
  Heart,
  TrendingUp } from "lucide-react";

const completedRescues = [
  {
    id: "cr-1",
    foodName: "Biryani Platter (6 portions)",
    provider: "Taj Coromandel",
    quantity: 6,
    completedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    beneficiaries: 18,
    location: "Nungambakkam Shelter",
    feedback: "Excellent quality. Beneficiaries very happy.",
    rating: 5 },
  {
    id: "cr-2",
    foodName: "Fresh Idli Sambar (12 servings)",
    provider: "Murugan Idli Shop",
    quantity: 12,
    completedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    beneficiaries: 12,
    location: "T. Nagar Community Center",
    feedback: "Perfect condition. Quick pickup.",
    rating: 5 },
  {
    id: "cr-3",
    foodName: "Assorted Pastries Box",
    provider: "The French Loaf",
    quantity: 20,
    completedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    beneficiaries: 30,
    location: "Anna Nagar Orphanage",
    feedback: "Children loved the pastries!",
    rating: 5 },
  {
    id: "cr-4",
    foodName: "Mixed Veg Curry & Rice",
    provider: "Saravana Bhavan",
    quantity: 8,
    completedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    beneficiaries: 24,
    location: "Adyar Senior Home",
    feedback: "Always reliable quality from Saravana Bhavan.",
    rating: 4 },
];

export default function RescueCompletedPage() {
  const totalBeneficiaries = completedRescues.reduce((s, r) => s + r.beneficiaries, 0);
  const totalPortions = completedRescues.reduce((s, r) => s + r.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/rescue" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Completed Rescues</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              History of successfully rescued surplus food
            </p>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-xs font-bold text-emerald-200 uppercase">Rescues</div>
              <div className="text-2xl font-black mt-1">{completedRescues.length}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-200 uppercase">Portions Saved</div>
              <div className="text-2xl font-black mt-1">{totalPortions}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-200 uppercase">Beneficiaries</div>
              <div className="text-2xl font-black mt-1">{totalBeneficiaries}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-200 uppercase">CO₂ Prevented</div>
              <div className="text-2xl font-black mt-1">{(totalPortions * 2.5).toFixed(0)} kg</div>
            </div>
          </div>
        </div>

        {/* Completed Cards */}
        <div className="space-y-4">
          {completedRescues.map((rescue) => (
            <div
              key={rescue.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 dark:text-white">{rescue.foodName}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <CheckCircle2 className="w-2.5 h-2.5" /> COMPLETED
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3" /> {rescue.provider}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" /> {rescue.quantity} portions
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {rescue.beneficiaries} served
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDateTime(rescue.completedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Heart className="w-3 h-3 text-pink-500" />
                      <span className="italic">&quot;{rescue.feedback}&quot;</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {Array.from({ length: rescue.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="font-black text-lg">Rescue Hero Badge Earned! 🏆</div>
              <p className="text-amber-100 text-sm">
                You&apos;ve completed over {completedRescues.length} rescues and served {totalBeneficiaries}+ beneficiaries.
                Keep up the incredible humanitarian work!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
