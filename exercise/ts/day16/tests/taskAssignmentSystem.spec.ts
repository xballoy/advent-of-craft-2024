import { Elf } from '../src/elf';
import { TaskAssignmentSystem } from '../src/taskAssignmentSystem';

describe('TaskAssignmentSystem', () => {
  let system: TaskAssignmentSystem;

  beforeEach(() => {
    const elves = [new Elf(1, 5), new Elf(2, 10), new Elf(3, 20)];
    system = new TaskAssignmentSystem(elves);
  });

  test('reportTaskCompletion increases total tasks completed', () => {
    expect(system.reportTaskCompletion(1)).toBeTruthy();
    expect(system.getTotalTasksCompleted()).toBe(1);
  });

  test('getElfWithHighestSkill returns the correct elf', () => {
    const highestSkillElf = system.getElfWithHighestSkill();
    expect(highestSkillElf?.id).toBe(3);
  });

  test('assignTask assigns an elf based on skill level', () => {
    expect(system.assignTask(8)).toStrictEqual(new Elf(2, 10));
  });

  test('increaseSkillLevel updates elf skill correctly', () => {
    system.increaseSkillLevel(1, 3);
    const elf = system.assignTask(7);
    expect(elf?.id).toBe(1);
  });

  test('decreaseSkillLevel updates elf skill correctly', () => {
    system.decreaseSkillLevel(1, 3);
    system.decreaseSkillLevel(2, 5);

    const elf = system.assignTask(4);
    expect(elf?.id).toBe(2);
    expect(elf?.skillLevel).toBe(5);
  });

  test('assignTask fails when skills required is too high', () => {
    expect(system.assignTask(50)).toBeNull();
  });

  test('listElvesBySkillDescending returns elves in correct order', () => {
    const sortedElves = system.listElvesBySkillDescending();
    expect(sortedElves.map((elf) => elf.id)).toEqual([3, 2, 1]);
  });

  test('resetAllSkillsToBaseline resets all elves skills to a specified baseline', () => {
    system.resetAllSkillsToBaseline(10);
    const elves = system.listElvesBySkillDescending();
    for (const elf of elves) {
      expect(elf.skillLevel).toBe(10);
    }
  });

  test('decreaseSkillLevel updates elf skill and do not allow negative values', () => {
    system.decreaseSkillLevel(1, 10);
    const elf = system.assignTask(4);
    expect(elf?.id).toBe(1);
    expect(elf?.skillLevel).toBe(5);
  });

  test('should assign task to people who have the expected level', () => {
    const bob = new Elf(2, 5);
    const underTest = new TaskAssignmentSystem([bob]);
    const assigneElf = underTest.assignTask(5);
    expect(assigneElf).toBe(bob);
  });

  describe('Task Assignment Distribution Bug', () => {
    let system: TaskAssignmentSystem;
    let alice: Elf;
    let bob: Elf;
    let charlie: Elf;

    beforeEach(() => {
      // Setup the scenario from Bob's complaint
      alice = new Elf(1, 7); // Alice with skill level 7
      bob = new Elf(2, 5); // Bob with skill level 5
      charlie = new Elf(3, 3); // Charlie with skill level 3
      system = new TaskAssignmentSystem([alice, bob, charlie]);
    });

    test('findQualifiedElves returns all elves that meet skill requirement', () => {
      // Task requiring skill level 4 should return both Alice and Bob
      const qualifiedElves = system.findQualifiedElves(4);

      expect(qualifiedElves).toHaveLength(2);
      expect(qualifiedElves).toContainEqual(alice);
      expect(qualifiedElves).toContainEqual(bob);
      expect(qualifiedElves).not.toContainEqual(charlie);
    });

    test('assignTask distributes work among qualified elves', () => {
      // Assign multiple tasks requiring skill level 4
      const firstAssignment = system.assignTask(4);
      const secondAssignment = system.assignTask(4);

      // First and second assignments should go to different elves
      expect(firstAssignment).not.toBeNull();
      expect(secondAssignment).not.toBeNull();
      expect(firstAssignment?.id).not.toBe(secondAssignment?.id);

      // Both assignments should be to elves with sufficient skill
      expect(firstAssignment?.skillLevel).toBeGreaterThanOrEqual(4);
      expect(secondAssignment?.skillLevel).toBeGreaterThanOrEqual(4);
    });

    test('assignTask considers current workload when assigning tasks', () => {
      // Assign three tasks requiring skill level 4
      const assignments = [
        system.assignTask(4),
        system.assignTask(4),
        system.assignTask(4),
      ];

      // Count assignments per elf
      const assignmentCounts = new Map<number, number>();
      for (const elf of assignments) {
        if (elf) {
          assignmentCounts.set(elf.id, (assignmentCounts.get(elf.id) || 0) + 1);
        }
      }

      // No elf should have all assignments if multiple elves are qualified
      for (const count of Array.from(assignmentCounts.values())) {
        expect(count).toBeLessThan(3);
      }
    });
  });

  describe('Skill Level Transfer Bug', () => {
    let system: TaskAssignmentSystem;
    let seniorElf: Elf;
    let juniorElf: Elf;

    beforeEach(() => {
      seniorElf = new Elf(1, 10); // Senior elf with high skill
      juniorElf = new Elf(2, 5); // Junior elf with lower skill
      system = new TaskAssignmentSystem([seniorElf, juniorElf]);
    });

    test('reassignTask should not modify skill levels', () => {
      const originalJuniorSkill = juniorElf.skillLevel;

      // Attempt to reassign a task requiring skill level 7
      system.reassignTask(seniorElf.id, juniorElf.id, 7);

      // Junior elf's skill level should remain unchanged
      expect(juniorElf.skillLevel).toBe(originalJuniorSkill);
    });

    test('reassignTask should fail if receiving elf lacks required skill', () => {
      // Attempt to reassign a task requiring skill level 8
      const result = system.reassignTask(seniorElf.id, juniorElf.id, 8);

      // Reassignment should fail
      expect(result).toBe(false);

      // Junior elf's skill should remain unchanged
      expect(juniorElf.skillLevel).toBe(5);
    });

    test('reassignTask should succeed if receiving elf has required skill', () => {
      // Attempt to reassign a task requiring skill level 5
      const result = system.reassignTask(seniorElf.id, juniorElf.id, 5);

      // Reassignment should succeed
      expect(result).toBe(true);

      // Skill levels should remain unchanged
      expect(seniorElf.skillLevel).toBe(10);
      expect(juniorElf.skillLevel).toBe(5);
    });

    test('skill levels should only change through proper methods', () => {
      const originalSeniorSkill = seniorElf.skillLevel;
      const originalJuniorSkill = juniorElf.skillLevel;

      // Attempt task reassignment
      system.reassignTask(seniorElf.id, juniorElf.id, 5);

      // Use proper method to increase skill
      system.increaseSkillLevel(juniorElf.id, 2);

      // Senior elf's skill should be unchanged
      expect(seniorElf.skillLevel).toBe(originalSeniorSkill);

      // Junior elf's skill should only reflect the proper increase
      expect(juniorElf.skillLevel).toBe(originalJuniorSkill + 2);
    });
  });

  describe('Edge Cases', () => {
    test('reassignTask handles non-existent elves', () => {
      const system = new TaskAssignmentSystem([new Elf(1, 5)]);

      // Attempt to reassign task between non-existent elves
      const result = system.reassignTask(999, 888, 5);

      expect(result).toBe(false);
    });

    test('findQualifiedElves handles empty elf list', () => {
      const system = new TaskAssignmentSystem([]);

      const qualifiedElves = system.findQualifiedElves(5);

      expect(qualifiedElves).toHaveLength(0);
    });

    test('assignTask handles no qualified elves', () => {
      const system = new TaskAssignmentSystem([new Elf(1, 3)]);

      const assignment = system.assignTask(5);

      expect(assignment).toBeNull();
    });
  });
});
