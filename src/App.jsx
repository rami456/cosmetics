import { useEffect, useMemo, useState } from "react";

// Firebase
import { auth } from "./firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";

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
    button{ -webkit-tap-highlight-color: transparent; }
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

    /* Auth Button (topbar) */
    .authBtn{
      height:42px;
      padding:0 14px;
      border-radius:12px;
      border:1px solid var(--line);
      background:rgba(255,255,255,0.88);
      cursor:pointer;
      font-weight:900;
      transition:transform 120ms ease, box-shadow 180ms ease;
    }
    .authBtn:hover{ transform:translateY(-1px); box-shadow:var(--shadow2); }

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

    /* Sidebar */
    /* Sidebar drawer with image */
.sidebar{
  position:fixed;
  top:72px;
  left:0;
  bottom:0;
  width:360px;
  z-index:70;
  transform:translateX(-105%);
  transition:transform 220ms ease;
  overflow:hidden;
  padding:0;
  background:#000;
  border-right:1px solid var(--line);
}
.sidebar.open{
  transform:translateX(0);
}

.sidebarBg{
  position:absolute;
  inset:0;
  background-image:url("/menu.png");
  background-size:cover;
  background-position:center;
  background-repeat:no-repeat;
}

.sidebarContent{
  position:relative;
  z-index:1;
  height:100%;
  display:flex;
  flex-direction:column;
  padding:18px;
}
      .closeBtn{ display:flex; align-items:center; justify-content:center; }
      .pill{ display:none; }
      .lmGrid{ grid-template-columns: 1fr; }
      .lmThumbs{ margin-top:12px; }
    }
    @media (max-width: 620px){ .grid{ grid-template-columns: 1fr; } }
    @media (max-width: 520px){ .row2{ grid-template-columns: 1fr; } }
    @media (prefers-reduced-motion: reduce){ *{ transition:none !important; } }
  `;

  // ✅ Products
  const products = [
    { id: 1, name: "Velvet Lipstick", price: 15, img: "https://via.placeholder.com/900x900", category: "cosmetics" },
    { id: 2, name: "Radiant Foundation", price: 25, img: "https://via.placeholder.com/900x900", category: "cosmetics" },
    { id: 3, name: "Skincare Set", price: 40, img: "https://via.placeholder.com/900x900", category: "cosmetics" },
    { id: 4, name: "Silk Blush", price: 18, img: "https://via.placeholder.com/900x900", category: "cosmetics" },
    { id: 5, name: "Lash Mascara", price: 20, img: "https://via.placeholder.com/900x900", category: "cosmetics" },
    {
      id: 9,
      name: "Max Factor x 101",
      price: 11,
      category: "cosmetics",
      images: ["/products/Max_Factor_Closed_101_Ivory_Beige_PNG.png", "/products/OIP (11).webp"],
      details: {
        subtitle: "Lasting Performance Foundation — Shade 101 Ivory Beige",
        size: "30–35 ml (varies by market)",
        features: ["High coverage, buildable finish", "Smudge-resistant & touch-proof", "Long-wear up to ~8 hours", "Oil-free feel"],
        howToUse: "Apply a small amount and blend outward with a sponge/brush. Build coverage where needed.",
      },
    },
    { id: 13, name: "Noir Eau de Parfum", price: 98, img: "https://via.placeholder.com/900x900", category: "fragrances" },
    { id: 14, name: "Citrus Mist", price: 72, img: "https://via.placeholder.com/900x900", category: "fragrances" },
    { id: 15, name: "Amber Veil", price: 110, img: "https://via.placeholder.com/900x900", category: "fragrances" },
  ];

  const categories = [
    { key: "cosmetics", label: "Cosmetics" },
    { key: "fragrances", label: "Fragrances" },
  ];

  // ✅ State (NO duplicates)
  const [selectedCategory, setSelectedCategory] = useState("cosmetics");
  const [cartItems, setCartItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // user = { name, email, mode: "user" | "guest" }
  const [user, setUser] = useState(null);

  // Learn More modal
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");

  // Auth modal
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // "signin" | "signup"
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const filteredProducts = useMemo(
    () => products.filter((p) => p.category === selectedCategory),
    [selectedCategory]
  );

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const addToCart = (product) => setCartItems((prev) => [...prev, product]);
  const removeFromCart = (index) => setCartItems((prev) => prev.filter((_, i) => i !== index));

  const resetAuthForm = () => setAuthForm({ name: "", email: "", password: "", confirmPassword: "" });

  const setMode = (mode) => {
    setAuthMode(mode);
    resetAuthForm();
  };

  // ✅ Firebase: keep user logged in (REAL source of truth)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        // If they are guest, keep guest. Otherwise sign out UI.
        setUser((prev) => (prev?.mode === "guest" ? prev : null));
        return;
      }

      setUser({
        name: u.displayName || u.email?.split("@")[0] || "User",
        email: u.email || "",
        mode: "user",
      });
    });

    return () => unsub();
  }, []);

  // ESC closes drawer + modals
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
        setAuthOpen(false);
        setLearnMoreOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // lock body scroll when drawer or modal open
  useEffect(() => {
    const locked = sidebarOpen || authOpen || learnMoreOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [sidebarOpen, authOpen, learnMoreOpen]);

  // ✅ REAL Firebase Email/Password sign in (NO setUser here)
  const signIn = async () => {
    if (!authForm.email.trim() || !authForm.password.trim()) return;

    try {
      await signInWithEmailAndPassword(auth, authForm.email.trim(), authForm.password);
      setAuthOpen(false);
      resetAuthForm();
    } catch (err) {
      alert(err?.code || err?.message || "Sign in failed");
    }
  };

  // ✅ REAL Firebase Email/Password sign up (NO setUser here)
  const signUp = async () => {
    if (!authForm.name.trim() || !authForm.email.trim() || !authForm.password.trim()) return;
    if (authForm.password !== authForm.confirmPassword) return;

    try {
      const cred = await createUserWithEmailAndPassword(auth, authForm.email.trim(), authForm.password);
      await updateProfile(cred.user, { displayName: authForm.name.trim() });

      setAuthOpen(false);
      resetAuthForm();
    } catch (err) {
      alert(err?.code || err?.message || "Sign up failed");
    }
  };

  // ✅ REAL Google popup sign in (NO setUser here)
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      setAuthOpen(false);
      resetAuthForm();
    } catch (err) {
      alert(err?.code || err?.message || "Google sign-in failed");
    }
  };

  const continueAsGuest = () => {
    setUser({ name: "Guest", email: "", mode: "guest" });
    setAuthOpen(false);
    resetAuthForm();
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null); // UI update immediately
    } catch (err) {
      alert(err?.code || err?.message || "Sign out failed");
    }
  };

  // Learn more open/close
  const openLearnMore = (product) => {
    setActiveProduct(product);
    const first = product?.images?.[0] || product?.img || "";
    setActiveImage(first);
    setLearnMoreOpen(true);
  };
  const closeLearnMore = () => {
    setLearnMoreOpen(false);
    setActiveProduct(null);
    setActiveImage("");
  };

  return (
    <div className="app">
      <style>{styles}</style>

      {/* Top Bar */}
      <header className="topbar">
        <button className="iconBtn" aria-label="Open menu" onClick={() => setSidebarOpen(true)}>
          <span className="hamburger" />
        </button>

        <a className="brand" href="https://aurea.com">auréa</a>

        <div className="topbarRight">
          <div className="pill">
            <span className="pillDot" />
            <span>Free shipping over $75</span>
          </div>

          {user ? (
            <button className="authBtn" onClick={signOut} aria-label="Sign out">
              {user.mode === "guest" ? "Guest" : user.name} · Sign out
            </button>
          ) : (
            <button
              className="authBtn"
              onClick={() => {
                setAuthOpen(true);
                setMode("signin");
              }}
              aria-label="Open sign in"
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      {/* Overlay (sidebar) */}
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

      {/* Auth Modal */}
      <div className={`modal ${authOpen ? "show" : ""}`} role="dialog" aria-modal="true">
        <div className="modalBackdrop" onClick={() => setAuthOpen(false)} aria-label="Close auth modal" />
        <div className="modalCard">
          <div className="modalTop">
            <div>
              <div className="modalTitle">Account</div>
              <div className="help">Sign in, create an account, or continue as a guest.</div>
            </div>
            <button className="modalClose" onClick={() => setAuthOpen(false)} aria-label="Close">✕</button>
          </div>

          <div className="modalBody">
            <div className="tabs" role="tablist" aria-label="Auth tabs">
              <button className={`tab ${authMode === "signin" ? "active" : ""}`} onClick={() => setMode("signin")} type="button">
                Sign in
              </button>
              <button className={`tab ${authMode === "signup" ? "active" : ""}`} onClick={() => setMode("signup")} type="button">
                Sign up
              </button>
            </div>

            {authMode === "signup" && (
              <div className="field">
                <div className="label">Full name</div>
                <input
                  className="input"
                  value={authForm.name}
                  onChange={(e) => setAuthForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
            )}

            <div className="row2">
              <div className="field">
                <div className="label">Email</div>
                <input
                  className="input"
                  value={authForm.email}
                  onChange={(e) => setAuthForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@email.com"
                  type="email"
                />
              </div>

              <div className="field">
                <div className="label">Password</div>
                <input
                  className="input"
                  value={authForm.password}
                  onChange={(e) => setAuthForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </div>

            {authMode === "signup" && (
              <div className="field">
                <div className="label">Confirm password</div>
                <input
                  className="input"
                  value={authForm.confirmPassword}
                  onChange={(e) => setAuthForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                  type="password"
                />
                {authForm.password &&
                  authForm.confirmPassword &&
                  authForm.password !== authForm.confirmPassword && (
                    <div className="help" style={{ color: "#b00020", fontWeight: 800 }}>
                      Passwords do not match.
                    </div>
                  )}
              </div>
            )}

            <div className="authActions">
              {authMode === "signin" ? (
                <button
                  className="btnPrimary"
                  onClick={signIn}
                  disabled={!authForm.email.trim() || !authForm.password.trim()}
                  style={{
                    opacity: !authForm.email.trim() || !authForm.password.trim() ? 0.6 : 1,
                    cursor: !authForm.email.trim() || !authForm.password.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  Sign in
                </button>
              ) : (
                <button
                  className="btnPrimary"
                  onClick={signUp}
                  disabled={
                    !authForm.name.trim() ||
                    !authForm.email.trim() ||
                    !authForm.password.trim() ||
                    authForm.password !== authForm.confirmPassword
                  }
                  style={{
                    opacity:
                      !authForm.name.trim() ||
                      !authForm.email.trim() ||
                      !authForm.password.trim() ||
                      authForm.password !== authForm.confirmPassword
                        ? 0.6
                        : 1,
                    cursor:
                      !authForm.name.trim() ||
                      !authForm.email.trim() ||
                      !authForm.password.trim() ||
                      authForm.password !== authForm.confirmPassword
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Create account
                </button>
              )}

              <div className="divider">or</div>

              <button className="btnGhost" onClick={signInWithGoogle} type="button">
                Continue with Google
              </button>

              <button className="btnGhost" onClick={continueAsGuest} type="button">
                Continue as guest
              </button>

              <div className="help">(Firebase Auth is real. Guest mode is UI-only.)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Learn More Modal */}
      <div className={`modal ${learnMoreOpen ? "show" : ""}`} role="dialog" aria-modal="true">
        <div className="modalBackdrop" onClick={closeLearnMore} aria-label="Close learn more" />
        <div className="modalCard">
          <div className="modalTop">
            <div>
              <div className="modalTitle">Learn More</div>
              <div className="help">{activeProduct?.name || ""}</div>
            </div>
            <button className="modalClose" onClick={closeLearnMore} aria-label="Close">✕</button>
          </div>

          <div className="modalBody">
            {activeProduct && (
              <div className="lmGrid">
                <div className="lmImgWrap">
                  <img className="lmImg" src={activeImage} alt={activeProduct.name} />
                </div>

                <div>
                  <div className="lmThumbs">
                    {(activeProduct.images || (activeProduct.img ? [activeProduct.img] : [])).map((src, i) => (
                      <button
                        key={i}
                        className={`lmThumbBtn ${src === activeImage ? "active" : ""}`}
                        onClick={() => setActiveImage(src)}
                        type="button"
                      >
                        <img className="lmThumb" src={src} alt="" />
                      </button>
                    ))}
                  </div>

                  {activeProduct.details ? (
                    <div style={{ marginTop: 12 }}>
                      {activeProduct.details.subtitle && (
                        <div className="help">
                          <b>{activeProduct.details.subtitle}</b>
                        </div>
                      )}
                      {activeProduct.details.size && <div className="help">Size: {activeProduct.details.size}</div>}
                      {Array.isArray(activeProduct.details.features) && (
                        <ul style={{ marginTop: 10, paddingLeft: 18 }}>
                          {activeProduct.details.features.map((f, idx) => (
                            <li key={idx} className="help">{f}</li>
                          ))}
                        </ul>
                      )}
                      {activeProduct.details.howToUse && (
                        <div className="help" style={{ marginTop: 10 }}>
                          <b>How to use:</b> {activeProduct.details.howToUse}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="help" style={{ marginTop: 12 }}>More details coming soon.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="main">
        <section>
          <div className="sectionHeader">
            <div>
              <h1 className="h1">{selectedCategory === "cosmetics" ? "Cosmetics" : "Fragrances"}</h1>
              <p className="sub">Curated essentials designed to feel effortless.</p>
              {user && (
                <p className="sub" style={{ marginTop: 6 }}>
                  Shopping as <b>{user.mode === "guest" ? "Guest" : user.name}</b>
                </p>
              )}
            </div>
            <div className="sortHint">
              Showing <b>{filteredProducts.length}</b> items
            </div>
          </div>

          <div className="grid">
            {filteredProducts.map((p) => {
              const coverImg =
                p.img || (Array.isArray(p.images) ? p.images[0] : "") || "https://via.placeholder.com/900x900";

              return (
                <article key={p.id} className="card">
                  <button className="learnMoreBtn" type="button" onClick={() => openLearnMore(p)}>
                    Learn more
                  </button>

                  <div className="imgWrap">
                    <img src={coverImg} alt={p.name} className="img" />
                  </div>

                  <div className="cardBody">
                    <div className="cardTop">
                      <h3 className="cardTitle">{p.name}</h3>
                      <div className="price">${Number(p.price).toFixed(2)}</div>
                    </div>

                    <button className="btnPrimary" onClick={() => addToCart(p)}>
                      Add to Cart
                    </button>
                  </div>
                </article>
              );
            })}
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
                      <div className="cartPrice">${Number(item.price).toFixed(2)}</div>
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

              <button
                className="btnCheckout"
                onClick={() => {
                  if (!user) {
                    setAuthOpen(true);
                    setMode("signin");
                  } else {
                    alert("Checkout backend coming next ✅");
                  }
                }}
              >
                Checkout
              </button>

              <div className="cartNote">
                {user ? "Secure checkout coming next." : "Sign in / sign up or continue as guest to proceed."}
              </div>
            </>
          )}
        </aside>
      </main>

      <footer className="footer">© 2026 auréa.com</footer>
    </div>
  );
}
