"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocation } from "@/lib/location-context";
import { mockFoodListings, platformStats } from "@/lib/mock-data";
import { FoodCard } from "@/components/food/FoodCard";
import { haversineDistance } from "@/lib/distance";
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Store,
  Clock,
  Compass,
  Leaf,
  BarChart3,
  CheckCircle2,
  PlusCircle,
  ShoppingBag,
  Users,
  Utensils,
  Truck,
  Heart,
  Globe,
  Award,
  ChevronRight,
  Play,
  Star,
  Zap,
  HandHeart,
  TreePine } from "lucide-react";

/* ─── Animated Counter Hook ─── */
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function HomePage() {
  const router = useRouter();
  const { currentCity, setCity, cities } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  // Distance computation for active city
  const cityListings = useMemo(() => {
    return mockFoodListings
      .map((item) => {
        const lat = item.latitude || currentCity.latitude;
        const lng = item.longitude || currentCity.longitude;
        const dist = haversineDistance(currentCity.latitude, currentCity.longitude, lat, lng);
        return {
          ...item,
          distanceKm: dist };
      })
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }, [currentCity]);

  const featuredListings = cityListings.slice(0, 3);
  const localSurplus = cityListings.slice(0, 6);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/explore");
    }
  };

  // Animated counters
  const mealsCount = useCounter(platformStats.totalMealsRescued || 12480, 2500);
  const co2Count = useCounter(Math.round((platformStats.co2SavedKg || 32000) / 1000), 2000);
  const partnersCount = useCounter((platformStats.activeProviders || 42) + (platformStats.activeRescuePartners || 15), 1800);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, #0D2818 0%, #163A2A 25%, #1E5038 50%, #245C43 75%, #2D7A56 100%)"
        }} />

        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-[10%] w-72 h-72 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #4ADE80 0%, transparent 70%)",
              animation: "pulse 4s ease-in-out infinite" }}
          />
          <div className="absolute bottom-20 left-[5%] w-96 h-96 rounded-full opacity-8"
            style={{
              background: "radial-gradient(circle, #34D399 0%, transparent 70%)",
              animation: "pulse 5s ease-in-out infinite 1s" }}
          />
          <div className="absolute top-1/2 right-[30%] w-48 h-48 rounded-full opacity-5"
            style={{
              background: "radial-gradient(circle, #A7F3D0 0%, transparent 70%)",
              animation: "pulse 3s ease-in-out infinite 0.5s" }}
          />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className={`space-y-8 transition-all duration-1000 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {/* Status badge */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-400/30 bg-emerald-500/10 text-emerald-300 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Network — {currentCity.city}
                </div>

                {/* City Selector */}
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs font-semibold text-emerald-200 backdrop-blur-sm">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <select
                    value={currentCity.city}
                    onChange={(e) => setCity(e.target.value)}
                    aria-label="Select Region"
                    className="bg-transparent font-bold text-emerald-200 border-none outline-none cursor-pointer"
                  >
                    {cities.map((c) => (
                      <option key={c.city} value={c.city} className="text-gray-900">
                        {c.city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main heading */}
              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
                  Rescue Food.
                  <br />
                  <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">
                    Feed Communities.
                  </span>
                </h1>
                <p className="text-lg sm:text-xl font-medium mt-5 text-emerald-100/90 leading-relaxed max-w-xl">
                  Claim surplus food for free. Share extras with neighbours. Rescue what remains for shelters.
                </p>
                <p className="text-sm text-emerald-200/60 mt-2 max-w-lg leading-relaxed">
                  FoodWise connects kitchens, bakeries, caterers and homes with community members and verified rescue partners across {currentCity.city}. Every meal is 100% free.
                </p>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl">
                <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 focus-within:border-emerald-400/50 focus-within:bg-white/15 transition-all shadow-2xl shadow-black/20">
                  <Search className="w-5 h-5 text-emerald-300/70 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search meals, kitchens in ${currentCity.city}...`}
                    className="w-full px-3 py-2.5 text-sm bg-transparent border-none outline-none text-white placeholder-emerald-200/40"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl text-xs font-bold shrink-0 bg-emerald-500 hover:bg-emerald-400 text-white transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/explore"
                  className="group px-7 py-3.5 rounded-2xl text-sm font-bold bg-white text-[#163A2A] hover:bg-emerald-50 shadow-lg shadow-black/20 transition-all flex items-center gap-2"
                >
                  <Compass className="w-4.5 h-4.5 text-emerald-600" />
                  Discover Free Food
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/individual-seller"
                  className="px-6 py-3.5 rounded-2xl text-sm font-bold border border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/10 transition-colors flex items-center gap-2"
                >
                  <PlusCircle className="w-4.5 h-4.5" />
                  Donate Food
                </Link>
                <Link
                  href="/join"
                  className="px-6 py-3.5 rounded-2xl text-sm font-bold border border-white/15 text-white/80 hover:bg-white/5 transition-colors"
                >
                  Join FoodWise
                </Link>
              </div>
            </div>

            {/* Right Column — Floating Stats Cards */}
            <div className={`hidden lg:block relative h-[500px] transition-all duration-1000 delay-300 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              {/* Main floating card */}
              <div className="absolute top-8 right-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 w-72 shadow-2xl" style={{ animation: "float 6s ease-in-out infinite" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{mealsCount.toLocaleString()}+</div>
                    <div className="text-[11px] text-emerald-200/70 font-medium">Meals Redistributed</div>
                  </div>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-green-300 rounded-full" style={{ width: "78%", animation: "growWidth 2s ease-out" }} />
                </div>
              </div>

              {/* CO2 Card */}
              <div className="absolute top-44 left-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 w-56 shadow-2xl" style={{ animation: "float 6s ease-in-out infinite 1s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                    <TreePine className="w-5 h-5 text-teal-300" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white">{co2Count}+ Tons</div>
                    <div className="text-[10px] text-teal-200/70 font-medium">CO₂ Prevented</div>
                  </div>
                </div>
              </div>

              {/* Partners Card */}
              <div className="absolute bottom-12 right-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 w-60 shadow-2xl" style={{ animation: "float 6s ease-in-out infinite 2s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white">{partnersCount}+ Partners</div>
                    <div className="text-[10px] text-amber-200/70 font-medium">Kitchens, NGOs & Donors</div>
                  </div>
                </div>
              </div>

              {/* Free badge */}
              <div className="absolute bottom-40 left-12 bg-emerald-500 text-white rounded-2xl px-5 py-3 shadow-xl" style={{ animation: "float 5s ease-in-out infinite 0.5s" }}>
                <div className="text-lg font-black">100% FREE</div>
                <div className="text-[10px] text-emerald-100 font-medium">Every meal, always</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-[10px] font-medium uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1.5 h-2.5 rounded-full bg-white/40" style={{ animation: "scrollBounce 2s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════ TRUST BAR ═══════════════════ */}
      <section className="bg-white border-b py-5" style={{ borderColor: "var(--fw-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>FSSAI Verified Partners</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Quality Assured Surplus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Real-time Freshness Tracking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>UN SDG 12.3 Aligned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Zero Waste Mission</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TIME-CRITICAL SURPLUS ═══════════════════ */}
      <section className="py-16 border-b" style={{ borderColor: "var(--fw-border)", background: "var(--cream)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                <Zap className="w-3 h-3" />
                Time-Critical
              </div>
              <h2 className="text-3xl font-black text-[#163A2A]">
                Claim Now in {currentCity.city}
              </h2>
              <p className="text-sm text-gray-500 max-w-md">
                These meals are ready for pickup right now — claim before they expire!
              </p>
            </div>
            <Link
              href="/explore"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#245C43] hover:text-emerald-700 transition-colors"
            >
              View All Free Food
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((item) => (
              <FoodCard key={item.id} listing={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="py-20 bg-white border-b" style={{ borderColor: "var(--fw-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#163A2A]">
              Three Steps to Zero Waste
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              A seamless circular workflow ensuring no edible food reaches landfills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200" />

            {[
              {
                step: "01",
                icon: <PlusCircle className="w-6 h-6" />,
                title: "List Surplus",
                desc: "Kitchens, homes and caterers post surplus batches with prep times, dietary tags and pickup windows — takes under 60 seconds.",
                color: "emerald" },
              {
                step: "02",
                icon: <ShoppingBag className="w-6 h-6" />,
                title: "Claim Free",
                desc: "Community members browse nearby food on the map, add portions to their cart, and confirm claims at zero cost.",
                color: "teal" },
              {
                step: "03",
                icon: <Truck className="w-6 h-6" />,
                title: "Auto Rescue",
                desc: "When pickup deadlines approach, remaining portions automatically dispatch to registered shelter partners nearby.",
                color: "green" },
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center px-8 py-8">
                <div className={`w-14 h-14 rounded-2xl bg-${item.color}-100 text-${item.color}-700 flex items-center justify-center mb-5 relative z-10 border-4 border-white shadow-lg`}>
                  {item.icon}
                </div>
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">
                  Step {item.step}
                </div>
                <h3 className="font-bold text-lg text-[#163A2A] mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ DONATE CTA BANNER ═══════════════════ */}
      <section className="py-16 border-b" style={{ borderColor: "var(--fw-border)", background: "var(--cream)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0" style={{
              background: "linear-gradient(135deg, #163A2A 0%, #1E5038 40%, #245C43 70%, #2D6B4F 100%)"
            }} />
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
              backgroundSize: "30px 30px"
            }} />

            <div className="relative z-10 p-8 sm:p-14 flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 space-y-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/15 text-emerald-200 backdrop-blur-sm">
                  <HeartHandshake className="w-4 h-4" />
                  Community Food Sharing
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Have Extra Food?
                  <br />
                  <span className="text-emerald-300">Share It, Don&apos;t Waste It.</span>
                </h2>
                <p className="text-sm text-emerald-100/80 leading-relaxed max-w-lg">
                  Whether you cooked extra at home, your catering event has surplus, or your restaurant has unsold portions — list them on FoodWise in 60 seconds. Someone nearby can claim it before it goes to waste.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/individual-seller"
                    className="group px-7 py-3.5 rounded-2xl font-black text-sm bg-white text-[#163A2A] hover:bg-emerald-50 shadow-lg transition-all flex items-center gap-2"
                  >
                    <PlusCircle className="w-4.5 h-4.5 text-emerald-600" />
                    Donate Food Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/provider"
                    className="px-6 py-3.5 rounded-2xl font-bold text-sm border border-white/25 text-white hover:bg-white/10 transition-colors"
                  >
                    Business Provider Portal
                  </Link>
                </div>
              </div>

              {/* Stats mini-grid */}
              <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[280px]">
                {[
                  { icon: <Utensils className="w-4 h-4" />, val: "12,480+", label: "Meals Shared" },
                  { icon: <Users className="w-4 h-4" />, val: "2,100+", label: "Active Donors" },
                  { icon: <Clock className="w-4 h-4" />, val: "< 60s", label: "To List Food" },
                  { icon: <Heart className="w-4 h-4" />, val: "100%", label: "Free Always" },
                ].map((s, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                    <div className="text-emerald-300 flex justify-center mb-1">{s.icon}</div>
                    <div className="text-lg font-black text-white">{s.val}</div>
                    <div className="text-[10px] text-emerald-200/70 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ LOCAL SURPLUS GRID ═══════════════════ */}
      <section className="py-16 bg-white border-b" style={{ borderColor: "var(--fw-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-[#245C43]">
                Hyperlocal Clearance
              </span>
              <h2 className="text-3xl font-black text-[#163A2A]">
                Available Nearby in {currentCity.city}
              </h2>
              <p className="text-sm text-gray-500 max-w-md">
                Fresh surplus from verified kitchens and community donors near you.
              </p>
            </div>
            <Link
              href="/map"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#245C43] hover:text-emerald-700 transition-colors"
            >
              Open Map View
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {localSurplus.map((item) => (
              <FoodCard key={item.id} listing={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ IMPACT METRICS ═══════════════════ */}
      <section className="py-20 border-b" style={{ borderColor: "var(--fw-border)", background: "var(--cream)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#245C43]">
              Measurable Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#163A2A]">
              Every Meal Matters
            </h2>
            <p className="text-sm text-gray-500">
              Real results from our community-driven food redistribution network across Tamil Nadu.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: <Utensils className="w-6 h-6" />,
                value: `${platformStats.totalMealsRescued?.toLocaleString() || "12,480"}+`,
                label: "Meals Redistributed",
                sub: "Nourishing communities daily",
                gradient: "from-emerald-500 to-green-600",
                bg: "bg-emerald-50",
                iconBg: "bg-emerald-100 text-emerald-700" },
              {
                icon: <TreePine className="w-6 h-6" />,
                value: `${((platformStats.co2SavedKg || 32000) / 1000).toFixed(1)} Tons`,
                label: "CO₂ Prevented",
                sub: "Emissions kept from atmosphere",
                gradient: "from-teal-500 to-cyan-600",
                bg: "bg-teal-50",
                iconBg: "bg-teal-100 text-teal-700" },
              {
                icon: <Heart className="w-6 h-6" />,
                value: "28,450+",
                label: "Free Portions Claimed",
                sub: "100% free redistribution",
                gradient: "from-amber-500 to-orange-600",
                bg: "bg-amber-50",
                iconBg: "bg-amber-100 text-amber-700" },
              {
                icon: <Users className="w-6 h-6" />,
                value: `${(platformStats.activeProviders || 42) + (platformStats.activeRescuePartners || 15)}+`,
                label: "Active Partners",
                sub: "Kitchens, donors & NGOs",
                gradient: "from-violet-500 to-purple-600",
                bg: "bg-violet-50",
                iconBg: "bg-violet-100 text-violet-700" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`${stat.bg} p-6 rounded-3xl border shadow-sm hover:shadow-md transition-shadow`}
                style={{ borderColor: "var(--fw-border)" }}
              >
                <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center mb-4`}>
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#163A2A] mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">{stat.label}</div>
                <p className="text-[11px] text-gray-400 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="py-20 bg-white border-b" style={{ borderColor: "var(--fw-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#245C43]">
              Community Voices
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#163A2A]">
              Stories from Our Network
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "We used to throw away 30kg of food every night. Now it all goes to people who need it — and I sleep better knowing none of it is wasted.",
                name: "Chef Muthu",
                role: "Provider — Madras Bites, Chennai",
                rating: 5 },
              {
                quote: "As a student, getting restaurant-quality meals for free is unbelievable. FoodWise makes it easy — I just browse, claim, and pick up!",
                name: "Priya Krishnan",
                role: "Consumer — Anna University",
                rating: 5 },
              {
                quote: "Our NGO feeds 200 people every night. FoodWise's rescue automation has doubled our capacity without any extra cost.",
                name: "Rajesh Kumar",
                role: "Rescue Partner — Tamil Nadu Food Bank",
                rating: 5 },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-[#FAF7F0] p-7 rounded-3xl border space-y-4 hover:shadow-md transition-shadow"
                style={{ borderColor: "var(--fw-border)" }}
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="pt-3 border-t" style={{ borderColor: "var(--fw-border)" }}>
                  <div className="font-bold text-sm text-[#163A2A]">{t.name}</div>
                  <div className="text-[11px] text-gray-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PARTICIPATE CTA ═══════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, #0D2818 0%, #163A2A 50%, #1E5038 100%)"
        }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
            <HandHeart className="w-4 h-4" />
            Join the Movement
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Ready to Prevent
            <br />
            <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Food Waste in Your City?
            </span>
          </h2>
          <p className="text-base text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
            Whether you run a restaurant, represent an NGO shelter, or have surplus food at home — there is a place for you on FoodWise.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/join"
              className="group px-8 py-4 rounded-2xl text-sm font-black bg-white text-[#163A2A] hover:bg-emerald-50 shadow-lg shadow-black/20 transition-all flex items-center gap-2"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/provider"
              className="px-7 py-4 rounded-2xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors border border-emerald-500"
            >
              Become a Provider
            </Link>
            <Link
              href="/rescue/apply"
              className="px-7 py-4 rounded-2xl text-sm font-bold border border-white/20 text-white/90 hover:bg-white/10 transition-colors"
            >
              Become Rescue Partner
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CSS ANIMATIONS ═══════════════════ */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(6px); opacity: 0.3; }
        }
        @keyframes growWidth {
          from { width: 0; }
          to { width: 78%; }
        }
      `}</style>
    </div>
  );
}
