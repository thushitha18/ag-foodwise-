"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FoodCategory } from "@/types";
import {
  ArrowLeft,
  Sparkles,
  PlusCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Image,
  MapPin,
  Utensils,
  Check } from "lucide-react";

const PRESET_IMAGES = [
  { label: "Biryani & Rice", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8" },
  { label: "Bakery & Bread", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
  { label: "South Indian Meals", url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91" },
  { label: "Pastries & Cakes", url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a" },
  { label: "Fresh Salads", url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" },
];

export default function NewSurplusListingPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(FoodCategory.MEALS);
  const [quantity, setQuantity] = useState(10);
  const [unit, setUnit] = useState("portions");
  const [preparedTime, setPreparedTime] = useState("12:00 PM");
  const [expiryHours, setExpiryHours] = useState(3);
  const [pickupDeadline, setPickupDeadline] = useState("03:30 PM");
  const [ingredients, setIngredients] = useState("");
  const [allergens, setAllergens] = useState("");
  const [storageMethod, setStorageMethod] = useState("Thermal insulated containers (65°C+)");
  const [pickupLocation, setPickupLocation] = useState("Gandhipuram Central Counter, Coimbatore");
  const [isRescueEligible, setIsRescueEligible] = useState(true);
  const [dietary, setDietary] = useState(["Veg"]);
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDietaryToggle = (tag) => {
    if (dietary.includes(tag)) {
      setDietary(dietary.filter((t) => t !== tag));
    } else {
      setDietary([...dietary, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }, 600);
  };

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--cream)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 font-bold hover:text-[#245C43] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <span className="font-semibold text-emerald-800">100% Free Food Redistribution</span>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
          <div className="border-b pb-4 mb-6" style={{ borderColor: "var(--fw-border)" }}>
            <span className="text-xs font-black text-[#245C43] uppercase tracking-wider">
              Commercial & Community Kitchens
            </span>
            <h1 className="text-2xl font-black text-[#163A2A] mt-0.5">
              Post Surplus Food for Free Claim
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              FoodWise connects your surplus portions with local residents and verified rescue partners. No prices are charged.
            </p>
          </div>

          {success ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#245C43] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-[#163A2A]">Surplus Food Posted Successfully!</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Your surplus batch is now live for free claim in the community marketplace.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Food Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Food Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Vegetable Biryani & Kurma (Buffet Surplus)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#245C43]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Food Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#245C43]"
                  >
                    {Object.values(FoodCategory).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Quantity Available *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                      className="w-2/3 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#245C43]"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-1/3 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#245C43]"
                    >
                      <option value="portions">portions</option>
                      <option value="plates">plates</option>
                      <option value="kg">kg</option>
                      <option value="packs">packs</option>
                      <option value="boxes">boxes</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Description & Prep Details *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the dishes, preparation method, and packing status..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#245C43]"
                  />
                </div>
              </div>

              {/* Timing & Pickup Window */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FAF7F0] border" style={{ borderColor: "var(--fw-border)" }}>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Prepared Date/Time
                  </label>
                  <input
                    type="text"
                    value={preparedTime}
                    onChange={(e) => setPreparedTime(e.target.value)}
                    placeholder="e.g. Today 11:30 AM"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Pickup Deadline *
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupDeadline}
                    onChange={(e) => setPickupDeadline(e.target.value)}
                    placeholder="e.g. Today 4:00 PM"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Best Before Expiry (Hours)
                  </label>
                  <select
                    value={expiryHours}
                    onChange={(e) => setExpiryHours(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs"
                  >
                    <option value={1}>1 Hour (Urgent)</option>
                    <option value={2}>2 Hours</option>
                    <option value={3}>3 Hours</option>
                    <option value={6}>6 Hours</option>
                    <option value={12}>12 Hours</option>
                  </select>
                </div>
              </div>

              {/* Kitchen Specifications: Ingredients, Allergens, Storage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider block">Ingredients</label>
                  <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="e.g. Rice, vegetables, ghee"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider block">Allergen Declarations</label>
                  <input
                    type="text"
                    value={allergens}
                    onChange={(e) => setAllergens(e.target.value)}
                    placeholder="e.g. Dairy, Gluten (No nuts)"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider block">Storage Method</label>
                  <input
                    type="text"
                    value={storageMethod}
                    onChange={(e) => setStorageMethod(e.target.value)}
                    placeholder="e.g. Insulated thermal warmers"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs"
                  />
                </div>
              </div>

              {/* Pickup Location */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Pickup Location & Counter Instructions *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Enter business address and pickup instructions"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#245C43]"
                  />
                </div>
              </div>

              {/* Dietary Type Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Dietary Category
                </label>
                <div className="flex gap-3 text-xs">
                  {["Veg", "Non-Veg", "Vegan", "Halal"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleDietaryToggle(tag)}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                        dietary.includes(tag)
                          ? "bg-emerald-100 border-[#245C43] text-[#245C43]"
                          : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}
                    >
                      {tag} {dietary.includes(tag) && "✓"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Select Visual Photo
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setSelectedImage(img.url)}
                      className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === img.url
                          ? "border-[#245C43] shadow-md ring-2 ring-[#245C43]/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] font-bold p-1 text-center truncate">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "var(--fw-border)" }}>
                <div className="text-xs text-gray-500">
                  Surplus food is published immediately to community members for free pickup.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-xs bg-[#245C43] hover:bg-[#163A2A] text-white shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  {isSubmitting ? "PUBLISHING..." : "POST FOOD TO FOODWISE"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
