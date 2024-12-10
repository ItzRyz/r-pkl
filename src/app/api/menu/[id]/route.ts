import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const menu = await prisma.menu.findUnique({
      where: {
        id: Number.parseInt((await params).id),
      },
    });

    if (!menu) {
      return NextResponse.json(
        {
          message: "No menu found!",
          data: menu,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "menu found!",
        data: menu,
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
