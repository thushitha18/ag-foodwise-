// ============================================================
// FOODWISE — Core Constants & Enums (JavaScript)
// ============================================================

export const UserRole = Object.freeze({
  CONSUMER: "consumer",
  PROVIDER: "provider",
  INDIVIDUAL_SELLER: "individual_seller",
  RESCUE_PARTNER: "rescue_partner",
  ADMIN: "admin",
});

export const UrgencyLevel = Object.freeze({
  NORMAL: "NORMAL",
  ATTENTION: "ATTENTION",
  URGENT: "URGENT",
  EXPIRED: "EXPIRED",
});

export const FoodStatus = Object.freeze({
  ACTIVE: "ACTIVE",
  PARTIALLY_SOLD: "PARTIALLY_SOLD",
  SOLD_OUT: "SOLD_OUT",
  RESCUE_PENDING: "RESCUE_PENDING",
  RESCUED: "RESCUED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
});

export const OrderStatus = Object.freeze({
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  READY: "READY",
  PICKED_UP: "PICKED_UP",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
});

export const RescueStatus = Object.freeze({
  PENDING: "PENDING",
  CLAIMED: "CLAIMED",
  ACCEPTED: "ACCEPTED",
  PICKUP_ASSIGNED: "PICKUP_ASSIGNED",
  PICKED_UP: "PICKED_UP",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
});

export const RescueRequestStatus = Object.freeze({
  PENDING: "PENDING",
  CLAIMED: "CLAIMED",
  ACCEPTED: "ACCEPTED",
  PICKUP_ASSIGNED: "PICKUP_ASSIGNED",
  PICKED_UP: "PICKED_UP",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
});

export const FoodCategory = Object.freeze({
  MEALS: "MEALS",
  BAKERY: "BAKERY",
  SNACKS: "SNACKS",
  BEVERAGES: "BEVERAGES",
  DESSERTS: "DESSERTS",
  BREAKFAST: "BREAKFAST",
  CATERING: "CATERING",
  FRESH_PRODUCE: "FRESH_PRODUCE",
  DAIRY: "DAIRY",
  GROCERIES: "GROCERIES",
  OTHER: "OTHER",
});
