import { Company, Department } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function POST(req: NextRequest) {
  try {
    const { name, companyid }: Department = await req.json();

    const newDep = await prisma.department.create({
      data: {
        name: name,
        companyid: companyid,
      },
    });

    if (!newDep.id) {
      return NextResponse.json(
        {
          message: "Failed to create department",
          data: newDep,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Succcess create new department",
        data: newDep,
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
    const departments = await prisma.department.findMany();

    if (departments.length < 1) {
      return NextResponse.json(
        {
          message: "No departments found!",
          data: departments,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "departments found!",
        data: departments,
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
    const { id, name, companyid }: Department = await req.json();

    const updateDepartment = await prisma.department.update({
      data: {
        name: name,
        companyid: companyid,
      },
      where: {
        id: Number.parseInt(id as unknown as string),
      },
    });

    return NextResponse.json(
      {
        message: "Success update department",
        data: updateDepartment,
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
    const { id }: Department = await req.json();

    await prisma.department.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      {
        message: "Success delete department",
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
