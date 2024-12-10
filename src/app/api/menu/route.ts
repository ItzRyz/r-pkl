import { Menu } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function POST(req: NextRequest) {
  try {
    const { menunm, icon, seq, masterid, isactive }: Menu = await req.json();

    const newMenu = await prisma.menu.create({
      data: {
        menunm: menunm,
        icon: icon,
        seq: seq,
        masterid: masterid,
        isactive: isactive,
      },
    });

    if (!newMenu.id) {
      return NextResponse.json(
        {
          message: "Failed to create menu",
          data: newMenu,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Succcess create new menu",
        data: newMenu,
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

async function GET() {
  try {
    const menus = await prisma.menu.findMany();

    if (menus.length < 1) {
      return NextResponse.json(
        {
          message: "No menus found!",
          data: menus,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Menus found!",
        data: menus,
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

async function PUT(req: NextRequest) {
  try {
    const { id, menunm, icon, seq, masterid, isactive }: Menu =
      await req.json();

    const updateMenu = await prisma.menu.update({
      data: {
        menunm: menunm,
        icon: icon,
        seq: seq,
        masterid: masterid,
        isactive: isactive,
      },
      where: {
        id: Number.parseInt(id as unknown as string),
      },
    });

    return NextResponse.json(
      {
        message: "Success update group",
        data: updateMenu,
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

async function DELETE(req: NextRequest) {
  try {
    const { id }: Menu = await req.json();

    await prisma.menu.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      {
        message: "Success delete group",
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

export { POST, GET, PUT, DELETE };
