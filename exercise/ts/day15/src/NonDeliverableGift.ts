export class NonDeliverableGift extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NonDeliverableGift';
    Object.setPrototypeOf(this, NonDeliverableGift.prototype);
  }
}
