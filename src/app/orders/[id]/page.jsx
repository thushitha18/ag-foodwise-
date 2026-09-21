"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { mockFoodListings, mockRescuePartners } from "@/lib/mock-data";
import { UrgencyLevel } from "@/types";

import { UrgencyBadge } from "@/components/food/UrgencyBadge";
import {
  MapPin,
  Filter,
  Navigation,
  Sparkles,
  Zap,
  Clock,
  Layers,
  Search } from "lucide-react";

// Dynamic import with SSR disabled for Leaflet
const DynamicLeafletMap = dynamic(
  () => import("@/components/map/LeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-slate-100 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400">
        <MapPin className="w-8 h-8 animate-bounce text-emerald-600" />
        <span className="text-sm font-medium">Loading Live Chennai Surplus Map...</span>
      </div>
    ) }
);

export default function MapPage() {
  const [filterType, setFilterType] = useState("ALL");
  const [selectedListingId, setSelectedListingId] = useState(null);

  const filteredListings = useMemo(() => {
    return mockFoodListings.filter((item) => {
      if (filterType === "URGENT") return item.urgencyLevel === UrgencyLevel.URGENT;
      if (filterType === "VEG") return item.dietaryTags.some(t => t.toLowerCase().includes("veg") && !t.toLowerCase().includes("non"));
      return true;
    });
  }, [filterType]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <Navigation className="w-3.5 h-3.5" />
              Live Geofenced Surplus
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Surplus & Rescue Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Interactive geographic view of available surplus food batches and hunger relief hubs in Chennai.
            </p>
          </div>

          {/* Map Filter Controls */}
          <div className="flex items-center gap-2 flex-wrap bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "ALL"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              All Pins ({mockFoodListings.length})
            </button>
            <button
              onClick={() => setFilterType("URGENT")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                filterType === "URGENT"
                  ? "bg-rose-600 text-white shadow"
                  : "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Urgent (&lt;2h)
            </button>
            <button
              onClick={() => setFilterType("VEG")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "VEG"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Pure Veg
            </button>
            <button
              onClick={() => setFilterType("RESCUE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === "RESCUE"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              NGO Hubs
            </button>
          </div>
        </div>

        {/* Map Layout: Left Listing List + Right Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Side Listing List */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 space-y-3 max-h-[640px] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-400">
                Surplus Batches Nearby ({filteredListings.length})
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">Chennai Central</span>
            </div>

            <div className="space-y-3">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => setSelectedListingId(listing.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedListingId === listing.id
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm"
                      : "border-slate-100 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <UrgencyBadge urgencyLevel={listing.urgencyLevel} expiresAt={listing.expiresAt} />
                    <span className="text-xs font-bold text-emerald-600">
                      FREE
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {listing.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>{listing.provider?.name}</span>
                    <span>{listing.distanceKm?.toFixed(1) || "1.2"} km</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{listing.quantity} {listing.unit} left</span>
                    <Link
                      href={`/food/${listing.id}`}
                      className="text-emerald-600 hover:underline font-semibold"
                    >
                      Reserve →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaflet Map Component */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-2 shadow-sm">
            <DynamicLeafletMap
              listings={filteredListings}
              rescuePartners={mockRescuePartners}
              selectedFilter={filterType}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
