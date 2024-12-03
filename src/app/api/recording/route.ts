import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
  } catch (e: any) {
    NextResponse.json(
      {
        message: "Internal Server Error!",
        error: e.message,
      },
      { status: 500 }
    );
  }
}
