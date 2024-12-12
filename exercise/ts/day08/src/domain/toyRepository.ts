import type { Option } from 'effect';
import type { Toy } from './toy';

export interface ToyRepository {
  findByName(name: string): Option.Option<Toy>;
  save(toy: Toy): void;
}
