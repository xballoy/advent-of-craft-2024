import type { Option } from 'effect';
import type { Discount } from './Discount';
import type { Product } from './Product';

export type OfferType = {
  tryApplyOffer(args: {
    quantity: number;
    unitPrice: number;
    product: Product;
  }): Option.Option<Discount>;
};
