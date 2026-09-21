"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "@/lib/location-context";
import { useCart } from "@/lib/cart-context";
import {
  Leaf,
  Compass,
  Heart,
  ShoppingBag,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Store,
  MapPin,
  PlusCircle,
  HeartHandshake,
  Home,
  ShieldCheck,
  ShoppingCart,
  Layers,
} from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { currentCity, setCity, cities } = useLocation();
  const { totalPortions, items } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [participateOpen, setParticipateOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const participateRef = useRef(null);
  const userDropRef = useRef(null);
  const cityDropRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (participateRef.current && !participateRef.current.contains(e.target)) {
        setParticipateOpen(false);
      }
      if (userDropRef.current && !userDropRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (cityDropRef.current && !cityDropRef.current.contains(e.target)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { href: "/explore", label: "Explore Food", icon: Compass },
    { href: "/individual-seller", label: "Donate Food", icon: PlusCircle },
    { href: "/orders", label: "My Orders", icon: ShoppingBag },
    { href: "/impact", label: "Impact", icon: BarChart3 },
  ];

  const participateOptions = [
    {
      title: "Join FoodWise",
      subtitle: "Create your FoodWise account",
      href: "/join",
      icon: User,
    },
    {
      title: "Become Provider",
      subtitle: "List surplus food from your business",
      href: "/provider",
      icon: Store,
    },
    {
      title: "Become Rescue Partner",
      subtitle: "Help redistribute surplus food",
      href: "/rescue/apply",
      icon: HeartHandshake,
    },
    {
      title: "Sell Excess Food",
      subtitle: "Share or donate food from home",
      href: "/individual-seller",
      icon: Home,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b" style={{ borderColor: "var(--fw-border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs" style={{ background: "var(--forest)" }}>
              <Leaf className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight" style={{ color: "var(--forest)" }}>
                FoodWise
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-800 -mt-1">
                Free Food Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-[#C8DCCB]/60 text-[#163A2A]"
                      : "text-[#242522] hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#245C43]" />
                  {link.label}
                </Link>
              );
            })}

            {/* Top PARTICIPATE Dropdown */}
            <div className="relative" ref={participateRef}>
              <button
                type="button"
                onClick={() => setParticipateOpen(!participateOpen)}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  participateOpen ? "bg-gray-100 text-[#163A2A]" : "text-[#242522] hover:bg-gray-50"
                }`}
              >
                <span>PARTICIPATE</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${participateOpen ? "rotate-180" : ""}`} />
              </button>

              {participateOpen && (
                <div
                  className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-lg border p-1.5 z-50 animate-fade-in"
                  style={{ borderColor: "var(--fw-border)" }}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1.5 border-b" style={{ borderColor: "var(--fw-border)" }}>
                    Get Involved in FoodWise
                  </div>
                  {participateOptions.map((opt) => {
                    const OptIcon = opt.icon;
                    return (
                      <Link
                        key={opt.href}
                        href={opt.href}
                        onClick={() => setParticipateOpen(false)}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-[#FAF7F0] transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-100">
                          <OptIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs text-gray-900 group-hover:text-emerald-800">
                            {opt.title}
                          </div>
                          <div className="text-[11px] text-gray-500 line-clamp-1">
                            {opt.subtitle}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Side: City Selector, Cart Icon, Auth Profile */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* City Location Selector */}
            <div className="relative" ref={cityDropRef}>
              <button
                type="button"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-gray-50"
                style={{ borderColor: "var(--fw-border)", color: "var(--charcoal)" }}
              >
                <MapPin className="w-3.5 h-3.5 text-[#245C43]" />
                <span>{currentCity.city}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {cityDropdownOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border py-1 z-50 animate-fade-in"
                  style={{ borderColor: "var(--fw-border)" }}
                >
                  <div className="px-3 py-1 text-[10px] font-bold uppercase text-gray-400 border-b" style={{ borderColor: "var(--fw-border)" }}>
                    Select Region Hub
                  </div>
                  {cities.map((c) => (
                    <button
                      key={c.city}
                      onClick={() => {
                        setCity(c.city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 ${
                        c.city === currentCity.city ? "font-bold text-emerald-800 bg-emerald-50/50" : "text-gray-700"
                      }`}
                    >
                      <span>{c.city}</span>
                      {c.city === currentCity.city && <span className="w-1.5 h-1.5 rounded-full bg-[#245C43]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Icon Link */}
            <Link
              href="/cart"
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold hover:bg-gray-50 transition-colors"
              style={{ borderColor: "var(--fw-border)", color: "var(--charcoal)" }}
              title="View Claim Cart"
            >
              <ShoppingCart className="w-4 h-4 text-[#245C43]" />
              <span className="hidden sm:inline">Cart</span>
              {items.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#245C43] text-white">
                  {totalPortions}
                </span>
              )}
            </Link>

            {/* Authenticated User / Join CTA */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userDropRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-50 transition-colors border"
                  style={{ borderColor: "var(--fw-border)" }}
                >
                  <div className="w-7 h-7 rounded-lg text-white font-black text-xs flex items-center justify-center" style={{ background: "var(--forest)" }}>
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-gray-800 max-w-[90px] truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400 mr-1" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-lg border py-1 z-50 animate-fade-in"
                    style={{ borderColor: "var(--fw-border)" }}
                  >
                    <div className="px-3.5 py-2 border-b" style={{ borderColor: "var(--fw-border)" }}>
                      <div className="font-bold text-xs text-gray-900 truncate">{user.name}</div>
                      <div className="text-[11px] text-gray-500 truncate">{user.email}</div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <Layers className="w-3.5 h-3.5 text-emerald-700" />
                      Unified Dashboard
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                      My Orders & Claims
                    </Link>

                    <Link
                      href="/complaints"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-3.5 h-3.5 text-emerald-700" />
                      Support & Complaints
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-600 border-t hover:bg-red-50"
                      style={{ borderColor: "var(--fw-border)" }}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/join"
                className="btn-primary py-2 px-4 rounded-lg text-xs font-bold shadow-xs"
              >
                Join FoodWise
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/cart"
              className="p-2 rounded-lg border text-gray-700 relative"
              style={{ borderColor: "var(--fw-border)" }}
            >
              <ShoppingCart className="w-4 h-4 text-[#245C43]" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#245C43] text-white">
                  {totalPortions}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white px-4 pt-3 pb-6 space-y-4 animate-fade-in" style={{ borderColor: "var(--fw-border)" }}>
          {/* City Selector */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F0] border text-xs" style={{ borderColor: "var(--fw-border)" }}>
            <span className="font-semibold text-gray-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#245C43]" /> Region:
            </span>
            <select
              value={currentCity.city}
              onChange={(e) => setCity(e.target.value)}
              className="font-bold text-emerald-800 bg-transparent border-none outline-none"
            >
              {cities.map((c) => (
                <option key={c.city} value={c.city}>{c.city}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-gray-800 hover:bg-gray-50"
                >
                  <Icon className="w-4 h-4 text-[#245C43]" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Participate Section on Mobile */}
          <div className="border-t pt-3 space-y-1" style={{ borderColor: "var(--fw-border)" }}>
            <div className="text-[10px] font-bold uppercase text-gray-400 px-3 py-1">
              Participate
            </div>
            {participateOptions.map((opt) => (
              <Link
                key={opt.href}
                href={opt.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-50"
              >
                <span className="font-semibold">{opt.title}</span>
                <span className="text-[11px] text-gray-400">{opt.subtitle}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Auth Button */}
          <div className="border-t pt-3" style={{ borderColor: "var(--fw-border)" }}>
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center btn-primary py-2.5 rounded-lg text-xs font-bold"
                >
                  Unified Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="block w-full text-center py-2 rounded-lg border text-xs font-semibold text-red-600 hover:bg-red-50"
                  style={{ borderColor: "var(--fw-border)" }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/join"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center btn-primary py-2.5 rounded-lg text-xs font-bold"
              >
                Join FoodWise
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
