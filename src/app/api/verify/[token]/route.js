import { NextResponse } from "next/server";
import { mockRescueRequests } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    total: mockRescueRequests.length,
    data: mockRescueRequests });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newRescue = {
      id: `rr-${Date.now()}`,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      ...body };

    return NextResponse.json(
      {
        success: true,
        message: "Rescue broadcast broadcasted to nearby NGOs",
        data: newRescue },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Invalid payload" },
      { status: 400 }
    );
  }
}
