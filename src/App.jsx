import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

const PRODUCTS = [
  {
    id: 1,
    name: "Velvet Rouge Lip Color",
    category: "Lips",
    price: 48,
    badge: "Best Seller",
    description: "Weightless matte color with rosehip-infused hydration.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Luminous Silk Foundation",
    category: "Face",
    price: 72,
    badge: "New",
    description: "Second-skin coverage with a radiant, studio-soft finish.",
    image:
      "https://images.unsplash.com/photo-1526758097130-bab247274f58?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Noir Length Mascara",
    category: "Eyes",
    price: 38,
    badge: "Best Seller",
    description: "Long-wear volume with a lash-defining precision brush.",
    image:
      "https://images.unsplash.com/photo-1631730486572-2260f8f4f84d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Aura Renewal Serum",
    category: "Skin",
    price: 96,
    badge: "Editor Pick",
    description: "Brightening peptide complex for a rested luminous glow.",
    image:
      "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Sculpted Glow Palette",
    category: "Face",
    price: 58,
    badge: "Limited",
    description: "Contour, bronze, and highlight in one refined compact.",
    image:
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Rose Quartz Cleansing Oil",
    category: "Skin",
    price: 44,
    badge: "New",
    description: "Melts makeup instantly while nourishing the skin barrier.",
    image:
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=900&q=80",
  },
];

const LOADING_CARDS = 6;

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => {
      setIsLoading(false);
    }, 900);

    return () => window.clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const toastTimer = window.setTimeout(() => {
      setToastMessage("");
    }, 1800);

    return () => window.clearTimeout(toastTimer);
  }, [toastMessage]);

  const categories = useMemo(
    () => ["All", ...new Set(PRODUCTS.map((product) => product.category))],
    [],
  );

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") {
      return PRODUCTS;
    }

    return PRODUCTS.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  const cartCount = useMemo(
    () =>
      cartItems.reduce((count, item) => {
        return count + item.quantity;
      }, 0),
    [cartItems],
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0),
    [cartItems],
  );

  const shipping = subtotal > 0 && subtotal < 180 ? 12 : 0;
  const total = subtotal + shipping;

  const addToCart = useCallback((product) => {
    setOrderPlaced(false);

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });

    setToastMessage(`${product.name} added to bag`);
  }, []);

  const increaseQuantity = useCallback((productId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }, []);

  const decreaseQuantity = useCallback((productId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  }, []);

  const openCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      return;
    }

    setOrderPlaced(false);
    setIsCheckoutOpen(true);
  }, [cartItems.length]);

  const completeCheckout = useCallback(
    (event) => {
      event.preventDefault();

      if (cartItems.length === 0) {
        return;
      }

      setCartItems([]);
      setOrderPlaced(true);
      setIsCheckoutOpen(false);
      setToastMessage("Order placed. A concierge will confirm shortly.");
    },
    [cartItems.length],
  );

  return (
    <div className="store">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#home">
            AUREA
          </a>

          <nav className="menu" aria-label="Primary">
            <a href="#collection">Collection</a>
            <a href="#cart">Bag</a>
            <a href="#ritual">Ritual</a>
          </nav>

          <button className="bag-pill" type="button" onClick={openCheckout}>
            Bag <span>{cartCount}</span>
          </button>
        </div>
      </header>

      <main id="home">
        <section className="hero section-shell">
          <div className="hero-copy">
            <p className="eyebrow">Paris Atelier Edition</p>
            <h1>Luxury beauty crafted for modern rituals.</h1>
            <p>
              Curated complexion, lip, and skincare formulas inspired by couture
              studios and made for everyday elegance.
            </p>
            <a className="hero-link" href="#collection">
              Explore Collection
            </a>
          </div>

          <div className="hero-stats" aria-label="Store highlights">
            <div>
              <p>48h</p>
              <span>White-glove dispatch</span>
            </div>
            <div>
              <p>4.9/5</p>
              <span>Client satisfaction score</span>
            </div>
            <div>
              <p>180+</p>
              <span>Complimentary shipping threshold</span>
            </div>
          </div>
        </section>

        <section className="section-shell catalog-layout" id="collection">
          <div className="catalog-panel">
            <div className="catalog-header">
              <h2>Signature Collection</h2>
              <p>Precision formulas and timeless shades selected by our artists.</p>
            </div>

            <div className="filter-row" role="tablist" aria-label="Category filter">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`filter-chip ${
                    activeCategory === category ? "filter-chip-active" : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {isLoading
                ? Array.from({ length: LOADING_CARDS }).map((_, index) => (
                    <article className="product-card skeleton" key={`loading-${index}`}>
                      <div className="skeleton-block skeleton-image" />
                      <div className="skeleton-body">
                        <div className="skeleton-block skeleton-line short" />
                        <div className="skeleton-block skeleton-line" />
                        <div className="skeleton-block skeleton-line" />
                        <div className="skeleton-block skeleton-line button" />
                      </div>
                    </article>
                  ))
                : filteredProducts.map((product) => (
                    <article className="product-card" key={product.id}>
                      <div className="image-frame">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-image"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="badge">{product.badge}</span>
                      </div>

                      <div className="product-content">
                        <p className="product-category">{product.category}</p>
                        <h3>{product.name}</h3>
                        <p className="product-description">{product.description}</p>

                        <div className="product-bottom">
                          <p className="price">${product.price.toFixed(2)}</p>
                          <button
                            type="button"
                            className="luxe-button"
                            onClick={() => addToCart(product)}
                          >
                            Add to Bag
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
            </div>
          </div>

          <aside className="cart-panel" id="cart">
            <div className="cart-head">
              <h2>Shopping Bag</h2>
              <p>{cartCount} items</p>
            </div>

            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <h3>Your bag is waiting.</h3>
                <p>Add a few atelier essentials to begin your ritual.</p>
              </div>
            ) : (
              <ul className="cart-list">
                {cartItems.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div>
                      <h4>{item.name}</h4>
                      <p>${item.price.toFixed(2)}</p>
                    </div>

                    <div className="quantity-control" aria-label={`Adjust ${item.name}`}>
                      <button
                        type="button"
                        aria-label={`Decrease ${item.name}`}
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${item.name}`}
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="text-button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="summary">
              <div>
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>{shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}</strong>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>

            <button
              className="checkout-button"
              type="button"
              onClick={openCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>

            {isCheckoutOpen ? (
              <form className="checkout-form" onSubmit={completeCheckout}>
                <h3>Express Checkout</h3>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" required placeholder="you@example.com" />

                <label htmlFor="address">Delivery Address</label>
                <input id="address" type="text" required placeholder="12 Rue de la Paix" />

                <div className="checkout-actions">
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setIsCheckoutOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="luxe-button">
                    Confirm Order
                  </button>
                </div>
              </form>
            ) : null}

            <p className={`checkout-note ${orderPlaced ? "checkout-success" : ""}`}>
              {orderPlaced
                ? "Order confirmed. Your curated parcel is being prepared."
                : "Complimentary shipping on every order over $180."}
            </p>
          </aside>
        </section>
      </main>

      <footer className="section-shell footer" id="ritual">
        <p>Atelier support: concierge@aurea.com</p>
        <p>Crafted for timeless beauty rituals © 2026 AUREA</p>
      </footer>

      <div
        className={`toast ${toastMessage ? "toast-visible" : ""}`}
        aria-live="polite"
        role="status"
      >
        {toastMessage}
      </div>
    </div>
  );
}

export default App;
