import "./App.css";
import { useMemo, useState } from "react";
import {
  ILS,
  categories,
  mostOrdered,
  products,
  storeMeta,
} from "./utils/data";

function DesktopHeader({ total, count, onOpen }: { total: number; count: number; onOpen: () => void }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="title">{storeMeta.title}</h1>
        </div>
        <div className="header-right">
          <button className="desktop-cart-btn" onClick={onOpen}>
            🛒 סל קניות ({count}) - {ILS} {total.toFixed(2)}
          </button>
        </div>
      </div>
    </header>
  );
}

function StoreHero() {
  return (
    <section className="hero">
      <h1 className="title">{storeMeta.title}</h1>
    </section>
  );
}

function Tabs() {
  return (
    <nav className="tabs">
      {categories.map((c) => (
        <button key={c.id} className="tab">
          {c.name}
        </button>
      ))}
    </nav>
  );
}

function ProductCard({
  name,
  price,
  imageUrl,
  weightGrams,
  per100gPrice,
  id,
  onAdd,
}: (typeof products)[number] & { onAdd: (productId: string) => void }) {
  return (
    <div className="card product">
      <button className="add" onClick={() => onAdd(id)}>
        +
      </button>
      <img
        src={imageUrl}
        alt={name}
        className="thumb"
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          target.src = "https://picsum.photos/seed/fallback/800/600";
        }}
      />
      <div className="price">
        {ILS} {price.toFixed(2)}
      </div>
      <div className="name">{name}</div>
      <div className="sub">
        {weightGrams ? `${weightGrams} ג'` : ""}
        {per100gPrice ? ` · ${ILS} ${per100gPrice}/100ג'` : ""}
      </div>
    </div>
  );
}

function ProductGrid({ onAdd }: { onAdd: (productId: string) => void }) {
  return (
    <section className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} {...p} onAdd={onAdd} />
      ))}
    </section>
  );
}

function MostOrdered({ onAdd }: { onAdd: (productId: string) => void }) {
  return (
    <section className="most-ordered">
      <h2>המוזמנים ביותר</h2>
      <div className="grid">
        {mostOrdered.map((p) => (
          <ProductCard key={p.id} {...p} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}

function FloatingCartBar({
  total,
  count,
  onOpen,
}: {
  total: number;
  count: number;
  onOpen: () => void;
}) {
  if (count === 0) return null;
  return (
    <div className="cart-bar">
      <div className="total">
        {ILS} {total.toFixed(2)}
      </div>
      <button className="details" onClick={onOpen}>
        הצגת פריטים ({count})
      </button>
    </div>
  );
}

type CartMap = Record<string, number>;

function BasketDrawer({
  open,
  onClose,
  cart,
  setCart,
}: {
  open: boolean;
  onClose: () => void;
  cart: CartMap;
  setCart: (next: CartMap) => void;
}) {
  const items = useMemo(() => products.filter((p) => cart[p.id]), [cart]);
  const total = useMemo(
    () => items.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0),
    [items, cart]
  );

  const changeQty = (id: string, delta: number) => {
    setCart({
      ...cart,
      [id]: Math.max(0, (cart[id] || 0) + delta),
    });
  };

  return (
    <div className={`drawer ${open ? "open" : ""}`} onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <strong>סל קניות</strong>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        {items.length === 0 ? (
          <div className="empty">הסל ריק</div>
        ) : (
          <div className="items">
            {items.map((p) => (
              <div key={p.id} className="row">
                <img src={p.imageUrl} className="mini" alt="" />
                <div className="grow">
                  <div className="r-name">{p.name}</div>
                  <div className="r-price">
                    {ILS} {p.price.toFixed(2)}
                  </div>
                </div>
                <div className="qty">
                  <button onClick={() => changeQty(p.id, -1)}>-</button>
                  <span>{cart[p.id]}</span>
                  <button onClick={() => changeQty(p.id, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="panel-footer">
          <div className="sum">
            סה"כ: {ILS} {total.toFixed(2)}
          </div>
          <button className="checkout">לתשלום</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState<CartMap>({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addToCart = (productId: string) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const itemCount = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart]
  );
  const total = useMemo(
    () => products.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0),
    [cart]
  );

  return (
    <div className="app">
      {/* Desktop header - only shows on desktop */}
      <div className="desktop-only">
        <DesktopHeader
          total={total}
          count={itemCount}
          onOpen={() => setDrawerOpen(true)}
        />
      </div>
      
      {/* Mobile hero - only shows on mobile */}
      <div className="mobile-only">
        <StoreHero />
      </div>
      
      <MostOrdered onAdd={addToCart} />
      <Tabs />
      <ProductGrid onAdd={addToCart} />
      
      {/* Mobile cart bar - only shows on mobile */}
      <div className="mobile-only">
        <FloatingCartBar
          total={total}
          count={itemCount}
          onOpen={() => setDrawerOpen(true)}
        />
      </div>
      
      <BasketDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cart={cart}
        setCart={setCart}
      />
    </div>
  );
}
