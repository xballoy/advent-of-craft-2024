import { Match } from 'effect';

type InstructionToFloorFn = (char: string) => number;
const InstructionWithElf: InstructionToFloorFn = (char: string) =>
    Match.value(char).pipe(
        Match.when(')', () => 3),
        Match.when('(', () => -2),
        Match.when('🧝', () => 0),
        Match.exhaustive,
    );
const InstructionWithoutElf: InstructionToFloorFn = (char: string) =>
    Match.value(char).pipe(
        Match.when(')', () => -1),
        Match.when('(', () => 1),
        Match.exhaustive,
    );

export class Building {
    static whichFloor(instructions: string): number {
        const rules: InstructionToFloorFn = this.getRules(instructions);
        return Array.from(instructions).reduce((floor, instruction) => {
            return floor + rules(instruction);
        }, 0);
    }

    private static getRules(instructions: string) {
        return this.includesElf(instructions) ? InstructionWithElf : InstructionWithoutElf;
    }

    private static includesElf(instructions: string) {
        return instructions.includes('🧝');
    }
}
