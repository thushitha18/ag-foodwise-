"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "@/lib/location-context";
import { mockFoodListings, mockOrders, platformStats } from "@/lib/mock-data";
import { FoodListing, OrderStatus, UrgencyLevel } from "@/types";

import { UrgencyBadge } from "@/components/food/UrgencyBadge";
import { Countdown } from "@/components/food/Countdown";
import { haversineDistance, formatDistance } from "@/lib/distance";
import {
  ShoppingBag,
  Compass,
  MapPin,
  Clock,
  Heart,
  BarChart3,
  User,
  Search,
  Filter,
  Navigation,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  Leaf,
  Store,
  Calendar } from "lucide-react";


export default function ConsumerPage() {
  const { user } = useAuth();
  const { currentCity } = useLocation();

  const [activeNav, setActiveNav] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedUrgency, setSelectedUrgency] = useState("ALL");
  const [sortBy, setSortBy] = useState("distance");
  const [favorites, setFavorites] = useState(["fl-1", "fl-3"]);

  // Calculate real distance for listings from current city coords
  const listingsWithDistance = useMemo(() => {
    return mockFoodListings.map((item) => {
      const lat = item.latitude || currentCity.latitude;
      const lng = item.longitude || currentCity.longitude;
      const dist = haversineDistance(currentCity.latitude, currentCity.longitude, lat, lng);
      return {
        ...item,
        distanceKm: dist };
    });
  }, [currentCity]);

  // Filtered listings
  const filteredListings = useMemo(() => {
    return listingsWithDistance.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.provider?.name && item.provider.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;

      const matchesUrgency =
        selectedUrgency === "ALL" || item.urgencyLevel === selectedUrgency;

      return matchesSearch && matchesCategory && matchesUrgency;
    }).sort((a, b) => {
      if (sortBy === "distance") return (a.distanceKm || 0) - (b.distanceKm || 0);
      if (sortBy === "urgency") {
        const scoreA = a.urgencyLevel === UrgencyLevel.URGENT ? 0 : 1;
        const scoreB = b.urgencyLevel === UrgencyLevel.URGENT ? 0 : 1;
        return scoreA - scoreB;
      }
      if (sortBy === "portions") return (b.quantityAvailable || 0) - (a.quantityAvailable || 0);
      if (sortBy === "expiry") {
        return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
      }
      return 0;
    });
  }, [listingsWithDistance, searchQuery, selectedCategory, selectedUrgency, sortBy]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activeOrders = mockOrders.filter(
    (o) => o.status !== OrderStatus.COMPLETED && o.status !== OrderStatus.CANCELLED
  );
  const pastOrders = mockOrders.filter(
    (o) => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.CANCELLED
  );

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header & Persona Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5" style={{ borderColor: "var(--fw-border)" }}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Consumer Experience • {currentCity.city}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--charcoal)" }}>
              Welcome, {user?.name || "Priya"}
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
              Discover affordable surplus food near {currentCity.city}. Save money and rescue surplus from landfills.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/orders"
              className="px-3 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 hover:bg-white"
              style={{ borderColor: "var(--fw-border)", color: "var(--charcoal)" }}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
              Orders ({mockOrders.length})
            </Link>
            <Link
              href="/complaints"
              className="px-3 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 hover:bg-white"
              style={{ borderColor: "var(--fw-border)", color: "var(--charcoal)" }}
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              Help & Complaints
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b" style={{ borderColor: "var(--fw-border)" }}>
          {[
            { id: "home", label: "Home", icon: Sparkles },
            { id: "explore", label: "Explore Food", icon: Compass },
            { id: "orders", label: "My Orders", icon: ShoppingBag, count: activeOrders.length },
            { id: "favorites", label: "Favorites", icon: Heart, count: favorites.length },
            { id: "impact", label: "My Impact", icon: Leaf },
            { id: "profile", label: "Profile", icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeNav === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveNav(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#245C43] text-white shadow-xs"
                    : "bg-white text-[#242522] border hover:bg-gray-50"
                }`}
                style={!isActive ? { borderColor: "var(--fw-border)" } : {}}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ================= TAB: HOME ================= */}
        {activeNav === "home" && (
          <div className="space-y-8">
            {/* Active Order Banner if any */}
            {activeOrders.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderColor: "var(--fw-border)" }}>
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Active Order Ready</span>
                      <span className="text-xs font-mono text-gray-500">#{activeOrders[0].id}</span>
                    </div>
                    <div className="font-extrabold text-base" style={{ color: "var(--charcoal)" }}>
                      {activeOrders[0].listing?.title || "Surplus Reservation"}
                    </div>
                    <p className="text-xs text-gray-500">
                      Counter verification code: <strong className="font-mono font-bold text-gray-800">{activeOrders[0].pickupCode}</strong> ({activeOrders[0].provider?.name})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link
                    href={`/orders/${activeOrders[0].id}/track`}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    style={{ background: "var(--forest)" }}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Open Tracking Map
                  </Link>
                  <Link
                    href={`/orders/${activeOrders[0].id}`}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold border text-center hover:bg-gray-50"
                    style={{ borderColor: "var(--fw-border)", color: "var(--charcoal)" }}
                  >
                    View Pass
                  </Link>
                </div>
              </div>
            )}

            {/* Expiring Soon & Recommendations Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-red-600">
                    <Clock className="w-3.5 h-3.5" />
                    Expiring Soon (&lt; 2 Hours)
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--charcoal)" }}>
                    Urgent Local Surplus
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUrgency(UrgencyLevel.URGENT);
                    setActiveNav("explore");
                  }}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  View All Urgent <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listingsWithDistance
                  .filter((item) => item.urgencyLevel === UrgencyLevel.URGENT)
                  .slice(0, 3)
                  .map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                      style={{ borderColor: "var(--fw-border)" }}
                    >
                      <div className="relative h-44 w-full bg-gray-100">
                        <Image
                          src={listing.images[0] || listing.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"}
                          alt={listing.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <UrgencyBadge urgencyLevel={listing.urgencyLevel} expiresAt={listing.expiresAt} />
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(listing.id)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-gray-700 hover:text-red-500 shadow-xs"
                        >
                          <Heart
                            className={`w-4 h-4 ${favorites.includes(listing.id) ? "fill-red-500 text-red-500" : ""}`}
                          />
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                            <span className="font-semibold text-emerald-800">{listing.category}</span>
                            <span>{formatDistance(listing.distanceKm || 1.2)} away</span>
                          </div>
                          <h3 className="font-bold text-sm line-clamp-1" style={{ color: "var(--charcoal)" }}>
                            {listing.title}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Store className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate">{listing.provider?.name || "Local Kitchen"}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--fw-border)" }}>
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">🆓 FREE</span>
                            <div className="text-[10px] text-gray-400 mt-0.5">{listing.quantityAvailable || 5} portions left</div>
                          </div>

                          <Link
                            href={`/food/${listing.id}`}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-95"
                            style={{ background: "var(--forest)" }}
                          >
                            Claim Free →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recommendations with Explainability Factor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-emerald-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Scored Recommendations
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--charcoal)" }}>
                    Curated For You
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listingsWithDistance.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border p-4.5 space-y-3 shadow-xs hover:shadow-md transition-all"
                    style={{ borderColor: "var(--fw-border)" }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                          94% Match Score
                        </span>
                        <h4 className="font-bold text-sm mt-1.5" style={{ color: "var(--charcoal)" }}>
                          {item.title}
                        </h4>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">🆓 FREE</span>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>

                    {/* Recommendation explanation factor breakdown */}
                    <div className="p-2.5 rounded-xl bg-[#FAF7F0] border text-[11px] space-y-1" style={{ borderColor: "var(--fw-border)" }}>
                      <span className="font-semibold text-gray-700 block">Why Recommended:</span>
                      <div className="text-gray-500 space-y-0.5">
                        <div>• Proximity: {formatDistance(item.distanceKm || 1.4)} from your location</div>
                        <div>• Freshness: Prepared freshly within the last 3 hours</div>
                        <div>• Value: Completely free — zero cost to you</div>
                      </div>
                    </div>

                    <Link
                      href={`/food/${item.id}`}
                      className="block w-full text-center py-2 rounded-lg text-xs font-bold text-white"
                      style={{ background: "var(--forest-light)" }}
                    >
                      View Details & Reserve
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: EXPLORE ================= */}
        {activeNav === "explore" && (
          <div className="space-y-6">
            {/* Search and Filters Bar */}
            <div className="bg-white rounded-2xl p-4 border shadow-xs space-y-4" style={{ borderColor: "var(--fw-border)" }}>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by food title, restaurant, or keyword..."
                    className="fw-input pl-9 text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="fw-select text-xs"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="MEALS">Meals & Platters</option>
                    <option value="BAKERY">Bakery & Breads</option>
                    <option value="FRESH_PRODUCE">Produce & Veg</option>
                    <option value="SNACKS">Snacks & Fast</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="fw-select text-xs"
                  >
                    <option value="distance">Nearest First</option>
                    <option value="urgency">Most Urgent</option>
                    <option value="portions">Most Portions</option>
                    <option value="expiry">Expiring Soonest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                  style={{ borderColor: "var(--fw-border)" }}
                >
                  <div className="relative h-44 w-full bg-gray-100">
                    <Image
                      src={listing.images[0] || listing.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"}
                      alt={listing.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <UrgencyBadge urgencyLevel={listing.urgencyLevel} expiresAt={listing.expiresAt} />
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(listing.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-gray-700 hover:text-red-500 shadow-xs"
                    >
                      <Heart
                        className={`w-4 h-4 ${favorites.includes(listing.id) ? "fill-red-500 text-red-500" : ""}`}
                      />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                        <span className="font-semibold text-emerald-800">{listing.category}</span>
                        <span>{formatDistance(listing.distanceKm || 1.2)}</span>
                      </div>
                      <h3 className="font-bold text-sm line-clamp-1" style={{ color: "var(--charcoal)" }}>
                        {listing.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{listing.description}</p>
                    </div>

                    <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--fw-border)" }}>
                      <div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">🆓 FREE</span>
                        <div className="text-[10px] text-gray-400 mt-0.5">{listing.quantityAvailable || 5} portions left</div>
                      </div>

                      <Link
                        href={`/food/${listing.id}`}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white"
                        style={{ background: "var(--forest)" }}
                      >
                        Claim Free
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: ORDERS ================= */}
        {activeNav === "orders" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold" style={{ color: "var(--charcoal)" }}>
              Order History & Tracking
            </h2>

            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  style={{ borderColor: "var(--fw-border)" }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gray-600">#{order.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.status === OrderStatus.COMPLETED
                            ? "bg-gray-100 text-gray-700"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="font-bold text-base" style={{ color: "var(--charcoal)" }}>
                      {order.listing?.title || "Surplus Reservation"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Kitchen: <strong>{order.provider?.name}</strong> • Quantity: {order.quantity} portions • <span className="font-bold text-emerald-700">FREE</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/orders/${order.id}/track`}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1"
                      style={{ background: "var(--forest)" }}
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Live Track
                    </Link>
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold border hover:bg-gray-50"
                      style={{ borderColor: "var(--fw-border)", color: "var(--charcoal)" }}
                    >
                      Pickup Pass
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: FAVORITES ================= */}
        {activeNav === "favorites" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold" style={{ color: "var(--charcoal)" }}>
              Saved Favorite Listings ({favorites.length})
            </h2>

            {favorites.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border" style={{ borderColor: "var(--fw-border)" }}>
                <Heart className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>
                  No favorites saved yet.
                </p>
                <button
                  onClick={() => setActiveNav("explore")}
                  className="mt-3 text-xs font-bold text-emerald-700 underline"
                >
                  Explore food to bookmark
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listingsWithDistance
                  .filter((item) => favorites.includes(item.id))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border p-4 space-y-3 shadow-xs"
                      style={{ borderColor: "var(--fw-border)" }}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm" style={{ color: "var(--charcoal)" }}>
                          {item.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(item.id)}
                          className="text-red-500"
                        >
                          <Heart className="w-4 h-4 fill-red-500" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.provider?.name} • {formatDistance(item.distanceKm || 1.2)}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--fw-border)" }}>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">🆓 FREE</span>
                        <Link
                          href={`/food/${item.id}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                          style={{ background: "var(--forest)" }}
                        >
                          Reserve
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: IMPACT ================= */}
        {activeNav === "impact" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold" style={{ color: "var(--charcoal)" }}>
              Your Sustainability Ledger
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl p-5 border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
                <div className="text-xs font-bold uppercase text-emerald-800 mb-1">Meals Rescued</div>
                <div className="text-3xl font-extrabold text-[#245C43]">5 portions</div>
                <p className="text-xs text-gray-500 mt-1">Saved from commercial kitchen disposal</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
                <div className="text-xs font-bold uppercase text-teal-800 mb-1">CO₂ Emissions Prevented</div>
                <div className="text-3xl font-extrabold text-[#163A2A]">12.5 kg</div>
                <p className="text-xs text-gray-500 mt-1">Equivalent to 48 km driving in a petrol car</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
                <div className="text-xs font-bold uppercase text-amber-800 mb-1">Free Meals Claimed</div>
                <div className="text-3xl font-extrabold text-amber-700">12</div>
                <p className="text-xs text-gray-500 mt-1">Quality meals enjoyed at zero cost</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border shadow-xs space-y-3" style={{ borderColor: "var(--fw-border)" }}>
              <h3 className="font-bold text-sm" style={{ color: "var(--charcoal)" }}>
                Verified City-Wide Impact ({currentCity.city})
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Across {currentCity.city}, FoodWise community members have rescued{" "}
                <strong>{platformStats.mealsSaved.toLocaleString()} meals</strong>, preventing{" "}
                <strong>{platformStats.co2PreventedKg.toLocaleString()} kg</strong> of greenhouse gas emissions.
              </p>
              <Link
                href="/impact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 underline pt-1"
              >
                View Full Platform Impact Ledger <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* ================= TAB: PROFILE ================= */}
        {activeNav === "profile" && (
          <div className="bg-white rounded-2xl p-6 border shadow-xs space-y-6 max-w-2xl" style={{ borderColor: "var(--fw-border)" }}>
            <div className="border-b pb-4" style={{ borderColor: "var(--fw-border)" }}>
              <h2 className="text-lg font-bold" style={{ color: "var(--charcoal)" }}>
                Consumer Profile
              </h2>
              <p className="text-xs text-gray-500">Manage your persona preferences and active location</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="fw-label">Full Name</label>
                <div className="font-semibold text-sm text-gray-800">{user?.name || "Priya Sharma"}</div>
              </div>
              <div>
                <label className="fw-label">Registered Email</label>
                <div className="font-semibold text-sm text-gray-800">{user?.email || "consumer@foodwise.demo"}</div>
              </div>
              <div>
                <label className="fw-label">Current Region Hub</label>
                <div className="font-semibold text-sm text-emerald-700">{currentCity.city}</div>
              </div>
            </div>

            <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--fw-border)" }}>
              <Link href="/join" className="text-xs font-bold text-emerald-700 underline">
                Switch Role / Logout
              </Link>
              <span className="text-[11px] text-gray-400">FoodWise Consumer Account • Active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
