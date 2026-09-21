"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { mockOrders, mockFoodListings } from "@/lib/mock-data";
import { FoodCard } from "@/components/food/FoodCard";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  ShoppingBag,
  Leaf,
  Heart,
  QrCode,
  ArrowRight,
  Sparkles,
  Store,
  Clock,
  CheckCircle2,
  PlusCircle,
  Navigation,
  Package,
  Layers,
  BarChart3,
  HeartHandshake,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  User } from "lucide-react";

export default function UnifiedDashboard() {
  const { user, role, switchRole } = useAuth();
  const { totalPortions, items: cartItems } = useCart();

  // Active section tab for unified experience
  const [activeTab, setActiveTab] = useState("DISCOVER");

  // Load user placed orders from localStorage merged with mock
  const [allOrders, setAllOrders] = useState(mockOrders);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fw_user_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = new Set(parsed.map((p) => p.id));
          const rest = mockOrders.filter((o) => !ids.has(o.id));
          setAllOrders([...parsed, ...rest]);
        }
      }
    } catch {}
  }, []);

  const activeOrders = allOrders.filter(
    (o) => o.status === "CONFIRMED" || o.status === "PREPARING" || o.status === "READY" || o.status === "READY_FOR_PICKUP"
  );

  const recommendedListings = mockFoodListings.slice(0, 3);
  const myDonatedListings = mockFoodListings.filter(
    (l) => l.provider?.businessType === "OTHER" || l.providerId === "p1"
  );

  const isProviderOrSeller =
    role === "provider" ||
    role === "individual_seller" ||
    role === "admin" ||
    user?.role === "provider" ||
    user?.role === "individual_seller";

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Unified Header Banner */}
        <div className="bg-[#163A2A] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-900/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-300">
                Unified FoodWise Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-emerald-200 border border-white/10 uppercase">
                {role || "Community Member"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome back, {user?.name || "Priya Sharma"}! 👋
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Explore nearby surplus food for free, manage your active pickup passes, or share food with your community.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/individual-seller"
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Donate Food
            </Link>

            <Link
              href="/cart"
              className="px-4 py-2.5 rounded-xl bg-white text-[#163A2A] hover:bg-emerald-50 font-bold text-xs shadow transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-[#245C43]" />
              Claim Cart ({totalPortions})
            </Link>
          </div>
        </div>

        {/* Impact Stats Grid (No Money, Free Food Metrics) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border shadow-xs space-y-1" style={{ borderColor: "var(--fw-border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">Meals Claimed</span>
              <ShoppingBag className="w-4 h-4 text-[#245C43]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#163A2A]">
              {allOrders.reduce((acc, o) => acc + (o.quantity || 1), 0)}
            </div>
            <div className="text-[11px] text-[#245C43] font-bold">100% Free surplus</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-xs space-y-1" style={{ borderColor: "var(--fw-border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">Food Donated</span>
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#245C43]">
              {myDonatedListings.length * 5} portions
            </div>
            <div className="text-[11px] text-gray-500">Shared with community</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-xs space-y-1" style={{ borderColor: "var(--fw-border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">CO₂ Prevented</span>
              <Leaf className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-teal-700">38.4 kg</div>
            <div className="text-[11px] text-teal-700 font-medium">Landfill waste diverted</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-xs space-y-1" style={{ borderColor: "var(--fw-border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">Impact Rank</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-700">Community Hero 🌟</div>
            <div className="text-[11px] text-gray-400">Zero Food Waste Champion</div>
          </div>
        </div>

        {/* Unified Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b overflow-x-auto pb-2 scrollbar-none" style={{ borderColor: "var(--fw-border)" }}>
          <button
            onClick={() => setActiveTab("DISCOVER")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "DISCOVER"
                ? "bg-[#245C43] text-white shadow-xs"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Discover Free Food
          </button>

          <button
            onClick={() => setActiveTab("MY_ORDERS")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "MY_ORDERS"
                ? "bg-[#245C43] text-white shadow-xs"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            My Food Claims ({activeOrders.length} active)
          </button>

          <button
            onClick={() => setActiveTab("DONATIONS")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "DONATIONS"
                ? "bg-[#245C43] text-white shadow-xs"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            My Donations & Food
          </button>

          <button
            onClick={() => setActiveTab("PROVIDER_TOOLS")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "PROVIDER_TOOLS"
                ? "bg-[#245C43] text-white shadow-xs"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Provider & Kitchen Tools {isProviderOrSeller && "✓"}
          </button>
        </div>

        {/* TAB 1: DISCOVER FOOD */}
        {activeTab === "DISCOVER" && (
          <div className="space-y-8">
            {/* Prominent Donate Food Banner */}
            <div className="p-6 rounded-3xl bg-white border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderColor: "var(--fw-border)" }}>
              <div className="space-y-1">
                <span className="text-xs font-black text-[#245C43] uppercase tracking-wider">
                  Community Sharing
                </span>
                <h3 className="text-lg font-black text-[#163A2A]">
                  Have Extra Food? Share it with someone nearby.
                </h3>
                <p className="text-xs text-gray-500 max-w-lg">
                  Prevent home or event food waste by listing extra portions. It takes 60 seconds and is completely free.
                </p>
              </div>

              <Link
                href="/individual-seller"
                className="px-5 py-3 rounded-xl bg-[#245C43] hover:bg-[#163A2A] text-white font-black text-xs shadow transition-all shrink-0 flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                ADD FOOD TO DONATE
              </Link>
            </div>

            {/* Recommended Surplus Listings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#163A2A]">
                    Available Food Nearby
                  </h2>
                  <p className="text-xs text-gray-500">
                    High-urgency fresh surplus meals ready to be claimed
                  </p>
                </div>

                <Link
                  href="/explore"
                  className="text-xs font-bold text-[#245C43] hover:underline flex items-center gap-1"
                >
                  View All ({mockFoodListings.length}) <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedListings.map((listing) => (
                  <FoodCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY ORDERS & CLAIMS */}
        {activeTab === "MY_ORDERS" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#163A2A]">
                  Active Claims & Digital Pickup Passes
                </h2>
                <p className="text-xs text-gray-500">
                  Present verification PINs to staff when collecting claimed food
                </p>
              </div>

              <Link
                href="/orders"
                className="text-xs font-bold text-[#245C43] hover:underline flex items-center gap-1"
              >
                Full Orders History <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border text-center space-y-3" style={{ borderColor: "var(--fw-border)" }}>
                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
                <h3 className="font-bold text-gray-800">No active pickup claims</h3>
                <p className="text-xs text-gray-500">You currently have no pending surplus reservations.</p>
                <Link
                  href="/explore"
                  className="inline-block px-5 py-2.5 rounded-xl bg-[#245C43] text-white font-bold text-xs shadow-xs"
                >
                  Discover Available Food
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-5 border shadow-xs space-y-4"
                    style={{ borderColor: "var(--fw-border)" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900">
                        {order.status}
                      </span>
                      <span className="text-xs font-mono text-gray-400">#{order.id}</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-[#163A2A] text-base">
                        {order.listing?.title || "Surplus Meal Batch"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Provider: {order.provider?.name} • Portions: <strong>{order.quantity}</strong>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF7F0] border border-gray-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Verification PIN</span>
                        <span className="font-mono text-base font-black text-[#245C43] tracking-widest">{order.pickupPin}</span>
                      </div>
                      <span className="font-black text-xs text-[#245C43]">FREE TO CLAIM</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href={`/orders/${order.id}/track`}
                        className="flex-1 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#245C43]" />
                        Track Pickup
                      </Link>
                      <Link
                        href={`/orders/${order.id}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#245C43] hover:bg-[#163A2A] text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Pickup Pass
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DONATIONS & SHARED FOOD */}
        {activeTab === "DONATIONS" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#163A2A]">
                  My Donated Food Listings
                </h2>
                <p className="text-xs text-gray-500">
                  Surplus meals you have made available for your community
                </p>
              </div>

              <Link
                href="/individual-seller"
                className="px-4 py-2.5 rounded-xl bg-[#245C43] hover:bg-[#163A2A] text-white font-bold text-xs shadow flex items-center gap-1.5 self-start"
              >
                <PlusCircle className="w-4 h-4" />
                Post New Surplus Food
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myDonatedListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl p-5 border shadow-xs flex gap-4 items-center"
                  style={{ borderColor: "var(--fw-border)" }}
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={listing.images[0] || listing.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#163A2A] truncate">{listing.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-[#245C43]">ACTIVE</span>
                    </div>
                    <div className="text-gray-500">{listing.quantity} {listing.unit || "portions"} available</div>
                    <div className="text-[11px] text-red-600 font-semibold">
                      Pickup cutoff: {new Date(listing.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: INTEGRATED PROVIDER TOOLS */}
        {activeTab === "PROVIDER_TOOLS" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--fw-border)" }}>
              <div>
                <div className="flex items-center gap-2 text-xs font-black text-[#245C43] uppercase tracking-wider">
                  <Store className="w-4 h-4" /> Kitchen & Commercial Tools
                </div>
                <h2 className="text-xl font-black text-[#163A2A] mt-0.5">
                  Integrated Provider Management
                </h2>
                <p className="text-xs text-gray-500">
                  Manage inventory, post new surplus batches, and trigger hunger relief rescue.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/provider/food/new"
                  className="px-4 py-2.5 rounded-xl bg-[#245C43] hover:bg-[#163A2A] text-white font-bold text-xs shadow flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  Post Kitchen Surplus
                </Link>
                <Link
                  href="/provider"
                  className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-bold text-xs text-gray-700"
                >
                  Full Provider Hub →
                </Link>
              </div>
            </div>

            {/* Provider Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/provider/food/new"
                className="bg-white p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all space-y-2 group"
                style={{ borderColor: "var(--fw-border)" }}
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#245C43] flex items-center justify-center font-bold">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#163A2A] group-hover:text-[#245C43]">Post Free Surplus</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  List prepared meals, bakery items, or buffet trays for free community pickup.
                </p>
              </Link>

              <Link
                href="/provider/rescue"
                className="bg-white p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all space-y-2 group"
                style={{ borderColor: "var(--fw-border)" }}
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#163A2A] group-hover:text-[#245C43]">Trigger NGO Rescue</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Automatically match urgent surplus batches with registered local shelter partners.
                </p>
              </Link>

              <Link
                href="/provider/analytics"
                className="bg-white p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all space-y-2 group"
                style={{ borderColor: "var(--fw-border)" }}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#163A2A] group-hover:text-[#245C43]">Surplus Analytics</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  View claim rates, food rescued, waste avoided, and demand forecasts without monetary metrics.
                </p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
