import { Match, Option } from 'effect';
import type { Offer } from './Offer';
import { PercentageDiscountOffer } from './PercentageDiscountOffer';
import type { Product } from './Product';
import type { Receipt } from './Receipt';
import type { SantamarketCatalog } from './SantamarketCatalog';
import { SpecialOfferType } from './SpecialOfferType';
import { XForAmountOffer } from './XForAmountOffer';
import { XForYOffer } from './XForYOffer';

export class ShoppingSleigh {
  private items: { product: Product; quantity: number }[] = [];
  private productQuantities: Map<Product, number> = new Map();

  getItems(): { product: Product; quantity: number }[] {
    return [...this.items];
  }

  addItem(product: Product): void {
    this.addItemQuantity(product, 1.0);
  }

  addItemQuantity(product: Product, quantity: number): void {
    this.items.push({ product, quantity });
    const currentQuantity = this.productQuantities.get(product) || 0;
    this.productQuantities.set(product, currentQuantity + quantity);
  }

  handleOffers(
    receipt: Receipt,
    offers: Map<Product, Offer>,
    catalog: SantamarketCatalog,
  ): void {
    for (const [product, quantity] of this.productQuantities) {
      const offer = offers.get(product);
      if (!offer) {
        continue;
      }

      const unitPrice = catalog.getUnitPrice(product);

      Option.match(
        Match.value(offer).pipe(
          Match.when({ offerType: SpecialOfferType.THREE_FOR_TWO }, () =>
            new XForYOffer(3, 2).tryApplyOffer({
              quantity,
              unitPrice,
              product,
            }),
          ),
          Match.when({ offerType: SpecialOfferType.TWO_FOR_ONE }, () =>
            new XForYOffer(2, 1).tryApplyOffer({
              quantity,
              unitPrice,
              product,
            }),
          ),
          Match.when({ offerType: SpecialOfferType.TWO_FOR_AMOUNT }, (offer) =>
            new XForAmountOffer(2, offer.argument).tryApplyOffer({
              quantity,
              unitPrice,
              product,
            }),
          ),
          Match.when({ offerType: SpecialOfferType.FIVE_FOR_AMOUNT }, (offer) =>
            new XForAmountOffer(5, offer.argument).tryApplyOffer({
              quantity,
              unitPrice,
              product,
            }),
          ),
          Match.when(
            { offerType: SpecialOfferType.TEN_PERCENT_DISCOUNT },
            (offer) =>
              new PercentageDiscountOffer(offer.argument).tryApplyOffer({
                quantity,
                unitPrice,
                product,
              }),
          ),
          Match.exhaustive,
        ),
        {
          onSome: (discount) => receipt.addDiscount(discount),
          onNone: () => {},
        },
      );
    }
  }
}
