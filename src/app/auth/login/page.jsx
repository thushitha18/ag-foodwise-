"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/types";
import {
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Store,
  HeartHandshake,
  Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err?.message || "Invalid credentials. Try using one of the 1-click demo accounts below.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, role) => {
    setError(null);
    setLoading(true);
    try {
      await login(demoEmail, "Demo@1234");
      switch (role) {
        case UserRole.PROVIDER:
          router.push("/provider");
          break;
        case UserRole.RESCUE_PARTNER:
          router.push("/rescue");
          break;
        case UserRole.ADMIN:
          router.push("/admin");
          break;
        case UserRole.CONSUMER:
        default:
          router.push("/dashboard");
          break;
      }
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            FoodWise
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="text-xs text-slate-500">
          Or test immediately using hackathon pre-configured personas below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl border border-slate-200/80 dark:border-slate-800 sm:rounded-3xl sm:px-10 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs border border-rose-200 dark:border-rose-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Judge / Evaluator 1-Click Demo Accounts */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>1-Click Hackathon Evaluator Login</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("consumer@foodwise.demo", UserRole.CONSUMER)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left hover:border-emerald-500 transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <User className="w-3.5 h-3.5 text-emerald-600" /> Consumer
                </div>
                <div className="text-[10px] text-slate-400">Priya Sharma</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("provider@foodwise.demo", UserRole.PROVIDER)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left hover:border-emerald-500 transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Store className="w-3.5 h-3.5 text-emerald-600" /> Food Provider
                </div>
                <div className="text-[10px] text-slate-400">Taj Coromandel</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("rescue@foodwise.demo", UserRole.RESCUE_PARTNER)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left hover:border-indigo-500 transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" /> Rescue NGO
                </div>
                <div className="text-[10px] text-slate-400">Robin Hood Army</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("admin@foodwise.demo", UserRole.ADMIN)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left hover:border-cyan-500 transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Shield className="w-3.5 h-3.5 text-cyan-600" /> Platform Admin
                </div>
                <div className="text-[10px] text-slate-400">Dr. Aris Thorne</div>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-bold text-emerald-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
