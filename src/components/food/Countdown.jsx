"use client";

import React, { useEffect, useState } from "react";
import { formatTimeRemaining, getTimeRemaining } from "@/lib/urgency";
import { Clock } from "lucide-react";

export const Countdown = ({
  expiresAt,
  className = "",
  showIcon = true,
}) => {
  const [remaining, setRemaining] = useState(formatTimeRemaining(expiresAt));
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const formatted = formatTimeRemaining(expiresAt);
      setRemaining(formatted);
      const { hours, isExpired } = getTimeRemaining(expiresAt);
      setIsUrgent(!isExpired && hours < 2);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 10000); // 10s tick
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-medium tabular-nums ${
        isUrgent ? "text-rose-600 font-semibold animate-pulse" : "text-slate-600 dark:text-slate-300"
      } ${className}`}
    >
      {showIcon && <Clock className="w-3.5 h-3.5 opacity-80" />}
      <span>{remaining}</span>
    </div>
  );
};
