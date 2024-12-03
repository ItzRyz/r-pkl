import { Group } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function POST(req: NextRequest) {
  try {
    const { groupnm }: Group = await req.json();

    const validation = await prisma.group.findMany({
      where: {
        groupnm: {
          equals: groupnm,
          mode: "insensitive",
        },
      },
    });

    if (validation.length > 0) {
      return NextResponse.json(
        {
          message: "Failed to create group, group name already used",
          data: [],
        },
        { status: 400 }
      );
    }

    const newGroup = await prisma.group.create({
      data: {
        groupnm: groupnm,
        isactive: true,
      },
    });

    if (!newGroup.id) {
      return NextResponse.json(
        {
          message: "Failed to create group",
          data: newGroup,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Succcess create new group",
        data: newGroup,
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
    const groups = await prisma.group.findMany();

    if (groups.length < 1) {
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
        message: "groups found!",
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

async function PUT(req: NextRequest) {
  try {
    const { id, groupnm }: Group = await req.json();

    const validation = await prisma.group.findMany({
      where: {
        groupnm: {
          equals: groupnm,
          mode: "insensitive",
        },
      },
    });

    if (validation.length > 0) {
      return NextResponse.json(
        {
          message: "Failed to update group, group name already used",
          data: [],
        },
        { status: 400 }
      );
    }

    const updateGroup = await prisma.group.update({
      data: {
        groupnm: groupnm,
      },
      where: {
        id,
      },
    });

    NextResponse.json(
      {
        message: "Success update group",
        data: updateGroup,
      },
      { status: 200 }
    );
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

async function DELETE(req: NextRequest) {
  try {
    const { id }: Group = await req.json();

    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    NextResponse.json(
      {
        message: "Success delete group",
      },
      { status: 200 }
    );
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

export { POST, GET, PUT, DELETE };
