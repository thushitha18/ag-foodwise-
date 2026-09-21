"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockFoodListings, mockInventory, dailyAnalytics } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Brain,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  BarChart2,
  Clock,
  Zap,
  RefreshCcw,
  Activity } from "lucide-react";


export default function ProviderAIPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const predictions = [
    {
      category: "Biryani & Rice Dishes",
      predictedDemand: 45,
      suggestedPrep: 52,
      estimatedSurplus: 7,
      confidence: 0.87,
      trend: "up",
      action: "Weekend demand spike expected. Prepare 52 portions, list 7 surplus by 6 PM." },
    {
      category: "Bakery & Pastries",
      predictedDemand: 30,
      suggestedPrep: 35,
      estimatedSurplus: 5,
      confidence: 0.82,
      trend: "stable",
      action: "Stable pattern. Pre-list 5 surplus pastries at 60% discount by 3 PM." },
    {
      category: "Fresh Curries & Gravies",
      predictedDemand: 28,
      suggestedPrep: 25,
      estimatedSurplus: 0,
      confidence: 0.79,
      trend: "down",
      action: "Low surplus risk. Reduce prep by 3 units to avoid waste." },
    {
      category: "Beverages & Juices",
      predictedDemand: 60,
      suggestedPrep: 70,
      estimatedSurplus: 10,
      confidence: 0.91,
      trend: "up",
      action: "Hot weather alert. High surplus expected. List at 50% off from 2 PM." },
  ];

  const priceRecommendations = [
    {
      item: "Paneer Biryani",
      originalPrice: 280,
      suggestedPrice: 140,
      timeLeft: "1.5h",
      remaining: 4,
      reason: "Expiring soon with 4 remaining. 50% discount recommended to clear stock." },
    {
      item: "Croissants (6 pack)",
      originalPrice: 350,
      suggestedPrice: 175,
      timeLeft: "3h",
      remaining: 8,
      reason: "Evening batch. Historical data shows 50% discount clears within 2h." },
    {
      item: "Fresh Fruit Juice Set",
      originalPrice: 180,
      suggestedPrice: 72,
      timeLeft: "0.5h",
      remaining: 12,
      reason: "Critical urgency. 60% discount + rescue trigger recommended." },
  ];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/provider" className="text-slate-400 hover:text-emerald-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">AI Intelligence Hub</h1>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-[10px] font-bold">
                  ML POWERED
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Demand forecasting, price optimization & surplus prevention
              </p>
            </div>
          </div>
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 w-fit disabled:opacity-60"
          >
            {isAnalyzing ? (
              <>
                <RefreshCcw className="w-4 h-4 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" /> Run Fresh Analysis
              </>
            )}
          </button>
        </div>

        {/* Model Info Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-950 rounded-2xl p-6 text-white shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-xs font-bold text-indigo-300 uppercase">Model</div>
              <div className="text-lg font-black mt-1">Random Forest</div>
              <div className="text-[11px] text-indigo-300/70">Scikit-learn v1.4</div>
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-300 uppercase">Training Data</div>
              <div className="text-lg font-black mt-1">2,000+</div>
              <div className="text-[11px] text-indigo-300/70">Historical records</div>
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-300 uppercase">R² Score</div>
              <div className="text-lg font-black mt-1 text-emerald-400">0.72</div>
              <div className="text-[11px] text-indigo-300/70">Model accuracy</div>
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-300 uppercase">Features</div>
              <div className="text-lg font-black mt-1">12</div>
              <div className="text-[11px] text-indigo-300/70">Input variables</div>
            </div>
          </div>
        </div>

        {showResults && (
          <>
            {/* Demand Predictions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-violet-600" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Tomorrow&apos;s Demand Forecast</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictions.map((pred) => (
                  <div
                    key={pred.category}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 dark:text-white">{pred.category}</div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            Demand: <strong className="text-slate-700 dark:text-slate-300">{pred.predictedDemand}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            Prep: <strong className="text-emerald-600">{pred.suggestedPrep}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            Surplus: <strong className={pred.estimatedSurplus > 0 ? "text-amber-600" : "text-green-600"}>{pred.estimatedSurplus}</strong>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-0.5 text-xs font-bold ${
                          pred.trend === "up" ? "text-emerald-600" : pred.trend === "down" ? "text-red-500" : "text-slate-400"
                        }`}>
                          {pred.trend === "up" ? <TrendingUp className="w-3.5 h-3.5" /> : pred.trend === "down" ? <TrendingDown className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                          {pred.trend.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-[10px] font-bold">
                          {(pred.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30">
                      <div className="flex items-start gap-2 text-xs text-indigo-700 dark:text-indigo-300">
                        <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span>{pred.action}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Pricing */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Smart Price Recommendations</h2>
              </div>

              <div className="space-y-3">
                {priceRecommendations.map((rec) => (
                  <div
                    key={rec.item}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{rec.item}</span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3" /> {rec.timeLeft} left
                          </span>
                          <span className="text-xs text-slate-400">• {rec.remaining} remaining</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{rec.reason}</p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Original</div>
                          <div className="font-bold text-slate-400 line-through">{formatCurrency(rec.originalPrice)}</div>
                        </div>
                        <div className="text-lg text-slate-300 dark:text-slate-600">→</div>
                        <div className="text-right">
                          <div className="text-xs text-emerald-600 font-bold">Suggested</div>
                          <div className="font-black text-emerald-600 text-lg">{formatCurrency(rec.suggestedPrice)}</div>
                        </div>
                        <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all">
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
