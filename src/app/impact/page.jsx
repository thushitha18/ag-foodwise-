"use client";

import React, { useState } from "react";
import Link from "next/link";
import { platformStats, mockProviders } from "@/lib/mock-data";

import {
  Leaf,
  Droplets,
  Award,
  Globe,
  TrendingDown,
  Building,
  ShieldCheck,
  ArrowRight,
  Heart,
  Users } from "lucide-react";

export default function ImpactPage() {
  const [calculatorMeals, setCalculatorMeals] = useState(5);

  const yearlyCo2 = (calculatorMeals * 2.5 * 52).toFixed(0);
  const yearlyMealsShared = calculatorMeals * 52;
  const yearlyWater = (calculatorMeals * 750 * 52).toLocaleString();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            Chennai Metro Sustainability Pilot
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            City-Wide Environmental & Social Impact
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Every rescued meal directly cuts greenhouse emissions, saves freshwater, and puts affordable nutrition on people’s plates.
          </p>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {(platformStats.co2PreventedKg / 1000).toFixed(1)} Metric Tons
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              CO₂ Emissions Prevented
            </div>
            <p className="text-[11px] text-slate-500">
              Equivalent to taking 7 cars off Chennai roads for a full year.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-cyan-600">
              9.3M Liters
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Embedded Water Conserved
            </div>
            <p className="text-[11px] text-slate-500">
              Preserving precious reservoir resources required to produce agricultural crops.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-amber-600">
              {platformStats.mealsSaved.toLocaleString()}+
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Community Meals Shared Free
            </div>
            <p className="text-[11px] text-slate-500">
              Families and students enjoying restaurant-quality food completely free through our community network.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-indigo-600">
              3,420 Meals
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Donated Free via Relief NGOs
            </div>
            <p className="text-[11px] text-slate-500">
              Zero-cost wholesome nutrition redirected to local shelters and night soup runs.
            </p>
          </div>
        </div>

        {/* Global Alignment: UN SDGs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              SDG
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Aligned with United Nations Sustainable Development Goals
              </h2>
              <p className="text-xs text-slate-500">
                Measurable progress towards 2030 international climate & food security targets
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-2">
              <span className="px-2.5 py-1 rounded-md bg-amber-500 text-white font-bold text-xs">
                Goal 12.3: Responsible Consumption & Production
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Halving Global Food Waste
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                FoodWise empowers commercial kitchens to eliminate edible landfill waste through automated surplus redistribution and seamless community sharing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 space-y-2">
              <span className="px-2.5 py-1 rounded-md bg-rose-500 text-white font-bold text-xs">
                Goal 2: Zero Hunger
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Community Food Redistribution
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Connecting commercial surplus immediately with grassroots charity fleets like Robin Hood Army, bridging the gap between excess and deprivation.
              </p>
            </div>
          </div>
        </div>

        {/* Top Sustainable Kitchens Leaderboard */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Chennai Zero-Waste Kitchen Leaderboard
              </h2>
              <p className="text-xs text-slate-500">
                Providers with the highest circularity efficiency and lowest landfill ratio
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600">Updated Daily</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {mockProviders.map((prov, index) => (
              <div key={prov.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      {prov.name}
                      {prov.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                    </h3>
                    <div className="text-xs text-slate-500">{prov.address}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-600">
                    {prov.mealsRescuedCount} meals rescued
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Rating: {prov.rating} ★
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
