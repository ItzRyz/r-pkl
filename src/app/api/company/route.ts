import { Company, Group } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function POST(req: NextRequest) {
  try {
    const { name, address }: Company = await req.json();

    const newComp = await prisma.company.create({
      data: {
        name: name,
        address: address,
      },
    });

    if (!newComp.id) {
      return NextResponse.json(
        {
          message: "Failed to create company",
          data: newComp,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Succcess create new company",
        data: newComp,
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
    const companies = await prisma.company.findMany();

    if (companies.length < 1) {
      return NextResponse.json(
        {
          message: "No companies found!",
          data: companies,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "groups found!",
        data: companies,
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
    const { id, name, address }: Company = await req.json();

    const updateCompany = await prisma.company.update({
      data: {
        name: name,
        address: address,
      },
      where: {
        id: Number.parseInt(id as unknown as string),
      },
    });

    return NextResponse.json(
      {
        message: "Success update company",
        data: updateCompany,
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
    const { id }: Company = await req.json();

    await prisma.company.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      {
        message: "Success delete company",
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
