import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

const statuses = ["TODO", "IN_PROGRESS", "DONE"] as const;

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = req.headers.get("x-user-id");
    const userRole = req.headers.get("x-user-role");

    const body = await req.json();
    const { status } = body;

    if (!statuses.includes(status)) {
      return NextResponse.json(
        { message: "Valid status is required" },
        { status: 400 }
      );
    }

    // Check if task exists and user can update it
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    // Only assigned user or admin can update status
    if (task.userId !== userId && userRole !== 'ADMIN') {
      return NextResponse.json(
        { message: "You can only update your own tasks" },
        { status: 403 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        project: true,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json(
      { message: "Update failed", error },
      { status: 500 }
    );
  }
}
