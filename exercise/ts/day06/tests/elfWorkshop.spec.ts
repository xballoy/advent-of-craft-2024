import {ElfWorkshop} from "../src/elfWorkshop";

describe('ElfWorkshop Tasks', () => {
    // Comment: extract a function to add tasks/initialize the class under test

    // Comment: bad naming, we are testing add task
    test('removeTask should add a task', () => {
        const workshop = new ElfWorkshop();
        // Add fuzzying, the name is not important
        workshop.addTask("Build toy train");
        expect(workshop.taskList).toContain("Build toy train");
    });

    // Comment: same test as before.
    test('test2 checks for task addition', () => {
        const workshop = new ElfWorkshop();
        workshop.addTask("Craft dollhouse");
        // Comment: use framework assertions instead of toBeTruthy to have better error message/explaining the test.
        expect(workshop.taskList.includes("Craft dollhouse")).toBeTruthy();
    });

    // Comment: same test as before.
    test('test2 checks for task addition', () => {
        const workshop = new ElfWorkshop();
        workshop.addTask("Paint bicycle");
        expect(workshop.taskList.includes("Paint bicycle")).toBeTruthy();
    });

    test('Should handle empty tasks correctly', () => {
        const workshop = new ElfWorkshop();
        workshop.addTask("");
        // Comment: use toHaveLength
        expect(workshop.taskList.length).toBe(0);
    });

    test('Task removal functionality', () => {
        const workshop = new ElfWorkshop();
        workshop.addTask("Wrap gifts");
        const removedTask = workshop.completeTask();
        expect(removedTask).toBe("Wrap gifts");
        // Comment: use toHaveLength
        expect(workshop.taskList.length).toBe(0);
    });

    // Comment: does not test when there is no task to remove
});
