import { Match, Option } from 'effect';
import type { Behavior } from './Behavior';
import type { Child } from './Child';
import type { ChildrenRepository } from './ChildrenRepository';
import type { Toy } from './Toy';

export class Santa {
  constructor(private readonly childrenRepository: ChildrenRepository) {}

  addChild(child: Child): void {
    this.childrenRepository.addChild(child);
  }

  chooseToyForChild(childName: string): Toy | undefined {
    return this.childrenRepository.findByName(childName).pipe(
      (maybeChild) =>
        Option.map(maybeChild, (child) =>
          Match.value<Behavior>(child.behavior).pipe(
            Match.when('naughty', () => child.wishlist?.thirdChoice),
            Match.when('nice', () => child.wishlist?.secondChoice),
            Match.when('very nice', () => child.wishlist?.firstChoice),
            Match.exhaustive,
          ),
        ),
      (maybeToy) => Option.getOrUndefined(maybeToy),
    );
  }
}
