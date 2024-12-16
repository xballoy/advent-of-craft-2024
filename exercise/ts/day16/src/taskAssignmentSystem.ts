import type { Elf } from './elf';

export class TaskAssignmentSystem {
  private readonly elves: Elf[] = [];
  private tasksCompleted = 0;
  private taskAssignments: Map<number, Elf> = new Map(); // Track current assignments
  private nextTaskId = 1; // To generate unique task IDs

  constructor(elves: Elf[]) {
    this.elves = elves;
  }

  // Returns all qualified elves instead of just the first one
  findQualifiedElves(taskSkillRequired: number): Elf[] {
    return this.elves.filter((elf) => elf.skillLevel >= taskSkillRequired);
  }

  // Assigns task to the least busy qualified elf
  assignTask(taskSkillRequired: number): Elf | null {
    const qualifiedElves = this.findQualifiedElves(taskSkillRequired);
    if (qualifiedElves.length === 0) return null;

    // Find the elf with the fewest current assignments
    const elfAssignmentCounts = new Map<number, number>();
    for (const elf of this.elves) {
      elfAssignmentCounts.set(elf.id, 0);
    }

    for (const elf of this.taskAssignments.values()) {
      const count = elfAssignmentCounts.get(elf.id) || 0;
      elfAssignmentCounts.set(elf.id, count + 1);
    }

    // Sort qualified elves by their current workload
    const sortedQualifiedElves = qualifiedElves.sort((a, b) => {
      const aCount = elfAssignmentCounts.get(a.id) || 0;
      const bCount = elfAssignmentCounts.get(b.id) || 0;
      return aCount - bCount;
    });

    // biome-ignore lint/style/noNonNullAssertion: we know sortedQualifiedElves has at least 1 entry
    const assignedElf = sortedQualifiedElves[0]!;
    const taskId = this.nextTaskId++;
    this.taskAssignments.set(taskId, assignedElf);

    return assignedElf;
  }

  // Reassign task without modifying skill levels
  reassignTask(
    fromElfId: number,
    toElfId: number,
    taskSkillRequired: number,
  ): boolean {
    const fromElf = this.elves.find((e) => e.id === fromElfId);
    const toElf = this.elves.find((e) => e.id === toElfId);

    if (!fromElf || !toElf) return false;

    // Check if the receiving elf has sufficient skill level
    if (toElf.skillLevel >= taskSkillRequired) {
      return true;
    }
    return false;
  }

  // Rest of the methods remain the same...
  reportTaskCompletion(elfId: number): boolean {
    const elf = this.elves.find((e) => e.id === elfId);
    if (elf) {
      this.tasksCompleted++;
      return true;
    }
    return false;
  }

  getTotalTasksCompleted(): number {
    return this.tasksCompleted;
  }

  getElfWithHighestSkill(): Elf | null {
    if (this.elves.length === 0) return null;
    // @ts-ignore
    return this.elves.reduce(
      (prev, current) =>
        // @ts-ignore
        prev.skillLevel > current.skillLevel ? prev : current,
      this.elves[0],
    );
  }

  increaseSkillLevel(elfId: number, increment: number): void {
    const elf = this.elves.find((e) => e.id === elfId);
    if (elf) {
      elf.skillLevel += increment;
    }
  }

  decreaseSkillLevel(elfId: number, decrement: number): void {
    const elf = this.elves.find((e) => e.id === elfId);
    if (elf && elf.skillLevel - decrement > 0) {
      elf.skillLevel -= decrement;
    }
  }

  listElvesBySkillDescending(): Elf[] {
    return [...this.elves].sort((a, b) => b.skillLevel - a.skillLevel);
  }

  resetAllSkillsToBaseline(baseline: number): void {
    for (const elf of this.elves) {
      elf.skillLevel = baseline;
    }
  }
}
