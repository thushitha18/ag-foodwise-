"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "@/lib/location-context";
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  FileText,
  MapPin,
  Clock,
  Truck,
  ArrowRight } from "lucide-react";

export default function RescueApplyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { currentCity } = useLocation();

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    orgName: "",
    orgType: "NGO",
    regNumber: "TN/2021/008419",
    contactPerson: user?.name || "Sunita Rao",
    email: user?.email || "rescue@foodwise.demo",
    phone: "+91 98765 43212",
    address: `14, Red Cross Rd, ${currentCity.city}`,
    city: currentCity.city,
    area: currentCity.city === "Coimbatore" ? "Singanallur" : "Mylapore",
    latitude: currentCity.latitude.toString(),
    longitude: currentCity.longitude.toString(),
    operatingHours: "10:00 AM – 10:30 PM",
    pickupCapacity: "350",
    vehicleAvailability: "Two-wheelers & 1 Cargo Van",
    foodCategories: "Cooked Meals, Bakery, Packaged Staples",
    serviceAreas: `${currentCity.city} Urban Core, Slum Clusters & Night Shelters`,
    description: "Dedicated to prompt, dignified collection of remaining commercial food surplus and redistributing to verified community kitchens." });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6" style={{ background: "var(--cream)" }}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mx-auto shadow-xs">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--charcoal)" }}>
            Rescue Partner Accreditation Application
          </h1>
          <p className="text-xs sm:text-sm max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
            To safeguard food integrity and community dignity, the FoodWise Rescue Hub is restricted to registered NGOs, charities, and relief organizations.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl border p-8 shadow-sm text-center space-y-4" style={{ borderColor: "var(--fw-border)" }}>
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold" style={{ color: "var(--charcoal)" }}>
              Application Submitted (Status: PENDING)
            </h2>
            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
              Your application for <strong>{formData.orgName || "Your Organization"}</strong> is under evaluation by our platform administration team. We verify 12A/80G certification and local kitchen hygiene readiness.
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 max-w-md mx-auto">
              <strong>Demo Note:</strong> Demo rescue accounts (e.g. <code>rescue@foodwise.demo</code>) come pre-verified so you can inspect the verified Rescue Hub immediately.
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/rescue"
                className="btn-primary py-2.5 px-5 text-xs font-bold"
              >
                Access Rescue Hub (Demo Verified Mode)
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border p-6 sm:p-8 shadow-sm space-y-5"
            style={{ borderColor: "var(--fw-border)" }}
          >
            <div className="border-b pb-3">
              <h3 className="font-bold text-sm" style={{ color: "var(--charcoal)" }}>
                Organization Credentials
              </h3>
              <p className="text-[11px] text-gray-500">Official organizational registration details</p>
            </div>

            {/* Row 1: Org Name & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="fw-label fw-label-required">Organization Name</label>
                <input
                  name="orgName"
                  type="text"
                  required
                  value={formData.orgName}
                  onChange={handleInputChange}
                  placeholder="e.g. Coimbatore Hunger Relief Trust"
                  className="fw-input"
                />
              </div>
              <div>
                <label className="fw-label fw-label-required">Organization Type</label>
                <select
                  name="orgType"
                  value={formData.orgType}
                  onChange={handleInputChange}
                  className="fw-select"
                >
                  <option value="NGO">Registered NGO</option>
                  <option value="Charity">Charitable Trust</option>
                  <option value="Community Kitchen">Community Kitchen</option>
                  <option value="Shelter">Night Shelter / Care Home</option>
                  <option value="Food Redistribution">Food Redistribution Org</option>
                </select>
              </div>
            </div>

            {/* Row 2: Reg Number & Contact Person */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="fw-label fw-label-required">Registration Number (Trust/Society/CSR)</label>
                <input
                  name="regNumber"
                  type="text"
                  required
                  value={formData.regNumber}
                  onChange={handleInputChange}
                  className="fw-input"
                />
              </div>
              <div>
                <label className="fw-label fw-label-required">Authorized Contact Person</label>
                <input
                  name="contactPerson"
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="fw-input"
                />
              </div>
            </div>

            {/* Row 3: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="fw-label fw-label-required">Official Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="fw-input"
                />
              </div>
              <div>
                <label className="fw-label fw-label-required">Phone / Dispatch Hotline</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="fw-input"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold text-sm" style={{ color: "var(--charcoal)" }}>
                Operational Capacity & Geographic Reach
              </h3>
              <p className="text-[11px] text-gray-500">Used by the matching algorithm to allocate remaining surplus</p>
            </div>

            {/* Address & City */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="fw-label fw-label-required">Physical Depot / Kitchen Address</label>
                <input
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="fw-input"
                />
              </div>
              <div>
                <label className="fw-label fw-label-required">City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="fw-select"
                >
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>
            </div>

            {/* Capacity & Vehicles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="fw-label fw-label-required">Pickup Capacity (meals/day)</label>
                <input
                  name="pickupCapacity"
                  type="number"
                  required
                  value={formData.pickupCapacity}
                  onChange={handleInputChange}
                  className="fw-input"
                />
              </div>
              <div>
                <label className="fw-label fw-label-required">Operating Hours</label>
                <input
                  name="operatingHours"
                  type="text"
                  required
                  value={formData.operatingHours}
                  onChange={handleInputChange}
                  className="fw-input"
                />
              </div>
              <div>
                <label className="fw-label">Vehicle Availability</label>
                <input
                  name="vehicleAvailability"
                  type="text"
                  value={formData.vehicleAvailability}
                  onChange={handleInputChange}
                  className="fw-input"
                />
              </div>
            </div>

            {/* Service Areas & Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="fw-label">Service Areas / Localities Served</label>
                <input
                  name="serviceAreas"
                  type="text"
                  value={formData.serviceAreas}
                  onChange={handleInputChange}
                  className="fw-input"
                />
              </div>
              <div>
                <label className="fw-label">Accepted Food Categories</label>
                <input
                  name="foodCategories"
                  type="text"
                  value={formData.foodCategories}
                  onChange={handleInputChange}
                  className="fw-input"
                />
              </div>
            </div>

            {/* Mission Statement */}
            <div>
              <label className="fw-label">Operational Overview / Distribution Model</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="fw-textarea text-xs"
              />
            </div>

            <div className="p-3 bg-gray-50 border rounded-xl text-[11px] text-gray-600">
              Applications are reviewed under FoodWise Standard Operating Procedure 4.1. Approvals grant cryptographic keys for emergency batch claim authorization.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {isSubmitting ? "Submitting Application..." : "Submit Rescue Accreditation Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
