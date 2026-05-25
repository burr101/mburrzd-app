export interface ProductImage {
  url: string;
  altText: string | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{ node: ProductImage }>;
  };
  variants: {
    edges: Array<{ node: ProductVariant }>;
  };
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ProductImage | null;
}

export interface CartLineItem {
  id: string;
  quantity: number;
  variantId: string;
  variantTitle: string;
  productTitle: string;
  price: string;
  currencyCode: string;
  imageUrl: string;
}
