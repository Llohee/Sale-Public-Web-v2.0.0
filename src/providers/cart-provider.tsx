"use client";

import type { ProductDetail } from "@/services/product/product.schema";
import {
  type CartItem,
  type ProductSize,
  PRODUCT_SIZES,
  getCartItemLineTotal,
} from "@/types/cart";
import { useAddCartItemToasts } from "@/services/order/order.mutations";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CART_STORAGE_KEY = "coffee-cart";

interface CartContextType {
  /** false until cart is loaded from localStorage (first client mount). */
  isHydrated: boolean;
  items: CartItem[];
  addItem: (params: {
    product: ProductDetail;
    size: ProductSize;
    quantity: number;
    note?: string;
  }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  totalItems: number;
  totalAmount: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { onMutate, onSuccess, onError } = useAddCartItemToasts();

  useEffect(() => {
    queueMicrotask(() => {
      setItems(loadCart());
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) saveCart(items);
  }, [items, hydrated]);

  const addItem = useCallback(
    ({
      product,
      size,
      quantity,
      note,
    }: {
      product: ProductDetail;
      size: ProductSize;
      quantity: number;
      note?: string;
    }) => {
      onMutate();
      try {
        const unitPrice = product.price ?? 0;
        const normalizedNote = note?.trim();
        setItems((prev) => {
          const existing = prev.find(
            (i) => i.productId === product.id && i.size === size
          );
          if (existing) {
            return prev.map((i) =>
              i.id === existing.id
                ? {
                    ...i,
                    quantity: i.quantity + quantity,
                    note: normalizedNote
                      ? normalizedNote
                      : i.note,
                  }
                : i
            );
          }
          const newItem: CartItem = {
            id: `${product.id}-${size}-${Date.now()}`,
            productId: product.id,
            productName: product.name,
            imageUrl: product.imageUrl,
            unitPrice,
            size,
            quantity,
            note: normalizedNote || undefined,
          };
          return [...prev, newItem];
        });
        onSuccess();
      } catch {
        onError();
      }
    },
    [onMutate, onSuccess, onError]
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );
  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + getCartItemLineTotal(i), 0),
    [items]
  );

  const value = useMemo(
    () => ({
      isHydrated: hydrated,
      items,
      addItem,
      removeItem,
      updateQuantity,
      totalItems,
      totalAmount,
      clearCart,
    }),
    [
      hydrated,
      items,
      addItem,
      removeItem,
      updateQuantity,
      totalItems,
      totalAmount,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { PRODUCT_SIZES };
