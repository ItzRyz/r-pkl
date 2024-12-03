import { User } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";

async function POST(req: NextRequest) {
  try {
    const { username, password, name, email, groupid }: User = await req.json();

    const usernameValidation = await prisma.user.findMany({
      where: {
        username: username,
      },
    });

    if (usernameValidation.length > 0) {
      return NextResponse.json(
        {
          message: "Failed to create user, username already used",
          data: [],
        },
        { status: 400 }
      );
    }

    const emailValidation = await prisma.user.findMany({
      where: {
        email: email,
      },
    });

    if (emailValidation.length > 0) {
      return NextResponse.json(
        {
          message: "Failed to create user, email already used",
          data: [],
        },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: encrypt(password as string),
        email: email,
        name: name,
        groupid: groupid,
      },
    });

    if (!newUser.id) {
      return NextResponse.json(
        {
          message: "Failed to create user",
          data: newUser,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Succcess create new user",
        data: newUser,
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
    const users = await prisma.user.findMany();

    if (users.length < 1) {
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

async function PUT(req: NextRequest) {
  try {
    const { id, username, name, email, password }: User = await req.json();

    const usernameValidation = await prisma.user.findMany({
      where: {
        username: username,
      },
    });

    if (usernameValidation.length > 0) {
      const validateId = usernameValidation.map((a) => a.id == id);
      if (!validateId) {
        return NextResponse.json(
          {
            message: "Failed to update user, username already used",
            data: [],
          },
          { status: 400 }
        );
      }
    }

    const emailValidation = await prisma.user.findMany({
      where: {
        email: email,
      },
    });

    if (emailValidation.length > 0) {
      const validateId = emailValidation.map((a) => a.id == id);
      if (!validateId) {
        return NextResponse.json(
          {
            message: "Failed to update user, email already used",
            data: [],
          },
          { status: 400 }
        );
      }
    }

    const updateUser = await prisma.user.update({
      data: {
        username: username,
        name: name,
        email: email,
        password: encrypt(password as string),
      },
      where: {
        id: Number.parseInt(id as unknown as string),
      },
    });

    return NextResponse.json(
      {
        message: "Success update user",
        data: updateUser,
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
    const { id }: User = await req.json();

    const deleteUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      {
        message: "Success delete user",
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
