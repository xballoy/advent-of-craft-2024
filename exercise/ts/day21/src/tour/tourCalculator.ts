import { Either } from 'effect';

type ITourCalculator = {
  deliveryTime: number;
  calculate: () => Either.Either<string, string>;
};

export type Step = {
  time: string;
  label: string;
  deliveryTime: number;
};

export class TourCalculator implements ITourCalculator {
  private steps: Step[];
  private calculated = false;
  private _deliveryTime = 0;

  constructor(steps: Step[]) {
    this.steps = steps;
  }

  get deliveryTime(): number {
    return this._deliveryTime;
  }

  calculate(): Either.Either<string, string> {
    if (!this.steps || this.steps.length === 0) {
      return Either.left('No locations !!!');
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      const result: string[] = [];

      for (const s of this.steps.sort((a, b) => (a.time > b.time ? 1 : -1))) {
        if (!this.calculated) {
          this._deliveryTime += s.deliveryTime;
          result.push(this.fLine(s, this._deliveryTime));
        }
      }

      const str = new Date(this._deliveryTime * 1000)
        .toISOString()
        .substring(11);
      result.push(`Delivery time | ${str}`);
      this.calculated = true;

      return Either.right(result.join('\n'));
    }
  }

  private fLine(step: Step, x: number): string {
    if (!step) throw new Error('Invalid operation');
    return `${step.time} : ${step.label} | ${step.deliveryTime} sec`;
  }
}

export class NewTourCalculator implements ITourCalculator {
  private readonly steps: Step[];
  private calculated = false;
  private _deliveryTime = 0;

  constructor(steps: Step[]) {
    this.steps = steps;
  }

  get deliveryTime(): number {
    return this._deliveryTime;
  }

  calculate(): Either.Either<string, string> {
    if (!this.steps.length) {
      return Either.left('No locations !!!');
    }

    const result: string[] = [];
    if (!this.calculated) {
      for (const step of this.getSortedSteps()) {
        this._deliveryTime += step.deliveryTime;
        result.push(this.formatStep(step));
      }
    }
    this.calculated = true;

    result.push(
      `Delivery time | ${this.formatDeliveryTime(this._deliveryTime)}`,
    );
    return Either.right(result.join('\n'));
  }

  private formatStep(step: Step): string {
    return `${step.time} : ${step.label} | ${step.deliveryTime} sec`;
  }

  private getSortedSteps(): Step[] {
    return [...this.steps].sort((a, b) => (a.time > b.time ? 1 : -1));
  }

  private formatDeliveryTime(deliveryTime: number): string {
    return new Date(deliveryTime * 1000).toISOString().substring(11);
  }
}
