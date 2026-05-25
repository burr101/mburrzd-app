import { create } from 'zustand';
import { createCart, addToCart, updateCartLine, removeCartLine, parseCart } from '../api/shopify';
import { CartLineItem } from '../types';

interface CartState {
  cartId: string | null;
  checkoutUrl: string | null;
  items: CartLineItem[];
  totalQuantity: number;
  totalAmount: string;
  currencyCode: string;
  loading: boolean;
  initCart: () => Promise<void>;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartId: null,
  checkoutUrl: null,
  items: [],
  totalQuantity: 0,
  totalAmount: '0.00',
  currencyCode: 'USD',
  loading: false,

  initCart: async () => {
    if (get().cartId) return;
    set({ loading: true });
    try {
      const cart = await createCart();
      set({ ...parseCart(cart), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addItem: async (variantId, quantity = 1) => {
    if (!get().cartId) await get().initCart();
    const cartId = get().cartId!;
    set({ loading: true });
    try {
      const cart = await addToCart(cartId, variantId, quantity);
      set({ ...parseCart(cart), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  updateItem: async (lineId, quantity) => {
    const cartId = get().cartId;
    if (!cartId) return;
    set({ loading: true });
    try {
      const cart = await updateCartLine(cartId, lineId, quantity);
      set({ ...parseCart(cart), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  removeItem: async (lineId) => {
    const cartId = get().cartId;
    if (!cartId) return;
    set({ loading: true });
    try {
      const cart = await removeCartLine(cartId, lineId);
      set({ ...parseCart(cart), loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
