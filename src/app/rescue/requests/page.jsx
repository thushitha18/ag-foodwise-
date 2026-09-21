"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockRescueRequests, mockRescuePartners } from "@/lib/mock-data";
import { RescueRequest, RescueRequestStatus } from "@/types";
import { formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  HeartHandshake,
  AlertTriangle,
  Clock,
  MapPin,
  Package,
  Building,
  Truck,
  CheckCircle2,
  ChevronRight } from "lucide-react";

export default function RescueRequestsPage() {
  const [requests, setRequests] = useState(mockRescueRequests);

  const pendingRequests = requests.filter((r) => r.status === RescueRequestStatus.PENDING);
  const partner = mockRescuePartners[0];

  const handleClaim = (id) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, status: RescueRequestStatus.CLAIMED, rescuePartnerId: partner.id }
          : req
      )
    );
  };

  const getUrgencyColor = (deadline) => {
    if (!deadline) return "text-slate-400";
    const hoursLeft = (new Date(deadline).getTime() - Date.now()) / 3600000;
    if (hoursLeft < 0.5) return "text-red-600";
    if (hoursLeft < 1) return "text-amber-600";
    return "text-emerald-600";
  };

  const getTimeLeft = (deadline) => {
    if (!deadline) return "N/A";
    const ms = new Date(deadline).getTime() - Date.now();
    if (ms <= 0) return "Expired";
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins}m left`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m left`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/rescue" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Available Rescue Requests</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Claim expiring food surplus for free community redistribution
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase">Pending</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{pendingRequests.length}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase">Claimed Today</div>
            <div className="text-2xl font-black text-indigo-600 mt-1">{requests.filter((r) => r.status === RescueRequestStatus.CLAIMED).length}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase">Est. Meals</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{pendingRequests.reduce((s, r) => s + r.quantity, 0)}</div>
          </div>
        </div>

        {/* Request Cards */}
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-sm p-5 transition-all hover:shadow-md ${
                req.status === RescueRequestStatus.PENDING
                  ? "border-amber-200 dark:border-amber-900/30"
                  : "border-slate-200/80 dark:border-slate-800"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    req.status === RescueRequestStatus.PENDING
                      ? "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30"
                      : "bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30"
                  }`}>
                    {req.status === RescueRequestStatus.PENDING ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 dark:text-white">
                        {req.listing?.title || "Food Surplus"}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.status === RescueRequestStatus.PENDING
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                          : req.status === RescueRequestStatus.CLAIMED
                          ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                      }`}>
                        {(req.status).replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3" /> {req.provider?.name || "Provider"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" /> {req.quantity} portions
                      </span>
                      <span className={`flex items-center gap-1 font-bold ${getUrgencyColor(req.deadline)}`}>
                        <Clock className="w-3 h-3" /> {getTimeLeft(req.deadline)}
                      </span>
                    </div>
                    {req.triggerReason && (
                      <p className="text-[11px] text-slate-400 italic">&quot;{req.triggerReason}&quot;</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {req.status === RescueRequestStatus.PENDING ? (
                    <button
                      onClick={() => handleClaim(req.id)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4" /> Claim Now
                    </button>
                  ) : (
                    <Link
                      href="/rescue/active"
                      className="px-5 py-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold text-sm transition-all flex items-center gap-2"
                    >
                      View Details <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
