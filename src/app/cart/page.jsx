"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { UrgencyBadge } from "@/components/food/UrgencyBadge";
import { Countdown } from "@/components/food/Countdown";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { items, totalPortions, updateQuantity, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16" style={{ background: "var(--cream)" }}>
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-[#245C43] mb-6 shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#163A2A] text-center">
          Your Claim Cart is Empty
        </h1>
        <p className="mt-2 text-sm text-gray-600 max-w-md text-center">
          Explore wholesome surplus food available in your community and claim portions before they expire.
        </p>
        <Link
          href="/explore"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-[#245C43] hover:bg-[#163A2A] text-white shadow-md transition-all"
        >
          Discover Available Food
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10" style={{ background: "var(--cream)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: "var(--fw-border)" }}>
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link href="/explore" className="hover:text-[#245C43] flex items-center gap-1 font-semibold">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#163A2A]">
              Food Claim Cart
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Review your reserved food portions before confirming pickup.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-red-600 hover:text-red-700 self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
        </div>

        {/* Main Grid: Cart Items & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List (Left Column) */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.listingId}
                className="bg-white rounded-2xl border p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-4"
                style={{ borderColor: "var(--fw-border)" }}
              >
                {/* Food Image */}
                <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 112px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#245C43] text-white">
                      FREE
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#245C43]" />
                      {item.providerName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#245C43] border border-emerald-200">
                      FREE TO CLAIM
                    </span>
                  </div>

                  <Link
                    href={`/food/${item.listingId}`}
                    className="block font-bold text-base text-[#163A2A] hover:text-[#245C43] truncate transition-colors"
                  >
                    {item.title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {item.pickupLocation}
                    </span>
                    <span className="flex items-center gap-1 text-red-700 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      Pickup Deadline: {new Date(item.pickupDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs pt-0.5">
                    <Countdown expiresAt={item.expiresAt} className="text-xs font-bold text-red-600" />
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 font-medium">Max available: {item.maxAvailable}</span>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="flex items-center gap-2 border rounded-xl p-1 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.listingId, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white border shadow-2xs font-bold text-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-7 text-center font-black text-sm text-[#163A2A]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.listingId, item.quantity + 1)}
                      disabled={item.quantity >= item.maxAvailable}
                      className="w-7 h-7 rounded-lg bg-white border shadow-2xs font-bold text-sm flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 transition-colors"
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.listingId)}
                    className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Claim Summary Box (Right Column) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border p-6 shadow-lg space-y-6 sticky top-24" style={{ borderColor: "var(--fw-border)" }}>
              <div>
                <h2 className="text-lg font-black text-[#163A2A]">
                  Claim Summary
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  100% Free Surplus Food Rescue
                </p>
              </div>

              <div className="space-y-3 border-t border-b py-4 text-xs" style={{ borderColor: "var(--fw-border)" }}>
                <div className="flex justify-between text-gray-600">
                  <span>Food Items:</span>
                  <strong className="text-gray-900 font-bold">{items.length}</strong>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Food Portions:</span>
                  <strong className="text-emerald-800 font-black text-sm">{totalPortions} portions</strong>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Cost:</span>
                  <strong className="text-[#245C43] font-black text-sm uppercase">FREE</strong>
                </div>
              </div>

              {/* Free food highlight box */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-emerald-200 text-xs text-[#245C43] space-y-1">
                <div className="font-extrabold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#245C43]" />
                  All FoodWise food is free to claim.
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  FoodWise eliminates financial barriers so surplus food feeds communities instead of entering landfills.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="w-full py-4 px-4 rounded-xl text-sm font-extrabold bg-[#245C43] hover:bg-[#163A2A] text-white shadow-md flex items-center justify-center gap-2 transition-all"
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <Link
                  href="/explore"
                  className="text-xs font-bold text-gray-500 hover:text-[#245C43] transition-colors"
                >
                  + Add more food to claim
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
