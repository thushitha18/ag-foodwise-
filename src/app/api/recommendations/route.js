import { NextResponse } from "next/server";
import { mockFoodListings } from "@/lib/mock-data";
import { sortListings } from "@/lib/recommendations";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sortBy = (searchParams.get("sortBy")) || "RECOMMENDED";

  const sorted = sortListings(mockFoodListings, sortBy);

  return NextResponse.json({
    success: true,
    engine: "FoodWise-MultiFactor-V1",
    weights: {
      proximity: 0.30,
      urgency: 0.25,
      dietaryPreference: 0.20,
      priceValue: 0.15,
      inventoryAvailability: 0.10 },
    total: sorted.length,
    data: sorted });
}
