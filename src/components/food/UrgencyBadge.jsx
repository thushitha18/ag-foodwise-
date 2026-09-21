"use client";

import React from "react";
import { UrgencyLevel } from "@/types";
import { getUrgencyLevel } from "@/lib/urgency";
import { AlertTriangle, Clock, Zap, CheckCircle2 } from "lucide-react";

export const UrgencyBadge = ({
  urgencyLevel,
  expiresAt,
  className = "",
  showIcon = true,
}) => {
  const level = urgencyLevel || (expiresAt ? getUrgencyLevel(expiresAt) : UrgencyLevel.NORMAL);

  switch (level) {
    case UrgencyLevel.URGENT:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-600 border border-rose-500/30 animate-pulse ${className}`}
        >
          {showIcon && <Zap className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />}
          <span>Urgent Rescue</span>
        </span>
      );
    case UrgencyLevel.ATTENTION:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 border border-amber-500/30 ${className}`}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600" />}
          <span>Ending Soon</span>
        </span>
      );
    case UrgencyLevel.EXPIRED:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-500 border border-slate-400/30 ${className}`}
        >
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />}
          <span>Expired</span>
        </span>
      );
    case UrgencyLevel.NORMAL:
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 ${className}`}
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          <span>Fresh Surplus</span>
        </span>
      );
  }
};
