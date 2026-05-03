import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-user-role") === "ADMIN";
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: "Fetch failed", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json(
        { message: "Only admins can remove team members" },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { message: "User id is required" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.task.updateMany({
        where: { userId: body.id },
        data: { userId: null },
      }),
      prisma.user.delete({ where: { id: body.id } }),
    ]);

    return NextResponse.json({ message: "User removed" });
  } catch (error) {
    return NextResponse.json(
      { message: "Remove failed", error },
      { status: 500 }
    );
  }
}
