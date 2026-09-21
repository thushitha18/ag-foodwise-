import React from "react";
import Link from "next/link";
import { Leaf, Shield } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#163A2A] text-[#C8DCCB] border-t border-[#245C43]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#245C43] flex items-center justify-center text-white">
                <Leaf className="w-4 h-4 text-[#C8DCCB]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                FoodWise
              </span>
            </Link>
            <p className="text-xs text-[#C8DCCB] max-w-sm leading-relaxed">
              Turn Surplus Into Opportunity. Buy surplus. Sell surplus. Rescue what remains. Waste less.
            </p>
            <div className="text-[11px] text-[#7FA88A] pt-1">
              Active in Coimbatore & Chennai Metropolitan Hubs.
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/consumer" className="hover:text-white transition-colors">
                  Food
                </Link>
              </li>
              <li>
                <Link href="/provider" className="hover:text-white transition-colors">
                  Providers
                </Link>
              </li>
              <li>
                <Link href="/rescue" className="hover:text-white transition-colors">
                  Rescue
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-white transition-colors">
                  Impact
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/complaints" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/complaints" className="hover:text-white transition-colors">
                  Complaints
                </Link>
              </li>
              <li>
                <Link href="/complaints" className="hover:text-white transition-colors">
                  Help Desk
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Participate & Demo */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Participate
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/join" className="hover:text-white font-semibold transition-colors">
                  Join FoodWise
                </Link>
              </li>
              <li>
                <Link href="/provider" className="hover:text-white transition-colors">
                  Become Provider
                </Link>
              </li>
              <li>
                <Link href="/rescue/apply" className="hover:text-white transition-colors">
                  Become Rescue Partner
                </Link>
              </li>
              <li>
                <Link href="/individual-seller" className="hover:text-white transition-colors">
                  Sell Excess Food
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/demo" className="text-amber-300 hover:text-white font-bold">
                  Interactive Demo →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="mt-10 pt-6 border-t border-[#245C43]">
          <div className="p-3.5 rounded-xl bg-[#245C43]/40 border border-[#7FA88A]/30 flex items-start gap-2.5 text-[11px] text-[#C8DCCB] leading-relaxed">
            <Shield className="w-4 h-4 text-[#7FA88A] shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Safety Disclaimer:</strong> FoodWise facilitates commercial surplus optimization and humanitarian community redistribution. Sellers and providers certify compliance with applicable hygienic standards. FoodWise does not certify private residential kitchens.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-[#245C43]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7FA88A] gap-3">
          <p>© 2026 FoodWise. Turn Surplus Into Opportunity.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Chennai • Coimbatore</span>
            <span>Zero Edible Food to Landfill</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
