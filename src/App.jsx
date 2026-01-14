import { useEffect, useMemo, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function App() {
  // ✅ PUT YOUR CLIENT ID HERE
  const GOOGLE_CLIENT_ID = "314819988108-qbrkln5dus1s209bv749oiq4kh53o094.apps.googleusercontent.com";

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
      display:flex; align-items:center; gap:14px;      padding:0 18px;
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

    /* Learn more button */
    .btnSecondary{
      width:100%;
      padding:11px 12px;
      border-radius:12px;
      border:1px solid rgba(0,0,0,0.12);
      background:#fff;
      font-weight:900;
      cursor:pointer;
      transition:transform 120ms ease, box-shadow 180ms ease;
    }
    .btnSecondary:hover{ transform:translateY(-1px); box-shadow:var(--shadow2); }

    .btnRow{
      display:flex;
      flex-direction:column;
      gap:10px;
    }

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

    /* Auth Modal */
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
      width:min(520px, 100%);
      border-radius:22px;
      border:1px solid var(--line);
      background:rgba(255,255,255,0.92);
      backdrop-filter: blur(14px);
      box-shadow:var(--shadow);
      overflow:hidden;
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

    /* Google button wrapper so it looks centered */
    .googleWrap{
      display:flex;
      justify-content:center;
      margin-top:6px;
    }

    /* Product modal (Learn more) */
    .pmodal{ position:fixed; inset:0; z-index:95; opacity:0; pointer-events:none; transition:opacity 180ms ease; }
    .pmodal.show{ opacity:1; pointer-events:auto; }
    .pmodalBackdrop{ position:absolute; inset:0; background:rgba(0,0,0,0.45); }
    .pmodalCard{
      position:relative;
      width:min(720px, 100%);
      margin:18px;
      border-radius:22px;
      border:1px solid var(--line);
      background:rgba(255,255,255,0.92);
      backdrop-filter: blur(14px);
      box-shadow:var(--shadow);
      overflow:hidden;
    }
    .pmodalBody{ padding:16px; display:grid; grid-template-columns: 220px 1fr; gap:16px; }
    .pmodalImg{ width:100%; aspect-ratio:1/1; border-radius:18px; object-fit:cover; background:#f2f2f3; }
    .pmodalH{ margin:0; font-size:18px; font-weight:900; }
    .pmodalSub{ margin:6px 0 0; color:var(--muted); font-size:13px; }
    .pmodalList{ margin:12px 0 0; padding-left:18px; color:var(--text); }
    .pmodalMeta{ margin-top:10px; color:var(--muted); font-size:12px; }
    .pmodalActions{ margin-top:14px; display:flex; gap:10px; }
    .pmodalClose{
      width:42px; height:42px;
      border-radius:12px;
      border:1px solid var(--line);
      background:rgba(255,255,255,0.9);
      cursor:pointer;
      display:flex; align-items:center; justify-content:center;
    }
    @media (max-width: 700px){
      .pmodalBody{ grid-template-columns:1fr; }
    }

    /* Responsive */
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
    }
    @media (max-width: 520px){
      .row2{ grid-template-columns: 1fr; }
    }
  `;

  const products = [
    // Cosmetics
    {
  id: 101,
  name: "Max Factor X 55 Beige",
  price: 13,
  img: "/products/maxfactor-x-55-beige.png",
  category: "cosmetics",
  details: {
    subtitle: "Smooth coverage foundation with a natural beige tone",
    features: [
      "Medium, buildable coverage",
      "Evens skin tone without heaviness",
      "Comfortable all-day wear",
      "Ideal for normal to combination skin"
    ],
    howToUse: "Apply evenly with a sponge or brush, blending outward from the center of the face."
  }
}
,
   {
  id: 102,
  name: "Max Factor Foundation SPF 20",
  price: 17,
  img: "/products/maxfactor-spf-20.png",
  category: "cosmetics",
  details: {
    subtitle: "Daily foundation with SPF 20 sun protection",
    features: [
      "Protects skin from UV damage",
      "Lightweight, breathable texture",
      "Natural radiant finish",
      "Perfect for everyday wear"
    ],
    howToUse: "Apply in the morning after skincare. Blend evenly for smooth coverage."
  }
}
,
    {
  id: 103,
  name: "L’Oréal Paris Nude Foundation",
  price: 20,
  img: "/products/loreal-nude.png",
  category: "cosmetics",
  details: {
    subtitle: "Bare-skin effect foundation with a nude finish",
    features: [
      "Ultra-light texture",
      "Natural skin-like look",
      "Does not clog pores",
      "Comfortable for long wear"
    ],
    howToUse: "Apply with fingers or sponge for a second-skin effect."
  }
}
,
   {
  id: 104,
  name: "L’Oréal Paris 24H Cool",
  price: 12,
  img: "/products/loreal-24h-cool.png",
  category: "cosmetics",
  details: {
    subtitle: "Long-lasting foundation with cool undertones",
    features: [
      "Up to 24-hour wear",
      "Resists fading and shine",
      "Smooth matte finish",
      "Ideal for cool-toned skin"
    ],
    howToUse: "Blend evenly using a brush or sponge. Build coverage as needed."
  }
}

,
   {
  id: 105,
  name: "HD Luminous Foundation",
  price: 10,
  img: "/products/hd-luminous.png",
  category: "cosmetics",
  details: {
    subtitle: "High-definition luminous finish foundation",
    features: [
      "Soft glow effect",
      "Blurs imperfections",
      "Light-reflecting pigments",
      "Great for photos and events"
    ],
    howToUse: "Apply lightly and blend well for a radiant finish."
  }
}
,

    // ✅ Your Max Factor product (image in /public/products/)
    {
      id: 9,
      name: "Max Factor X 101",
      price: 11,
      img: "products/Max_Factor_Closed_101_Ivory_Beige_PNG.png",
      category: "cosmetics",
      details: {
        subtitle: "Lasting Performance Foundation — Shade 101 Ivory Beige",
        size: "30–35 ml (varies by market)",
        features: ["High coverage, buildable finish", "Smudge-resistant & touch-proof", "Long-wear up to ~8 hours", "Oil-free feel"],
        howToUse: "Apply a small amount and blend outward with a sponge/brush. Build coverage where needed.",
      },
    },
{
  id: 106,
  name: "Miss Sporty Blush",
  price: 5,
  img: "/products/miss-sporty-blush.png",
  category: "cosmetics",
  details: {
    subtitle: "Fresh color blush for a natural glow",
    features: [
      "Smooth powder texture",
      "Easy to blend",
      "Buildable color",
      "Perfect for everyday makeup"
    ],
    howToUse: "Apply to the apples of the cheeks and blend outward."
  }
}
,
{
  id: 107,
  name: "Rimmel Mascara",
  price: 11,
  img: "/products/rimmel-mascara.png",
  category: "cosmetics",
  details: {
    subtitle: "Volumizing mascara for bold lashes",
    features: [
      "Adds volume and length",
      "Smudge-resistant formula",
      "Deep black pigment",
      "Long-lasting wear"
    ],
    howToUse: "Apply from lash roots to tips. Add extra coats for intensity."
  }
}
,
{
  id: 108,
  name: "Max Factor Color Elixir Lipstick",
  price: 6,
  img: "/products/maxfactor-color-elixir.png",
  category: "cosmetics",
  details: {
    subtitle: "Moisturizing lipstick with rich color payoff",
    features: [
      "Nourishing formula",
      "Smooth, creamy texture",
      "Hydrating finish",
      "Comfortable on lips"
    ],
    howToUse: "Apply directly to lips. Reapply as needed."
  }
}
,



















    // Women
   , { id: 6, name: "Silk Dress", price: 120, img: "https://via.placeholder.com/900x900", category: "women" },
    { id: 7, name: "Auréa Jacket", price: 180, img: "https://via.placeholder.com/900x900", category: "women" },
    { id: 8, name: "Tailored Pants", price: 95, img: "https://via.placeholder.com/900x900", category: "women" },

    // Men (placeholders — you can replace images later)
    { id: 10, name: "Essential Tee", price: 35, img: "https://via.placeholder.com/900x900", category: "men" },
    { id: 11, name: "Modern Overshirt", price: 110, img: "https://via.placeholder.com/900x900", category: "men" },
    { id: 12, name: "Straight Chino", price: 85, img: "https://via.placeholder.com/900x900", category: "men" },

    // Fragrances (placeholders — you can replace images later)
    { id: 13, name: "Noir Eau de Parfum", price: 98, img: "https://via.placeholder.com/900x900", category: "fragrances" },
    { id: 14, name: "Citrus Mist", price: 72, img: "https://via.placeholder.com/900x900", category: "fragrances" },
    { id: 15, name: "Amber Veil", price: 110, img: "https://via.placeholder.com/900x900", category: "fragrances" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("cosmetics");
  const [cartItems, setCartItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Auth UI state
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // "signin" | "signup"
  const [user, setUser] = useState(null); // { name, email, mode: "user" | "guest" }
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ Learn more modal state
  const [productOpen, setProductOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  // ✅ Categories: Cosmetics, Men, Women, Fragrances
  const categories = [
    { key: "cosmetics", label: "Cosmetics" },
    { key: "women", label: "Women" },
    { key: "men", label: "Men" },
    { key: "fragrances", label: "Fragrances" },
  ];

  const filteredProducts = useMemo(
    () => products.filter((p) => p.category === selectedCategory),
    [selectedCategory]
  );

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const addToCart = (product) => setCartItems((prev) => [...prev, product]);
  const removeFromCart = (index) => setCartItems((prev) => prev.filter((_, i) => i !== index));

  const learnMore = (product) => {
    setActiveProduct(product);
    setProductOpen(true);
  };

  const sectionTitle =
    selectedCategory === "cosmetics"
      ? "Cosmetics"
      : selectedCategory === "women"
      ? "Women"
      : selectedCategory === "men"
      ? "Men"
      : "Fragrances";

  // ESC closes drawer + modal
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
        setAuthOpen(false);
        setProductOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // lock body scroll when drawer OR auth modal OR product modal open
  useEffect(() => {
    const locked = sidebarOpen || authOpen || productOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [sidebarOpen, authOpen, productOpen]);

  const resetAuthForm = () =>
    setAuthForm({ name: "", email: "", password: "", confirmPassword: "" });

  const setMode = (mode) => {
    setAuthMode(mode);
    resetAuthForm();
  };

  const signIn = () => {
    if (!authForm.email.trim() || !authForm.password.trim()) return;

    setUser({
      name: authForm.email.split("@")[0] || "User",
      email: authForm.email.trim(),
      mode: "user",
    });
    setAuthOpen(false);
    resetAuthForm();
  };

  const signUp = () => {
    if (!authForm.name.trim() || !authForm.email.trim() || !authForm.password.trim()) return;
    if (authForm.password !== authForm.confirmPassword) return;

    setUser({
      name: authForm.name.trim(),
      email: authForm.email.trim(),
      mode: "user",
    });
    setAuthOpen(false);
    resetAuthForm();
  };

  const continueAsGuest = () => {
    setUser({ name: "Guest", email: "", mode: "guest" });
    setAuthOpen(false);
    resetAuthForm();
  };

  const signOut = () => setUser(null);

  // ✅ Decode Google JWT payload (client-side) for display only
  const decodeJwtPayload = (jwt) => {
    try {
      const payload = jwt.split(".")[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  // ✅ Google Sign-in handlers
  const onGoogleSuccess = (credentialResponse) => {
    const token = credentialResponse?.credential;
    if (!token) return;

    const payload = decodeJwtPayload(token);
    const name = payload?.name || payload?.given_name || "Google User";
    const email = payload?.email || "Verified by Google";

    setUser({ name, email, mode: "user" });
    setAuthOpen(false);
    resetAuthForm();
  };

  const onGoogleError = () => {
    alert("Google sign-in failed. Check Authorized JavaScript origins in Google Cloud.");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
              <button className="modalClose" onClick={() => setAuthOpen(false)} aria-label="Close">
                ✕
              </button>
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
                  {authForm.password && authForm.confirmPassword && authForm.password !== authForm.confirmPassword && (
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

                {/* ✅ Google Sign-in */}
                <div className="googleWrap">
                  <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} />
                </div>

                <button className="btnGhost" onClick={continueAsGuest}>
                  Continue as guest
                </button>

                <div className="help">(This is UI-only for now. Later you can connect to a backend.)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main */}
        <main className="main">
          <section>
            <div className="sectionHeader">
              <div>
                <h1 className="h1">{sectionTitle}</h1>
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

                    {/* ✅ ONLY ONE Learn more button (no duplicates) */}
                    <div className="btnRow">
                      <button className="btnSecondary" onClick={() => learnMore(p)} type="button">
                        Learn more
                      </button>

                      <button className="btnPrimary" onClick={() => addToCart(p)} type="button">
                        Add to Cart
                      </button>
                    </div>
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

                <button
                  className="btnCheckout"
                  onClick={() => {
                    if (!user) setAuthOpen(true);
                  }}
                >
                  Checkout
                </button>
                <div className="cartNote">{user ? "Secure checkout coming next." : "Sign in / sign up or continue as guest to proceed."}</div>
              </>
            )}
          </aside>
        </main>

        {/* Product Learn More Modal */}
        <div className={`pmodal ${productOpen ? "show" : ""}`} role="dialog" aria-modal="true">
          <div
            className="pmodalBackdrop"
            onClick={() => {
              setProductOpen(false);
              setActiveProduct(null);
            }}
            aria-label="Close product modal"
          />
          <div className="pmodalCard">
            <div className="modalTop">
              <div>
                <div className="modalTitle">Product</div>
                <div className="help">Details & usage</div>
              </div>
              <button
                className="pmodalClose"
                onClick={() => {
                  setProductOpen(false);
                  setActiveProduct(null);
                }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="pmodalBody">
              <img className="pmodalImg" src={activeProduct?.img} alt={activeProduct?.name || "Product"} />

              <div>
                <h3 className="pmodalH">{activeProduct?.name}</h3>
                <div className="pmodalSub">{activeProduct?.details?.subtitle || "More details coming soon."}</div>

                {activeProduct?.details?.features?.length ? (
                  <ul className="pmodalList">
                    {activeProduct.details.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                ) : null}

                {activeProduct?.details?.size ? <div className="pmodalMeta">Size: {activeProduct.details.size}</div> : null}
                {activeProduct?.details?.howToUse ? <div className="pmodalMeta">How to use: {activeProduct.details.howToUse}</div> : null}

                <div className="pmodalActions">
                  <button
                    className="btnPrimary"
                    type="button"
                    onClick={() => {
                      if (activeProduct) addToCart(activeProduct);
                      setProductOpen(false);
                      setActiveProduct(null);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btnGhost"
                    type="button"
                    onClick={() => {
                      setProductOpen(false);
                      setActiveProduct(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer">© 2026 auréa.com</footer>
      </div>
    </GoogleOAuthProvider>
  );
}
