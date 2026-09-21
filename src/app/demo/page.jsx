"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Store,
  ShoppingBag,
  HeartHandshake,
  Clock,
  AlertTriangle,
  Leaf,
  Truck,
  ShieldCheck,
  Check } from "lucide-react";


export default function DemoPage() {
  const [stage, setStage] = useState("POSTED");

  // Step state values
  const totalPosted = 50;
  const claimedCount = stage === "POSTED" ? 0 : 32;
  const remainingSurplus = stage === "POSTED" ? 50 : 18;
  const rescuedCount = stage === "RESCUE_COMPLETED" ? 18 : 0;
  const remainingFinal = stage === "RESCUE_COMPLETED" ? 0 : remainingSurplus;

  const handleReset = () => {
    setStage("POSTED");
  };

  return (
    <div className="min-h-screen py-10" style={{ background: "var(--cream)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5" style={{ borderColor: "var(--fw-border)" }}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245C43]">
              <Sparkles className="w-4 h-4 text-[#245C43]" />
              Free Food Surplus Simulation
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#163A2A]">
              End-to-End Surplus Lifecycle Demo
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Interactive demonstration of the FoodWise circular workflow: Post → Free Claim → Urgency → Rescue → Zero Waste.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary py-2 px-3 text-xs font-bold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo
          </button>
        </div>

        {/* Live Counters Banner (Per Requirement 47: No Prices, Free Claim) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <span className="text-[11px] font-bold uppercase text-gray-500">1. Posted Surplus</span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">{totalPosted} meals</div>
            <span className="text-[11px] text-[#245C43] font-bold">FREE TO CLAIM</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <span className="text-[11px] font-bold uppercase text-gray-500">2. Users Claimed</span>
            <div className="text-2xl font-black text-[#245C43] mt-0.5">{claimedCount} meals</div>
            <span className="text-[11px] text-gray-500">
              Community pickup claims
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <span className="text-[11px] font-bold uppercase text-gray-500">3. Shelter Rescued</span>
            <div className="text-2xl font-black text-indigo-700 mt-0.5">{rescuedCount} meals</div>
            <span className="text-[11px] text-gray-500">NGO relief redistribution</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <span className="text-[11px] font-bold uppercase text-gray-500">4. Final Leftover</span>
            <div className={`text-2xl font-black mt-0.5 ${remainingFinal === 0 ? "text-emerald-700" : "text-amber-700"}`}>
              {remainingFinal} remaining
            </div>
            <span className="text-[11px] font-bold text-emerald-800">
              {stage === "RESCUE_COMPLETED" ? "✓ 0 REMAINING (100% SAVED)" : "In circulation"}
            </span>
          </div>
        </div>

        {/* Main Stage Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border shadow-sm space-y-6" style={{ borderColor: "var(--fw-border)" }}>
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 border-b pb-3" style={{ borderColor: "var(--fw-border)" }}>
            <span>
              Current Phase:{" "}
              <strong className="text-[#245C43] font-black uppercase">
                {stage.replace("_", " ")}
              </strong>
            </span>
            <span className="text-gray-400">Step {stage === "POSTED" ? 1 : stage === "CLAIMED" ? 2 : stage === "URGENCY" ? 3 : stage === "RESCUE_ACTIVE" ? 4 : 5} of 5</span>
          </div>

          {/* PHASE 1: POSTED */}
          {stage === "POSTED" && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#245C43] flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#163A2A]">
                    Phase 1: Provider Posts Surplus Batch
                  </h2>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    <strong>Coimbatore Fresh Kitchen</strong> in Gandhipuram posts <strong>50 Veg Meals</strong> remaining from an afternoon banquet. All portions are available for free community pickup.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border text-xs grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ borderColor: "var(--fw-border)" }}>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Batch Item</span>
                  <strong className="text-sm text-gray-800">50 Veg Meals</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Claim Fee</span>
                  <strong className="text-sm font-black text-[#245C43]">FREE TO CLAIM</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Location</span>
                  <strong className="text-sm text-gray-800">Gandhipuram, CBE</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Pickup Deadline</span>
                  <strong className="text-sm text-red-700">10:00 PM</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStage("CLAIMED")}
                className="btn-primary w-full py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2"
              >
                <span>Simulate 32 Users Claiming Food</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* PHASE 2: CLAIMED */}
          {stage === "CLAIMED" && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#245C43] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#163A2A]">
                    Phase 2: 32 Portions Claimed by Community Members
                  </h2>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Neighbors in Gandhipuram and RS Puram discover the listing, add portions to their claim carts, and checkout. <strong>32 portions</strong> are reserved. <strong>18 portions</strong> remain.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs flex justify-between items-center">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Community Claim Status</span>
                  <strong className="text-sm text-emerald-950">32 of 50 Meals Claimed (18 Portions Remaining)</strong>
                </div>
                <div className="text-right font-black text-[#245C43] text-sm">
                  100% Free Food
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStage("URGENCY")}
                className="btn-primary w-full py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2"
              >
                <span>Advance Clock (&lt; 1 Hour Remaining: Urgency Activates)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* PHASE 3: URGENCY ACTIVATES */}
          {stage === "URGENCY" && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#163A2A]">
                    Phase 3: Expiry Urgency Protocol Activates
                  </h2>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    The collection deadline is now within 1 hour. To ensure zero edible food is lost, the remaining <strong>18 portions</strong> are flagged for automated emergency rescue.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
                <strong>⚡ Urgency Protocol Active:</strong>
                <div>• Time remaining: 48 minutes</div>
                <div>• Remaining surplus: 18 portions</div>
                <div>• Automated rescue partner notification initiated</div>
              </div>

              <button
                type="button"
                onClick={() => setStage("RESCUE_ACTIVE")}
                className="btn-primary w-full py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2"
              >
                <span>Trigger Rescue Broadcast to Local NGOs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* PHASE 4: RESCUE ACTIVATES */}
          {stage === "RESCUE_ACTIVE" && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-6 h-6 text-purple-700" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#163A2A]">
                    Phase 4: Rescue Activates & Partner Dispatches
                  </h2>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    <strong>Anbagam Community Shelter</strong> in RS Puram receives the automated high-priority alert and claims all remaining 18 portions for shelter dinner distribution.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs space-y-2">
                <div className="flex justify-between font-bold text-purple-950">
                  <span>Matched Rescue Partner:</span>
                  <span>Anbagam Community Shelter (1.8 km)</span>
                </div>
                <div className="flex justify-between text-purple-800">
                  <span>Rescue Batch Allocated:</span>
                  <span>18 portions</span>
                </div>
                <div className="flex justify-between text-purple-800">
                  <span>Verification Pass:</span>
                  <span className="font-mono font-bold">FW-RESCUE-8821</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStage("RESCUE_COMPLETED")}
                className="btn-primary w-full py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2"
              >
                <span>Confirm Shelter Pickup & Complete Zero Waste</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* PHASE 5: ZERO WASTE COMPLETE */}
          {stage === "RESCUE_COMPLETED" && (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#245C43] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-[#245C43] uppercase tracking-wider">
                  Zero Waste Achieved
                </span>
                <h2 className="text-2xl font-black text-[#163A2A] mt-2">
                  100% of Surplus Successfully Diverted!
                </h2>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  50 posted → 32 claimed by community members → 18 rescued by shelter → 0 remaining.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border text-xs max-w-lg mx-auto grid grid-cols-3 gap-2" style={{ borderColor: "var(--fw-border)" }}>
                <div>
                  <span className="text-gray-400 block font-bold">50 Posted</span>
                  <strong className="text-gray-800">Batch Total</strong>
                </div>
                <div>
                  <span className="text-[#245C43] block font-bold">32 Claimed</span>
                  <strong className="text-[#245C43]">Community</strong>
                </div>
                <div>
                  <span className="text-indigo-700 block font-bold">18 Rescued</span>
                  <strong className="text-indigo-700">Shelter</strong>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl bg-[#245C43] hover:bg-[#163A2A] text-white font-black text-xs shadow-md transition-all inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Rerun Simulation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
