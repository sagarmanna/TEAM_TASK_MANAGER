import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();

    const [
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      projects,
      recentTasks,
      users,
    ] = await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { status: "DONE" } }),
      prisma.task.count({
        where: { status: { in: ["TODO", "IN_PROGRESS"] } },
      }),
      prisma.task.count({
        where: {
          dueDate: { lt: now },
          status: { not: "DONE" },
        },
      }),
      prisma.project.findMany({
        include: {
          tasks: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.task.findMany({
        take: 6,
        orderBy: {
          dueDate: "asc",
        },
        include: {
          project: true,
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    const projectProgress = projects.map((project) => {
      const total = project.tasks.length;
      const done = project.tasks.filter(
        (task) => task.status === "DONE"
      ).length;

      return {
        id: project.id,
        name: project.name,
        progress: total === 0 ? 0 : Math.round((done / total) * 100),
      };
    });

    return NextResponse.json({
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
      },
      projectProgress,
      recentTasks,
      users,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Fetch failed", error },
      { status: 500 }
    );
  }
}
