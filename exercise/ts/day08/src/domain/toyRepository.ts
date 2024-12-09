import {Toy} from "./toy";
import { Option } from "effect"

export interface ToyRepository {
    findByName(name: string): Option.Option<Toy>;
    save(toy: Toy): void;
}
