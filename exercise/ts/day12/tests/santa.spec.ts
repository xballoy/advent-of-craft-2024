import { Child } from '../src/gifts/Child';
import { InMemoryChildrenRepository } from '../src/gifts/ChildrenRepository';
import { Santa } from '../src/gifts/Santa';
import { Toy } from '../src/gifts/Toy';

describe("Santa's gift selection process", () => {
  const Playstation = new Toy('playstation');
  const Ball = new Toy('ball');
  const Plush = new Toy('plush');

  it('should give the third choice to a naughty child', () => {
    const bobby = new Child('bobby', 'naughty');
    bobby.setWishlist(Playstation, Plush, Ball);

    const santa = new Santa(new InMemoryChildrenRepository());
    santa.addChild(bobby);

    expect(santa.chooseToyForChild('bobby')).toBe(Ball);
  });

  it('should give the second choice to a nice child', () => {
    const bobby = new Child('bobby', 'nice');
    bobby.setWishlist(Playstation, Plush, Ball);

    const santa = new Santa(new InMemoryChildrenRepository());
    santa.addChild(bobby);

    expect(santa.chooseToyForChild('bobby')).toBe(Plush);
  });

  it('should give the first choice to a very nice child', () => {
    const bobby = new Child('bobby', 'very nice');
    bobby.setWishlist(Playstation, Plush, Ball);

    const santa = new Santa(new InMemoryChildrenRepository());
    santa.addChild(bobby);

    expect(santa.chooseToyForChild('bobby')).toBe(Playstation);
  });
});
