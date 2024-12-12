import { faker } from '@faker-js/faker';
import type { Behavior } from '../src/behavior';
import { Child } from '../src/child';
import type { GiftRequest } from '../src/giftRequest';
import { GiftRequestBuilder } from './giftRequest-builder';

export class ChildBuilder {
  private readonly firstName: string;
  private readonly lastName: string;
  private readonly age: number;
  private behavior: Behavior;
  private giftRequest: GiftRequest;

  public constructor() {
    this.firstName = faker.person.firstName();
    this.lastName = faker.person.lastName();
    this.age = faker.number.int({ max: 12 });
    this.behavior = 'nice';
    this.giftRequest = new GiftRequestBuilder()
      .withFeasibleGiftRequest()
      .build();
  }

  withNiceBehavior(): this {
    this.behavior = 'nice';
    return this;
  }

  withNaughtyBehavior(): this {
    this.behavior = 'naughty';
    return this;
  }

  withFeasibleGiftRequest(): this {
    this.giftRequest = new GiftRequestBuilder()
      .withFeasibleGiftRequest()
      .build();
    return this;
  }

  withInfeasibleGiftRequest(): this {
    this.giftRequest = new GiftRequestBuilder()
      .withInfeasibleGiftRequest()
      .build();
    return this;
  }

  public build() {
    return new Child(
      this.firstName,
      this.lastName,
      this.age,
      this.behavior,
      this.giftRequest,
    );
  }
}
