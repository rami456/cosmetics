import { useState, useMemo } from "react";
import "./App.css";

export default function App() {
  const products = [
    { id: 1, name: "Lipstick", price: 15, img: "https://via.placeholder.com/300", category: "cosmetics" },
    { id: 2, name: "Foundation", price: 25, img: "https://via.placeholder.com/300", category: "cosmetics" },
    { id: 3, name: "Skincare Set", price: 40, img: "https://via.placeholder.com/300", category: "cosmetics" },
    { id: 4, name: "Blush", price: 18, img: "https://via.placeholder.com/300", category: "cosmetics" },
    { id: 5, name: "Mascara", price: 20, img: "https://via.placeholder.com/300", category: "cosmetics" },

    { id: 6, name: "Silk Dress", price: 120, img: "https://via.placeholder.com/300", category: "clothes" },
    { id: 7, name: "Auréa Jacket", price: 180, img: "https://via.placeholder.com/300", category: "clothes" },
    { id: 8, name: "Tailored Pants", price: 95, img: "https://via.placeholder.com/300", category: "clothes" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("cosmetics");
  const [cartItems, setCartItems] = useState([]);

  const filteredProducts = useMemo(
    () => products.filter((p) => p.category === selectedCategory),
    [selectedCategory]
  );

  const addToCart = (product) => setCartItems((prev) => [...prev, product]);
  const removeFromCart = (index) =>
    setCartItems((prev) => prev.filter((_, i) => i !== index));

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", background: "#fafafa" }}>
      {/* Header */}
      <header
        style={{
          background: "#fff",
          padding: 20,
          textAlign: "center",
          fontSize: 28,
          fontWeight: "bold",
          borderBottom: "1px solid #eee",
        }}
      >
        auréa
      </header>

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 80,
          left: 0,
          bottom: 0,
          width: 220,
          background: "#fff",
          borderRight: "1px solid #eee",
          padding: 20,
        }}
      >
        <h3>Categories</h3>

        {["cosmetics", "clothes"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              width: "100%",
              padding: 12,
              marginTop: 10,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: selectedCategory === cat ? "#000" : "#f2f2f2",
              color: selectedCategory === cat ? "#fff" : "#000",
              textTransform: "capitalize",
            }}
          >
            {cat}
          </button>
        ))}
      </aside>

      {/* Main */}
      <main style={{ padding: 30, paddingLeft: 260, display: "flex", gap: 30 }}>
        {/* Products */}
        <section
          style={{
            flex: 3,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 25,
          }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 15,
                textAlign: "center",
                border: "1px solid #eee",
              }}
            >
              <img src={product.img} alt={product.name} style={{ width: "100%", borderRadius: 10 }} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button
                onClick={() => addToCart(product)}
                style={{
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  padding: 10,
                  width: "100%",
                  borderRadius: 6,
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </section>

        {/* Cart */}
        <aside
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            border: "1px solid #eee",
            height: "fit-content",
          }}
        >
          <h2>🛒 Cart</h2>

          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {cartItems.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span>{item.name}</span>
                  <button onClick={() => removeFromCart(i)} style={{ color: "red", border: "none" }}>
                    ✕
                  </button>
                </div>
              ))}
              <hr />
              <strong>Total: ${totalPrice}</strong>
            </>
          )}
        </aside>
      </main>

      {/* Footer */}
      <footer
        style={{
          marginLeft: 220,
          textAlign: "center",
          padding: 15,
          borderTop: "1px solid #eee",
          fontSize: 14,
          color: "#666",
          background: "#fff",
        }}
      >
        © 2026 auréa.com
      </footer>
    </div>
  );
}
