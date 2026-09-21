import { NextResponse } from "next/server";
import { mockOrders } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    total: mockOrders.length,
    data: mockOrders });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder = {
      id: `ord-${Date.now()}`,
      status: "CONFIRMED",
      pickupCode: `FW-${Date.now().toString().slice(-6)}`,
      pickupPin: pin,
      createdAt: new Date().toISOString(),
      ...body };

    return NextResponse.json(
      {
        success: true,
        message: "Reservation confirmed",
        data: newOrder },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Invalid payload" },
      { status: 400 }
    );
  }
}
