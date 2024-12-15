import { Offer } from './Offer';
import type { Product } from './Product';
import { Receipt } from './Receipt';
import type { SantamarketCatalog } from './SantamarketCatalog';
import type { ShoppingSleigh } from './ShoppingSleigh';
import type { SpecialOfferType } from './SpecialOfferType';

export class ChristmasElf {
  private readonly catalog: SantamarketCatalog;
  private readonly offers: Map<Product, Offer>;

  constructor(catalog: SantamarketCatalog) {
    this.catalog = catalog;
    this.offers = new Map<Product, Offer>();
  }

  addSpecialOffer(
    offerType: SpecialOfferType,
    product: Product,
    argument: number,
  ): void {
    this.offers.set(product, new Offer(offerType, product, argument));
  }

  checksOutArticlesFrom(sleigh: ShoppingSleigh): Receipt {
    const receipt = new Receipt();
    const productQuantities = sleigh.getItems();

    productQuantities.forEach(({ product, quantity }) => {
      const unitPrice = this.catalog.getUnitPrice(product);
      const totalPrice = quantity * unitPrice;
      receipt.addProduct(product, quantity, unitPrice, totalPrice);
    });

    sleigh.handleOffers(receipt, this.offers, this.catalog);

    return receipt;
  }
}
