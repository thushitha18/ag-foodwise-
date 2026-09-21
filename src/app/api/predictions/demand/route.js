import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const day = searchParams.get("day") || "Friday";
  const category = searchParams.get("category") || "MEALS";

  // Simulate machine learning model inference output
  const prediction = {
    model: "FoodWise-LightGBM-SurplusPredictor-v2",
    features: {
      dayOfWeek: day,
      category,
      rainProbability: 0.15,
      localEventsIndex: 0.8,
      historicalVariance: 0.12 },
    predictedSurplusPortions: 14,
    recommendedPreListingTime: "16:00",
    confidenceInterval: [11, 17],
    accuracyScore: 0.894,
    explanation:
      "Historical Friday evening patterns at banquet venues indicate an average 18% surplus in cooked rice dishes and side gravies after 8:30 PM. Pre-listing by 4:00 PM increases customer reservation probability to 96%." };

  return NextResponse.json({
    success: true,
    data: prediction });
}
