import {ToyRepository} from "../domain/toyRepository";
import {Toy} from "../domain/toy";
import { Option } from "effect"

export class ToyProductionService {
    private repository: ToyRepository;

    constructor(repository: ToyRepository) {
        this.repository = repository;
    }

    assignToyToElf(toyName: string): void {
        Option.match(this.repository.findByName(toyName), {
            onSome: (toy) => {
                toy.assignToElf();
                this.repository.save(toy);
            },
            onNone: () => {}
        })

    }
}
