"use client";

import React from "react";
import Link from "next/link";
import { UtensilsCrossed, Leaf, Heart, Globe, ArrowRight, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            About FoodWise
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto">
            &ldquo;Turn Surplus Into Opportunity. Buy surplus. Rescue what remains. Waste less.&rdquo;
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
          <p>
            FoodWise was conceived to solve one of modern society&apos;s greatest contradictions: millions of kilograms of edible, chef-prepared food are thrown away every single day across commercial hospitality, while families and students struggle with rising food costs and millions suffer food insecurity.
          </p>
          <p>
            Traditional food waste solutions operate linearly: excess food is either discarded or, in rare cases, picked up by charities if logistically convenient. FoodWise introduces an intelligent circular platform that dynamically tiers surplus food based on time urgency:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Stage 1 (Commercial Clearance):</strong> Fresh unsold batches are offered to consumers at 50% to 75% discounts, enabling businesses to recover food costs and community members to dine affordably.
            </li>
            <li>
              <strong>Stage 2 (Emergency Redistribution):</strong> Any items remaining unsold 45 minutes prior to consumption cutoff are transitioned into zero-cost rescue batches, automatically alerting nearby verified hunger relief NGOs.
            </li>
            <li>
              <strong>Stage 3 (Upstream Prevention):</strong> Our machine learning demand forecasting engine analyzes surplus trends to help kitchens optimize prep schedules and prevent overproduction from happening in the first place.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">Chennai Pilot</h2>
          <p>
            We are actively piloting FoodWise in Chennai, Tamil Nadu, partnering with prominent establishments like Taj Coromandel, Anjappar Chettinad, The French Loaf, and Sangeetha Veg, alongside humanitarian partners including Robin Hood Army Chennai.
          </p>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
          >
            Explore Today&apos;s Surplus Meals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
