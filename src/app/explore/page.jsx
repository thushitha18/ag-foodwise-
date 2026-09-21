"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { mockFoodListings } from "@/lib/mock-data";
import { FoodListing, FoodCategory, UrgencyLevel } from "@/types";
import { FoodCard } from "@/components/food/FoodCard";
import { useLocation } from "@/lib/location-context";
import { haversineDistance } from "@/lib/distance";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ArrowUpDown,
  X,
  Filter,
  LayoutGrid,
  List,
  Clock,
  Heart,
  Store } from "lucide-react";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { currentCity, setCity, cities } = useLocation();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedArea, setSelectedArea] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDietary, setSelectedDietary] = useState("ALL");
  const [selectedUrgency, setSelectedUrgency] = useState("ALL");
  const [selectedSource, setSelectedSource] = useState("ALL");
  const [maxDistanceKm, setMaxDistanceKm] = useState(25);
  const [rescueOnly, setRescueOnly] = useState(false);
  const [sortBy, setSortBy] = useState("RECOMMENDED");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const categories = ["ALL", ...Object.values(FoodCategory)];

  // Filter listings
  const filteredListings = useMemo(() => {
    return mockFoodListings.filter((listing) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = listing.title.toLowerCase().includes(q);
        const matchesDesc = listing.description.toLowerCase().includes(q);
        const matchesProvider = listing.provider?.name?.toLowerCase().includes(q);
        const matchesCategory = listing.category.toLowerCase().includes(q);
        const matchesLocation = (listing.location || listing.provider?.address || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesProvider && !matchesCategory && !matchesLocation) return false;
      }

      // Area filter
      if (selectedArea !== "ALL") {
        const loc = (listing.location || listing.provider?.address || "").toLowerCase();
        if (!loc.includes(selectedArea.toLowerCase())) return false;
      }

      // Category filter
      if (selectedCategory !== "ALL" && listing.category !== selectedCategory) {
        return false;
      }

      // Dietary filter
      if (selectedDietary !== "ALL") {
        if (selectedDietary === "VEG" && !listing.dietaryTags.some(t => t.toLowerCase().includes("veg") && !t.toLowerCase().includes("non"))) {
          return false;
        }
        if (selectedDietary === "NON_VEG" && !listing.dietaryTags.some(t => t.toLowerCase().includes("non-veg"))) {
          return false;
        }
        if (selectedDietary === "VEGAN" && !listing.dietaryTags.some(t => t.toLowerCase().includes("vegan"))) {
          return false;
        }
      }

      // Urgency filter
      if (selectedUrgency !== "ALL" && listing.urgencyLevel !== selectedUrgency) {
        return false;
      }

      // Source filter (Community Donor vs Commercial Provider)
      if (selectedSource === "COMMUNITY") {
        const isComm = listing.provider?.businessType === "OTHER" || listing.provider?.name.toLowerCase().includes("home") || listing.provider?.name.toLowerCase().includes("community");
        if (!isComm) return false;
      } else if (selectedSource === "PROVIDER") {
        const isComm = listing.provider?.businessType === "OTHER" || listing.provider?.name.toLowerCase().includes("home") || listing.provider?.name.toLowerCase().includes("community");
        if (isComm) return false;
      }

      // Distance filter
      const lat = listing.latitude || currentCity.latitude;
      const lng = listing.longitude || currentCity.longitude;
      const dist = haversineDistance(currentCity.latitude, currentCity.longitude, lat, lng);
      if (dist > maxDistanceKm) {
        return false;
      }

      // Rescue only
      if (rescueOnly && !listing.isRescueEligible) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedArea, selectedCategory, selectedDietary, selectedUrgency, selectedSource, maxDistanceKm, rescueOnly, currentCity]);

  // Sort filtered listings
  const sortedListings = useMemo(() => {
    return [...filteredListings].sort((a, b) => {
      if (sortBy === "DISTANCE") {
        const distA = haversineDistance(currentCity.latitude, currentCity.longitude, a.latitude || currentCity.latitude, a.longitude || currentCity.longitude);
        const distB = haversineDistance(currentCity.latitude, currentCity.longitude, b.latitude || currentCity.latitude, b.longitude || currentCity.longitude);
        return distA - distB;
      }
      if (sortBy === "URGENCY") {
        const timeA = new Date(a.expiresAt).getTime();
        const timeB = new Date(b.expiresAt).getTime();
        return timeA - timeB;
      }
      if (sortBy === "PORTIONS") {
        return b.quantity - a.quantity;
      }
      // RECOMMENDED default (by score & freshness)
      return (b.recommendationScore || 0) - (a.recommendationScore || 0);
    });
  }, [filteredListings, sortBy, currentCity]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedArea("ALL");
    setSelectedCategory("ALL");
    setSelectedDietary("ALL");
    setSelectedUrgency("ALL");
    setSelectedSource("ALL");
    setMaxDistanceKm(25);
    setRescueOnly(false);
    setSortBy("RECOMMENDED");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedArea !== "ALL" ||
    selectedCategory !== "ALL" ||
    selectedDietary !== "ALL" ||
    selectedUrgency !== "ALL" ||
    selectedSource !== "ALL" ||
    maxDistanceKm < 25 ||
    rescueOnly;

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header & City Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: "var(--fw-border)" }}>
          <div>
            <span className="text-xs font-bold text-[#245C43] uppercase tracking-wider">
              Free Food Surplus Redistribution
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#163A2A]">
              Discover Surplus Food
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Browse wholesome surplus food available for pickup in {currentCity.city}. All food is 100% free to claim.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* City Switcher */}
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-xs">
              <MapPin className="w-4 h-4 text-[#245C43]" />
              <select
                value={currentCity.city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setSelectedArea("ALL");
                }}
                className="text-xs font-black text-[#163A2A] bg-transparent focus:outline-none cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={c.city} value={c.city}>
                    {c.city}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-white rounded-xl p-1 border border-gray-200">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg ${viewMode === "grid" ? "bg-emerald-50 text-[#245C43] font-bold" : "text-gray-400"}`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg ${viewMode === "list" ? "bg-emerald-50 text-[#245C43] font-bold" : "text-gray-400"}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold shadow-xs text-gray-700"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#245C43]" />
              Filters {hasActiveFilters && "(Active)"}
            </button>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-3 sm:p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search meals, bakery, produce, or locations in ${currentCity.city}...`}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#245C43]/20 focus:border-[#245C43] text-gray-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="md:col-span-4 flex items-center justify-end gap-2">
            <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1 font-semibold">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#245C43]"
            >
              <option value="RECOMMENDED">✨ Recommended</option>
              <option value="DISTANCE">📍 Nearest First</option>
              <option value="URGENCY">⏰ Expiring Soonest</option>
              <option value="PORTIONS">📦 Most Portions</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#245C43] text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {cat === "ALL" ? "All Categories" : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Main Content: Sidebar Filters + Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-2xl border shadow-xs space-y-6 sticky top-24" style={{ borderColor: "var(--fw-border)" }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--fw-border)" }}>
              <span className="font-black text-sm text-[#163A2A] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#245C43]" /> Filter Food
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-red-600 hover:text-red-700 font-bold"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Area Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Area in {currentCity.city}
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#245C43]"
              >
                <option value="ALL">All Areas in {currentCity.city}</option>
                {currentCity.areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Source Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Food Source
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: "ALL", label: "All Available Food" },
                  { id: "COMMUNITY", label: "Community & Home Donated" },
                  { id: "PROVIDER", label: "Commercial Surplus" },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="source"
                      checked={selectedSource === item.id}
                      onChange={() => setSelectedSource(item.id)}
                      className="accent-[#245C43]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dietary Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Dietary Preference
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: "ALL", label: "Any Dietary Type" },
                  { id: "VEG", label: "Pure Vegetarian" },
                  { id: "NON_VEG", label: "Non-Vegetarian" },
                  { id: "VEGAN", label: "Vegan Friendly" },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="dietary"
                      checked={selectedDietary === item.id}
                      onChange={() => setSelectedDietary(item.id)}
                      className="accent-[#245C43]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Urgency Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Urgency & Freshness
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: "ALL", label: "All Freshness Windows" },
                  { id: UrgencyLevel.URGENT, label: "⚡ Urgent (< 2h remaining)" },
                  { id: UrgencyLevel.ATTENTION, label: "⏰ Ending Soon (< 6h)" },
                  { id: UrgencyLevel.NORMAL, label: "🥗 Fresh Surplus" },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="urgency"
                      checked={selectedUrgency === item.id}
                      onChange={() => setSelectedUrgency(item.id)}
                      className="accent-[#245C43]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Distance Filter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="font-bold text-gray-700 uppercase tracking-wider">
                  Distance Range
                </label>
                <span className="font-black text-[#245C43]">Within {maxDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#245C43]"
              />
            </div>

            {/* Rescue Eligible Toggle */}
            <div className="pt-2 border-t" style={{ borderColor: "var(--fw-border)" }}>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-gray-700">
                  Rescue Partner Eligible
                </span>
                <input
                  type="checkbox"
                  checked={rescueOnly}
                  onChange={(e) => setRescueOnly(e.target.checked)}
                  className="rounded border-gray-300 text-[#245C43] focus:ring-[#245C43] h-4 w-4"
                />
              </label>
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="lg:col-span-9 space-y-4">
            {/* Results count & status */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                Showing <strong className="text-[#163A2A] font-black">{sortedListings.length}</strong> available food items in {currentCity.city}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-[#245C43] hover:underline font-bold"
                >
                  Clear active filters
                </button>
              )}
            </div>

            {sortedListings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border text-center space-y-3" style={{ borderColor: "var(--fw-border)" }}>
                <p className="text-base font-bold text-gray-800">
                  No food listings match your current filters.
                </p>
                <p className="text-xs text-gray-500">
                  Try broadening your location radius or selecting &quot;All Categories&quot;.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#245C43] text-white font-bold text-xs shadow-sm hover:bg-[#163A2A] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {sortedListings.map((listing) => (
                  <FoodCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-gray-500">Loading food discovery...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
