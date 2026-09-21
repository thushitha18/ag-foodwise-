"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Countdown } from "@/components/food/Countdown";
import { UrgencyBadge } from "@/components/food/UrgencyBadge";
import {
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Navigation,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Home,
  Check } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPortions, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // User details state (prepopulated if logged in)
  const [name, setName] = useState(user?.name || "Priya Sharma");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [email, setEmail] = useState(user?.email || "priya.sharma@example.com");

  // Address state
  const [addressLine, setAddressLine] = useState("14, Cross Cut Road");
  const [area, setArea] = useState("Gandhipuram");
  const [city, setCity] = useState("Coimbatore");
  const [state, setState] = useState("Tamil Nadu");
  const [pincode, setPincode] = useState("641012");

  // Flow states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Sync user info if auth state updates
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Handle claim confirmation
  const handleConfirmClaim = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage("No items in your cart to claim.");
      return;
    }

    if (!name.trim() || !phone.trim() || !addressLine.trim() || !pincode.trim()) {
      setErrorMessage("Please fill in all contact and address fields.");
      return;
    }

    // Atomic / concurrency check: make sure requested quantity is within limits
    for (const item of items) {
      if (item.quantity > item.maxAvailable) {
        setErrorMessage(
          `Sorry, "${item.title}" only has ${item.maxAvailable} portion(s) remaining.`
        );
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const orderId = `FW-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const pickupPin = String(Math.floor(1000 + Math.random() * 9000));
    const primaryItem = items[0];

    // Build the order object compatible with the system
    const newOrder = {
      id: orderId,
      listingId: primaryItem.listingId,
      consumerId: user?.id || "cu-guest",
      providerId: "p1",
      quantity: totalPortions,
      totalPrice: 0,
      status: "CONFIRMED",
      pickupCode: orderId,
      pickupPin: pickupPin,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      listing: {
        id: primaryItem.listingId,
        title: primaryItem.title,
        images: [primaryItem.imageUrl],
        quantity: primaryItem.maxAvailable,
        unit: primaryItem.unit,
        originalPrice: 0,
        discountedPrice: 0,
        expiresAt: primaryItem.expiresAt,
        collection_deadline: primaryItem.pickupDeadline,
        urgencyLevel: primaryItem.urgencyLevel,
        category: "MEALS",
        dietaryTags: ["Veg"],
        description: `Claimed ${totalPortions} portion(s) through FoodWise free food rescue.` },
      provider: {
        id: "p1",
        name: primaryItem.providerName,
        address: primaryItem.pickupLocation,
        latitude: 11.0168,
        longitude: 76.9558,
        phone: "+91 98765 43211" } };

    // Store in localStorage so /orders and /orders/[id] see it immediately
    try {
      const existing = localStorage.getItem("fw_user_orders");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newOrder);
      localStorage.setItem("fw_user_orders", JSON.stringify(list));
    } catch {}

    setConfirmedOrder({
      orderId,
      pickupPin,
      items: [...items],
      totalPortions,
      pickupLocation: primaryItem.pickupLocation,
      pickupDeadline: primaryItem.pickupDeadline,
      claimantName: name });

    clearCart();
    setIsSubmitting(false);
  };

  // If order was confirmed, show the realistic Claim Confirmed screen
  if (confirmedOrder) {
    return (
      <div className="min-h-screen py-10" style={{ background: "var(--cream)" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border shadow-xl text-center space-y-5" style={{ borderColor: "var(--fw-border)" }}>
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#245C43] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-[#245C43] uppercase tracking-wider">
                Claim Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#163A2A] mt-2">
                FoodWise Claim Confirmed!
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Your surplus food reservation has been successfully registered. No payment required.
              </p>
            </div>

            {/* Order Code & QR Pass */}
            <div className="p-5 rounded-2xl bg-[#FAF7F0] border text-left space-y-3" style={{ borderColor: "var(--fw-border)" }}>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Order Claim ID</span>
                <span className="font-mono text-sm font-black text-[#163A2A]">{confirmedOrder.orderId}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Verification PIN:</span>
                <span className="font-mono text-lg font-black text-[#245C43] tracking-widest">{confirmedOrder.pickupPin}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Claimant:</span>
                <span className="text-xs font-bold text-gray-900">{confirmedOrder.claimantName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Total Portions:</span>
                <span className="text-xs font-black text-emerald-800">{confirmedOrder.totalPortions} portion(s)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Pickup Location:</span>
                <span className="text-xs font-semibold text-gray-800 text-right">{confirmedOrder.pickupLocation}</span>
              </div>

              <div className="flex items-center justify-between text-red-700">
                <span className="text-xs font-bold">Pickup Deadline:</span>
                <span className="text-xs font-black">
                  {new Date(confirmedOrder.pickupDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="pt-2 border-t flex justify-between items-center text-xs">
                <span className="font-bold text-gray-600">Total Amount:</span>
                <span className="font-black text-sm text-[#245C43] uppercase">FREE</span>
              </div>
            </div>

            {/* Claimed Items */}
            <div className="text-left space-y-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Claimed Food Items
              </h3>
              {confirmedOrder.items.map((it) => (
                <div key={it.listingId} className="flex items-center gap-3 p-3 rounded-xl border bg-gray-50/70 text-xs">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                    <Image src={it.imageUrl} alt={it.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 truncate">{it.title}</div>
                    <div className="text-[11px] text-gray-500">{it.providerName}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-800">{it.quantity} {it.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/orders/${confirmedOrder.orderId}/track`}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-black bg-[#245C43] hover:bg-[#163A2A] text-white shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <Navigation className="w-4 h-4" />
                TRACK ORDER
              </Link>
              <Link
                href={`/orders/${confirmedOrder.orderId}`}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold border border-[#245C43] text-[#245C43] hover:bg-emerald-50 bg-white flex items-center justify-center gap-1.5 transition-all"
              >
                <QrCode className="w-4 h-4" />
                VIEW ORDER PASS
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty and no order confirmed
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16" style={{ background: "var(--cream)" }}>
        <h1 className="text-2xl font-black text-[#163A2A]">No Food in Claim Cart</h1>
        <p className="text-xs text-gray-600 mt-2">Add available surplus portions to your cart before proceeding to checkout.</p>
        <Link
          href="/explore"
          className="mt-4 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#245C43] text-white shadow"
        >
          Discover Food
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--cream)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/cart" className="hover:text-[#245C43] flex items-center gap-1 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#163A2A]">
            Checkout & Food Claim Confirmation
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Confirm your contact details and pickup schedule to reserve your food portions.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleConfirmClaim} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: User Information & Pickup Address */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 1: User Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border shadow-xs space-y-4" style={{ borderColor: "var(--fw-border)" }}>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[#245C43]" />
                  <h2 className="text-sm font-black text-[#163A2A] uppercase tracking-wide">
                    1. Claimant Information
                  </h2>
                </div>
                {isAuthenticated && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#245C43]">
                    Auto-filled from Profile
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#245C43]/20 focus:border-[#245C43]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#245C43]/20 focus:border-[#245C43]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#245C43]/20 focus:border-[#245C43]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Pickup / Delivery Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border shadow-xs space-y-4" style={{ borderColor: "var(--fw-border)" }}>
              <div className="flex items-center gap-2 border-b pb-3">
                <Home className="w-4 h-4 text-[#245C43]" />
                <h2 className="text-sm font-black text-[#163A2A] uppercase tracking-wide">
                  2. Claimant Address & City
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-gray-700">Address Line *</label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="House/Apartment #, Street name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#245C43]/20 focus:border-[#245C43]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Area / Locality *</label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Gandhipuram, RS Puram"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#245C43]/20 focus:border-[#245C43]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#245C43]/20 focus:border-[#245C43] bg-white"
                  >
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">State *</label>
                  <input
                    type="text"
                    readOnly
                    value={state}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 641012"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#245C43]/20 focus:border-[#245C43]"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Ordered Food Items */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border shadow-xs space-y-4" style={{ borderColor: "var(--fw-border)" }}>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#245C43]" />
                  <h2 className="text-sm font-black text-[#163A2A] uppercase tracking-wide">
                    3. Food Claimed ({items.length} items)
                  </h2>
                </div>
                <Link href="/cart" className="text-xs font-bold text-[#245C43] hover:underline">
                  Edit Cart
                </Link>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.listingId}
                    className="p-4 rounded-2xl border bg-[#FAF7F0]/60 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs"
                    style={{ borderColor: "var(--fw-border)" }}
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#163A2A] truncate">{item.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#245C43]">
                          FREE
                        </span>
                      </div>
                      <div className="text-gray-500 font-medium">Provider: {item.providerName}</div>
                      <div className="flex flex-wrap items-center gap-x-4 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {item.pickupLocation}
                        </span>
                        <span className="text-red-700 font-semibold">
                          Pickup by: {new Date(item.pickupDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right sm:self-center font-black text-[#163A2A] text-sm">
                      {item.quantity} {item.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary: Claim Summary & Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border shadow-lg space-y-5 sticky top-24" style={{ borderColor: "var(--fw-border)" }}>
              <div>
                <h3 className="text-lg font-black text-[#163A2A]">
                  Claim Confirmation Summary
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Direct Community Surplus Redistribution
                </p>
              </div>

              <div className="space-y-3 border-t border-b py-4 text-xs" style={{ borderColor: "var(--fw-border)" }}>
                <div className="flex justify-between text-gray-600">
                  <span>Food Items:</span>
                  <strong className="text-gray-900 font-bold">{items.length}</strong>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Portions Claimed:</span>
                  <strong className="text-emerald-800 font-black text-sm">{totalPortions} portions</strong>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Claim Fee:</span>
                  <strong className="text-[#245C43] font-black text-sm">FREE</strong>
                </div>
              </div>

              {/* Free food highlight note */}
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-emerald-200 text-xs space-y-1.5">
                <div className="font-black text-[#245C43] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#245C43]" />
                  Your FoodWise claim is free.
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  By claiming this surplus food before the cutoff time, you are preventing edible food from being discarded.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 rounded-xl text-sm font-black bg-[#245C43] hover:bg-[#163A2A] disabled:opacity-50 text-white shadow-md flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting ? "PROCESSING CLAIM..." : "CONFIRM FOOD CLAIM"}
              </button>

              <div className="space-y-1 text-center">
                <p className="text-[11px] text-gray-400">
                  A verification PIN and pickup code will be generated upon confirmation.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
