"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag,
  Store,
  HeartHandshake,
  ArrowRight,
  AlertTriangle,
  Leaf,
  Award } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Transparent Circularity
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            How FoodWise Works
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            A tri-party surplus ecosystem turning kitchen oversupply into consumer savings and zero-waste hunger relief.
          </p>
        </div>

        {/* The Three Tracks */}
        <div className="space-y-12">
          {/* Track 1: For Consumers */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase">Track 1</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">For Smart Consumers</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="text-sm font-bold text-slate-900 dark:text-white">1. Discover Nearby</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Open the live map to browse freshly discounted meals from top hotels, bakeries, and restaurants in your Chennai neighborhood.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="text-sm font-bold text-slate-900 dark:text-white">2. Instant Reservation</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Lock in your portions with a single tap. Get a digital pickup pass with a secure verification QR code and 4-digit PIN.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="text-sm font-bold text-slate-900 dark:text-white">3. Collect & Enjoy</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Show your pass at the counter during the pickup window, verify with your QR code, and enjoy chef-prepared food — completely free.
                </p>
              </div>
            </div>
          </div>

          {/* Track 2: For Food Providers */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase">Track 2</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">For Food Businesses</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="text-sm font-bold text-slate-900 dark:text-white">1. Fast 60s Listing</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Kitchen managers post unsold batches directly from mobile. Select presets, quantities, and pickup deadlines easily.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="text-sm font-bold text-slate-900 dark:text-white">2. AI Dynamic Pricing</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Our algorithm automatically recommends discounts (50-70%) based on remaining shelf life to clear inventory swiftly.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="text-sm font-bold text-slate-900 dark:text-white">3. Recover Margin</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Recover food and prep costs on dishes that would otherwise go to waste, while boosting environmental ratings.
                </p>
              </div>
            </div>
          </div>

          {/* Track 3: For Rescue NGOs */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase">Track 3</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">For Hunger Relief Partners</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="text-sm font-bold text-slate-900 dark:text-white">1. Urgent Broadcasts</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  When surplus batches near the end of their commercial window, FoodWise triggers instant zero-cost emergency alerts.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="text-sm font-bold text-slate-900 dark:text-white">2. 1-Click NGO Claim</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Verified charities claim portions for free. Volunteers are dispatched immediately with food-grade thermal containers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="text-sm font-bold text-slate-900 dark:text-white">3. Dignified Relief</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Fresh, nutritious food reaches shelter homes and vulnerable individuals without delay, achieving true zero waste.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Food Safety & FSSAI Standards Section */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl space-y-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-black">
                Food Safety & Quality Compliance
              </h2>
              <p className="text-emerald-200/80 text-xs sm:text-sm">
                Safety is non-negotiable. Here is how FoodWise enforces quality standards.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-emerald-100/90 leading-relaxed">
            <div className="bg-white/10 rounded-2xl p-5 space-y-2 border border-white/10">
              <h4 className="font-bold text-white text-sm">FSSAI Certified Providers Only</h4>
              <p>
                Every participating food establishment must hold a valid Food Safety and Standards Authority of India (FSSAI) license. Kitchens undergo administrative license audits prior to listing approval.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 space-y-2 border border-white/10">
              <h4 className="font-bold text-white text-sm">Strict Time-Temperature Controls</h4>
              <p>
                Cooked food listings enforce strict 2-to-4 hour consumption windows from banquet or service conclusion. Hot items must be held above 65°C and cold items below 5°C in approved packaging.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 space-y-2 border border-white/10">
              <h4 className="font-bold text-white text-sm">Hygienic Packaging Protocols</h4>
              <p>
                All surplus meals must be packed in food-grade, tamper-evident containers or sealed boxes before customer handover. Providers indicate whether customers can bring reusable containers.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 space-y-2 border border-white/10">
              <h4 className="font-bold text-white text-sm">Full Transparency on Surplus Origin</h4>
              <p>
                Listings clearly state why food is surplus (e.g. banquet over-prep, menu turnover, or bakery closing stock). Full allergen and vegetarian disclosures are mandatory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
