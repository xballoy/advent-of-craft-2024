import { faker } from '@faker-js/faker';
import { GiftRequest } from '../src/giftRequest';

export class GiftRequestBuilder {
    private readonly giftName: string;
    private readonly priority: Priority;
    private isFeasible: boolean;

    constructor() {
        this.giftName = faker.commerce.productName();
        this.priority = 'dream';
        this.isFeasible = true;
    }

    withFeasibleGiftRequest(): this {
        this.isFeasible = true;
        return this;
    }

    withInfeasibleGiftRequest(): this {
        this.isFeasible = false;
        return this;
    }

    public build(): GiftRequest {
        return new GiftRequest(
            this.giftName,
            this.isFeasible,
            this.priority,
        )
    }

}
