const STORE_DOMAIN = '553999-12.myshopify.com';
const STOREFRONT_TOKEN = 'e847b5bc549850de42cfc97f3c28d80d';
const API_URL = `https://${STORE_DOMAIN}/api/2024-01/graphql.json`;

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

const PRODUCT_FIELDS = `
  id title handle description
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 6) { edges { node { url altText } } }
  variants(first: 20) {
    edges {
      node {
        id title availableForSale
        price { amount currencyCode }
        selectedOptions { name value }
      }
    }
  }
`;

const CART_FIELDS = `
  id checkoutUrl totalQuantity
  cost { totalAmount { amount currencyCode } }
  lines(first: 50) {
    edges {
      node {
        id quantity
        merchandise {
          ... on ProductVariant {
            id title
            price { amount currencyCode }
            product {
              title
              images(first: 1) { edges { node { url } } }
            }
          }
        }
      }
    }
  }
`;

export async function getCollections() {
  const data = await shopifyFetch<any>(`{
    collections(first: 20) {
      edges {
        node {
          id title handle description
          image { url altText }
        }
      }
    }
  }`);
  return data.collections.edges.map((e: any) => e.node);
}

export async function getProducts(first = 20, collectionHandle?: string) {
  if (collectionHandle) {
    const data = await shopifyFetch<any>(
      `query($handle: String!) {
        collectionByHandle(handle: $handle) {
          products(first: 50) { edges { node { ${PRODUCT_FIELDS} } } }
        }
      }`,
      { handle: collectionHandle }
    );
    return data.collectionByHandle?.products.edges.map((e: any) => e.node) ?? [];
  }
  const data = await shopifyFetch<any>(`{
    products(first: ${first}) { edges { node { ${PRODUCT_FIELDS} } } }
  }`);
  return data.products.edges.map((e: any) => e.node);
}

export async function getProduct(handle: string) {
  const data = await shopifyFetch<any>(
    `query($handle: String!) {
      productByHandle(handle: $handle) { ${PRODUCT_FIELDS} }
    }`,
    { handle }
  );
  return data.productByHandle;
}

export async function createCart() {
  const data = await shopifyFetch<any>(`mutation { cartCreate { cart { ${CART_FIELDS} } } }`);
  return data.cartCreate.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity = 1) {
  const data = await shopifyFetch<any>(
    `mutation($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } }
    }`,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] }
  );
  return data.cartLinesAdd.cart;
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number) {
  const data = await shopifyFetch<any>(
    `mutation($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
  return data.cartLinesUpdate.cart;
}

export async function removeCartLine(cartId: string, lineId: string) {
  const data = await shopifyFetch<any>(
    `mutation($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } }
    }`,
    { cartId, lineIds: [lineId] }
  );
  return data.cartLinesRemove.cart;
}

export function parseCart(cart: any) {
  return {
    cartId: cart.id as string,
    checkoutUrl: cart.checkoutUrl as string,
    totalQuantity: cart.totalQuantity as number,
    totalAmount: cart.cost.totalAmount.amount as string,
    currencyCode: cart.cost.totalAmount.currencyCode as string,
    items: cart.lines.edges.map((e: any) => ({
      id: e.node.id,
      quantity: e.node.quantity,
      variantId: e.node.merchandise.id,
      variantTitle: e.node.merchandise.title,
      productTitle: e.node.merchandise.product.title,
      price: e.node.merchandise.price.amount,
      currencyCode: e.node.merchandise.price.currencyCode,
      imageUrl: e.node.merchandise.product.images.edges[0]?.node.url ?? '',
    })),
  };
}
