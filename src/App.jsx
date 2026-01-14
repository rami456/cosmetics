import { useEffect, useMemo, useState } from "react";

export default function App() {
  // ✅ All styles included here (no separate CSS file needed)
  const styles = `
    :root{
      --panel:#ffffff;
      --soft:#f6f6f7;
      --line:rgba(0,0,0,0.08);
      --text:#0e0e10;
      --muted:rgba(14,14,16,0.62);
      --shadow:0 18px 60px rgba(0,0,0,0.10);
      --shadow2:0 10px 30px rgba(0,0,0,0.10);
      --radius:18px;
    }
    *{ box-sizing:border-box; }
    body{
      margin:0;
      background:var(--soft);
      color:var(--text);
      font-family:ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    }

    .app{ min-height:100vh; }

    /* Topbar */
    .topbar{
      position:sticky; top:0; z-index:50;
      height:72px;
      display:flex; align-items:center; gap:14px;
      padding:0 18px;
      background:rgba(255,255,255,0.75);
      backdrop-filter:blur(14px);
      border-bottom:1px solid var(--line);
    }
    .brand{
      text-decoration:none;
      color:var(--text);
      font-weight:900;
      letter-spacing:0.06em;
      font-size:22px;
      text-transform:lowercase;
    }
    .topbarRight{ margin-left:auto; display:flex; align-items:center; gap:10px; }
    .pill{
      display:flex; align-items:center; gap:10px;
      padding:10px 12px;
      border:1px solid var(--line);
      border-radius:999px;
      background:rgba(255,255,255,0.7);
      font-size:12px;
      color:var(--muted);
      white-space:nowrap;
    }
    .pillDot{ width:8px; height:8px; border-radius:999px; background:#0e0e10; opacity:0.9; }

    /* Icon Button */
    .iconBtn{
      width:42px; height:42px;
      border-radius:12px;
      border:1px solid var(--line);
      background:rgba(255,255,255,0.88);
      cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      transition:transform 120ms ease, box-shadow 180ms ease;
    }
    .iconBtn:hover{ transform:translateY(-1px); box-shadow:var(--shadow2); }
    .hamburger{
      width:18px; height:2px;
      background:#111;
      border-radius:999px;
      position:relative;
      display:block;
    }
    .hamburger::before,.hamburger::after{
      content:"";
      position:absolute; left:0;
      width:18px; height:2px;
      background:#111;
      border-radius:999px;
    }
    .hamburger::before{ top:-5px; }
    .hamburger::after{ top:5px; }

    /* Overlay */
    .overlay{
      position:fixed; inset:0;
      background:rgba(0,0,0,0.40);
      opacity:0;
      pointer-events:none;
      transition:opacity 220ms ease;
      z-index:60;
    }
    .overlay.show{
      opacity:1;
      pointer-events:auto;
    }

    /* Sidebar (desktop pinned, mobile drawer) */
    .sidebar{
      position:fixed;
      top:72px; left:0; bottom:0;
      width:280px;
      background:var(--panel);
      border-right:1px solid var(--line);
      padding:18px;
      z-index:70;
      transform:translateX(0);
      transition:transform 220ms ease;
    }

    .sidebarHeader{
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:12px;
      padding-bottom:14px;
      border-bottom:1px solid var(--line);
      margin-bottom:14px;
    }
    .sidebarTitle{
      font-weight:900;
      font-size:12px;
      letter-spacing:0.10em;
      text-transform:uppercase;
    }
    .sidebarSub{
      margin-top:6px;
      font-size:12px;
      color:var(--muted);
    }
    .closeBtn{
      display:none; /* shown on mobile drawer */
      width:42px; height:42px;
      border-radius:12px;
      border:1px solid var(--line);
      background:rgba(255,255,255,0.9);
      cursor:pointer;
    }

    .menuList{
      list-style:none;
      padding:0;
      margin:0;
      display:flex;
      flex-direction:column;
      gap:10px;
    }
    .menuItem{
      width:100%;
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:14px 14px;
      border-radius:14px;
      border:1px solid var(--line);
      background:#fff;
      cursor:pointer;
      transition:transform 120ms ease, box-shadow 180ms ease;
    }
    .menuItem:hover{ transform:translateY(-1px); box-shadow:var(--shadow2); }
    .menuItem.active{
      background:#0e0e10;
      color:#fff;
      border-color:rgba(0,0,0,0.2);
    }
    .menuText{ font-weight:800; letter-spacing:0.01em; }
    .menuArrow{ opacity:0.7; font-size:18px; }

    .sidebarFooter{ margin-top:16px; }
    .miniCard{
      padding:14px;
      border-radius:14px;
      border:1px solid var(--line);
      background:linear-gradient(180deg, #ffffff, #f7f7f8);
    }
    .miniCardTitle{
      font-weight:900;
      font-size:12px;
      letter-spacing:0.08em;
      text-transform:uppercase;
    }
    .miniCardText{ margin-top:6px; font-size:12px; color:var(--muted); }

    /* Main layout */
    .main{
      display:grid;
      grid-template-columns: 1fr 340px;
      gap:18px;
      padding:22px;
      max-width:1280px;
      margin:0 auto;
      margin-left:280px; /* space for pinned sidebar desktop */
    }

    .sectionHeader{
      display:flex;
      align-items:flex-end;
      justify-content:space-between;
      gap:16px;
      margin-bottom:16px;
    }
    .h1{ margin:0; font-size:32px; letter-spacing:-0.02em; }
    .sub{ margin:8px 0 0; color:var(--muted); font-size:14px; }
    .sortHint{ font-size:13px; color:var(--muted); }

    /* Products grid */
    .grid{
      display:grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap:16px;
    }
    .card{
      border-radius:var(--radius);
      border:1px solid var(--line);
      background:#fff;
      overflow:hidden;
      box-shadow:0 6px 20px rgba(0,0,0,0.06);
      transition:transform 140ms ease, box-shadow 220ms ease;
    }
    .card:hover{ transform:translateY(-2px); box-shadow:var(--shadow); }
    .imgWrap{ background:#f2f2f3; aspect-ratio:1/1; overflow:hidden; }
    .img{ width:100%; height:100%; object-fit:cover; display:block; }
    .cardBody{ padding:14px; display:flex; flex-direction:column; gap:12px; }
    .cardTop{ display:flex; align-items:flex-start; justify-content:space-between; gap:10px; }
    .cardTitle{ margin:0; font-size:14px; font-weight:900; }
    .price{ font-weight:900; font-size:14px; }

    .btnPrimary{
      width:100%;
      padding:11px 12px;
      border-radius:12px;
      border:1px solid rgba(0,0,0,0.12);
      background:#0e0e10;
      color:#fff;
      font-weight:900;
      cursor:pointer;
      transition:transform 120ms ease, opacity 180ms ease;
    }
    .btnPrimary:hover{ transform:translateY(-1px); }
    .btnPrimary:active{ transform:translateY(0px); opacity:0.92; }

    /* Cart */
    .cart{
      position:sticky;
      top:90px;
      height:fit-content;
      border-radius:var(--radius);
      border:1px solid var(--line);
      background:#fff;
      padding:16px;
      box-shadow:0 8px 26px rgba(0,0,0,0.06);
    }
    .cartHeader{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:12px; }
    .cartTitle{ font-weight:900; font-size:16px; }
    .cartCount{ color:var(--muted); font-size:12px; }

    .empty{
      border:1px dashed rgba(0,0,0,0.18);
      border-radius:16px;
      padding:16px;
      text-align:center;
      background:linear-gradient(180deg,#fff,#fafafa);
    }
    .emptyIcon{ font-size:22px; }
    .emptyTitle{ margin-top:10px; font-weight:900; }
    .emptyText{ margin-top:6px; color:var(--muted); font-size:12px; }

    .cartList{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:12px; }
    .cartRow{ display:flex; justify-content:space-between; gap:12px; padding:10px 0; border-bottom:1px solid var(--line); }
    .cartRow:last-child{ border-bottom:none; }
    .cartName{ font-weight:800; font-size:13px; }
    .cartPrice{ color:var(--muted); font-size:12px; margin-top:4px; }
    .removeBtn{
      border:none;
      background:transparent;
      color:#b00020;
      cursor:pointer;
      font-weight:800;
    }

    .cartTotal{
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-top:12px;
      padding-top:12px;
      border-top:1px solid var(--line);
      font-size:14px;
    }
    .btnCheckout{
      width:100%;
      margin-top:12px;
      padding:12px 12px;
      border-radius:12px;
      border:1px solid rgba(0,0,0,0.12);
      background:#fff;
      font-weight:900;
      cursor:pointer;
      transition:transform 120ms ease, box-shadow 180ms ease;
    }
    .btnCheckout:hover{ transform:translateY(-1px); box-shadow:var(--shadow2); }
    .cartNote{ margin-top:10px; color:var(--muted); font-size:12px; text-align:center; }

    .footer{
      margin-left:280px;
      padding:18px;
      text-align:center;
      color:var(--muted);
      font-size:13px;
    }

    /* Responsive */
    @media (max-width: 1100px){
      .grid{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .main{ grid-template-columns: 1fr 320px; }
    }

    @media (max-width: 900px){
      .main{
        margin-left:0;
        grid-template-columns: 1fr;
      }
      .cart{ position:relative; top:auto; }
      .footer{ margin-left:0; }

      /* sidebar becomes drawer */
      .sidebar{
        transform:translateX(-105%);
        box-shadow:var(--shadow);
      }
      .sidebar.open{ transform:translateX(0); }
      .closeBtn{ display:flex; align-items:center; justify-content:center; }
      .pill{ display:none; }
    }
  `;

  const products = [
    { id: 1, name: "Velvet Lipstick", price: 15, img: "https://via.placeholder.com/900x900", category: "cosmetics" },
    { id: 2, name: "Radiant Foundation", price: 25, img: "https://via.placeholder.com/900x900", category: "cosmetics" },
    { id: 3, name: "Skincare Set", price: 40, img: "https://via.placeholder.com/900x900", category: "cosmetics" },
    { id: 4, name: "Silk Blush", price: 18, img: "https://via.placeholder.com/900x900", category: "cosmetics" },
    { id: 5, name: "Lash Mascara", price: 20, img: "https://via.placeholder.com/900x900", category: "cosmetics" },

    { id: 6, name: "Silk Dress", price: 120, img: "https://via.placeholder.com/900x900", category: "clothes" },
    { id: 7, name: "Auréa Jacket", price: 180, img: "https://via.placeholder.com/900x900", category: "clothes" },
    { id: 8, name: "Tailored Pants", price: 95, img: "https://via.placeholder.com/900x900", category: "clothes" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("cosmetics");
  const [cartItems, setCartItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = [
    { key: "cosmetics", label: "Cosmetics" },
    { key: "clothes", label: "Clothes" },
  ];

  const filteredProducts = useMemo(
    () => products.filter((p) => p.category === selectedCategory),
    [products, selectedCategory]
  );

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const addToCart = (product) => setCartItems((prev) => [...prev, product]);
  const removeFromCart = (index) => setCartItems((prev) => prev.filter((_, i) => i !== index));

  // ESC closes drawer
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // lock body scroll when drawer open (mobile)
  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [sidebarOpen]);

  return (
    <div className="app">
      <style>{styles}</style>

      {/* Top Bar */}
      <header className="topbar">
        <button className="iconBtn" aria-label="Open menu" onClick={() => setSidebarOpen(true)}>
          <span className="hamburger" />
        </button>

        <a className="brand" href="https://aurea.com">
          auréa
        </a>

        <div className="topbarRight">
          <div className="pill">
            <span className="pillDot" />
            <span>Free shipping over $75</span>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div className={`overlay ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebarHeader">
          <div>
            <div className="sidebarTitle">Browse</div>
            <div className="sidebarSub">Select a category</div>
          </div>

          <button className="closeBtn" aria-label="Close menu" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        {/* LIST MENU */}
        <nav>
          <ul className="menuList">
            {categories.map((c) => {
              const active = selectedCategory === c.key;
              return (
                <li key={c.key}>
                  <button
                    className={`menuItem ${active ? "active" : ""}`}
                    onClick={() => {
                      setSelectedCategory(c.key);
                      setSidebarOpen(false);
                    }}
                  >
                    <span className="menuText">{c.label}</span>
                    <span className="menuArrow">›</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebarFooter">
          <div className="miniCard">
            <div className="miniCardTitle">Auréa Standard</div>
            <div className="miniCardText">Clean formulas • Timeless tailoring</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <section>
          <div className="sectionHeader">
            <div>
              <h1 className="h1">{selectedCategory === "cosmetics" ? "Cosmetics" : "Clothes"}</h1>
              <p className="sub">Curated essentials designed to feel effortless.</p>
            </div>
            <div className="sortHint">
              Showing <b>{filteredProducts.length}</b> items
            </div>
          </div>

          <div className="grid">
            {filteredProducts.map((p) => (
              <article key={p.id} className="card">
                <div className="imgWrap">
                  <img src={p.img} alt={p.name} className="img" />
                </div>

                <div className="cardBody">
                  <div className="cardTop">
                    <h3 className="cardTitle">{p.name}</h3>
                    <div className="price">${p.price.toFixed(2)}</div>
                  </div>

                  <button className="btnPrimary" onClick={() => addToCart(p)}>
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="cart">
          <div className="cartHeader">
            <div className="cartTitle">Cart</div>
            <div className="cartCount">{cartItems.length} items</div>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty">
              <div className="emptyIcon">🛍️</div>
              <div className="emptyTitle">Your cart is empty</div>
              <div className="emptyText">Add something you love.</div>
            </div>
          ) : (
            <>
              <ul className="cartList">
                {cartItems.map((item, i) => (
                  <li key={i} className="cartRow">
                    <div>
                      <div className="cartName">{item.name}</div>
                      <div className="cartPrice">${item.price.toFixed(2)}</div>
                    </div>
                    <button className="removeBtn" onClick={() => removeFromCart(i)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <div className="cartTotal">
                <span>Total</span>
                <b>${totalPrice.toFixed(2)}</b>
              </div>

              <button className="btnCheckout">Checkout</button>
              <div className="cartNote">Secure checkout coming next.</div>
            </>
          )}
        </aside>
      </main>

      <footer className="footer">© 2026 auréa.com</footer>
    </div>
  );
}
