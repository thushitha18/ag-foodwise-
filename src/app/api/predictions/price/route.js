import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { originalPrice, remainingMinutes, category } = await request.json();

    const price = Number(originalPrice) || 300;
    const minutes = Number(remainingMinutes) || 120;

    // Decay formula:
    // If minutes <= 60 -> 65% discount
    // If minutes <= 120 -> 55% discount
    // If minutes <= 240 -> 45% discount
    // Else -> 35% discount
    let discountPercent = 35;
    if (minutes <= 60) discountPercent = 65;
    else if (minutes <= 120) discountPercent = 55;
    else if (minutes <= 240) discountPercent = 45;

    const recommendedPrice = Math.round((price * (1 - discountPercent / 100)) / 10) * 10;
    const projectedClearanceProbability = Math.min(0.98, 0.65 + (discountPercent / 100) * 0.45);

    return NextResponse.json({
      success: true,
      data: {
        originalPrice: price,
        recommendedPrice,
        discountPercent,
        projectedClearanceProbability,
        estimatedCo2SavedKg: (recommendedPrice * 0.008).toFixed(1),
        urgencyClassification: minutes <= 120 ? "URGENT" : minutes <= 360 ? "ATTENTION" : "NORMAL" } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Invalid payload" },
      { status: 400 }
    );
  }
}
