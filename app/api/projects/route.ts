import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

function isAdmin(req: NextRequest | Request) {
  return req.headers.get("x-user-role") === "ADMIN";
}

export async function GET() {
  try {
    const projects =
      await prisma.project.findMany({
        include: {
          tasks: true,
        },
      });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { message: "Fetch failed", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json(
        { message: "Only admins can create projects" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();

    if (!name || !description) {
      return NextResponse.json(
        { message: "Name and description are required" },
        { status: 400 }
      );
    }

    const project =
      await prisma.project.create({
        data: {
          name,
          description,
        },
      });

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { message: "Create failed", error },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json(
        { message: "Only admins can update projects" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();

    if (!body.id || !name || !description) {
      return NextResponse.json(
        { message: "Project id, name and description are required" },
        { status: 400 }
      );
    }

    const updated =
      await prisma.project.update({
        where: { id: body.id },
        data: {
          name,
          description,
        },
      });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Update failed", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json(
        { message: "Only admins can delete projects" },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { message: "Project id is required" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.task.deleteMany({ where: { projectId: body.id } }),
      prisma.project.delete({ where: { id: body.id } }),
    ]);

    return NextResponse.json({
      message: "Deleted",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Delete failed", error },
      { status: 500 }
    );
  }
}
