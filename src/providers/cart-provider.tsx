"use client";

import type { ProductDetail } from "@/services/product/product.schema";
import type { ComboDetail } from "@/services/combo/combo.schema";
import {
  type CartItem,
  type ComboCartItem,
  type ProductSize,
  PRODUCT_SIZES,
  getCartItemLineTotal,
  getComboCartItemLineTotal,
} from "@/types/cart";
import {
  useAddCartItemToasts,
  useClearCartItemsToasts,
  useRemoveCartItemToasts,
} from "@/services/order/order.mutations";
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
  comboItems: ComboCartItem[];
  addItem: (params: {
    product: ProductDetail;
    size: ProductSize;
    quantity: number;
    note?: string;
  }) => void;
  removeItem: (id: string) => void;
  addComboItem: (params: {
    combo: ComboDetail;
    quantity: number;
    note?: string;
  }) => void;
  removeComboItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateComboQuantity: (id: string, quantity: number) => void;
  totalItems: number;
  totalAmount: number;
  clearCart: (options?: { silent?: boolean }) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return Array.isArray(parsed?.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

function loadComboCart(): ComboCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.comboItems) ? parsed.comboItems : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[], comboItems: ComboCartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, comboItems }));
  } catch {}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [comboItems, setComboItems] = useState<ComboCartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { onMutate, onSuccess, onError } = useAddCartItemToasts();
  const {
    onMutate: onRemoveMutate,
    onSuccess: onRemoveSuccess,
    onError: onRemoveError,
  } = useRemoveCartItemToasts();
  const {
    onMutate: onClearMutate,
    onSuccess: onClearSuccess,
    onError: onClearError,
  } = useClearCartItemsToasts();

  useEffect(() => {
    queueMicrotask(() => {
      setItems(loadCart());
      setComboItems(loadComboCart());
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) saveCart(items, comboItems);
  }, [items, comboItems, hydrated]);

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

  const removeItem = useCallback(
    (id: string) => {
      onRemoveMutate();
      try {
        setItems((prev) => prev.filter((i) => i.id !== id));
        onRemoveSuccess();
      } catch {
        onRemoveError();
      }
    },
    [onRemoveMutate, onRemoveSuccess, onRemoveError]
  );

  const addComboItem = useCallback(
    ({
      combo,
      quantity,
      note,
    }: {
      combo: ComboDetail;
      quantity: number;
      note?: string;
    }) => {
      onMutate();
      try {
        const basePrice = combo.products.reduce(
          (sum, item) => sum + (item.product.price ?? 0) * item.quantityRequired,
          0
        );
        const unitPrice = Math.max(0, basePrice - combo.discountAmount);
        const imageUrl = combo.products[0]?.product.imageUrl ?? "";
        const normalizedNote = note?.trim();
        setComboItems((prev) => {
          const existing = prev.find((i) => i.comboId === combo.id);
          if (existing) {
            return prev.map((i) =>
              i.id === existing.id
                ? {
                    ...i,
                    quantity: i.quantity + quantity,
                    note: normalizedNote ? normalizedNote : i.note,
                  }
                : i
            );
          }
          const newItem: ComboCartItem = {
            id: `combo-${combo.id}-${Date.now()}`,
            comboId: combo.id,
            comboName: combo.name,
            imageUrl,
            unitPrice,
            note: normalizedNote || undefined,
            quantity,
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

  const removeComboItem = useCallback(
    (id: string) => {
      onRemoveMutate();
      try {
        setComboItems((prev) => prev.filter((i) => i.id !== id));
        onRemoveSuccess();
      } catch {
        onRemoveError();
      }
    },
    [onRemoveMutate, onRemoveSuccess, onRemoveError]
  );

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const updateComboQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setComboItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(
    (options?: { silent?: boolean }) => {
      if (options?.silent) {
        setItems([]);
        setComboItems([]);
        return;
      }
      onClearMutate();
      try {
        setItems([]);
        setComboItems([]);
        onClearSuccess();
      } catch {
        onClearError();
      }
    },
    [onClearMutate, onClearSuccess, onClearError]
  );

  const totalItems = useMemo(
    () =>
      items.reduce((sum, i) => sum + i.quantity, 0) +
      comboItems.reduce((sum, i) => sum + i.quantity, 0),
    [items, comboItems]
  );
  const totalAmount = useMemo(
    () =>
      items.reduce((sum, i) => sum + getCartItemLineTotal(i), 0) +
      comboItems.reduce((sum, i) => sum + getComboCartItemLineTotal(i), 0),
    [items, comboItems]
  );

  const value = useMemo(
    () => ({
      isHydrated: hydrated,
      items,
      comboItems,
      addItem,
      addComboItem,
      removeItem,
      removeComboItem,
      updateQuantity,
      updateComboQuantity,
      totalItems,
      totalAmount,
      clearCart,
    }),
    [
      hydrated,
      items,
      comboItems,
      addItem,
      addComboItem,
      removeItem,
      removeComboItem,
      updateQuantity,
      updateComboQuantity,
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
