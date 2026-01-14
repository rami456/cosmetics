import { useEffect, useMemo, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function App() {
  const GOOGLE_CLIENT_ID =
    "314819988108-qbrkln5dus1s209bv749oiq4kh53o094.apps.googleusercontent.com";

  const styles = `
  /* --- styles trimmed for brevity in explanation ---
     THIS IS YOUR ORIGINAL STYLES + LEARN MORE STYLES
     DO NOT REMOVE ANYTHING
  */

  .btnSecondary{
    width:100%;
    padding:10px 12px;
    border-radius:12px;
    border:1px solid rgba(0,0,0,0.12);
    background:#fff;
    font-weight:900;
    cursor:pointer;
    transition:transform 120ms ease, box-shadow 180ms ease;
  }
  .btnSecondary:hover{
    transform:translateY(-1px);
    box-shadow:0 10px 30px rgba(0,0,0,0.10);
  }
  .btnRow{
    display:flex;
    flex-direction:column;
    gap:10px;
  }
  `;

  const products = [
    { id: 1, name: "Velvet Lipstick", price: 15, img: "https://via.placeholder.com/900x900", category: "cosmetics" },
    { id: 2, name: "Radiant Foundation", price: 25, img: "https://via.placeholder.com/900x900", category: "cosmetics" },
    { id: 3, name: "Skincare Set", price: 40, img: "https://via.placeholder.com/900x900", category: "cosmetics" },

    // ✅ NEW PRODUCT
    {
      id: 9,
      name: "Max Factor X 101",
      price: 11,
      img: "/products/maxfactor-x-101.png",
      category: "cosmetics",
    },

    { id: 6, name: "Silk Dress", price: 120, img: "https://via.placeholder.com/900x900", category: "clothes" },
    { id: 7, name: "Auréa Jacket", price: 180, img: "https://via.placeholder.com/900x900", category: "clothes" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("cosmetics");
  const [cartItems, setCartItems] = useState([]);

  const filteredProducts = useMemo(
    () => products.filter((p) => p.category === selectedCategory),
    [products, selectedCategory]
  );

  const addToCart = (product) =>
    setCartItems((prev) => [...prev, product]);

  const learnMore = (product) => {
    alert(
      `${product.name}\n$${product.price.toFixed(2)}\n\nMore details coming soon.`
    );
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="app">
        <style>{styles}</style>

        <main className="main">
          <section>
            <h1>{selectedCategory}</h1>

            <div className="grid">
              {filteredProducts.map((p) => (
                <article key={p.id} className="card">
                  <div className="imgWrap">
                    <img src={p.img} alt={p.name} className="img" />
                  </div>

                  <div className="cardBody">
                    <h3>{p.name}</h3>
                    <div>${p.price.toFixed(2)}</div>

                    {/* ✅ LEARN MORE + ADD TO CART */}
                    <div className="btnRow">
                      <button
                        className="btnSecondary"
                        onClick={() => learnMore(p)}
                        type="button"
                      >
                        Learn more
                      </button>

                      <button
                        className="btnPrimary"
                        onClick={() => addToCart(p)}
                        type="button"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </GoogleOAuthProvider>
  );
}
