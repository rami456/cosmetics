import React, { useState } from "react";

function App() {
  const products = [
    { id: 1, name: "Lipstick", price: 15, img: "https://via.placeholder.com/300" },
    { id: 2, name: "Foundation", price: 25, img: "https://via.placeholder.com/300" },
    { id: 3, name: "Skincare Set", price: 40, img: "https://via.placeholder.com/300" },
    { id: 4, name: "Blush", price: 18, img: "https://via.placeholder.com/300" },
    { id: 5, name: "Mascara", price: 20, img: "https://via.placeholder.com/300" },
  ];

  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>
      
      {/* Header */}
      <header
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderBottom: "1px solid #eee",
          textAlign: "center",
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        <a
          href="https://aurea.com"
          style={{ textDecoration: "none", color: "#000" }}
        >
          auréa
        </a>
      </header>

      {/* Main Content */}
      <main
        style={{
          display: "flex",
          padding: "30px",
          backgroundColor: "#fafafa",
          gap: "30px",
        }}
      >
        {/* Products Grid */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "25px",
            flex: 3,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #eee",
                borderRadius: "12px",
                padding: "15px",
                textAlign: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "none")
              }
            >
              <img
                src={product.img}
                alt={product.name}
                style={{ width: "100%", borderRadius: "10px" }}
              />
              <h3 style={{ margin: "12px 0 5px" }}>{product.name}</h3>
              <p style={{ color: "#555", marginBottom: "10px" }}>
                ${product.price.toFixed(2)}
              </p>
              <button
                onClick={() => addToCart(product)}
                style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  width: "100%",
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
            backgroundColor: "#fff",
            border: "1px solid #eee",
            borderRadius: "12px",
            padding: "20px",
            height: "fit-content",
          }}
        >
          <h2 style={{ marginBottom: "15px" }}>🛒 Cart</h2>

          {cartItems.length === 0 ? (
            <p style={{ color: "#777" }}>Your cart is empty</p>
          ) : (
            <>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {cartItems.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                      fontSize: "14px",
                    }}
                  >
                    <span>
                      {item.name} – ${item.price}
                    </span>
                    <button
                      onClick={() => removeFromCart(index)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "red",
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <hr />
              <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                Total: ${totalPrice.toFixed(2)}
              </p>
            </>
          )}
        </aside>
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "15px",
          borderTop: "1px solid #eee",
          fontSize: "14px",
          color: "#666",
        }}
      >
        © 2026 auréa.com
      </footer>
    </div>
  );
}

export default App;
