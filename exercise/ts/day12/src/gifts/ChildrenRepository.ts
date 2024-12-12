import { Option } from 'effect';
import type { Child } from './Child';

export type ChildrenRepository = {
  addChild: (child: Child) => void;
  findByName: (name: string) => Option.Option<Child>;
};

export class InMemoryChildrenRepository implements ChildrenRepository {
  private readonly children: Child[] = [];

  public addChild(child: Child) {
    this.children.push(child);
  }

  public findByName(name: string): Option.Option<Child> {
    return Option.fromNullable(this.children.find((c) => c.name === name));
  }
}
