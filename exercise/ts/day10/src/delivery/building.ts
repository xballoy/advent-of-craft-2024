import { Match } from 'effect';

type InstructionToFloorFn = (char: string) => number;
const InstructionWithElf: InstructionToFloorFn = (char: string) =>
  Match.value(char).pipe(
    Match.when(')', () => 3),
    Match.when('(', () => -2),
    Match.when('🧝', () => 0),
    // @ts-expect-error
    Match.exhaustive,
  );
const InstructionWithoutElf: InstructionToFloorFn = (char: string) =>
  Match.value(char).pipe(
    Match.when(')', () => -1),
    Match.when('(', () => 1),
    // @ts-expect-error
    Match.exhaustive,
  );

// biome-ignore lint/complexity/noStaticOnlyClass: keep exercise as-is
export class Building {
  static whichFloor(instructions: string): number {
    const rules: InstructionToFloorFn = Building.getRules(instructions);
    return Array.from(instructions).reduce((floor, instruction) => {
      return floor + rules(instruction);
    }, 0);
  }

  private static getRules(instructions: string) {
    return Building.includesElf(instructions)
      ? InstructionWithElf
      : InstructionWithoutElf;
  }

  private static includesElf(instructions: string) {
    return instructions.includes('🧝');
  }
}
