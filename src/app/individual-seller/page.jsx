"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "@/lib/location-context";
import { useCart } from "@/lib/cart-context";
import {
  Home,
  PlusCircle,
  Heart,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Sparkles,
  MapPin,
  Utensils,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Check } from "lucide-react";


const INITIAL_DONATIONS = [
  {
    id: "don-1",
    foodName: "Home-cooked Lemon Rice & Papad",
    description: "Prepared fresh for lunch with roasted peanuts, curry leaves, and green chillies. Sealed in clean thermal containers.",
    foodType: "HOME COOKED",
    category: "Homemade Meals",
    quantity: 5,
    unit: "portions",
    preparedAt: "Today 2:30 PM",
    expiryAt: "Today 7:00 PM",
    pickupDeadline: "Today 6:00 PM",
    storageMethod: "Room Temperature / Airtight Thermal Container",
    ingredients: "Rice, lemon juice, turmeric, mustard, curry leaves, peanuts",
    allergens: "Peanuts",
    isVegetarian: true,
    approxLocation: "RS Puram, Coimbatore",
    pickupInstructions: "Porch pickup near entrance. Ring bell 2A.",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    createdAt: new Date().toISOString(),
    status: "ACTIVE" },
  {
    id: "don-2",
    foodName: "Excess Terrace Harvest: Drumsticks & Curry Leaves",
    description: "Organic drumsticks picked fresh from our terrace garden this morning along with freshly plucked aromatic curry leaves.",
    foodType: "VEGETABLE",
    category: "Fresh Produce",
    quantity: 6,
    unit: "bundles",
    preparedAt: "Today 10:00 AM",
    expiryAt: "Tomorrow 8:00 PM",
    pickupDeadline: "Today 7:00 PM",
    storageMethod: "Dry cool storage",
    ingredients: "Farm organic drumsticks",
    allergens: "None",
    isVegetarian: true,
    approxLocation: "Gandhipuram, Coimbatore",
    pickupInstructions: "Box at main security desk.",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    createdAt: new Date().toISOString(),
    status: "ACTIVE" },
  {
    id: "don-3",
    foodName: "Festival Sweets & Ribbon Pakoda Box",
    description: "Fresh homemade sweets made for family gathering yesterday evening. Stored in airtight food containers.",
    foodType: "BAKERY",
    category: "Home Bakery & Sweets",
    quantity: 4,
    unit: "boxes",
    preparedAt: "Yesterday 6:00 PM",
    expiryAt: "Tomorrow 9:00 PM",
    pickupDeadline: "Today 8:00 PM",
    storageMethod: "Airtight sealed tin",
    ingredients: "Gram flour, ghee, sugar, cardamom, rice flour",
    allergens: "Dairy, Traces of nuts",
    isVegetarian: true,
    approxLocation: "Saibaba Colony, Coimbatore",
    pickupInstructions: "Self-pickup at apartment lobby.",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
    createdAt: new Date().toISOString(),
    status: "ACTIVE" },
];

export default function IndividualSellerPage() {
  const { user } = useAuth();
  const { currentCity } = useLocation();
  const { addToCart } = useCart();

  const [listings, setListings] = useState(INITIAL_DONATIONS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successNotice, setSuccessNotice] = useState("");
  const [addedItemNotice, setAddedItemNotice] = useState(null);

  const [formData, setFormData] = useState({
    foodName: "",
    description: "",
    foodType: "HOME COOKED",
    category: "Homemade Meals",
    quantity: 3,
    unit: "portions",
    preparedAt: "Today 12:30 PM",
    expiryAt: "Today 8:00 PM",
    pickupDeadline: "Today 6:30 PM",
    storageMethod: "Sealed clean thermal container",
    ingredients: "",
    allergens: "",
    isVegetarian: true,
    approxLocation: `${currentCity.city} Central Area`,
    pickupInstructions: "Contact upon arrival at gate.",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `don-${Date.now()}`,
      foodName: formData.foodName,
      description: formData.description,
      foodType: formData.foodType,
      category: formData.category,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      preparedAt: formData.preparedAt,
      expiryAt: formData.expiryAt,
      pickupDeadline: formData.pickupDeadline,
      storageMethod: formData.storageMethod,
      ingredients: formData.ingredients || "Wholesome home ingredients",
      allergens: formData.allergens || "None declared",
      isVegetarian: formData.isVegetarian,
      approxLocation: formData.approxLocation,
      pickupInstructions: formData.pickupInstructions,
      imageUrl: formData.imageUrl,
      createdAt: new Date().toISOString(),
      status: "ACTIVE" };

    setListings([newEntry, ...listings]);
    setShowCreateModal(false);
    setSuccessNotice(`Donation listing "${newEntry.foodName}" is now available to neighbors in ${currentCity.city}!`);
    setTimeout(() => setSuccessNotice(""), 5000);
  };

  const handleClaimDonation = (item) => {
    const res = addToCart(
      {
        listingId: item.id,
        title: item.foodName,
        providerName: "Community Donor (Verified Member)",
        pickupLocation: item.approxLocation,
        maxAvailable: item.quantity,
        imageUrl: item.imageUrl,
        unit: item.unit,
        pickupDeadline: new Date(Date.now() + 4 * 3600000).toISOString(),
        expiresAt: new Date(Date.now() + 6 * 3600000).toISOString(),
        urgencyLevel: "ATTENTION" },
      1
    );

    if (res.success) {
      setAddedItemNotice(`Added 1 portion of "${item.foodName}" to your claim cart!`);
      setTimeout(() => setAddedItemNotice(null), 3000);
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--cream)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5" style={{ borderColor: "var(--fw-border)" }}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245C43]">
              <Home className="w-4 h-4" />
              Community Sharing & Food Donations • {currentCity.city}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#163A2A]">
              Add Food to Donate
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Have extra food? Share it with someone nearby. All FoodWise food is 100% free to claim.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="btn-primary py-2.5 px-5 text-xs font-black flex items-center gap-2 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            DONATE FOOD
          </button>
        </div>

        {/* Donor Privacy & Safety Notice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border bg-white text-xs flex items-start gap-3 shadow-2xs" style={{ borderColor: "var(--fw-border)" }}>
            <ShieldCheck className="w-5 h-5 text-[#245C43] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-gray-900">Donor Privacy Protection</span>
              <p className="text-gray-600 leading-relaxed text-[11px]">
                Your private address and phone number are never publicly exposed. Only approximate area (e.g. {currentCity.city}) is shown on the marketplace card.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border bg-[#FAF7F0] text-xs flex items-start gap-3 shadow-2xs" style={{ borderColor: "var(--fw-border)" }}>
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-gray-900">Food Preparation Notice</span>
              <p className="text-gray-600 leading-relaxed text-[11px]">
                Please ensure food was prepared under clean, hygienic conditions, is stored at appropriate temperatures, and accurately states any common allergens.
              </p>
            </div>
          </div>
        </div>

        {successNotice && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
        )}

        {addedItemNotice && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{addedItemNotice}</span>
            </div>
            <Link href="/cart" className="font-bold underline text-[#245C43]">
              View Cart
            </Link>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <span className="text-[11px] font-bold uppercase text-gray-500">Available Nearby</span>
            <div className="text-2xl font-black text-[#163A2A] mt-1">{listings.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <span className="text-[11px] font-bold uppercase text-gray-500">Community Donors</span>
            <div className="text-2xl font-black text-[#245C43] mt-1">24 Active</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <span className="text-[11px] font-bold uppercase text-gray-500">Meals Shared</span>
            <div className="text-2xl font-black text-amber-800 mt-1">320 portions</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
            <span className="text-[11px] font-bold uppercase text-gray-500">Impact (CO₂ Saved)</span>
            <div className="text-2xl font-black text-teal-700 mt-1">112 kg</div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#163A2A]">
              Available Food Donated by Community
            </h2>
            <span className="text-xs text-gray-500">{listings.length} items ready to claim</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border shadow-xs space-y-4 flex flex-col justify-between"
                style={{ borderColor: "var(--fw-border)" }}
              >
                <div className="space-y-3">
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#245C43]">
                      FREE TO CLAIM
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      Donated by: Community Member
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#163A2A]">
                    {item.foodName}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{item.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 pt-1 border-t">
                    <div>
                      <span className="text-gray-400 block font-bold">Quantity:</span>
                      <strong className="text-gray-900">{item.quantity} {item.unit} available</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold">Location:</span>
                      <span className="truncate block font-semibold text-[#245C43]">{item.approxLocation}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold">Prepared:</span>
                      <span>{item.preparedAt}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold">Pickup by:</span>
                      <strong className="text-red-700">{item.pickupDeadline}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF7F0] text-[11px] space-y-0.5 text-gray-600 border border-gray-100">
                    <div><strong>Storage:</strong> {item.storageMethod}</div>
                    {item.allergens && <div><strong>Allergens:</strong> {item.allergens}</div>}
                    <div><strong>Dietary:</strong> {item.isVegetarian ? "Pure Vegetarian" : "Non-Vegetarian"}</div>
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-between gap-2" style={{ borderColor: "var(--fw-border)" }}>
                  <button
                    type="button"
                    onClick={() => handleClaimDonation(item)}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black bg-[#245C43] hover:bg-[#163A2A] text-white shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    CLAIM FOOD
                  </button>

                  <button
                    type="button"
                    onClick={() => setListings(listings.filter((l) => l.id !== item.id))}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Creating Food Donation */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 border shadow-2xl my-8 space-y-4" style={{ borderColor: "var(--fw-border)" }}>
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--fw-border)" }}>
                <div>
                  <h3 className="text-lg font-black text-[#163A2A]">
                    Add Food to Donate
                  </h3>
                  <p className="text-xs text-gray-500">Share surplus homemade or event food with neighbors for free</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
                {/* Title & Food Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-700 block mb-1">Food Item Name *</label>
                    <input
                      name="foodName"
                      type="text"
                      required
                      value={formData.foodName}
                      onChange={handleInputChange}
                      placeholder="e.g. Extra Homemade Lemon Rice"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#245C43]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Food Type *</label>
                    <select
                      name="foodType"
                      value={formData.foodType}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <option value="HOME COOKED">HOME COOKED</option>
                      <option value="BAKERY">BAKERY</option>
                      <option value="PACKAGED">PACKAGED</option>
                      <option value="FRUIT">FRUIT</option>
                      <option value="VEGETABLE">VEGETABLE</option>
                      <option value="MEAL">MEAL</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Quantity & Unit *</label>
                    <div className="flex gap-2">
                      <input
                        name="quantity"
                        type="number"
                        min={1}
                        required
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-1/2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                      />
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="w-1/2 px-2 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs"
                      >
                        <option value="portions">portions</option>
                        <option value="plates">plates</option>
                        <option value="bundles">bundles</option>
                        <option value="boxes">boxes</option>
                        <option value="kg">kg</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Description *</label>
                  <textarea
                    name="description"
                    rows={2}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe dishes, freshness, and packaging..."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#245C43]"
                  />
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Prepared Date/Time</label>
                    <input
                      name="preparedAt"
                      type="text"
                      value={formData.preparedAt}
                      onChange={handleInputChange}
                      placeholder="e.g. Today 1:00 PM"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Pickup Deadline *</label>
                    <input
                      name="pickupDeadline"
                      type="text"
                      required
                      value={formData.pickupDeadline}
                      onChange={handleInputChange}
                      placeholder="e.g. Today 6:00 PM"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Expiry Date/Time</label>
                    <input
                      name="expiryAt"
                      type="text"
                      value={formData.expiryAt}
                      onChange={handleInputChange}
                      placeholder="e.g. Today 8:00 PM"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                </div>

                {/* Storage & Allergens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Storage Method</label>
                    <input
                      name="storageMethod"
                      type="text"
                      value={formData.storageMethod}
                      onChange={handleInputChange}
                      placeholder="e.g. Refrigerated or airtight container"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Allergens</label>
                    <input
                      name="allergens"
                      type="text"
                      value={formData.allergens}
                      onChange={handleInputChange}
                      placeholder="e.g. Dairy, Peanuts, Gluten"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                </div>

                {/* Approximate Location for Privacy & Pickup Instructions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Approximate Location (Public) *</label>
                    <input
                      name="approxLocation"
                      type="text"
                      required
                      value={formData.approxLocation}
                      onChange={handleInputChange}
                      placeholder="e.g. RS Puram, Coimbatore"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Pickup Instructions (Claimant Only)</label>
                    <input
                      name="pickupInstructions"
                      type="text"
                      value={formData.pickupInstructions}
                      onChange={handleInputChange}
                      placeholder="e.g. Ring flat 2A doorbell"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isVegetarian"
                    name="isVegetarian"
                    checked={formData.isVegetarian}
                    onChange={handleInputChange}
                    className="accent-[#245C43] h-4 w-4"
                  />
                  <label htmlFor="isVegetarian" className="font-bold text-gray-700 cursor-pointer">
                    Pure Vegetarian Item
                  </label>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2" style={{ borderColor: "var(--fw-border)" }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2.5 rounded-xl border text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#245C43] hover:bg-[#163A2A] text-white font-black shadow-xs transition-all"
                  >
                    ADD FOOD TO FOODWISE
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
