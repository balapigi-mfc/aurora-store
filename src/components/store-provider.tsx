"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import type { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { CheckIcon, CloseIcon } from "@/components/icons";

const CART_KEY = "aurora.cart.v1";
const WISH_KEY = "aurora.wishlist.v1";

interface Toast {
  id: number;
  title: string;
  description?: string;
  href?: string;
}

interface StoreContextValue {
  cart: CartItem[];
  wishlist: CartItem[];
  hydrated: boolean;
  count: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (slug: string, color?: string) => void;
  setQty: (slug: string, color: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (item: CartItem) => void;
  isWishlisted: (slug: string) => boolean;
  notify: (toast: Omit<Toast, "id">) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function readStorage(key: string): CartItem[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    setCart(readStorage(CART_KEY));
    setWishlist(readStorage(WISH_KEY));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const notify = useCallback((toast: Omit<Toast, "id">) => {
    counter.current += 1;
    const id = counter.current;
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const addItem = useCallback(
    (item: CartItem) => {
      setCart((current) => {
        const existing = current.find(
          (entry) => entry.slug === item.slug && entry.color === item.color,
        );
        if (existing) {
          return current.map((entry) =>
            entry.slug === item.slug && entry.color === item.color
              ? { ...entry, qty: Math.min(entry.qty + item.qty, 10) }
              : entry,
          );
        }
        return [...current, item];
      });
      notify({
        title: "Added to your bag",
        description: `${item.name} — ${formatPrice(item.price)}`,
        href: "/cart",
      });
    },
    [notify],
  );

  const removeItem = useCallback((slug: string, color?: string) => {
    setCart((current) =>
      current.filter(
        (entry) =>
          !(entry.slug === slug && (color ? entry.color === color : true)),
      ),
    );
  }, []);

  const setQty = useCallback((slug: string, color: string, qty: number) => {
    setCart((current) =>
      current
        .map((entry) =>
          entry.slug === slug && entry.color === color
            ? { ...entry, qty: Math.max(0, Math.min(qty, 10)) }
            : entry,
        )
        .filter((entry) => entry.qty > 0),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (item: CartItem) => {
      setWishlist((current) => {
        const exists = current.some((entry) => entry.slug === item.slug);
        if (exists) {
          notify({ title: "Removed from saved items", description: item.name });
          return current.filter((entry) => entry.slug !== item.slug);
        }
        notify({ title: "Saved for later", description: item.name });
        return [...current, item];
      });
    },
    [notify],
  );

  const isWishlisted = useCallback(
    (slug: string) => wishlist.some((entry) => entry.slug === slug),
    [wishlist],
  );

  const value = useMemo<StoreContextValue>(() => {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    return {
      cart,
      wishlist,
      hydrated,
      count,
      subtotal,
      addItem,
      removeItem,
      setQty,
      clearCart,
      toggleWishlist,
      isWishlisted,
      notify,
    };
  }, [
    cart,
    wishlist,
    hydrated,
    addItem,
    removeItem,
    setQty,
    clearCart,
    toggleWishlist,
    isWishlisted,
    notify,
  ]);

  return (
    <StoreContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:right-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto animate-rise rounded-xl border border-ink/10 bg-ink px-4 py-3 text-paper shadow-soft"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-paper/15">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{toast.title}</p>
                {toast.description ? (
                  <p className="truncate text-xs text-paper/60">
                    {toast.description}
                  </p>
                ) : null}
                {toast.href ? (
                  <Link
                    href={toast.href}
                    className="mt-1 inline-block text-xs underline underline-offset-4 hover:text-clay"
                  >
                    View bag
                  </Link>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() =>
                  setToasts((current) =>
                    current.filter((item) => item.id !== toast.id),
                  )
                }
                className="text-paper/40 transition hover:text-paper"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return context;
}
