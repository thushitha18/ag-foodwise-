"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/types";
import {
  ShoppingBag,
  Store,
  Home,
  HeartHandshake,
  Shield,
  ArrowRight,
  ArrowLeft,
  Leaf,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  KeyRound,
  MapPin } from "lucide-react";


const rolesList = [
  {
    value: UserRole.CONSUMER,
    label: "Consumer",
    icon: ShoppingBag,
    tagline: "Buy Surplus & Save",
    description: "Discover verified high-quality surplus meals, bakery items, and groceries nearby at deep discounts.",
    color: "#245C43" },
  {
    value: UserRole.PROVIDER,
    label: "Food Provider",
    icon: Store,
    tagline: "Commercial Surplus Monetization",
    description: "Restaurants, bakeries, supermarkets, and caterers listing surplus batches to recover costs and prevent waste.",
    color: "#163A2A" },
  {
    value: UserRole.INDIVIDUAL_SELLER,
    label: "Individual Seller",
    icon: Home,
    tagline: "Household Excess & Home Kitchens",
    description: "Sell or donate extra home-cooked food, party excess, garden harvest, or packaged goods to your neighborhood.",
    color: "#7FA88A" },
  {
    value: UserRole.RESCUE_PARTNER,
    label: "Rescue Partner",
    icon: HeartHandshake,
    tagline: "Verified Hunger Relief NGOs",
    description: "Registered NGOs, charities, shelters, and community kitchens claiming urgent surplus for free redistribution.",
    color: "#C98F88" },
  {
    value: UserRole.ADMIN,
    label: "Platform Admin",
    icon: Shield,
    tagline: "Governance & Quality Control",
    description: "Oversee marketplace health, review partner applications, monitor anomalies, and handle dispute resolution.",
    color: "#242522" },
];

export default function JoinPage() {
  const router = useRouter();
  const { login, register, forgotPassword } = useAuth();

  const [mode, setMode] = useState("roles");
  const [selectedRole, setSelectedRole] = useState(UserRole.CONSUMER);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: "Coimbatore",
    area: "Gandhipuram",
    // Rescue partner specific
    orgName: "",
    orgType: "NGO",
    pickupCapacity: "200" });

  const getDashboardRoute = (role) => {
    switch (role) {
      case UserRole.PROVIDER:
      case "provider":
        return "/provider";
      case UserRole.INDIVIDUAL_SELLER:
      case "individual_seller":
        return "/individual-seller";
      case UserRole.RESCUE_PARTNER:
      case "rescue_partner":
        return "/rescue";
      case UserRole.ADMIN:
      case "admin":
        return "/admin";
      case UserRole.CONSUMER:
      case "consumer":
      default:
        return "/consumer";
    }
  };

  const handleRoleChoose = (role) => {
    setSelectedRole(role);
    setMode("register");
    setError("");
    setInfoMessage("");
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setInfoMessage("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");

    if (!formData.name.trim()) {
      setError("Please provide your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (selectedRole === UserRole.RESCUE_PARTNER && !formData.orgName.trim()) {
      setError("Organization name is required for rescue partners.");
      return;
    }

    setIsLoading(true);
    const res = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: selectedRole,
      city: formData.city });
    setIsLoading(false);

    if (res.success) {
      router.push(getDashboardRoute(selectedRole));
    } else {
      setError(res.error || "Registration encountered an issue. Please retry.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");

    if (!formData.email.trim() || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    const res = await login(formData.email, formData.password);
    setIsLoading(false);

    if (res.success) {
      try {
        const stored = localStorage.getItem("fw_user");
        const parsed = stored ? JSON.parse(stored) : null;
        router.push(getDashboardRoute(parsed?.role || UserRole.CONSUMER));
      } catch {
        router.push("/consumer");
      }
    } else {
      setError(res.error || "Invalid credentials.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");

    if (!formData.email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    const res = await forgotPassword(formData.email);
    setIsLoading(false);
    if (res.success) {
      setInfoMessage(res.message);
    }
  };

  const fillDemoCreds = (email) => {
    setFormData((prev) => ({
      ...prev,
      email,
      password: "Demo@1234" }));
    setError("");
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center" style={{ background: "var(--cream)" }}>
      <div className="max-w-xl w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: "var(--forest)" }}>
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--forest)" }}>
              FoodWise
            </span>
          </Link>

          <h1 className="text-3xl font-extrabold" style={{ color: "var(--charcoal)" }}>
            Join FoodWise
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Choose how you want to participate in the food surplus network.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl p-1 bg-white border shadow-xs" style={{ borderColor: "var(--fw-border)" }}>
          <button
            type="button"
            onClick={() => {
              setMode("roles");
              setError("");
              setInfoMessage("");
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              mode === "roles" || mode === "register" ? "bg-[#245C43] text-white shadow-xs" : "text-[#8A8D87] hover:text-[#242522]"
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
              setInfoMessage("");
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              mode === "login" ? "bg-[#245C43] text-white shadow-xs" : "text-[#8A8D87] hover:text-[#242522]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("forgot");
              setError("");
              setInfoMessage("");
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              mode === "forgot" ? "bg-[#245C43] text-white shadow-xs" : "text-[#8A8D87] hover:text-[#242522]"
            }`}
          >
            Reset Password
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {infoMessage && (
          <div className="flex items-center gap-2 p-3 rounded-lg text-sm bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Check className="w-4 h-4 shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* ================= MODE: ROLE SELECTION ================= */}
        {mode === "roles" && (
          <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-4" style={{ borderColor: "var(--fw-border)" }}>
            <div className="border-b pb-3" style={{ borderColor: "var(--fw-border)" }}>
              <h2 className="text-base font-bold" style={{ color: "var(--charcoal)" }}>
                Step 1: Select Your Role
              </h2>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Select the experience that best reflects your participation.
              </p>
            </div>

            <div className="space-y-2.5">
              {rolesList.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => handleRoleChoose(r.value)}
                    className="w-full text-left p-4 rounded-xl border transition-all hover:border-[#245C43] hover:shadow-xs group flex items-start gap-3.5 bg-white"
                    style={{ borderColor: "var(--fw-border)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5"
                      style={{ background: r.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm" style={{ color: "var(--charcoal)" }}>
                          {r.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-[11px] font-semibold text-emerald-700">{r.tagline}</p>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>
                        {r.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center text-xs" style={{ color: "var(--muted)" }}>
              Already part of the network?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-bold underline"
                style={{ color: "var(--forest)" }}
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* ================= MODE: REGISTRATION FORM ================= */}
        {mode === "register" && (
          <form
            onSubmit={handleRegister}
            className="bg-white rounded-2xl p-6 border shadow-sm space-y-4"
            style={{ borderColor: "var(--fw-border)" }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--fw-border)" }}>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Role: {rolesList.find((r) => r.value === selectedRole)?.label}
                </span>
                <h2 className="text-lg font-bold" style={{ color: "var(--charcoal)" }}>
                  Account Details
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setMode("roles")}
                className="text-xs flex items-center gap-1 font-medium hover:underline"
                style={{ color: "var(--muted)" }}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Change Role
              </button>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="fw-label fw-label-required">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Ramesh Kumar"
                  className="fw-input"
                />
              </div>
              <div>
                <label className="fw-label fw-label-required">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@organization.com"
                  className="fw-input"
                />
              </div>
            </div>

            {/* Phone & Location Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="fw-label">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="fw-input"
                />
              </div>
              <div>
                <label className="fw-label fw-label-required">Location / Hub</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="fw-select"
                >
                  <option value="Coimbatore">Coimbatore (Demo Hub)</option>
                  <option value="Chennai">Chennai (Metro Hub)</option>
                </select>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="fw-label fw-label-required">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min 6 characters"
                    className="fw-input pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="fw-label fw-label-required">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Repeat password"
                  className="fw-input"
                />
              </div>
            </div>

            {/* Role specific additions */}
            {selectedRole === UserRole.RESCUE_PARTNER && (
              <div className="p-3.5 rounded-xl border space-y-3 bg-[#FAF7F0]" style={{ borderColor: "var(--fw-border)" }}>
                <div className="text-xs font-bold text-[#163A2A]">Rescue Partner Verification Setup</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="fw-label fw-label-required">Organization Name</label>
                    <input
                      name="orgName"
                      type="text"
                      required
                      value={formData.orgName}
                      onChange={handleInputChange}
                      placeholder="e.g. Coimbatore Food Bank"
                      className="fw-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="fw-label">Organization Type</label>
                    <select
                      name="orgType"
                      value={formData.orgType}
                      onChange={handleInputChange}
                      className="fw-select text-xs"
                    >
                      <option value="NGO">NGO</option>
                      <option value="Charity">Charity</option>
                      <option value="Community Kitchen">Community Kitchen</option>
                      <option value="Shelter">Shelter</option>
                      <option value="Food Redistribution">Food Redistribution Org</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {selectedRole === UserRole.INDIVIDUAL_SELLER && (
              <div className="p-3 rounded-xl border text-xs leading-relaxed bg-[#EFE7DA]" style={{ borderColor: "var(--fw-border)", color: "var(--charcoal)" }}>
                <strong>Food Safety Notice:</strong> Sellers are personally responsible for following applicable hygiene standards. FoodWise does not inspect or certify private kitchens.
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isLoading ? "Creating Profile..." : "Complete Registration & Continue"}
            </button>
          </form>
        )}

        {/* ================= MODE: LOGIN ================= */}
        {mode === "login" && (
          <form
            onSubmit={handleLogin}
            className="bg-white rounded-2xl p-6 border shadow-sm space-y-4"
            style={{ borderColor: "var(--fw-border)" }}
          >
            <div className="border-b pb-3" style={{ borderColor: "var(--fw-border)" }}>
              <h2 className="text-lg font-bold" style={{ color: "var(--charcoal)" }}>
                Sign In to Your Account
              </h2>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Enter your credentials or choose a quick demo role below.
              </p>
            </div>

            <div>
              <label className="fw-label fw-label-required">Email Address</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@domain.com"
                className="fw-input"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="fw-label fw-label-required !mb-0">Password</label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs font-semibold text-emerald-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="fw-input pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {/* Quick Demo Logins */}
            <div className="pt-4 border-t space-y-2" style={{ borderColor: "var(--fw-border)" }}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8D87]">
                Quick Demo Switcher (Password: Demo@1234)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                {[
                  { label: "Consumer", email: "consumer@foodwise.demo" },
                  { label: "Provider", email: "provider@foodwise.demo" },
                  { label: "Seller", email: "seller@foodwise.demo" },
                  { label: "Rescue", email: "rescue@foodwise.demo" },
                  { label: "Admin", email: "admin@foodwise.demo" },
                ].map((d) => (
                  <button
                    key={d.email}
                    type="button"
                    onClick={() => fillDemoCreds(d.email)}
                    className="px-2.5 py-1.5 rounded-lg border text-left font-medium hover:border-[#245C43] hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "var(--fw-border)", color: "var(--charcoal)" }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* ================= MODE: FORGOT PASSWORD ================= */}
        {mode === "forgot" && (
          <form
            onSubmit={handleForgotPassword}
            className="bg-white rounded-2xl p-6 border shadow-sm space-y-4"
            style={{ borderColor: "var(--fw-border)" }}
          >
            <div className="border-b pb-3" style={{ borderColor: "var(--fw-border)" }}>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 mb-2">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold" style={{ color: "var(--charcoal)" }}>
                Reset Your Password
              </h2>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Enter your registered email address to receive secure reset credentials.
              </p>
            </div>

            <div>
              <label className="fw-label fw-label-required">Registered Email</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@domain.com"
                className="fw-input"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              {isLoading ? "Sending reset link..." : "Send Reset Instructions"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-xs font-semibold underline text-emerald-700"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
