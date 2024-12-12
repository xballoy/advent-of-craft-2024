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

    if (!foundChild.wishlist) {
      return undefined;
    }

    if (foundChild.behavior === 'naughty') {
      return foundChild.wishlist.thirdChoice;
    }

    if (foundChild.behavior === 'nice') {
      return foundChild.wishlist.secondChoice;
    }

    if (foundChild.behavior === 'very nice') {
      return foundChild.wishlist.firstChoice;
    }

    return undefined;
  }
}
