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
      white-space:nowrap;
    }
    .authBtn:hover{ transform:translateY(-1px); box-shadow:var(--shadow2); }

    /* Cart bubble button (top-right) */
    .cartBubble{
      height:42px;
      width:42px;
      border-radius:999px;
      border:1px solid var(--line);
      background:rgba(255,255,255,0.88);
      cursor:pointer;
      display:flex;
      align-items:center;
      justify-content:center;
      position:relative;
      transition:transform 120ms ease, box-shadow 180ms ease;
    }
    .cartBubble:hover{ transform:translateY(-1px); box-shadow:var(--shadow2); }
    .cartBadge{
      position:absolute;
      top:-6px;
      right:-6px;
      min-width:18px;
      height:18px;
      padding:0 6px;
      border-radius:999px;
      background:#0e0e10;
      color:#fff;
      font-size:11px;
      font-weight:900;
      display:flex;
      align-items:center;
      justify-content:center;
    }

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
      display:none;
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
      margin-left:280px;
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

    /* Products */
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
      position:relative;
    }
    .card:hover{ transform:translateY(-2px); box-shadow:var(--shadow); }
    .imgWrap{ background:#f2f2f3; aspect-ratio:1/1; overflow:hidden; }
    .img{ width:100%; height:100%; object-fit:cover; display:block; }
    .cardBody{ padding:14px; display:flex; flex-direction:column; gap:10px; }
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
      margin-top:10px;
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

    /* Modal */
    .modal{
      position:fixed;
      inset:0;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:18px;
      z-index:90;
      opacity:0;
      pointer-events:none;
      transition:opacity 180ms ease;
    }
    .modal.show{ opacity:1; pointer-events:auto; }
    .modalBackdrop{ position:absolute; inset:0; background:rgba(0,0,0,0.45); }
    .modalCard{
      position:relative;
      width:min(720px, 100%);
      border-radius:22px;
      border:1px solid var(--line);
      background:rgba(255,255,255,0.92);
      backdrop-filter: blur(14px);
      box-shadow:var(--shadow);
      overflow:hidden;
      max-height: calc(100vh - 48px);
      overflow:auto;
    }
    .modalTop{
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:12px;
      padding:16px 16px 0;
    }
    .modalTitle{
      font-weight:900;
      font-size:14px;
      letter-spacing:0.10em;
      text-transform:uppercase;
    }
    .modalClose{
      width:42px; height:42px;
      border-radius:12px;
      border:1px solid var(--line);
      background:rgba(255,255,255,0.9);
      cursor:pointer;
      display:flex; align-items:center; justify-content:center;
    }
    .modalBody{ padding:14px 16px 16px; }
    .tabs{ display:flex; gap:10px; margin-top:10px; margin-bottom:12px; }
    .tab{
      flex:1;
      padding:10px 12px;
      border-radius:12px;
      border:1px solid var(--line);
      background:#fff;
      cursor:pointer;
      font-weight:900;
    }
    .tab.active{ background:#0e0e10; color:#fff; border-color:rgba(0,0,0,0.2); }
    .field{ display:flex; flex-direction:column; gap:7px; margin-top:12px; }
    .label{ font-size:12px; color:var(--muted); font-weight:800; letter-spacing:0.02em; }
    .input{
      height:44px;
      border-radius:12px;
      border:1px solid var(--line);
      padding:0 12px;
      outline:none;
      background:#fff;
      font-weight:700;
    }
    .row2{ display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
    .help{ margin-top:10px; font-size:12px; color:var(--muted); }
    .authActions{ display:flex; flex-direction:column; gap:10px; margin-top:14px; }
    .btnGhost{
      width:100%;
      padding:11px 12px;
      border-radius:12px;
      border:1px solid var(--line);
      background:#fff;
      font-weight:900;
      cursor:pointer;
      transition:transform 120ms ease, box-shadow 180ms ease;
    }
    .btnGhost:hover{ transform:translateY(-1px); box-shadow:var(--shadow2); }
    .divider{
      display:flex;
      align-items:center;
      gap:10px;
      margin:12px 0 2px;
      color:var(--muted);
      font-size:12px;
    }
    .divider::before, .divider::after{
      content:"";
      height:1px;
      flex:1;
      background:var(--line);
    }

    /* Learn More gallery */
    .lmGrid{ display:grid; grid-template-columns: 1fr 260px; gap:14px; align-items:start; }
    .lmImgWrap{ width:100%; border:1px solid var(--line); border-radius:16px; overflow:hidden; background:#f2f2f3; }
    .lmImg{ width:100%; height:auto; display:block; }
    .lmThumbs{ display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-start; }
    .lmThumbBtn{ width:70px; height:70px; padding:0; border-radius:12px; border:1px solid var(--line); background:#fff; cursor:pointer; overflow:hidden; }
    .lmThumbBtn.active{ border-color:#0e0e10; }
    .lmThumb{ width:100%; height:100%; object-fit:cover; display:block; }

    @media (max-width: 1100px){
      .grid{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .main{ grid-template-columns: 1fr 320px; }
    }
    @media (max-width: 900px){
      .main{ margin-left:0; grid-template-columns: 1fr; }
      .cart{ position:relative; top:auto; }
      .footer{ margin-left:0; }
      .sidebar{ transform:translateX(-105%); box-shadow:var(--shadow); }
      .sidebar.open{ transform:translateX(0); }
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
    // Cosmetics placeholders
    { id: 1, name: "Velvet Lipstick", price: 15, img: "https://via.placeholder.com/900x900", category: "cosmetics" },
    { id: 2, name: "Radiant Foundation", price: 25, img: "https://via.placeholder.com/900x900", category: "cosmetics" },
    { id: 3, name: "Skincare Set", price: 40, img: "https://via.placeholder.com/900x900", category: "cosmetics" },
    { id: 4, name: "Silk Blush", price: 18, img: "https://via.placeholder.com/900x900", category: "cosmetics" },
    { id: 5, name: "Lash Mascara", price: 20, img: "https://via.placeholder.com/900x900", category: "cosmetics" },

    // ✅ Your cosmetics (with Learn More)
    {
      id: 9,
      name: "MAxFactor X 101",
      price: 11,
      category: "cosmetics",
      images: ["/products/maxfactor-101.jpg"],
      details: {
        subtitle: "Foundation — Shade 101 (light tone)",
        size: "30 ml",
        features: ["Buildable coverage (light → medium)", "Smooth, natural-looking finish", "Best for everyday wear"],
        howToUse:
          "Apply 1–2 pumps to clean, moisturized skin. Blend from center outward using a sponge or brush.",
      },
    },
    {
      id: 10,
      name: "MaxFactor X 55 BEIGE",
      price: 13,
      category: "cosmetics",
      images: ["/products/maxfactor-55-beige.jpg"],
      details: {
        subtitle: "Foundation — Shade 55 Beige (medium tone)",
        size: "30 ml",
        features: ["Medium coverage for an even tone", "Comfortable wear with a soft finish", "Great for daily looks"],
        howToUse: "Dot small amounts on cheeks/forehead/chin, then blend evenly. Add a second layer where needed.",
      },
    },
    {
      id: 11,
      name: "MaxFactor SPF 20",
      price: 17,
      category: "cosmetics",
      images: ["/products/maxfactor-spf20.jpg"],
      details: {
        subtitle: "Foundation with SPF 20 — Everyday base",
        size: "30 ml",
        features: ["Evens skin tone with medium coverage", "SPF 20 (bonus protection)", "Pairs well with setting powder"],
        howToUse:
          "Apply after skincare. Blend well along jawline/neck. For longer wear, set lightly with powder.",
      },
    },
    {
      id: 12,
      name: "L’Oréal PARIS NUDE",
      price: 20,
      category: "cosmetics",
      images: ["/products/loreal-nude.jpg"],
      details: {
        subtitle: "Nude finish foundation — Natural look",
        size: "30 ml",
        features: ["Skin-like nude finish", "Light → medium buildable coverage", "Ideal for minimal makeup styles"],
        howToUse:
          "Use a damp sponge for the most natural finish. Build coverage only where needed (T-zone, cheeks).",
      },
    },
    {
      id: 13,
      name: "L’Oréal PARIS 24H C Cool",
      price: 12,
      category: "cosmetics",
      images: ["/products/loreal-24h-c-cool.jpg"],
      details: {
        subtitle: "Shade: Cool undertone (C)",
        size: "30 ml",
        features: ["Cool undertone shade (balances warmth)", "Medium coverage, blendable texture", "Good for events too"],
        howToUse:
          "Blend quickly with a brush, then press with sponge to smooth texture. Set the T-zone if oily.",
      },
    },
    {
      id: 14,
      name: "L’Oréal PARIS HN Normal",
      price: 12,
      category: "cosmetics",
      images: ["/products/loreal-hn-normal.jpg"],
      details: {
        subtitle: "Shade: HN (Neutral) — Balanced tone",
        size: "30 ml",
        features: ["Neutral undertone shade", "Medium coverage for an even base", "Works well with most blush/bronzer"],
        howToUse:
          "Apply in thin layers. Let the first layer set for 30 seconds before adding more coverage.",
      },
    },
    {
      id: 16,
      name: "HD Luminous",
      price: 10,
      category: "cosmetics",
      images: ["/products/hd-luminous.jpg"],
      details: {
        subtitle: "HD Luminous Foundation — Bright, camera-ready finish",
        size: "30 ml",
        features: ["Luminous finish", "Smooth look for photos", "Lightweight daily feel"],
        howToUse: "Apply a thin layer, then build only where needed. Set lightly to keep glow without shine.",
      },
    },

    // fragrances placeholders
    { id: 21, name: "Noir Eau de Parfum", price: 98, img: "https://via.placeholder.com/900x900", category: "fragrances" },
    { id: 22, name: "Citrus Mist", price: 72, img: "https://via.placeholder.com/900x900", category: "fragrances" },
    { id: 23, name: "Amber Veil", price: 110, img: "https://via.placeholder.com/900x900", category: "fragrances" },
  ];

  const categories = [
    { key: "cosmetics", label: "Cosmetics" },
    { key: "fragrances", label: "Fragrances" },
  ];

  // ✅ State (NO duplicates)
  const [selectedCategory, setSelectedCategory] = useState("cosmetics");
  const [cartItems, setCartItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Cart modal
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ Intro overlay (first thing you see)
  const [introOpen, setIntroOpen] = useState(true);

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

  // ✅ Intro: show only once per browser (unless you clear localStorage)
  useEffect(() => {
    const seen = localStorage.getItem("aurea_intro_seen");
    if (seen === "1") setIntroOpen(false);
  }, []);

  const closeIntro = () => {
    localStorage.setItem("aurea_intro_seen", "1");
    setIntroOpen(false);
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
        setCartOpen(false);
        setIntroOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // lock body scroll when drawer or modal open
  useEffect(() => {
    const locked = sidebarOpen || authOpen || learnMoreOpen || cartOpen || introOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [sidebarOpen, authOpen, learnMoreOpen, cartOpen, introOpen]);

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

      {/* ✅ INTRO OVERLAY (first page) */}
      {introOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 18,
          }}
        >
          <div
            style={{
              background: "#bfbfbf",
              padding: 28,
              borderRadius: 24,
              maxWidth: 980,
              width: "min(980px, 100%)",
              textAlign: "center",
              boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
            }}
          >
            <img
              src="/begin-experience.png"
              alt="Auréa intro"
              style={{ width: "100%", height: "auto", borderRadius: 18, display: "block" }}
            />

            <button
              onClick={closeIntro}
              style={{
                marginTop: 18,
                padding: "14px 28px",
                borderRadius: 14,
                border: "none",
                background: "#000",
                color: "#fff",
                fontWeight: 900,
                letterSpacing: "0.15em",
                cursor: "pointer",
              }}
            >
              BEGIN EXPERIENCE
            </button>
          </div>
        </div>
      )}

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

          {/* ✅ Cart bubble (opens cart modal) */}
          <button
            className="cartBubble"
            aria-label="Open cart"
            title="Your cart"
            onClick={() => setCartOpen(true)}
          >
            🛒
            {cartItems.length > 0 && <span className="cartBadge">{cartItems.length}</span>}
          </button>

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
            <div className="miniCardText">Authentic items • Curated selection</div>
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

      {/* ✅ Cart Modal (opens from top-right circle) */}
      <div className={`modal ${cartOpen ? "show" : ""}`} role="dialog" aria-modal="true">
        <div className="modalBackdrop" onClick={() => setCartOpen(false)} aria-label="Close cart modal" />
        <div className="modalCard">
          <div className="modalTop">
            <div>
              <div className="modalTitle">Your Cart</div>
              <div className="help">{cartItems.length} item(s)</div>
            </div>
            <button className="modalClose" onClick={() => setCartOpen(false)} aria-label="Close">✕</button>
          </div>

          <div className="modalBody">
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
                      setCartOpen(false);
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
                  <div className="imgWrap">
                    <img src={coverImg} alt={p.name} className="img" />
                  </div>

                  <div className="cardBody">
                    <div className="cardTop">
                      <h3 className="cardTitle">{p.name}</h3>
                      <div className="price">${Number(p.price).toFixed(2)}</div>
                    </div>

                    {/* ✅ Add to cart FIRST */}
                    <button className="btnPrimary" onClick={() => addToCart(p)}>
                      Add to Cart
                    </button>

                    {/* ✅ Learn more UNDER Add to cart */}
                    <button className="btnCheckout" type="button" onClick={() => openLearnMore(p)}>
                      Learn more
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Right side cart panel (still kept) */}
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
