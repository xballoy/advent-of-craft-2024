import { Option } from 'effect';
import { Discount } from './Discount';
import type { Offer } from './Offer';
import type { Product } from './Product';
import type { Receipt } from './Receipt';
import type { SantamarketCatalog } from './SantamarketCatalog';
import { SpecialOfferType } from './SpecialOfferType';
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
    this.productQuantities.forEach((quantity, product) => {
      if (offers.has(product)) {
        const offer = offers.get(product)!;
        const unitPrice = catalog.getUnitPrice(product);
        const quantityAsInt = Math.floor(quantity);
        let discount: Discount | null = null;
        let x = 1;

        if (offer.offerType === SpecialOfferType.THREE_FOR_TWO) {
          discount = Option.getOrNull(
            this.handleXForYOffers({
              offer: new XForYOffer(3, 2),
              quantityAsInt,
              quantity,
              unitPrice,
              product,
            }),
          );
        }

        if (offer.offerType === SpecialOfferType.TWO_FOR_AMOUNT) {
          x = 2;
          if (quantityAsInt >= 2) {
            const total =
              offer.argument * Math.floor(quantityAsInt / x) +
              (quantityAsInt % 2) * unitPrice;
            const discountN = unitPrice * quantity - total;
            discount = new Discount(
              product,
              `2 for ${offer.argument}`,
              -discountN,
            );
          }
        }

        if (offer.offerType === SpecialOfferType.FIVE_FOR_AMOUNT) {
          x = 5;
          const numberOfXs = Math.floor(quantityAsInt / x);
          if (quantityAsInt >= 5) {
            const discountTotal =
              unitPrice * quantity -
              (offer.argument * numberOfXs + (quantityAsInt % 5) * unitPrice);
            discount = new Discount(
              product,
              `5 for ${offer.argument}`,
              -discountTotal,
            );
          }
        }

        if (offer.offerType === SpecialOfferType.TEN_PERCENT_DISCOUNT) {
          const discountAmount = -quantity * unitPrice * (offer.argument / 100);
          discount = new Discount(
            product,
            `${offer.argument}% off`,
            discountAmount,
          );
        }

        if (discount) {
          receipt.addDiscount(discount);
        }
      }
    });
  }

  private handleXForYOffers({
    offer,
    quantityAsInt,
    quantity,
    unitPrice,
    product,
  }: {
    offer: XForYOffer;
    quantityAsInt: number;
    quantity: number;
    unitPrice: number;
    product: Product;
  }) {
    const numberOfXs = Math.floor(quantityAsInt / offer.x);
    if (quantityAsInt >= offer.x) {
      const discountAmount =
        quantity * unitPrice -
        (numberOfXs * offer.y * unitPrice +
          (quantityAsInt % offer.x) * unitPrice);
      return Option.some(
        new Discount(product, `${offer.x} for ${offer.y}`, -discountAmount),
      );
    }

    return Option.none();
  }
}
