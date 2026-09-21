"use client";

import React from "react";
import Link from "next/link";
import { mockRescueRequests, mockRescuePartners } from "@/lib/mock-data";
import { RescueRequestStatus } from "@/types";
import { formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  Truck,
  Clock,
  MapPin,
  Building,
  Package,
  Phone,
  CheckCircle2,
  Navigation,
  AlertCircle } from "lucide-react";

export default function RescueActivePage() {
  const activeRequests = mockRescueRequests.filter(
    (r) => r.status === RescueRequestStatus.CLAIMED || r.status === RescueRequestStatus.ACCEPTED || r.status === RescueRequestStatus.PICKUP_ASSIGNED
  );

  const partner = mockRescuePartners[0];

  const getTimeLeft = (deadline) => {
    if (!deadline) return "N/A";
    const ms = new Date(deadline).getTime() - Date.now();
    if (ms <= 0) return "Overdue";
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const steps = [
    { label: "Claimed", status: "done" },
    { label: "En Route", status: "current" },
    { label: "Picked Up", status: "pending" },
    { label: "Delivered", status: "pending" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/rescue" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Active Rescues</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track your ongoing rescue missions in real-time
            </p>
          </div>
        </div>

        {activeRequests.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 py-16 text-center text-slate-400 space-y-2">
            <Truck className="w-10 h-10 mx-auto opacity-50" />
            <p className="font-semibold">No active rescues</p>
            <p className="text-xs">Claim a rescue request to get started</p>
            <Link
              href="/rescue/requests"
              className="inline-flex mt-3 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all"
            >
              View Available Requests
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {activeRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-900/30 shadow-sm overflow-hidden"
              >
                {/* Status bar */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span className="font-bold text-sm">Active Rescue Mission</span>
                    </div>
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">
                      {getTimeLeft(req.deadline)} remaining
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between">
                    {steps.map((step, i) => (
                      <div key={step.label} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          step.status === "done"
                            ? "bg-emerald-600 text-white"
                            : step.status === "current"
                            ? "bg-indigo-600 text-white animate-pulse"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        }`}>
                          {step.status === "done" ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className={`text-xs font-bold hidden sm:block ${
                          step.status === "current" ? "text-indigo-600" : step.status === "done" ? "text-emerald-600" : "text-slate-400"
                        }`}>
                          {step.label}
                        </span>
                        {i < steps.length - 1 && (
                          <div className={`w-12 sm:w-20 h-0.5 ${
                            step.status === "done" ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700"
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Food Details</h3>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="w-4 h-4 text-indigo-500" />
                          <span className="font-bold">{req.listing?.title || "Food Surplus"}</span>
                        </div>
                        <div className="text-xs text-slate-500 space-y-1">
                          <div>Quantity: <strong>{req.quantity} portions</strong></div>
                          <div>Trigger: {req.triggerReason}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pickup From</h3>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="w-4 h-4 text-indigo-500" />
                          <span className="font-bold">{req.provider?.name || "Provider"}</span>
                        </div>
                        <div className="text-xs text-slate-500 space-y-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {req.provider?.address || "Address"}
                          </div>
                          {req.provider?.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {req.provider.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2">
                      <Navigation className="w-4 h-4" /> Start Navigation
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Confirm Pickup
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
