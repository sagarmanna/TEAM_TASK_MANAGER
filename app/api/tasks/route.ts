import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

const statuses = ["TODO", "IN_PROGRESS", "DONE"] as const;

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const userRole = req.headers.get("x-user-role");

    const tasks =
      await prisma.task.findMany({
        where: userRole === "MEMBER" ? { userId: userId || "" } : undefined,
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

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { message: "Fetch failed", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userRole = req.headers.get("x-user-role");

    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { message: "Only admins can create and assign tasks" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const title = String(body.title || "").trim();
    const projectId = String(body.projectId || "").trim();
    const requestedAssignee = String(body.userId || "").trim();
    const status = statuses.includes(body.status) ? body.status : "TODO";
    const dueDate = new Date(body.dueDate);

    if (!title || !body.dueDate || !projectId) {
      return NextResponse.json(
        { message: "Title, due date and project are required" },
        { status: 400 }
      );
    }

    if (Number.isNaN(dueDate.getTime())) {
      return NextResponse.json(
        { message: "Due date must be valid" },
        { status: 400 }
      );
    }

    const [project, assignee] = await Promise.all([
      prisma.project.findUnique({ where: { id: projectId } }),
      requestedAssignee
        ? prisma.user.findUnique({ where: { id: requestedAssignee } })
        : null,
    ]);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (requestedAssignee && !assignee) {
      return NextResponse.json(
        { message: "Assigned user not found" },
        { status: 404 }
      );
    }

    const task =
      await prisma.task.create({
        data: {
          title,
          status,
          dueDate,
          userId: requestedAssignee || null,
          projectId,
        },
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

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { message: "Create failed", error },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const userRole = req.headers.get("x-user-role");
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { message: "Task id is required" },
        { status: 400 }
      );
    }

    const { id, ...data } = body;
    const existingTask = await prisma.task.findUnique({ where: { id } });

    if (!existingTask) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    if (existingTask.userId !== userId && userRole !== "ADMIN") {
      return NextResponse.json(
        { message: "You can only update your own tasks" },
        { status: 403 }
      );
    }

    if (data.title) {
      data.title = String(data.title).trim();
    }

    if (data.status && !statuses.includes(data.status)) {
      return NextResponse.json(
        { message: "Valid status is required" },
        { status: 400 }
      );
    }

    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate);

      if (Number.isNaN(data.dueDate.getTime())) {
        return NextResponse.json(
          { message: "Due date must be valid" },
          { status: 400 }
        );
      }
    }

    if (data.userId === "") {
      data.userId = null;
    }

    if (data.userId && data.userId !== existingTask.userId && userRole !== "ADMIN") {
      return NextResponse.json(
        { message: "Only admins can reassign tasks" },
        { status: 403 }
      );
    }

    const task =
      await prisma.task.update({
        where: { id },
        data,
      });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { message: "Update failed", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (req.headers.get("x-user-role") !== "ADMIN") {
      return NextResponse.json(
        { message: "Only admins can delete tasks" },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { message: "Task id is required" },
        { status: 400 }
      );
    }

    await prisma.task.delete({
      where: { id: body.id },
    });

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
