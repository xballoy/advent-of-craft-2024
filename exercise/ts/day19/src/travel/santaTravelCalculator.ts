export class OverflowException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomOverflowException';
  }
}
// biome-ignore lint/complexity/noStaticOnlyClass: keep exercise as-is
export class SantaTravelCalculator {
  public static calculateTotalDistanceRecursively(
    numberOfReindeers: number,
  ): number {
    if (numberOfReindeers >= 32)
      throw new OverflowException(
        `Overflow for ${numberOfReindeers} reindeers`,
      );

    if (numberOfReindeers === 1) return 1;

    return (
      2 *
        SantaTravelCalculator.calculateTotalDistanceRecursively(
          numberOfReindeers - 1,
        ) +
      1
    );
  }

  public static calculateTotalDistanceNotRecursively(
    numberOfReindeers: number,
  ): number {
    return 2 ** numberOfReindeers - 1;
  }
}
