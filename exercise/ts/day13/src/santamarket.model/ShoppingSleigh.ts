import { Match, Option } from 'effect';
import { Discount } from './Discount';
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
            this.handleXForYOffers({
              offer: new XForYOffer(3, 2),
              quantity,
              unitPrice,
              product,
            }),
          ),
          Match.when({ offerType: SpecialOfferType.TWO_FOR_ONE }, () =>
            this.handleXForYOffers({
              offer: new XForYOffer(2, 1),
              quantity,
              unitPrice,
              product,
            }),
          ),
          Match.when({ offerType: SpecialOfferType.TWO_FOR_AMOUNT }, (offer) =>
            this.handleXForAmountOffers({
              offer: new XForAmountOffer(2, offer.argument),
              quantity,
              unitPrice,
              product,
            }),
          ),
          Match.when({ offerType: SpecialOfferType.FIVE_FOR_AMOUNT }, (offer) =>
            this.handleXForAmountOffers({
              offer: new XForAmountOffer(5, offer.argument),
              quantity,
              unitPrice,
              product,
            }),
          ),
          Match.when(
            { offerType: SpecialOfferType.TEN_PERCENT_DISCOUNT },
            (offer) =>
              this.handlePercentageDiscountOffer({
                offer: new PercentageDiscountOffer(offer.argument),
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

  private handleXForYOffers({
    offer,
    quantity,
    unitPrice,
    product,
  }: {
    offer: XForYOffer;
    quantity: number;
    unitPrice: number;
    product: Product;
  }) {
    if (quantity < offer.x) {
      return Option.none();
    }

    const numberOfXs = Math.floor(quantity / offer.x);
    const discountAmount =
      quantity * unitPrice -
      (numberOfXs * offer.y * unitPrice + (quantity % offer.x) * unitPrice);
    return Option.some(
      new Discount(product, `${offer.x} for ${offer.y}`, -discountAmount),
    );
  }

  private handleXForAmountOffers({
    offer,
    quantity,
    unitPrice,
    product,
  }: {
    offer: XForAmountOffer;
    quantity: number;
    unitPrice: number;
    product: Product;
  }) {
    if (quantity < offer.x) {
      return Option.none();
    }

    const total =
      offer.amount * Math.floor(quantity / offer.x) +
      (quantity % offer.x) * unitPrice;
    const discountN = unitPrice * quantity - total;
    return Option.some(
      new Discount(product, `${offer.x} for ${offer.amount}`, -discountN),
    );
  }

  private handlePercentageDiscountOffer({
    offer,
    quantity,
    unitPrice,
    product,
  }: {
    offer: PercentageDiscountOffer;
    quantity: number;
    unitPrice: number;
    product: Product;
  }) {
    const discountAmount = -quantity * unitPrice * (offer.percentage / 100);
    return Option.some(
      new Discount(product, `${offer.percentage}% off`, discountAmount),
    );
  }
}
