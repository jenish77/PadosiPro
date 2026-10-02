import { prisma } from '../../config/db';

export class TaskService {
  static async getCategoriesWithTasks() {
    return prisma.taskCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        tasks: {
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  static async saveUserTaskSelections(userId: string, taskIds: string[]) {
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      throw { statusCode: 400, message: 'Please select at least one task' };
    }

    const validTasks = await prisma.task.findMany({
      where: { id: { in: taskIds } },
      select: { id: true },
    });

    if (validTasks.length !== taskIds.length) {
      throw { statusCode: 400, message: 'One or more selected tasks are invalid' };
    }

    await prisma.$transaction([
      prisma.userTaskSelection.deleteMany({
        where: { userId },
      }),
      prisma.userTaskSelection.createMany({
        data: taskIds.map((taskId) => ({
          userId,
          taskId,
        })),
      }),
    ]);

    return this.getUserTaskSelections(userId);
  }

  static async getUserTaskSelections(userId: string) {
    const selections = await prisma.userTaskSelection.findMany({
      where: { userId },
      include: {
        task: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { selectedAt: 'desc' },
    });

    return selections.map((s) => ({
      id: s.task.id,
      name: s.task.name,
      description: s.task.description,
      iconName: s.task.iconName,
      categoryName: s.task.category.name,
      categoryId: s.task.category.id,
      selectedAt: s.selectedAt,
    }));
  }
}
