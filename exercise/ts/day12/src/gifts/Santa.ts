import { Match } from 'effect';
import type { Behavior } from './Behavior';
import type { Child } from './Child';
import type { Toy } from './Toy';

export class Santa {
  private readonly childrenRepository: Child[] = [];

  addChild(child: Child): void {
    this.childrenRepository.push(child);
  }

  chooseToyForChild(childName: string): Toy | undefined {
    const foundChild = this.childrenRepository.find(
      (child) => child.name === childName,
    );

    if (!foundChild) {
      throw new Error('No such child found');
    }

    return Match.value<Behavior>(foundChild.behavior).pipe(
      Match.when('naughty', () => foundChild.wishlist?.thirdChoice),
      Match.when('nice', () => foundChild.wishlist?.secondChoice),
      Match.when('very nice', () => foundChild.wishlist?.firstChoice),
      Match.exhaustive,
    );
  }
}
