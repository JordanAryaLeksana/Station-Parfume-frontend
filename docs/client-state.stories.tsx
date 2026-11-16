import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { create } from "zustand";

import { Button } from "@/components/ui/button";

// The live example of the Client State guide (client-state.mdx). In a
// feature, the store is src/features/<feature>/store.ts.
type CartUIStore = {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const useCartStore = create<CartUIStore>()((set) => ({
  isOpen: false,

  openCart: () => set({ isOpen: true }),

  closeCart: () => set({ isOpen: false }),

  toggleCart: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),
}));

// Two components that share the store without passing props to each other.
function CartButtons() {
  const openCart = useCartStore((state) => state.openCart);
  const toggleCart = useCartStore((state) => state.toggleCart);

  return (
    <div className="flex gap-3">
      <Button onClick={openCart}>Open Cart</Button>

      <Button variant="outline" onClick={toggleCart}>
        Toggle Cart
      </Button>
    </div>
  );
}

function CartPanel() {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);

  return (
    <section className="space-y-4 rounded-lg border p-5">
      <p className="text-sm text-muted-foreground">
        Cart status: {isOpen ? "Open" : "Closed"}
      </p>

      {isOpen && (
        <Button variant="outline" onClick={closeCart}>
          Close Cart
        </Button>
      )}
    </section>
  );
}

function CartExample() {
  return (
    <div className="w-80 space-y-4">
      <CartButtons />
      <CartPanel />
    </div>
  );
}

const meta = {
  title: "Guides/Client State",
  component: CartExample,
  // client-state.mdx is the Docs page of these stories.
  tags: ["!autodocs"],
} satisfies Meta<typeof CartExample>;

export default meta;

export const Example: StoryObj<typeof meta> = {};
