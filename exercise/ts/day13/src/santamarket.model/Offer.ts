import { Match } from 'effect';
import type { OfferType } from './OfferType';
import { PercentageDiscountOffer } from './PercentageDiscountOffer';
import type { Product } from './Product';
import { SpecialOfferType } from './SpecialOfferType';
import { XForAmountOffer } from './XForAmountOffer';
import { XForYOffer } from './XForYOffer';

export class Offer {
  constructor(
    public offerType: SpecialOfferType,
    public product: Product,
    public argument: number,
  ) {}

  toOfferType(): OfferType {
    return Match.value(this.offerType).pipe(
      Match.when(SpecialOfferType.THREE_FOR_TWO, () => new XForYOffer(3, 2)),
      Match.when(SpecialOfferType.TWO_FOR_ONE, () => new XForYOffer(2, 1)),
      Match.when(
        SpecialOfferType.TWO_FOR_AMOUNT,
        () => new XForAmountOffer(2, this.argument),
      ),
      Match.when(
        SpecialOfferType.FIVE_FOR_AMOUNT,
        () => new XForAmountOffer(5, this.argument),
      ),
      Match.when(
        SpecialOfferType.TEN_PERCENT_DISCOUNT,
        () => new PercentageDiscountOffer(this.argument),
      ),
      Match.exhaustive,
    );
  }
}
