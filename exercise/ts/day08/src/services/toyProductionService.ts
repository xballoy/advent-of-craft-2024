import { Option } from 'effect';
import type { ToyRepository } from '../domain/toyRepository';

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
      onNone: () => {},
    });
  }
}
