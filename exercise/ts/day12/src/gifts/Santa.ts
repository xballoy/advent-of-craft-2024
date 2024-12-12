import { Match, Option } from 'effect';
import type { Behavior } from './Behavior';
import type { Child } from './Child';
import type { Toy } from './Toy';

export class Santa {
  private readonly childrenRepository: Child[] = [];

  addChild(child: Child): void {
    this.childrenRepository.push(child);
  }

  chooseToyForChild(childName: string): Toy | undefined {
    const maybeChild = Option.fromNullable(
      this.childrenRepository.find((child) => child.name === childName),
    );
    const child = Option.getOrThrowWith(
      maybeChild,
      () => new Error('No such child found'),
    );

    return Match.value<Behavior>(child.behavior).pipe(
      Match.when('naughty', () => child.wishlist?.thirdChoice),
      Match.when('nice', () => child.wishlist?.secondChoice),
      Match.when('very nice', () => child.wishlist?.firstChoice),
      Match.exhaustive,
    );
  }
}
