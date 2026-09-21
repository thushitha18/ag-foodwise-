import { NextResponse } from "next/server";
import { mockFoodListings } from "@/lib/mock-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const urgent = searchParams.get("urgent");

  let listings = [...mockFoodListings];

  if (category && category !== "ALL") {
    listings = listings.filter((l) => l.category === category);
  }

  if (urgent === "true") {
    listings = listings.filter((l) => l.urgencyLevel === "URGENT");
  }

  return NextResponse.json({
    success: true,
    total: listings.length,
    data: listings });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newListing = {
      id: `fl-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...body };

    return NextResponse.json(
      {
        success: true,
        message: "Surplus listing created successfully",
        data: newListing },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Invalid payload" },
      { status: 400 }
    );
  }
}
