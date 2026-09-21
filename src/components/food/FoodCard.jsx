"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UrgencyBadge } from "./UrgencyBadge";
import { Countdown } from "./Countdown";
import { useCart } from "@/lib/cart-context";
import { MapPin, ShieldCheck, Heart, Sparkles, Check, ShoppingBag, Plus } from "lucide-react";

export const FoodCard = ({
  listing,
  onQuickReserve,
  showProvider = true,
  priority = false,
}) => {
  const { addToCart, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const isVeg = listing.dietaryTags.some(
    (t) => t.toLowerCase().includes("veg") && !t.toLowerCase().includes("non")
  );
  const isNonVeg = listing.dietaryTags.some((t) => t.toLowerCase().includes("non-veg"));

  // Check if item is already in cart
  const inCartItem = items.find((i) => i.listingId === listing.id);
  const cartQty = inCartItem ? inCartItem.quantity : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = addToCart(
      {
        listingId: listing.id,
        title: listing.title,
        providerName: listing.provider?.name || "Verified Community Donor",
        pickupLocation: listing.location || listing.provider?.address || "Coimbatore Central",
        maxAvailable: listing.quantity,
        imageUrl: listing.images[0] || listing.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        unit: listing.unit || "portion",
        pickupDeadline: listing.collection_deadline || listing.expiresAt,
        expiresAt: listing.expiresAt,
        urgencyLevel: listing.urgencyLevel,
      },
      1
    );

    if (result.success) {
      setJustAdded(true);
      setErrorMessage(null);
      setTimeout(() => setJustAdded(false), 2000);
    } else {
      setErrorMessage(result.message || "Cannot add more");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Image Container */}
      <div className="relative w-full h-48 sm:h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <Image
          src={listing.images[0] || listing.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Urgency Badge at Top-Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <UrgencyBadge urgencyLevel={listing.urgencyLevel} expiresAt={listing.expiresAt} />
          {listing.isRescueEligible && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-600/90 text-white backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3 h-3" />
              Rescue Eligible
            </span>
          )}
        </div>

        {/* Top-Right: Free To Claim Badge & Favorite */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide bg-[#245C43] text-white shadow-md border border-white/20">
            FREE TO CLAIM
          </span>
          <button
            type="button"
            aria-label="Save to favorites"
            className="w-8 h-8 rounded-full bg-white/85 dark:bg-slate-800/85 backdrop-blur-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:bg-white transition-colors"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Countdown Over Image Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
          <Countdown
            expiresAt={listing.expiresAt}
            className="text-white drop-shadow-md bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md"
          />
          {listing.distanceKm !== undefined && (
            <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-[11px] drop-shadow-md">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {listing.distanceKm.toFixed(1)} km away
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Provider info & Category */}
        {showProvider && (
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-semibold truncate text-slate-700 dark:text-slate-300">
              {listing.provider?.name || "Community Kitchen"}
              {listing.provider?.isVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-[#245C43] shrink-0 inline" />
              )}
            </span>
            <span className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium text-slate-600 dark:text-slate-300 shrink-0">
              {listing.category}
            </span>
          </div>
        )}

        {/* Title */}
        <Link href={`/food/${listing.id}`} className="block group-hover:text-[#245C43] transition-colors">
          <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">
            {listing.title}
          </h3>
        </Link>

        {/* Location & Details */}
        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="w-3 h-3 text-[#245C43] shrink-0" />
          <span className="truncate">{listing.location || listing.provider?.address || "Coimbatore"}</span>
        </div>

        {/* Description */}
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[32px] leading-relaxed">
          {listing.description}
        </p>

        {/* Dietary tags & Quantity available */}
        <div className="mt-3 flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {isVeg && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Veg
              </span>
            )}
            {isNonVeg && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Non-Veg
              </span>
            )}
            {listing.allergens && listing.allergens.length > 0 && (
              <span className="text-[10px] text-slate-400">
                Contains: {listing.allergens.slice(0, 2).join(", ")}
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-xs font-black text-[#163A2A] dark:text-emerald-400">
              {listing.quantity} {listing.unit || "portions"}
            </span>
            <span className="text-[10px] text-slate-500 block">available</span>
          </div>
        </div>

        {/* Error message if adding exceeds stock */}
        {errorMessage && (
          <div className="mt-2 text-[11px] text-red-600 font-medium bg-red-50 p-1.5 rounded-lg text-center">
            {errorMessage}
          </div>
        )}

        {/* Action Row - Free food claim buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs font-black text-[#245C43] dark:text-emerald-400 uppercase tracking-wide">
              Free to Claim
            </span>
            <span className="text-[10px] text-slate-400">
              Community Food Share
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Add To Cart button */}
            <button
              type="button"
              onClick={handleAddToCart}
              title="Add to claim cart"
              className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                justAdded
                  ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                  : cartQty > 0
                  ? "bg-[#FAF7F0] border-[#245C43]/30 text-[#163A2A] hover:bg-emerald-50"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {justAdded ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <div className="flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5 text-[#245C43]" />
                  <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
                  {cartQty > 0 && <span className="font-bold text-[10px] text-[#245C43]">({cartQty})</span>}
                </div>
              )}
            </button>

            {/* Claim Food Primary CTA */}
            <Link
              href={`/food/${listing.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#245C43] hover:bg-[#163A2A] text-white shadow-sm hover:shadow transition-all"
            >
              CLAIM FOOD
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
