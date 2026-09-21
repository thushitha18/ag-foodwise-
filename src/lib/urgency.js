// Urgency engine — calculates urgency level and score
import { UrgencyLevel } from '@/types';

export function calculateUrgency(collectionDeadline) {
  const now = new Date();
  const deadline = new Date(collectionDeadline);
  const diffMs = deadline.getTime() - now.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  let level;
  let score;
  let label;
  let color;
  let bgColor;
  let dot;

  if (diffMinutes <= 0) {
    level = UrgencyLevel.EXPIRED;
    score = 1.0;
    label = 'EXPIRED';
    color = 'text-gray-500';
    bgColor = 'bg-gray-100 text-gray-600';
    dot = '⚫';
  } else if (diffMinutes < 60) {
    level = UrgencyLevel.URGENT;
    score = 0.7 + (1 - diffMinutes / 60) * 0.3;
    label = 'URGENT';
    color = 'text-red-600';
    bgColor = 'bg-red-50 text-red-700 border-red-200';
    dot = '🔴';
  } else if (diffMinutes < 180) {
    level = UrgencyLevel.ATTENTION;
    score = 0.4 + (1 - (diffMinutes - 60) / 120) * 0.3;
    label = 'ATTENTION';
    color = 'text-amber-600';
    bgColor = 'bg-amber-50 text-amber-700 border-amber-200';
    dot = '🟡';
  } else {
    level = UrgencyLevel.NORMAL;
    score = Math.max(0, 0.4 - (diffMinutes - 180) / 1440 * 0.4);
    label = 'NORMAL';
    color = 'text-green-600';
    bgColor = 'bg-green-50 text-green-700 border-green-200';
    dot = '🟢';
  }

  return {
    level,
    score: Math.min(1, Math.max(0, score)),
    remainingMinutes: Math.max(0, diffMinutes),
    label,
    color,
    bgColor,
    dot,
  };
}

export function getUrgencyLevel(collectionDeadline) {
  return calculateUrgency(collectionDeadline).level;
}

export function getTimeRemaining(collectionDeadline) {
  const now = new Date();
  const deadline = new Date(collectionDeadline);
  const diffMs = deadline.getTime() - now.getTime();
  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  if (totalMinutes <= 0) {
    return { totalMinutes: 0, hours: 0, minutes: 0, isExpired: true };
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { totalMinutes, hours, minutes, isExpired: false };
}

export function formatTimeRemaining(collectionDeadline) {
  const { totalMinutes, hours, minutes, isExpired } = getTimeRemaining(collectionDeadline);
  if (isExpired) return 'Expired';
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export function formatCountdown(minutes) {
  if (minutes <= 0) return 'Expired';
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  if (hours > 0) return `${hours}h ${mins}m remaining`;
  return `${mins}m remaining`;
}

export function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
