import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const groups = await prisma.group.findUnique({
      where: {
        id: Number.parseInt((await params).id),
      },
    });

    if (!groups) {
      return NextResponse.json(
        {
          message: "No groups found!",
          data: groups,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Groups found!",
        data: groups,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        message: "Internal Server Error!",
        error: e.message,
      },
      { status: 500 }
    );
  }
}

export { GET };
