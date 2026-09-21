"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "@/lib/location-context";
import {
  mockProviders,
  mockRescuePartners,
  mockFoodListings,
  mockOrders,
  platformStats } from "@/lib/mock-data";
import { UserRole } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Shield,
  ShieldCheck,
  Building,
  HeartHandshake,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Search,
  Users,
  Home,
  BarChart3,
  Settings,
  AlertOctagon,
  RefreshCw,
  Lock,
  ArrowRight } from "lucide-react";


const INITIAL_ANOMALIES = [
  {
    id: "ANM-101",
    type: "HIGH_QUANTITY",
    title: "Unusually High Batch Quantity",
    severity: "Medium",
    entity: "Coimbatore Fresh Kitchen",
    detail: "Batch of 50 portions is 3x standard average. Flagged for capacity check.",
    detectedAt: "Today 11:45 AM",
    status: "FLAGGED" },
  {
    id: "ANM-102",
    type: "UNUSUAL_PRICE",
    title: "Extreme Discount Rate (>85%)",
    severity: "Low",
    entity: "Individual Seller (isl-1)",
    detail: "Homemade sweet box listed at 75% below regional market benchmark.",
    detectedAt: "Today 9:15 AM",
    status: "FLAGGED" },
  {
    id: "ANM-103",
    type: "NO_SHOW",
    title: "Repeated Consumer Counter No-Show",
    severity: "High",
    entity: "Consumer ID: cu-9",
    detail: "User missed 2 consecutive reserved pickups without prior cancellation.",
    detectedAt: "Yesterday 8:30 PM",
    status: "FLAGGED" },
];

export default function AdminCenterPage() {
  const { user, switchRole } = useAuth();
  const { currentCity } = useLocation();

  const [activeSection, setActiveSection] = useState("overview");
  const [providers, setProviders] = useState(mockProviders);
  const [rescuePartners, setRescuePartners] = useState(mockRescuePartners);
  const [anomalies, setAnomalies] = useState(INITIAL_ANOMALIES);
  const [toastMessage, setToastMessage] = useState(null);

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <div className="max-w-md w-full bg-white rounded-2xl border p-8 shadow-sm text-center space-y-4" style={{ borderColor: "var(--fw-border)" }}>
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-700">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--charcoal)" }}>
            Admin Access Required
          </h1>
          <p className="text-xs text-gray-600">
            You must be signed in as Platform Admin to view this console.
          </p>
          <button
            type="button"
            onClick={() => switchRole(UserRole.ADMIN)}
            className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold"
          >
            Switch to Demo Admin Persona
          </button>
        </div>
      </div>
    );
  }

  const toggleProviderVerification = (id) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.isVerified;
          setToastMessage(`${p.name} accreditation set to ${next ? "VERIFIED" : "UNVERIFIED"}`);
          setTimeout(() => setToastMessage(null), 4000);
          return { ...p, isVerified: next };
        }
        return p;
      })
    );
  };

  const updateAnomalyStatus = (id, status) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    setToastMessage(`Anomaly ${id} marked as ${status}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5" style={{ borderColor: "var(--fw-border)" }}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Shield className="w-4 h-4 text-emerald-700" />
              Platform Administration & Governance • {currentCity.city}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--charcoal)" }}>
              Platform Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Verify kitchen licenses, oversee partner accreditations, audit complaints, and review algorithmic anomaly flags.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/complaints"
              className="btn-primary py-2 px-3 text-xs font-bold flex items-center gap-1.5"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              Complaints Queue (3)
            </Link>
          </div>
        </div>

        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="underline text-[11px]">
              Dismiss
            </button>
          </div>
        )}

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b" style={{ borderColor: "var(--fw-border)" }}>
          {[
            { id: "overview", label: "Overview" },
            { id: "providers", label: "Providers", count: providers.length },
            { id: "sellers", label: "Individual Sellers", count: 2 },
            { id: "rescue", label: "Rescue Partners", count: rescuePartners.length },
            { id: "listings", label: "Listings", count: mockFoodListings.length },
            { id: "complaints", label: "Complaints", count: 3 },
            { id: "anomalies", label: "Anomalies", count: anomalies.filter(a => a.status === "FLAGGED").length },
            { id: "analytics", label: "Analytics" },
            { id: "settings", label: "Settings" },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeSection === sec.id
                  ? "bg-[#245C43] text-white shadow-xs"
                  : "bg-white text-gray-700 border hover:bg-gray-50"
              }`}
              style={activeSection !== sec.id ? { borderColor: "var(--fw-border)" } : {}}
            >
              {sec.label}
              {sec.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeSection === sec.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {sec.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ================= SECTION: OVERVIEW ================= */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
                <span className="text-[11px] font-bold uppercase text-gray-400">Total Rescued</span>
                <div className="text-2xl font-black text-gray-900 mt-1">{platformStats.mealsSaved.toLocaleString()} meals</div>
                <span className="text-[11px] text-emerald-700">100% verified circularity</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
                <span className="text-[11px] font-bold uppercase text-gray-400">CO₂ Diverted</span>
                <div className="text-2xl font-black text-emerald-700 mt-1">31.1 Metric Tons</div>
                <span className="text-[11px] text-gray-400">Landfill diversion yield</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
                <span className="text-[11px] font-bold uppercase text-gray-400">Commercial Kitchens</span>
                <div className="text-2xl font-black text-gray-900 mt-1">{providers.length} registered</div>
                <span className="text-[11px] text-emerald-700">FSSAI license audited</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
                <span className="text-[11px] font-bold uppercase text-gray-400">Dispute Escalations</span>
                <div className="text-2xl font-black text-red-600 mt-1">1 Critical</div>
                <span className="text-[11px] text-gray-400">2 under review</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-5 border shadow-xs space-y-3" style={{ borderColor: "var(--fw-border)" }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-900">Recent Providers</h3>
                  <button onClick={() => setActiveSection("providers")} className="text-xs font-bold text-emerald-700 underline">
                    View all
                  </button>
                </div>
                <div className="divide-y text-xs">
                  {providers.slice(0, 3).map((p) => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-800">{p.name}</div>
                        <div className="text-gray-500 text-[11px]">{p.address}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                        {p.isVerified ? "Verified" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border shadow-xs space-y-3" style={{ borderColor: "var(--fw-border)" }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-900">Algorithmic Anomaly Flags</h3>
                  <button onClick={() => setActiveSection("anomalies")} className="text-xs font-bold text-amber-700 underline">
                    Review ({anomalies.filter(a => a.status === "FLAGGED").length})
                  </button>
                </div>
                <div className="divide-y text-xs">
                  {anomalies.slice(0, 3).map((a) => (
                    <div key={a.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-800">{a.title}</div>
                        <div className="text-gray-500 text-[11px]">{a.entity}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                        {a.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: PROVIDERS ================= */}
        {activeSection === "providers" && (
          <div className="bg-white rounded-2xl border shadow-xs p-5 space-y-4" style={{ borderColor: "var(--fw-border)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Registered Food Providers</h2>
              <span className="text-xs text-gray-500">{providers.length} kitchens listed</span>
            </div>

            <div className="divide-y text-xs">
              {providers.map((prov) => (
                <div key={prov.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{prov.name}</span>
                      <span className="text-[10px] font-mono text-gray-400">FSSAI: {prov.fssaiLicense || "Pending"}</span>
                    </div>
                    <div className="text-gray-500 mt-0.5">{prov.address} • Rating: {prov.rating || 4.7}★</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleProviderVerification(prov.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        prov.isVerified
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                          : "bg-amber-50 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {prov.isVerified ? "✓ Verified Kitchen" : "Pending Accreditation"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: ANOMALIES ================= */}
        {activeSection === "anomalies" && (
          <div className="bg-white rounded-2xl border shadow-xs p-5 space-y-4" style={{ borderColor: "var(--fw-border)" }}>
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h2 className="text-base font-bold text-gray-900">Anomaly Detection Queue</h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                FoodWise automated anomaly algorithms flag unusual quantities, price discrepancies, duplicates, or repeated cancellations. <strong>Anomalies are flagged for human review; no automated account bans occur.</strong>
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {anomalies.map((anm) => (
                <div key={anm.id} className="p-4 rounded-xl border bg-gray-50/50 space-y-2 text-xs" style={{ borderColor: "var(--fw-border)" }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-500">{anm.id}</span>
                      <span className="font-bold text-gray-900">{anm.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        anm.severity === "High" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {anm.severity} Priority
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-gray-400">{anm.detectedAt}</span>
                  </div>

                  <p className="text-gray-700 leading-relaxed">{anm.detail}</p>
                  <div className="text-[11px] text-gray-500">Entity: <strong>{anm.entity}</strong></div>

                  <div className="pt-2 border-t flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-600">Status: {anm.status}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateAnomalyStatus(anm.id, "DISMISSED")}
                        className="px-2.5 py-1 rounded-md border text-gray-600 hover:bg-gray-100 text-[11px]"
                      >
                        Dismiss Flag
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAnomalyStatus(anm.id, "REVIEWED")}
                        className="px-2.5 py-1 rounded-md btn-primary text-[11px] font-bold"
                      >
                        Mark Reviewed
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: COMPLAINTS OVERVIEW ================= */}
        {activeSection === "complaints" && (
          <div className="bg-white rounded-2xl border shadow-xs p-6 text-center space-y-3" style={{ borderColor: "var(--fw-border)" }}>
            <FileText className="w-10 h-10 text-emerald-700 mx-auto" />
            <h2 className="text-lg font-bold text-gray-900">Complaints & Dispute Triage Queue</h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Handle user disputes, food freshness complaints, missing pickups, and allergen reports.
            </p>
            <div className="pt-2">
              <Link href="/admin/complaints" className="btn-primary py-2.5 px-5 text-xs font-bold inline-flex items-center gap-1.5">
                Launch Full Complaints Desk <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* ================= SECTION: SETTINGS ================= */}
        {activeSection === "settings" && (
          <div className="bg-white rounded-2xl border shadow-xs p-6 space-y-4 max-w-xl" style={{ borderColor: "var(--fw-border)" }}>
            <h2 className="text-base font-bold text-gray-900">Platform Settings</h2>
            <div className="space-y-3 text-xs text-gray-700">
              <div className="flex items-center justify-between p-3 rounded-xl border">
                <div>
                  <div className="font-bold">Automated Emergency Rescue Dispatch</div>
                  <div className="text-gray-500 text-[11px]">Triggers when batch has &lt; 45 mins remaining</div>
                </div>
                <span className="font-bold text-emerald-700">ENABLED</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border">
                <div>
                  <div className="font-bold">Active Geofence Hubs</div>
                  <div className="text-gray-500 text-[11px]">Coimbatore & Chennai Metropolitan Area</div>
                </div>
                <span className="font-bold text-emerald-700">ONLINE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
