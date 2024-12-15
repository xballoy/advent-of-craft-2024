import { Option } from 'effect';
import type { Offer } from './Offer';
import type { Product } from './Product';
import type { Receipt } from './Receipt';
import type { SantamarketCatalog } from './SantamarketCatalog';

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
        offer.toOfferType().tryApplyOffer({
          quantity,
          unitPrice,
          product,
        }),
        {
          onSome: (discount) => receipt.addDiscount(discount),
          onNone: () => {},
        },
      );
    }
  }
}
