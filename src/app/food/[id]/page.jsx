"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { mockFoodListings } from "@/lib/mock-data";
import { UrgencyBadge } from "@/components/food/UrgencyBadge";
import { Countdown } from "@/components/food/Countdown";
import { calculateUrgency } from "@/lib/urgency";
import { haversineDistance, formatDistance } from "@/lib/distance";
import { useLocation } from "@/lib/location-context";
import { useCart } from "@/lib/cart-context";
import {
  MapPin,
  ShieldCheck,
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  Leaf,
  CheckCircle2,
  Phone,
  Store,
  Heart,
  Navigation,
  Check,
  AlertCircle,
} from "lucide-react";

export default function FoodDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentCity } = useLocation();
  const { addToCart, items } = useCart();
  const [claimQty, setClaimQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState(null);

  const listing = useMemo(() => {
    return mockFoodListings.find((f) => f.id === params.id);
  }, [params.id]);

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
        <AlertCircle className="w-12 h-12 text-gray-400" />
        <h1 className="text-xl font-bold text-gray-800">Food Not Found</h1>
        <p className="text-sm text-gray-500">This listing may have expired or been removed.</p>
        <Link href="/explore" className="btn-primary text-sm mt-2">
          ← Back to Explore
        </Link>
      </div>
    );
  }

  const urgency = calculateUrgency(listing.expiresAt);
  const distKm = haversineDistance(
    currentCity.latitude,
    currentCity.longitude,
    listing.provider?.lat || listing.provider?.latitude || currentCity.latitude,
    listing.provider?.lng || listing.provider?.longitude || currentCity.longitude
  );

  const inCartItem = items.find((i) => i.listingId === listing.id);
  const cartQty = inCartItem ? inCartItem.quantity : 0;

  const handleAddToCart = () => {
    const result = addToCart(
      {
        listingId: listing.id,
        title: listing.title,
        providerName: listing.provider?.name || "Community Kitchen",
        pickupLocation: listing.location || listing.provider?.address || "Coimbatore",
        maxAvailable: listing.quantity,
        imageUrl: listing.images?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        unit: listing.unit || "portion",
        pickupDeadline: listing.collection_deadline || listing.expiresAt,
        expiresAt: listing.expiresAt,
        urgencyLevel: listing.urgencyLevel,
      },
      claimQty
    );
    if (result.success) {
      setJustAdded(true);
      setError(null);
      setTimeout(() => setJustAdded(false), 2500);
    } else {
      setError(result.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const isVeg = listing.dietaryTags?.some(
    (t) => t.toLowerCase().includes("veg") && !t.toLowerCase().includes("non")
  );
  const isNonVeg = listing.dietaryTags?.some((t) => t.toLowerCase().includes("non-veg"));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--fw-bg)" }}>
      {/* Back Nav */}
      <div className="max-w-5xl mx-auto px-4 pt-4 pb-2">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Image Column */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={listing.images?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                alt={listing.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <UrgencyBadge urgencyLevel={listing.urgencyLevel} expiresAt={listing.expiresAt} />
                {listing.isRescueEligible && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600/90 text-white backdrop-blur-sm">
                    <Sparkles className="w-3 h-3" /> Rescue Eligible
                  </span>
                )}
              </div>
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#245C43] text-white shadow-lg">
                  FREE TO CLAIM
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <Countdown
                  expiresAt={listing.expiresAt}
                  className="text-white bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold"
                />
              </div>
            </div>

            {/* Description */}
            <div className="fw-card p-6 space-y-4">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">About This Food</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>

              {listing.allergens && listing.allergens.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                  <span className="font-bold text-amber-800">⚠️ Allergens: </span>
                  <span className="text-amber-700">{listing.allergens.join(", ")}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-1">
                {isVeg && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" /> Vegetarian
                  </span>
                )}
                {isNonVeg && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-600" /> Non-Vegetarian
                  </span>
                )}
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {listing.category}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title & Provider */}
            <div className="fw-card p-6 space-y-4">
              <h1 className="text-2xl font-black text-gray-900 leading-tight">{listing.title}</h1>

              {listing.provider && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-[#245C43] text-white flex items-center justify-center font-bold text-sm">
                    {listing.provider.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-gray-900 truncate">{listing.provider.name}</span>
                      {listing.provider.isVerified && <ShieldCheck className="w-4 h-4 text-[#245C43] shrink-0" />}
                    </div>
                    <div className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {listing.provider.address || "Coimbatore"}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-lg font-black text-[#245C43]">{listing.quantity}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">{listing.unit || "portions"} left</div>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="text-lg font-black text-blue-700">{formatDistance(distKm)}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">away</div>
                </div>
              </div>
            </div>

            {/* Claim Card */}
            <div className="fw-card p-6 space-y-4 border-2 border-[#245C43]/20">
              <div className="text-center">
                <span className="text-xs font-black text-[#245C43] uppercase tracking-widest">Free to Claim</span>
                <p className="text-[11px] text-gray-500 mt-0.5">Community Food Share — No cost</p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setClaimQty(Math.max(1, claimQty - 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold"
                >
                  −
                </button>
                <span className="text-xl font-black text-gray-900 w-10 text-center">{claimQty}</span>
                <button
                  onClick={() => setClaimQty(Math.min(listing.quantity - cartQty, claimQty + 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold"
                >
                  +
                </button>
              </div>

              {cartQty > 0 && (
                <div className="text-center text-xs text-[#245C43] font-semibold">
                  Already {cartQty} in cart
                </div>
              )}

              {error && (
                <div className="text-center text-xs text-red-600 font-medium bg-red-50 p-2 rounded-lg">{error}</div>
              )}

              <button
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  justAdded
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-[#245C43] hover:bg-[#163A2A] text-white shadow-md hover:shadow-lg"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add {claimQty} to Claim Cart
                  </>
                )}
              </button>

              <Link
                href="/cart"
                className="block w-full text-center py-2.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Cart ({cartQty + (justAdded ? claimQty : 0)} items)
              </Link>
            </div>

            {/* Pickup Info */}
            <div className="fw-card p-5 space-y-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Pickup Details</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#245C43] shrink-0 mt-0.5" />
                  <span>{listing.location || listing.provider?.address || "Contact provider"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#245C43] shrink-0 mt-0.5" />
                  <span>Pickup before expiry — check countdown above</span>
                </div>
                <div className="flex items-start gap-2">
                  <Leaf className="w-3.5 h-3.5 text-[#245C43] shrink-0 mt-0.5" />
                  <span>Bring your own container if possible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
