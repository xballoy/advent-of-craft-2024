export class Building {
    static whichFloor(instructions: string): number {
        const instructionIncludesElf = this.includesElf(instructions);

        return instructions.split('').reduce((acc, instruction) => {
            if (instructionIncludesElf) {
                if (instruction === ')') {
                    acc += 3;
                } else if (instruction === '(') {
                    acc += -2;
                } else {
                    acc += 0;
                }
            } else {
                if(instruction === '(') {
                    acc += 1;
                } else {
                    acc += -1
                }
            }
            return acc;
        }, 0)
    }

    private static includesElf(instructions: string) {
        return instructions.includes('🧝');
    }
}
