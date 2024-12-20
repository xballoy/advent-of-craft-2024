import { Either } from 'effect';
import { v4 as uuidv4 } from 'uuid';
import { Reindeer, ReindeerColor, ReindeerErrorCode } from './types';

export class ReindeerService {
  private reindeer: Reindeer[] = [
    new Reindeer(
      '40f9d24d-d3e0-4596-adc5-b4936ff84b19',
      'Petar',
      ReindeerColor.Black,
    ),
  ];

  public get(id: string): Either.Either<Reindeer, ReindeerErrorCode> {
    const reindeer = this.reindeer.find((r) => r.id === id);
    return reindeer
      ? Either.right(reindeer)
      : Either.left(ReindeerErrorCode.NotFound);
  }

  public create(
    reindeerToCreate: ReindeerToCreate,
  ): Either.Either<Reindeer, ReindeerErrorCode> {
    const existingReindeer = this.reindeer.find(
      (r) => r.name === reindeerToCreate.name,
    );
    if (existingReindeer) return Either.left(ReindeerErrorCode.AlreadyExist);

    const newReindeer = new Reindeer(
      uuidv4(),
      reindeerToCreate.name,
      reindeerToCreate.color,
    );
    this.reindeer.push(newReindeer);

    return Either.right(newReindeer);
  }
}

export class ReindeerToCreate {
  constructor(
    public name: string,
    public color: ReindeerColor,
  ) {}
}
