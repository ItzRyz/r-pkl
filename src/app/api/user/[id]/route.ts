import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const users = await prisma.user.findUnique({
      where: {
        id: Number.parseInt((await params).id),
      },
    });

    if (!users) {
      return NextResponse.json(
        {
          message: "No users found!",
          data: users,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Users found!",
        data: users,
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
