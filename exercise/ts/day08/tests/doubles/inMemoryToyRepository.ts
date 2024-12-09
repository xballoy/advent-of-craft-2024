import {Toy} from "../../src/domain/toy";
import {ToyRepository} from "../../src/domain/toyRepository";
import { Option } from 'effect';

export class InMemoryToyRepository implements ToyRepository {
    private toys: Toy[] = [];

    findByName(name: string): Option.Option<Toy> {
        return Option.fromNullable(this.toys.find(t => t.getName() === name));
    }

    save(toy: Toy): void {
        this.toys = this.toys.filter(t => t.getName() !== toy.getName());
        this.toys.push(toy);
    }
}
