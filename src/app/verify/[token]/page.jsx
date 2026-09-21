"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "@/lib/location-context";
import { mockRescueRequests, mockRescuePartners, mockFoodListings } from "@/lib/mock-data";
import { UserRole, UrgencyLevel } from "@/types";
import { formatDateTime } from "@/lib/utils";
import {
  HeartHandshake,
  ShieldCheck,
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle2,
  Truck,
  Users,
  Building,
  Phone,
  ArrowRight,
  Filter,
  XCircle,
  Sparkles,
  AlertTriangle,
  RotateCcw } from "lucide-react";


const INITIAL_RESCUE_ITEMS = [
  {
    id: "rw-1",
    title: "50 Veg Meals Banquet Surplus",
    providerName: "Coimbatore Fresh Kitchen",
    address: "Gandhipuram Cross Cut Rd, Coimbatore",
    quantity: 18,
    unit: "portions",
    deadline: "In 45 minutes",
    status: "PENDING",
    distanceKm: 1.4,
    matchingScore: 94 },
  {
    id: "rw-2",
    title: "Royal Biryani & Salan Banquet Platter",
    providerName: "Taj Coromandel",
    address: "37, MG Rd, Nungambakkam",
    quantity: 6,
    unit: "portions",
    deadline: "In 55 minutes",
    status: "ACCEPTED",
    assignedVolunteer: "Arun Prakash (Fleet Volunteer)",
    distanceKm: 2.1,
    matchingScore: 88 },
  {
    id: "rw-3",
    title: "Grand South Indian Thali Feast",
    providerName: "Sangeetha Veg Restaurant",
    address: "2nd Ave, Anna Nagar",
    quantity: 8,
    unit: "thalis",
    deadline: "Delivered",
    status: "COMPLETED",
    assignedVolunteer: "Karthik R.",
    distanceKm: 3.2,
    matchingScore: 91 },
];

export default function RescuePartnerHub() {
  const { user, switchRole } = useAuth();
  const { currentCity } = useLocation();

  const [activeTab, setActiveTab] = useState("urgent");
  const [items, setItems] = useState(INITIAL_RESCUE_ITEMS);
  const [filterType, setFilterType] = useState("ALL");
  const [statusNotice, setStatusNotice] = useState("");

  const isVerifiedRescue =
    user?.role === UserRole.RESCUE_PARTNER || user?.role === "rescue_partner";

  // If user is not verified rescue partner, render strict guard
  if (!isVerifiedRescue) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <div className="max-w-md w-full bg-white rounded-2xl border p-8 shadow-sm text-center space-y-4" style={{ borderColor: "var(--fw-border)" }}>
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mx-auto border border-rose-200">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <h1 className="text-xl font-bold" style={{ color: "var(--charcoal)" }}>
            Access Restricted: Rescue Hub
          </h1>

          <p className="text-xs text-gray-600 leading-relaxed">
            Rescue Hub is available to verified organizations only (NGOs, Charities, Community Kitchens, and Shelters).
          </p>

          <div className="pt-2 space-y-2">
            <Link
              href="/rescue/apply"
              className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold block text-center"
            >
              Apply as Rescue Partner
            </Link>

            <button
              type="button"
              onClick={() => switchRole(UserRole.RESCUE_PARTNER)}
              className="w-full py-2.5 rounded-xl border text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors"
              style={{ borderColor: "var(--forest-light)" }}
            >
              Switch to Demo Rescue Partner Persona
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Update item status in workflow
  const transitionStatus = (id, nextStatus, volunteerName) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
              assignedVolunteer: volunteerName || item.assignedVolunteer }
          : item
      )
    );
    setStatusNotice(`Batch updated: status changed to ${nextStatus.replace("_", " ")}`);
    setTimeout(() => setStatusNotice(""), 4000);
  };

  const urgentBatches = items.filter((i) => i.status === "PENDING");
  const activeRescues = items.filter(
    (i) => i.status !== "PENDING" && i.status !== "COMPLETED" && i.status !== "REJECTED"
  );
  const completedRescues = items.filter((i) => i.status === "COMPLETED");

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-[#163A2A] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C8DCCB]">
                Humanitarian Redistribution Hub
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#245C43] text-[#FAF7F0] border border-[#7FA88A]">
                <ShieldCheck className="w-3 h-3 text-[#C8DCCB]" /> Verified Partner: {user?.name || "Robin Hood Army"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              {currentCity.city} Hunger Relief Operation
            </h1>
            <p className="text-xs sm:text-sm text-[#C8DCCB] max-w-xl">
              Real-time matching of expiring commercial surplus with certified relief networks. Zero edible food to landfill.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/rescue/apply"
              className="px-4 py-2.5 rounded-xl border border-[#7FA88A] text-xs font-semibold hover:bg-white/10 transition-colors"
            >
              Depot Credentials
            </Link>
          </div>
        </div>

        {statusNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* Operational Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <span className="text-[11px] font-bold uppercase text-gray-500">Today&apos;s Capacity</span>
            <div className="text-2xl font-black text-gray-900 mt-1">350 meals</div>
            <span className="text-[11px] text-emerald-700">128 meals claimed today</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <span className="text-[11px] font-bold uppercase text-gray-500">Urgent Batches Nearby</span>
            <div className="text-2xl font-black text-red-600 mt-1">{urgentBatches.length} pending</div>
            <span className="text-[11px] text-gray-500">Auto-routed by match algorithm</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <span className="text-[11px] font-bold uppercase text-gray-500">Active Rescues</span>
            <div className="text-2xl font-black text-[#245C43] mt-1">{activeRescues.length} in transit</div>
            <span className="text-[11px] text-emerald-700">Vehicles on the road</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <span className="text-[11px] font-bold uppercase text-gray-500">Lifetime Rescued</span>
            <div className="text-2xl font-black text-[#163A2A] mt-1">3,420 meals</div>
            <span className="text-[11px] text-gray-500">100% free community distribution</span>
          </div>
        </div>

        {/* Tab Filter Navigation */}
        <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--fw-border)" }}>
          <button
            type="button"
            onClick={() => setActiveTab("urgent")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "urgent"
                ? "bg-[#245C43] text-white shadow-xs"
                : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
            style={activeTab !== "urgent" ? { borderColor: "var(--fw-border)" } : {}}
          >
            Urgent Food Nearby ({urgentBatches.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "active"
                ? "bg-[#245C43] text-white shadow-xs"
                : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
            style={activeTab !== "active" ? { borderColor: "var(--fw-border)" } : {}}
          >
            Active Pipeline ({activeRescues.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "completed"
                ? "bg-[#245C43] text-white shadow-xs"
                : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
            style={activeTab !== "completed" ? { borderColor: "var(--fw-border)" } : {}}
          >
            Completed Rescues ({completedRescues.length})
          </button>
        </div>

        {/* ================= TAB 1: URGENT FOOD NEARBY ================= */}
        {activeTab === "urgent" && (
          <div className="space-y-4">
            <div className="p-3 bg-[#FAF7F0] border rounded-xl text-xs text-gray-700 leading-relaxed flex items-start gap-2" style={{ borderColor: "var(--fw-border)" }}>
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>Accredited Rescue Matching Algorithm:</strong> Batches are ranked using composite scoring: <strong>40% Distance</strong> + <strong>30% Daily Capacity</strong> + <strong>20% Expiry Urgency</strong> + <strong>10% Vehicle Availability</strong>.
              </div>
            </div>

            {urgentBatches.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border" style={{ borderColor: "var(--fw-border)" }}>
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-bold text-sm" style={{ color: "var(--charcoal)" }}>No Pending Urgent Food</h3>
                <p className="text-xs text-gray-500">All available commercial surplus in {currentCity.city} is currently claimed or handled.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {urgentBatches.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 border shadow-xs space-y-4"
                    style={{ borderColor: "var(--fw-border)" }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                            Urgent Redistribution Triggered
                          </span>
                          <span className="text-xs font-bold text-emerald-800">
                            Match Score: {item.matchingScore}%
                          </span>
                        </div>
                        <h3 className="font-extrabold text-base" style={{ color: "var(--charcoal)" }}>
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {item.providerName} • {item.address} ({item.distanceKm} km away)
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs text-gray-400">Available Surplus</div>
                        <div className="text-lg font-black text-gray-900">
                          {item.quantity} {item.unit}
                        </div>
                        <div className="text-xs text-red-600 font-semibold">{item.deadline}</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: "var(--fw-border)" }}>
                      <button
                        type="button"
                        onClick={() => transitionStatus(item.id, "REJECTED")}
                        className="px-4 py-2 rounded-xl border text-xs font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => transitionStatus(item.id, "ACCEPTED")}
                        className="btn-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Accept Rescue Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: ACTIVE PIPELINE ================= */}
        {activeTab === "active" && (
          <div className="space-y-4">
            {activeRescues.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border" style={{ borderColor: "var(--fw-border)" }}>
                <Truck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <h3 className="font-bold text-sm" style={{ color: "var(--charcoal)" }}>No Active Dispatches</h3>
                <p className="text-xs text-gray-500">Accept an urgent batch to start dispatch tracking.</p>
              </div>
            ) : (
              activeRescues.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border shadow-xs space-y-4"
                  style={{ borderColor: "var(--fw-border)" }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Status: {item.status.replace("_", " ")}
                        </span>
                        {item.assignedVolunteer && (
                          <span className="text-xs text-gray-500">
                            Assigned: <strong>{item.assignedVolunteer}</strong>
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-base" style={{ color: "var(--charcoal)" }}>
                        {item.title} ({item.quantity} {item.unit})
                      </h3>
                      <p className="text-xs text-gray-500">{item.providerName} • {item.address}</p>
                    </div>
                  </div>

                  {/* Progressive Actions based on status */}
                  <div className="pt-3 border-t flex items-center justify-between gap-3" style={{ borderColor: "var(--fw-border)" }}>
                    <div className="text-xs text-gray-500">
                      Pipeline Step: <strong>{item.status.replace("_", " ")}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status === "ACCEPTED" && (
                        <button
                          type="button"
                          onClick={() => transitionStatus(item.id, "PICKUP_ASSIGNED", "Fleet Volunteer Arun")}
                          className="btn-primary py-2 px-4 text-xs font-bold"
                        >
                          Assign Volunteer Driver
                        </button>
                      )}
                      {item.status === "PICKUP_ASSIGNED" && (
                        <button
                          type="button"
                          onClick={() => transitionStatus(item.id, "EN_ROUTE")}
                          className="btn-primary py-2 px-4 text-xs font-bold"
                        >
                          Mark Volunteer En Route
                        </button>
                      )}
                      {item.status === "EN_ROUTE" && (
                        <button
                          type="button"
                          onClick={() => transitionStatus(item.id, "PICKED_UP")}
                          className="btn-primary py-2 px-4 text-xs font-bold"
                        >
                          Confirm Food Picked Up from Kitchen
                        </button>
                      )}
                      {item.status === "PICKED_UP" && (
                        <button
                          type="button"
                          onClick={() => transitionStatus(item.id, "RECEIVED")}
                          className="btn-primary py-2 px-4 text-xs font-bold"
                        >
                          Confirm Delivered to Depot/Kitchen
                        </button>
                      )}
                      {item.status === "RECEIVED" && (
                        <button
                          type="button"
                          onClick={() => transitionStatus(item.id, "COMPLETED")}
                          className="btn-primary py-2 px-4 text-xs font-bold"
                        >
                          Sign Distribution & Complete Rescue
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ================= TAB 3: COMPLETED RESCUES ================= */}
        {activeTab === "completed" && (
          <div className="space-y-4">
            {completedRescues.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border shadow-xs space-y-2"
                style={{ borderColor: "var(--fw-border)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-sm" style={{ color: "var(--charcoal)" }}>
                      {item.title}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">Verified Completed</span>
                </div>
                <p className="text-xs text-gray-500">
                  Rescued {item.quantity} {item.unit} from {item.providerName} • Delivered to local community shelter.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
