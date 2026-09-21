// Recommendation Engine — Interpretable scoring system
import { calculateUrgency } from './urgency';
import { haversineDistance } from './distance';

// Max distance for proximity score (km)
const MAX_DISTANCE = 10;
// Max price for price score
const MAX_PRICE = 500;

/**
 * Score a single listing for a user
 * recommendation_score = 
 *   0.30 * proximity_score
 * + 0.25 * urgency_score
 * + 0.20 * preference_score
 * + 0.15 * price_score
 * + 0.10 * availability_score
 */
export function scoreListingForUser(
  listing,
  userLat,
  userLon,
  preferredCategories = [],
  maxBudget = MAX_PRICE
) {
  const reasons = [];
  const lat = listing.latitude ?? listing.provider?.lat ?? 13.0827;
  const lng = listing.longitude ?? listing.provider?.lng ?? 80.2707;
  const price = listing.discountedPrice ?? listing.surplus_price ?? 100;
  const original = listing.originalPrice ?? listing.original_price ?? 200;
  const deadline = listing.expiresAt ?? listing.collection_deadline ?? new Date().toISOString();

  // 1. Proximity score
  const distance = haversineDistance(userLat, userLon, lat, lng);
  const proximityScore = Math.max(0, 1 - distance / MAX_DISTANCE);
  if (distance < 2) reasons.push(`${distance.toFixed(1)} km away`);

  // 2. Urgency score (from urgency engine)
  const urgency = calculateUrgency(deadline);
  const urgencyScore = urgency.level === 'EXPIRED' ? 0 : urgency.score;
  if (urgency.level === 'URGENT') reasons.push('Collection deadline approaching');

  // 3. Preference score
  let preferenceScore = 0.5; // default for new users
  if (preferredCategories.includes(listing.category)) {
    preferenceScore = 1.0;
    reasons.push('Matches your preferred category');
  }

  // 4. Price score
  const priceScore = price <= maxBudget ? 1 - price / MAX_PRICE : 0;
  if (price <= maxBudget * 0.4) reasons.push('Within your usual price range');

  // 5. Availability score
  const remaining = listing.remaining_quantity ?? listing.quantity;
  const availabilityRatio = remaining / Math.max(1, listing.quantity);
  const availabilityScore = availabilityRatio > 0 ? Math.min(1, availabilityRatio) : 0;

  const finalScore =
    0.30 * proximityScore +
    0.25 * urgencyScore +
    0.20 * preferenceScore +
    0.15 * priceScore +
    0.10 * availabilityScore;

  // Discount based
  const discountPct = original > price ? ((original - price) / original) * 100 : 0;
  if (discountPct >= 50) reasons.push(`${Math.round(discountPct)}% off original price`);

  return { score: Math.min(1, Math.max(0, finalScore)), reasons };
}

export function rankListings(
  listings,
  userLat,
  userLon,
  preferredCategories = [],
  maxBudget = MAX_PRICE
) {
  return listings
    .filter((l) => l.status !== 'EXPIRED' && l.status !== 'SOLD_OUT')
    .map((l) => {
      const { score, reasons } = scoreListingForUser(l, userLat, userLon, preferredCategories, maxBudget);
      const lat = l.latitude ?? l.provider?.lat ?? 13.0827;
      const lng = l.longitude ?? l.provider?.lng ?? 80.2707;
      const distance = haversineDistance(userLat, userLon, lat, lng);
      return {
        ...l,
        recommendationScore: score,
        recommendation_score: score,
        recommendation_reasons: reasons,
        distance,
        distanceKm: distance,
      };
    })
    .sort((a, b) => (b.recommendationScore ?? 0) - (a.recommendationScore ?? 0));
}

export function applyFilters(listings, filter) {
  return listings.filter((l) => {
    const title = (l.title || l.food_name || '').toLowerCase();
    const desc = (l.description || '').toLowerCase();
    const price = l.discountedPrice ?? l.surplus_price ?? 0;
    const distance = l.distanceKm ?? l.distance ?? 0;
    const urgency = l.urgencyLevel ?? l.urgency_level;

    if (filter.search) {
      const q = filter.search.toLowerCase();
      if (!title.includes(q) && !desc.includes(q)) return false;
    }
    if (filter.category && l.category !== filter.category) return false;
    if (filter.min_price !== undefined && price < filter.min_price) return false;
    if (filter.max_price !== undefined && price > filter.max_price) return false;
    if (filter.max_distance !== undefined && distance > filter.max_distance) return false;
    if (filter.urgency && urgency !== filter.urgency) return false;
    return true;
  });
}

export function sortListings(listings, sort) {
  const sorted = [...listings];
  const s = String(sort || 'RECOMMENDED').toUpperCase();

  switch (s) {
    case 'NEAREST':
    case 'DISTANCE':
      return sorted.sort((a, b) => (a.distanceKm ?? a.distance ?? 999) - (b.distanceKm ?? b.distance ?? 999));
    case 'LOWEST_PRICE':
    case 'PRICE_ASC':
      return sorted.sort((a, b) => (a.discountedPrice ?? a.surplus_price ?? 0) - (b.discountedPrice ?? b.surplus_price ?? 0));
    case 'DISCOUNT':
      return sorted.sort((a, b) => {
        const discA = (a.originalPrice ?? 1) - (a.discountedPrice ?? 0);
        const discB = (b.originalPrice ?? 1) - (b.discountedPrice ?? 0);
        return discB - discA;
      });
    case 'MOST_URGENT':
    case 'URGENCY':
      return sorted.sort((a, b) => {
        const timeA = new Date(a.expiresAt ?? a.collection_deadline ?? 0).getTime();
        const timeB = new Date(b.expiresAt ?? b.collection_deadline ?? 0).getTime();
        return timeA - timeB;
      });
    case 'NEWEST':
      return sorted.sort((a, b) => {
        const timeA = new Date(a.createdAt ?? a.created_at ?? 0).getTime();
        const timeB = new Date(b.createdAt ?? b.created_at ?? 0).getTime();
        return timeB - timeA;
      });
    case 'RECOMMENDED':
    default:
      return sorted.sort((a, b) => (b.recommendationScore ?? b.recommendation_score ?? 0) - (a.recommendationScore ?? a.recommendation_score ?? 0));
  }
}
