import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from "react-router-dom";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

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

/** ✅ CSS (one file) */
const styles = `

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');
/* ============================= */
/*   AURÉA LUXURY HEADER LAYOUT  */
/* ============================= */

.ss-header{
  width:100%;
  background:#fff;
  border-bottom:1px solid rgba(0,0,0,0.08);
  position:sticky;
  top:0;
  z-index:999;
}
.ss-icon{
  width:18px;
  height:18px;
  stroke:#000;
  stroke-width:1.8;
  fill:none;
}

.ss-search-icon{
  width:18px;
  height:18px;
  stroke:#000;
  stroke-width:1.8;
  fill:none;
  flex-shrink:0;
}

/* Top info strip */
.ss-topstrip{
  height:36px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 24px;
  border-bottom:1px solid rgba(0,0,0,0.08);
  background:#fff;
  font-size:12px;
  color:#111;
}

.ss-topstrip-left,
.ss-topstrip-right{
  display:flex;
  align-items:center;
  gap:20px;
  font-weight:700;
  letter-spacing:0.04em;
}

.ss-topstrip-item{
  display:flex;
  align-items:center;
  gap:8px;
  opacity:0.9;
}

/* Main header row */
.ss-mainbar{
  height:64px;
  display:grid;
  grid-template-columns: 1fr auto 1fr;
  align-items:center;
  padding:0 28px;
}

/* Left search */
.ss-search{
  display:flex;
  align-items:center;
  gap:10px;
  max-width:320px;
}

.ss-search input{
  width:100%;
  height:42px;
  border:none;
  border-bottom:1px solid #000;
  font-size:13px;
  font-weight:700;
  outline:none;
  background:transparent;
  padding:0 6px;
}

.ss-search input::placeholder{
  letter-spacing:0.12em;
  font-weight:800;
}

/* Center logo */
.ss-logo{
  justify-self:center;
  font-family:'Playfair Display', serif;
  font-size:30px;
  font-weight:800;
  letter-spacing:0.18em;
  text-transform:lowercase;
  color:#000;
}

/* Right icons */
.ss-icons{
  justify-self:end;
  display:flex;
  align-items:center;
  gap:26px;
  font-weight:800;
  font-size:13px;
}

.ss-icon-btn{
  display:flex;
  align-items:center;
  gap:8px;
  cursor:pointer;
  background:none;
  border:none;
  font:inherit;
  color:#000;
  text-decoration:none; /* ✅ important for Link */
}


.ss-icon-btn:hover{
  opacity:0.7;
}

.ss-cart-count{
  font-weight:900;
}



.ss-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.ss-logo {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.ss-logo-main {
  color: #ffffff;
}

.ss-logo-accent { 
  color: #dcdcdc; 
  opacity: 0.9; 
}
 

/* Navigation */
.ss-nav {
  display: flex;
  gap: 28px;
}

.ss-nav a,
.ss-nav button {
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 500;
  transition: 0.2s ease;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  padding: 0;
}

.ss-nav a:hover,
.ss-nav button:hover {
  color: #ffffff;
}

.ss-nav a::after,
.ss-nav button::after {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 0%;
  height: 2px;
  background: #facc15;
  transition: 0.3s ease;
}

.ss-nav a:hover::after,
.ss-nav button:hover::after {
  width: 100%;
}

/* Actions */
.ss-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ss-login {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.25);
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
  font-weight: 600;
}

.ss-login:hover {
  border-color: #ffffff;
  color: #ffffff;
}

.ss-register {
  background: #ffffff;      /* ✅ white */
  border: none;
  color: #000000;           /* ✅ black text */
  padding: 8px 18px;
  border-radius: 8px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.ss-register:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255,255,255,0.18);
}


/* Burger menu */
.ss-burger {
  display: none;
  font-size: 24px;
  color: #ffffff;
  cursor: pointer;
}

/* Mobile */
@media (max-width: 900px) {
  .ss-nav {
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background: #000000;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px 0;
    display: none;
  }

  .ss-nav.active {
    display: flex;
  }

.ss-burger { display: none; }
@media (max-width: 900px) {
  .ss-burger { display: block; }
}

}
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

/* ✅ Dark mode overrides */
[data-theme="dark"]{
  --panel:#121214;
  --soft:#0b0b0d;
  --line:rgba(255,255,255,0.10);
  --text:#f2f2f3;
  --muted:rgba(242,242,243,0.62);
  --shadow:0 18px 60px rgba(0,0,0,0.45);
  --shadow2:0 10px 30px rgba(0,0,0,0.35);
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
  font-family: 'Playfair Display', serif;
  font-weight:800;
  letter-spacing:0.12em;
  font-size:26px;
  text-transform:lowercase;
}
.brand:hover{
  opacity:0.85;
}

/* ✅ Hamburger morph to X */
.iconBtn.active .hamburger{
  background:transparent;
}
.iconBtn.active .hamburger::before{
  top:0;
  transform:rotate(45deg);
}
.iconBtn.active .hamburger::after{
  top:0;
  transform:rotate(-45deg);
}
.hamburger, .hamburger::before, .hamburger::after{
  transition:transform 180ms ease, top 180ms ease, background 180ms ease;
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

.pillDot{
  width:8px; height:8px;
  border-radius:999px;
  background:#0e0e10;
  opacity:0.9;
}


/* ✅ Topbar search */
.topSearch{
  display:flex;
  gap:10px;
  align-items:center;
  max-width:520px;
}
.topSearch .input{
  height:42px;
  width:260px;
}
@media (max-width: 900px){
  .topSearch .input{ width:160px; }
}
@media (max-width: 520px){
  .topbar{
    flex-wrap:wrap;
    height:auto;
    padding:12px 14px;
    gap:10px;
  }

  .topSearch{
    display:flex;
    width:100%;
    max-width:none;
  }

  .topSearch .input{
    width:100%;
    flex:1;
  }

  .pill{ display:none; } /* keep hidden */
}
/* ✅ Brand banner carousel */
.brandCarousel{
  grid-column: 1 / -1;
  border-radius:22px;
  border:1px solid var(--line);
  overflow:hidden;
  box-shadow:var(--shadow2);
  background:var(--panel);
  position:relative;
}

.brandSlideBtn{
  width:100%;
  padding:0;
  border:none;
  background:transparent;
  cursor:pointer;
  display:block;
}

.brandSlideImg{
  width:100%;
  height:360px;
  object-fit:contain;
  display:block;
  background:#f2f2f3;
}
  .brandSlideBtn:hover .brandSlideImg{
  transform: scale(1.02);
  transition: transform 0.4s ease;
}


@media (max-width: 900px){
  .brandSlideImg{ height:220px; }
}

.brandDots{
  position:absolute;
  left:50%;
  bottom:12px;
  transform:translateX(-50%);
  display:flex;
  gap:8px;
  padding:8px 10px;
  border-radius:999px;
  background:rgba(0,0,0,0.35);
  backdrop-filter: blur(10px);
}

.brandDot{
  width:9px; height:9px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,0.7);
  background:transparent;
  cursor:pointer;
  padding:0;
}
.brandDot.active{
  background:#fff;
}

.brandHint{
  position:absolute;
  top:12px;
  left:12px;
  padding:10px 12px;
  border-radius:999px;
  background:rgba(0,0,0,0.35);
  color:#fff;
  font-weight:900;
  font-size:12px;
  letter-spacing:0.08em;
  text-transform:uppercase;
  backdrop-filter: blur(10px);
}
.brandLabel{
  position:absolute;
  bottom:20px;
  left:20px;
  padding:14px 18px;
  border-radius:14px;
  background:rgba(255,255,255,0.85);
  font-weight:900;
  font-size:20px;
  letter-spacing:0.04em;
  box-shadow:var(--shadow2);
}

.brandLabel{
  position:absolute;
  bottom:20px;
  left:20px;
  padding:14px 18px;
  border-radius:14px;
  background:rgba(250, 250, 250, 0.41);
  font-weight:900;
  font-size:20px;
  letter-spacing:0.04em;
  box-shadow:var(--shadow2);
}

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

/* ✅ Sidebar (closed by default; opens only when hamburger is pressed) */
.sidebar{
  position:fixed;
  top:72px; left:0; bottom:0;
  width:280px;
  background:var(--panel);
  border-right:1px solid var(--line);
  padding:18px;
  z-index:70;
  transform:translateX(-105%);
  transition:transform 220ms ease;
  box-shadow:var(--shadow);
}
.sidebar.open{ transform:translateX(0); }

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
  display:flex;
  width:42px; height:42px;
  border-radius:12px;
  border:1px solid var(--line);
  background:rgba(255,255,255,0.9);
  cursor:pointer;
  align-items:center;
  justify-content:center;
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

.sidebarFooter{ margin-top:16px; display:flex; flex-direction:column; gap:10px; }
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

.accountMini{
  padding:12px;
  border-radius:14px;
  border:1px solid var(--line);
  background:#fff;
}
.accountMiniTop{
  display:flex; align-items:center; justify-content:space-between; gap:10px;
}
.accountName{ font-weight:900; font-size:13px; }
.accountEmail{ margin-top:4px; color:var(--muted); font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.accountActions{ margin-top:10px; display:flex; gap:10px; }
.smallBtn{
  flex:1;
  height:38px;
  border-radius:12px;
  border:1px solid var(--line);
  background:#fff;
  font-weight:900;
  cursor:pointer;
}
.smallBtn.primary{ background:#0e0e10; color:#fff; border-color:rgba(0,0,0,0.15); }

/* Main layout */
.main{
  display:grid;
  grid-template-columns: 1fr ;
  gap:18px;
  padding:22px 22px 0;
  max-width:1280px;
  margin:0 auto;
  margin-left:0;
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
  cursor:pointer;
}
.card:hover{ transform:translateY(-2px); box-shadow:var(--shadow); }
.imgWrap{ background:#f2f2f3; aspect-ratio:1/1; overflow:hidden; position:relative; }
.img{
  width:100%;
  height:100%;
  object-fit:contain;         /* ✅ no crop */
  display:block;
  background:#f2f2f3;         /* ✅ nice backdrop for transparent/empty space */
  padding:10px;               /* ✅ gives breathing room */
  box-sizing:border-box;
}
.cardBody{ padding:14px; display:flex; flex-direction:column; gap:10px; }
.cardTop{ display:flex; align-items:flex-start; justify-content:space-between; gap:10px; }
.cardTitle{ margin:0; font-size:14px; font-weight:900; }
.price{ font-weight:900; font-size:14px; }

.wishBtn{
  position:absolute;
  top:10px; right:10px;
  width:40px; height:40px;
  border-radius:999px;
  border:1px solid var(--line);
  background:rgba(255,255,255,0.92);
  cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 10px 24px rgba(0,0,0,0.08);
}
.wishBtn.active{
  background:#0e0e10;
  color:#fff;
  border-color:rgba(0,0,0,0.2);
}
.wishBtn:hover{ transform:translateY(-1px); }

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

.btnCheckout{
  width:100%;
  margin-top:0;
  padding:12px 12px;
  border-radius:12px;
  border:1px solid rgba(0,0,0,0.12);
  background:#fff;
  font-weight:900;
  cursor:pointer;
  transition:transform 120ms ease, box-shadow 180ms ease;
}
.btnCheckout:hover{ transform:translateY(-1px); box-shadow:var(--shadow2); }

.searchBtn{
  height:42px;
  padding:0 14px;
  border-radius:12px;
  border:1px solid rgba(0,0,0,0.12);
  background:#0e0e10;
  color:#fff;
  font-weight:900;
  cursor:pointer;
  transition:transform 120ms ease, opacity 180ms ease;
  white-space:nowrap;
}
.searchBtn:hover{ transform:translateY(-1px); }
.searchBtn:active{ transform:translateY(0px); opacity:0.92; }

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
.cartMeta{ color:var(--muted); font-size:12px; margin-top:4px; }
.removeBtn{
  border:none;
  background:transparent;
  color:#b00020;
  cursor:pointer;
  font-weight:800;
}

.qtyBox{
  display:flex; align-items:center; gap:8px;
  margin-top:8px;
}
.qtyBtn{
  width:34px; height:34px;
  border-radius:10px;
  border:1px solid var(--line);
  background:#fff;
  cursor:pointer;
  font-weight:900;
}
.qtyNum{
  min-width:24px;
  text-align:center;
  font-weight:900;
}

.summary{
  margin-top:12px;
  padding-top:12px;
  border-top:1px solid var(--line);
  display:flex;
  flex-direction:column;
  gap:8px;
  font-size:13px;
}
.sumRow{
  display:flex; justify-content:space-between; align-items:center; gap:12px;
  color:var(--muted);
}
.sumRow b{ color:var(--text); }
.sumRow.total{
  padding-top:10px;
  margin-top:6px;
  border-top:1px solid var(--line);
  color:var(--text);
  font-size:14px;
}
.badge{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid var(--line);
  background:#fff;
  font-size:12px;
  color:var(--muted);
}

.promoBox{
  margin-top:12px;
  padding:12px;
  border-radius:16px;
  border:1px solid var(--line);
  background:linear-gradient(180deg,#fff,#fafafa);
}
.promoRow{
  display:flex; gap:10px; align-items:center;
}
.promoRow .input{ height:42px; }
.promoMsg{
  margin-top:8px;
  font-size:12px;
  color:var(--muted);
}
.promoMsg.ok{ color:#0b6b2e; font-weight:900; }
.promoMsg.bad{ color:#b00020; font-weight:900; }

.cartNote{ margin-top:10px; color:var(--muted); font-size:12px; text-align:center; }

.footer{
  margin-left:0;
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
  width:min(760px, 100%);
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
  width:100%;
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

/* Product Page */
.productWrap{
  max-width:1100px;
  margin:0 auto;
  padding:22px;
  display:grid;
  gap:18px;
}
.productCard{
  border:1px solid var(--line);
  background:#fff;
  border-radius:22px;
  box-shadow:var(--shadow2);
  overflow:hidden;
}
.productTop{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:16px;
  border-bottom:1px solid var(--line);
}
.backLink{
  display:inline-flex;
  gap:8px;
  align-items:center;
  text-decoration:none;
  font-weight:900;
  color:var(--text);
  padding:10px 12px;
  border-radius:12px;
  border:1px solid var(--line);
  background:rgba(255,255,255,0.9);
}
.productBody{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:16px;
  padding:16px;
}
.pImgWrap{
  border:1px solid var(--line);
  border-radius:18px;
  overflow:hidden;
  background:#f2f2f3;
  aspect-ratio: 1 / 1;        /* ✅ keeps a clean frame */
  display:flex;
  align-items:center;
  justify-content:center;
}

.pImg{
  width:100%;
  height:100%;
  object-fit:contain;         /* ✅ no crop */
  padding:12px;
  box-sizing:border-box;
  display:block;
  }
  .thumbRow{
  margin-top:10px;
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}
.thumbBtn{
  width:70px; height:70px;
  padding:0;
  border-radius:12px;
  border:1px solid var(--line);
  background:#fff;
  cursor:pointer;
  overflow:hidden;
}
.thumbBtn.active{ border-color:#0e0e10; }
.thumbImg{
  width:100%;
  height:100%;
  object-fit:contain;         /* ✅ no crop */
  background:#f2f2f3;
  padding:6px;
  box-sizing:border-box;
  display:block;
}


.sizeRow{
  margin-top:14px;
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}
.sizeBtn{
  height:42px;
  padding:0 14px;
  border-radius:12px;
  border:1px solid var(--line);
  background:#fff;
  cursor:pointer;
  font-weight:900;
}
.sizeBtn.active{
  background:#0e0e10;
  color:#fff;
  border-color:rgba(0,0,0,0.2);
}

.pageWrap{
  max-width:1100px;
  margin:0 auto;
  padding:22px;
}
.pageCard{
  border:1px solid var(--line);
  background:#fff;
  border-radius:22px;
  box-shadow:var(--shadow2);
  padding:18px;
}
.pageTitle{
  margin:0;
  font-size:26px;
  font-weight:900;
}
.pageSub{
  margin-top:8px;
  color:var(--muted);
}

/* Responsive */
@media (max-width: 1100px){
  .grid{ grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .main{ grid-template-columns: 1fr; }
}
@media (max-width: 900px){
  .grid{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .main{ grid-template-columns: 1fr; }
  .cart{ position:relative; top:auto; }
  .pill{ display:none; }
  .productBody{ grid-template-columns: 1fr; }
}
@media (max-width: 620px){
  .grid{
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap:10px;
  }
  .cardBody{ padding:10px 12px; }
  .cardTitle{ font-size:13px; }
  .price{ font-size:12px; }
}
@media (max-width: 520px){
  .row2{ grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce){
  *{ transition:none !important; }
}


  .cardBody{
    padding:10px 12px;
}
.cardTitle{ font-size:13px; }
  .price{
    font-size:12px;
  }
  
/* ===== FIX EXTRA WHITE SPACE ABOVE TRUST STRIP ===== */

.trustStrip{
  margin-top: 0 !important;
  padding-top: 18px !important;
}

.footer{
  margin-top: 0 !important;
  padding-top: 12px !important;
}
  /* ============================= */
/* ✅ FIX: Cart Drawer Styling   */
/* ============================= */

.cartDrawerOverlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.45);
  opacity:0;
  pointer-events:none;
  transition:opacity 200ms ease;
  z-index:95;
}
.cartDrawerOverlay.show{
  opacity:1;
  pointer-events:auto;
}

.cartDrawer{
  position:fixed;
  top:0;
  right:0;
  height:100vh;
  width:min(420px, 92vw);
  background:var(--panel);
  border-left:1px solid var(--line);
  box-shadow:var(--shadow);
  transform:translateX(105%);
  transition:transform 220ms ease;
  z-index:96;
  display:flex;
  flex-direction:column;
}
.cartDrawer.open{
  transform:translateX(0);
}

.cartDrawerHeader{
  padding:16px 16px 12px;
  border-bottom:1px solid var(--line);
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:12px;
}

.cartDrawerTitle{
  font-weight:900;
  font-size:14px;
  letter-spacing:0.10em;
  text-transform:uppercase;
}
.cartDrawerSub{
  margin-top:6px;
  font-size:12px;
  color:var(--muted);
  font-weight:800;
}

.cartDrawerBody{
  padding:14px 16px 16px;
  overflow:auto;
  flex:1;
}

/* ============================= */
/* ✅ FIX: Trust Strip Styling   */
/* ============================= */

.trustStrip{
  width:100%;
  border-top:1px solid var(--line);
  background:var(--panel);
}

.trustStripInner{
  max-width:1280px;
  margin:0 auto;
  padding:16px 22px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:28px;
  flex-wrap:wrap;
}

.trustItem{
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 12px;
  border-radius:999px;
  border:1px solid var(--line);
  background:rgba(255,255,255,0.75);
}

[data-theme="dark"] .trustItem{
  background:rgba(18,18,20,0.7);
}

.trustIcon{
  width:34px;
  height:34px;
  border-radius:999px;
  border:1px solid var(--line);
  display:flex;
  align-items:center;
  justify-content:center;
  background:var(--soft);
}

.trustImg{
  width:18px;
  height:18px;
  object-fit:contain;
  display:block;
}

.trustText{
  font-weight:900;
  letter-spacing:0.02em;
  font-size:12px;
  color:var(--text);
}
.trustText span{
  font-weight:800;
  color:var(--muted);
  margin-left:6px;
}

/* ============================= */
/* ✅ FIX: Header style conflict */
/* ============================= */
/* You have TWO .ss-logo blocks; keep the "luxury" one.
   This forces the logo in the header to stay black + Playfair. */
.ss-header .ss-logo{
  font-family:'Playfair Display', serif;
  font-size:30px;
  font-weight:800;
  letter-spacing:0.18em;
  text-transform:lowercase;
  color:#000;
  text-decoration:none;
}

section{
  margin-bottom: 0 !important;
}

@media (max-width: 520px){ .row2{ grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce){ *{ transition:none !important; } }
`;

/** ✅ Products */
 /** ✅ Products (ALL updated to have 3 images each — JPG) */
const products = [
  // Cosmetics
  {
    id: 9,
    name: "MAxFactor X 101",
    price: 10,
    category: "cosmetics",
    images: [
      "/products/maxfactor-101.jpg",
      "/products/maxfactor-101-2.jpg",
    ],
    details: {
      subtitle: "Foundation — Shade 101 (light tone)",
      size: "30 ml",
      features: ["Buildable coverage (light → medium)", "Smooth, natural-looking finish", "Best for everyday wear"],
      howToUse: "(App)ly 1–2 pumps to clean, moisturized skin. Blend from center outward using a sponge or brush.",
    },
  },
  {
    id: 10,
    name: "MaxFactor X 55 BEIGE",
    price: 12,
    category: "cosmetics",
    images: [
      "/products/maxfactor55beige.jpg",
    ],
    details: {
      subtitle: "Foundation — Shade 55s Beige (medium tone)",
      size: "30 ml",
      features: ["Medium coverage for an even tone", "Comfortable wear with a soft finish", "Great for daily looks"],
      howToUse: "Dot small amounts on cheeks/forehead/chin, then blend evenly. Add a second layer where needed.",
    },
  },
  {
    id: 11,
    name: "MaxFactor SPF 20",
    price: 11,
    category: "cosmetics",
    images: [
      "/products/maxfactorspf20.jpg",
    ],
    details: {
      subtitle: "Foundation with SPF 20 — Everyday base",
      size: "30 ml",
      features: ["Evens skin tone with medium coverage", "SPF 20 (bonus protection)", "Pairs well with setting powder"],
      howToUse: "Apply after skincare. Blend well along jawline/neck. For longer wear, set lightly with powder.",
    },
  },
{
  id: 401,
  name: "Rimmel Lip Art Graphic Lipstick",
  price: 9,
  category: "cosmetics",
  images: [
    "/products/rimmel-lip-art-graphic.jpg",
    "/products/rimmel-lip-art-graphic-2.jpg",
    "/products/rimmel-lip-art-graphic-3.jpg",
  ],
  details: {
    subtitle: "Liquid lipstick + lip liner in one",
    features: [
      "2-in-1 lip liner and lipstick",
      "High precision application",
      "Long-lasting matte finish",
    ],
  },
},
{
  id: 402,
  name: "Max Factor Pan Stik Foundation",
  price: 9,
  category: "cosmetics",
  images: [
    "/products/maxfactor-pan-stik-foundation.jpg",
    "/products/maxfactor-pan-stik-foundation-2.jpg",
    "/products/maxfactor-pan-stik-foundation-3.jpg",
  ],
  details: {
    subtitle: "Full coverage stick foundation",
    features: [
      "Creamy blendable formula",
      "Covers imperfections instantly",
      "Perfect for all skin types",
    ],
  },
},
{
  id: 403,
  name: "Max Factor Lipfinity Lip Colour 020 Angelic",
  price: 9,
  category: "cosmetics",
  images: [
    "/products/maxfactor-lipfinity-020-angelic.jpg",
    "/products/maxfactor-lipfinity-020-angelic-2.jpg",
  ],
  details: {
    subtitle: "24H long-lasting liquid lipstick",
    features: [
      "Up to 24 hours wear",
      "Smudge and transfer resistant",
      "Includes moisturizing top coat",
    ],
  },
},
{
  id: 404,
  name: "Max Factor Lipfinity Lipstick",
  price: 5,
  category: "cosmetics",
  images: [
    "/products/maxfactor-lipfinity-gold.jpg",
    "/products/maxfactor-lipfinity-gold-2.jpg",
    "/products/maxfactor-lipfinity-gold-3.jpg",
  ],
  details: {
    subtitle: "Long-lasting moisturizing lipstick",
    features: [
      "Smooth creamy texture",
      "High shine finish",
      "Comfortable all-day wear",
    ],
  },
},
{
  id: 405,
  name: "Bourjois Little Round Pot Eyeshadow",
  price: 10,
  category: "cosmetics",
  images: [
    "/products/bourjois-little-round-pot-eyeshadow.jpg",
    "/products/bourjois-little-round-pot-eyeshadow-2.jpg",
   
  ],
  details: {
    subtitle: "Silky baked eyeshadow",
    features: [
      "Ultra soft texture",
      "Long-lasting color",
      "Easy to blend",
    ],
  },
},
{
  id: 407,
  name: "Bourjois Always Fabulous Stick Foundation",
  price: 8,
  category: "cosmetics",
  images: [
    "/products/bourjois-always-fabulous-stick-foundation.jpg",
  ],
  details: {
    subtitle: "Long-lasting stick foundation",
    features: [
      "Full coverage",
      "Natural matte finish",
      "Easy on-the-go application",
    ],
  },
},
{
  id: 408,
  name: "Max Factor Eyeshadow Palette Nude",
  price: 7,
  category: "cosmetics",
  images: [
    "/products/maxfactor-eyeshadow-palette-nude.jpg",
  ],
  details: {
    subtitle: "Neutral everyday eye palette",
    features: [
      "Blendable shades",
      "Includes applicator",
      "Perfect for day and night looks",
    ],
  },
},
{
  id: 409,
  name: "Radiance Reveal Concealer",
  price: 9,
  category: "cosmetics",
  images: [
    "/products/radiance-reveal-concealer.jpg",
  
  ],
  details: {
    subtitle: "Hydrating liquid concealer",
    features: [
      "Brightens under eyes",
      "Hydrates for 24H",
      "Natural radiant finish",
    ],
  },
},
{
  id: 410,
  name: "Rimmel Lasting Finish Powder 25H",
  price: 4,
  category: "cosmetics",
  images: [
    "/products/rimmel-lasting-finish-powder.jpg",
    "/products/rimmel-lasting-finish-powder-2.jpg",
  ],
  details: {
    subtitle: "Long-wear powder foundation",
    features: [
      "Up to 25H wear",
      "Controls shine",
      "Smooth flawless finish",
    ],
  },
},


  // Clothing (Women)
  {
    id: 101,
    name: "Women’s Satin Blouse",
    price: 29,
    category: "clothing",
    gender: "women",
    images: [
      "https://via.placeholder.com/900x900?text=Women+Blouse+1",
      "https://via.placeholder.com/900x900?text=Women+Blouse+2",
      "https://via.placeholder.com/900x900?text=Women+Blouse+3",
    ],
    details: {
      subtitle: "Soft satin, relaxed fit",
      size: "S • M • L",
      features: ["Breathable feel", "Day-to-night style", "Easy to pair"],
      howToUse: "Pair with high-waist jeans or a skirt. Steam lightly before wear.",
    },
  },
  {
    id: 102,
    name: "Women’s Tailored Trousers",
    price: 39,
    category: "clothing",
    gender: "women",
    images: [
      "https://via.placeholder.com/900x900?text=Women+Trousers+1",
      "https://via.placeholder.com/900x900?text=Women+Trousers+2",
      "https://via.placeholder.com/900x900?text=Women+Trousers+3",
    ],
    details: {
      subtitle: "High-rise, straight leg",
      size: "XS • S • M • L",
      features: ["Flattering cut", "Comfort stretch", "Office-ready"],
      howToUse: "Wear with heels or sneakers. Add a blazer for a clean look.",
    },
  },

  // Clothing (Men)
  {
    id: 201,
    name: "Men’s Essential Tee",
    price: 18,
    category: "clothing",
    gender: "men",
    images: [
      "https://via.placeholder.com/900x900?text=Men+Tee+1",
      "https://via.placeholder.com/900x900?text=Men+Tee+2",
      "https://via.placeholder.com/900x900?text=Men+Tee+3",
    ],
    details: {
      subtitle: "Heavy cotton, classic cut",
      size: "S • M • L • XL",
      features: ["Soft handfeel", "Everyday staple", "Durable neckline"],
      howToUse: "Layer under overshirts or wear solo. Cold wash to keep shape.",
    },
  },
  {
    id: 202,
    name: "Men’s Overshirt Jacket",
    price: 55,
    category: "clothing",
    gender: "men",
    images: [
      "https://via.placeholder.com/900x900?text=Men+Overshirt+1",
      "https://via.placeholder.com/900x900?text=Men+Overshirt+2",
      "https://via.placeholder.com/900x900?text=Men+Overshirt+3",
    ],
    details: {
      subtitle: "Midweight layering piece",
      size: "M • L • XL",
      features: ["Easy layering", "Clean minimal design", "All-season"],
      howToUse: "Wear open over a tee or buttoned up. Perfect for evenings.",
    },
},
// ✅ then id: 301 starts as a new object:
{
    id: 301,
    name: "Max Factor Colour Adapt Foundation 80 Bronze",
    price: 11,
    category: "cosmetics",
    images: [
      "/products/maxfactor-colour-adapt-80-bronze.jpg",
    ],
    details: {
      subtitle: "Skin tone adapting liquid foundation",
      size: "30 ml",
      features: [
        "Adapts to your natural skin tone",
        "Light to medium coverage",
        "Smooth, natural finish",
      ],
      howToUse:
        "Apply 1–2 pumps to clean skin and blend evenly using a sponge or brush.",
    },
  },

  {
    id: 302,
    name: "Bourjois Paris Blush 74 Rose Ambré",
    price: 16,
    category: "cosmetics",
    images: [
      "/products/bourjois-blush-74-rose-ambre.jpg",
      "/products/bourjois-blush-74-rose-ambre-2.jpg",
      "/products/bourjois-blush-74-rose-ambre-3.jpg",
    ],
    details: {
      subtitle: "Soft compact blush with brush",
      size: "2.5 g",
      features: [
        "Natural rosy glow",
        "Silky smooth texture",
        "Buildable color payoff",
      ],
      howToUse:
        "Smile and sweep lightly over the apples of your cheeks, blending upward.",
    },
  },

  {
    id: 303,
    name: "Bourjois Paris Bronzing Powder 10 Châtaigne Dorée",
    price: 12,
    category: "cosmetics",
    images: [
      "/products/bourjois-bronzer-10-chataigne-doree.jpg",
      "/products/bourjois-bronzer-10-chataigne-doree-2.jpg",
      "/products/bourjois-bronzer-10-chataigne-doree-3.jpg",
    ],
    details: {
      subtitle: "Sun-kissed bronzing powder",
      size: "10 g",
      features: [
        "Warm golden bronze shade",
        "Lightweight blendable powder",
        "Natural sun-kissed finish",
      ],
      howToUse:
        "Apply to cheekbones, temples, and jawline using a fluffy brush.",
    },
  },
{
  id: 308,
  name: "Max Factor Kohl Pencil Blue",
  price: 4,
  category: "cosmetics",
  images: [
    "/products/maxfactor-kohl-pencil.jpg",
    "/products/maxfactor-kohl-pencil-2.jpg",
    "/products/maxfactor-kohl-pencil-3.jpg",
  ],
  details: {
    subtitle: "Smooth eyeliner pencil — Blue shade",
    size: "1.2 g",
    features: [
      "Soft, easy-glide formula",
      "Intense blue color payoff",
      "Perfect for everyday and evening looks",
    ],
    howToUse:
      "Apply along the upper or lower lash line. Smudge gently for a softer look.",
  },
},

  {
    id: 304,
    name: "Max Factor Miracle Glow Duo Pro Illuminator",
    price: 7,
    category: "cosmetics",
    images: [
      "/products/maxfactor-miracle-glow-duo.jpg",
      "/products/maxfactor-miracle-glow-duo-2.jpg",
    ],
    details: {
      subtitle: "Dual-tone highlighter compact",
      size: "6 g",
      features: [
        "Soft radiant glow",
        "Two complementary shades",
        "Enhances natural features",
      ],
      howToUse:
        "Apply to cheekbones, nose bridge, and cupid’s bow for a luminous finish.",
    },
  },

  {
    id: 305,
    name: "Miss Sporty Designer All In One Eye Palette Metal",
    price: 5,
    category: "cosmetics",
    images: [
      "/products/miss-sporty-designer-eye-palette-metal.jpg",
      "/products/miss-sporty-designer-eye-palette-metal-2.jpg",
      "/products/miss-sporty-designer-eye-palette-metal-3.jpg",
    ],
    details: {
      subtitle: "Metallic all-in-one eyeshadow palette",
      size: "8 g",
      features: [
        "Multiple metallic shades",
        "Smooth blendable texture",
        "Day to night looks",
      ],
      howToUse:
        "Apply light shades on lid and darker tones in crease for depth.",
    },
  },

  {
    id: 306,
    name: "Miss Sporty Designer Duo Sculpting Blush & Highlight",
    price: 2.5,
    category: "cosmetics",
    images: [
      "/products/100peachy.jpg",
      "/products/100peachy2.jpg",
    ],
    details: {
      subtitle: "Blush and highlighter duo compact",
      size: "6 g",
      features: [
        "Blush + highlight in one",
        "Natural sculpted look",
        "Soft luminous finish",
      ],
      howToUse:
        "Apply blush to cheeks and highlight to high points of the face.",
    },
  },

  {
    id: 307,
    name: "Rimmel London Lasting Radiance Concealer & Eye Illuminator",
    price: 6,
    category: "cosmetics",
    images: [
      "/products/rimmel-lasting-radiance-concealer.jpg",
      "/products/rimmel-lasting-radiance-concealer-2.jpg",
      "/products/rimmel-lasting-radiance-concealer-3.jpg",
    ],
    details: {
      subtitle: "Concealer with illuminating effect",
      size: "7 ml",
      features: [
        "Brightens under eyes",
        "Covers dark circles and blemishes",
        "Natural radiant finish",
      ],
      howToUse:
        "Apply under eyes and on imperfections, then blend with finger or sponge.",
    },
  },
 {
    id: 501,
    name: "Max Factor Colour Elixir Lipstick 010 Starlight Coral",
    price: 9,
    category: "cosmetics",
    images: [
      "/products/maxfactor-colour-elixir-010-starlight-coral.jpg",
      "/products/maxfactor-colour-elixir-010-starlight-coral-2.jpg",
      "/products/maxfactor-colour-elixir-010-starlight-coral-3.jpg",
    ],
    details: {
      subtitle: "Moisturising colour lipstick",
      features: ["Creamy comfort", "Rich colour payoff", "Smooth finish"],
      howToUse: "Apply directly to lips. Layer for more intensity.",
    },
  },

  {
    id: 502,
    name: "Max Factor Colour Elixir Lipstick 015 Nude Glory",
    price: 9,
    category: "cosmetics",
    images: [
      "/products/maxfactor-colour-elixir-015-nude-glory.jpg",
      "/products/maxfactor-colour-elixir-015-nude-glory-2.jpg",
      "/products/maxfactor-colour-elixir-015-nude-glory-3.jpg",
    ],
    details: {
      subtitle: "Moisturising nude lipstick",
      features: ["Everyday nude shade", "Hydrating feel", "Soft shine"],
      howToUse: "Apply from the center outward. Reapply as needed.",
    },
  },

  {
    id: 503,
    name: "Max Factor Mastertouch Concealer",
    price: 8.5,
    category: "cosmetics",
    images: [
      "/products/maxfactor-mastertouch-concealer.jpg",
      "/products/maxfactor-mastertouch-concealer-2.jpg",
      "/products/maxfactor-mastertouch-concealer-3.jpg",
    ],
    details: {
      subtitle: "Concealer with precision applicator",
      features: ["Targets dark circles", "Buildable coverage", "Natural finish"],
      howToUse: "Apply under eyes or on blemishes, then blend gently.",
    },
  },

  {
    id: 504,
    name: "Rimmel London Stay Matte Liquid",
    price: 5,
    category: "cosmetics",
    images: [
      "/products/rimmel-stay-matte-liquid.jpg",
      "/products/rimmel-stay-matte-liquid-2.jpg",
      "/products/rimmel-stay-matte-liquid-3.jpg",
    ],
    details: {
      subtitle: "Liquid foundation with matte finish",
      features: ["Shine control", "Lightweight feel", "Smooth matte look"],
      howToUse: "Blend evenly with sponge or brush. Set if needed.",
    },
  },

  {
    id: 505,
    name: "Max Factor Masterpiece Liquid Eyeliner 002 Charcoal Black",
    price: 16,
    category: "cosmetics",
    images: [
      "/products/maxfactor-masterpiece-liquid-eyeliner-002-charcoal-black.jpg",
      "/products/maxfactor-masterpiece-liquid-eyeliner-002-charcoal-black-2.jpg",
      "/products/maxfactor-masterpiece-liquid-eyeliner-002-charcoal-black-3.jpg",
    ],
    details: {
      subtitle: "Liquid eyeliner — Charcoal Black",
      features: ["Precise tip", "Bold definition", "Smooth application"],
      howToUse: "Trace along lash line. Build thickness for a wing.",
    },
  },

  {
    id: 506,
    name: "Bourjois Liner Reveal Liquid Eyeliner 01 Shiny Black",
    price: 14,
    category: "cosmetics",
    images: [
      "/products/bourjois-liner-reveal-01-shiny-black.jpg",
      "/products/bourjois-liner-reveal-01-shiny-black-2.jpg",
      "/products/bourjois-liner-reveal-01-shiny-black-3.jpg",
    ],
    details: {
      subtitle: "Liquid eyeliner — Shiny Black",
      features: ["Glossy black finish", "Easy glide", "Sharp lines"],
      howToUse: "Apply close to lash line. Let dry before blinking fully.",
    },
  },

  {
    id: 507,
    name: "Max Factor Masterpiece High Precision Liquid Eyeliner",
    price: 8,
    category: "cosmetics",
    images: [
      "/products/maxfactor-masterpiece-high-precision-eyeliner.jpg",
      "/products/maxfactor-masterpiece-high-precision-eyeliner-2.jpg",
      "/products/maxfactor-masterpiece-high-precision-eyeliner-3.jpg",
    ],
    details: {
      subtitle: "High precision liquid eyeliner",
      features: ["Ultra-precise applicator", "Intense definition", "Quick-dry"],
      howToUse: "Draw thin line for day, thicken for drama. Allow to set.",
    },
  },

  {
    id: 508,
    name: "L'Oréal Paris True Match Nude Plumping Tinted Serum 2-3 Light",
    price: 12,
    category: "cosmetics",
    images: [
      "/products/loreal-true-match-nude-serum-2-3-light.jpg",
      "/products/loreal-true-match-nude-serum-2-3-light-2.jpg",
      "/products/loreal-true-match-nude-serum-2-3-light-3.jpg",
    ],
    details: {
      subtitle: "Plumping tinted serum — Shade 2-3 Light",
      features: ["Lightweight serum feel", "Natural glow", "Evens skin tone"],
      howToUse: "Shake well. Apply a few drops and blend with fingers or sponge.",
    },
  },

  {
    id: 509,
    name: "L'Oréal Paris True Match Super-Blendable Foundation",
    price: 10,
    category: "cosmetics",
    images: [
      "/products/loreal-true-match-super-blendable-foundation.jpg",
      "/products/loreal-true-match-super-blendable-foundation-2.jpg",
    ],
    details: {
      subtitle: "Super-blendable foundation",
      features: ["Smooth blend", "Natural-looking coverage", "Everyday wear"],
      howToUse: "Apply from center outward and blend. Build coverage as needed.",
    },
  },
];



const categories = [
  { key: "cosmetics", label: "Cosmetics" },
  { key: "clothing", label: "Clothing" },
];

const PROMOS = {
  AUREA10: { type: "percent", value: 10, label: "10% off" },
  AUREA15: { type: "percent", value: 15, label: "15% off" },
  SAVE5: { type: "fixed", value: 5, label: "$5 off" },
  FREESHIP: { type: "freeship", value: 0, label: "Free shipping" },
};

const SHIPPING_FEE = 7.99;
const FREE_SHIPPING_THRESHOLD = 75;

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function parseSizes(sizeStr) {
  if (!sizeStr) return [];
  // "XS • S • M • L" -> ["XS","S","M","L"]
  return sizeStr
    .split(/•|·|,|\|/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

/** ✅ Product page */
function ProductPage({ products, wishlistIds, toggleWishlist, addToCart }) {
  const { id } = useParams();
  const pid = Number(id);
  const p = products.find((x) => Number(x.id) === pid);

  const [activeImage, setActiveImage] = useState("");
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");

 useEffect(() => {
  const first = p?.images?.[0] || p?.img || "";
  setActiveImage(first);
  setQty(1);
  setSize("");
}, [pid, p]);
 // eslint-disable-line react-hooks/exhaustive-deps

  if (!p) {
    return (
      <div className="pageWrap">
        <div className="pageCard">
          <h1 className="pageTitle">Product not found</h1>
          <p className="pageSub">This product doesn’t exist (ID: {id}).</p>
          <div style={{ marginTop: 14 }}>
            <Link className="backLink" to="/">← Back to shop</Link>
          </div>
        </div>
      </div>
    );
  }

  const images = p.images || (p.img ? [p.img] : []);
  const isWished = wishlistIds.includes(p.id);

  const sizeOptions = p.category === "clothing" ? parseSizes(p?.details?.size) : [];
  const needsSize = p.category === "clothing" && sizeOptions.length > 0;

  const add = () => {
    if (needsSize && !size) {
      alert("Please choose a size first.");
      return;
    }
    addToCart(p, { qty, size: needsSize ? size : "" });
  };

  return (
    <div className="productWrap">
      <div className="productCard">
        <div className="productTop">
          <Link className="backLink" to="/">← Back to shop</Link>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              className={`smallBtn ${isWished ? "primary" : ""}`}
              style={{ width: 44, flex: "none" }}
              onClick={() => toggleWishlist(p.id)}
              type="button"
              title={isWished ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isWished ? "♥" : "♡"}
            </button>
            <div style={{ fontWeight: 900 }}>{money(p.price)}</div>
          </div>
        </div>

        <div className="productBody">
          <div>
            <div className="pImgWrap">
              <img className="pImg" src={activeImage || images[0]} alt={p.name} />
            </div> 
          {images.length > 1 && (
  <div className="thumbRow">
    {images.map((src, i) => (
      <button
        key={i}
        className={`thumbBtn ${src === activeImage ? "active" : ""}`}
        onClick={() => setActiveImage(src)}
        type="button"
      >
        <img className="thumbImg" src={src} alt="" />
      </button>
    ))}
  </div>
)}

            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>{p.name}</h1>
            <div style={{ marginTop: 8, color: "var(--muted)", fontWeight: 800 }}>
              ⭐ 4.8 · 120+ reviews
            </div>

            {p.details?.subtitle && (
              <p style={{ marginTop: 14, marginBottom: 0, color: "var(--muted)" }}>
                <b style={{ color: "var(--text)" }}>{p.details.subtitle}</b>
              </p>
            )}

            {needsSize && (
              <div style={{ marginTop: 14 }}>
                <div className="label" style={{ marginBottom: 8 }}>Choose size</div>
                <div className="sizeRow">
                  {sizeOptions.map((s) => (
                    <button
                      key={s}
                      className={`sizeBtn ${size === s ? "active" : ""}`}
                      onClick={() => setSize(s)}
                      type="button"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 14 }}>
              <div className="label" style={{ marginBottom: 8 }}>Quantity</div>
              <div className="qtyBox">
                <button className="qtyBtn" onClick={() => setQty((q) => Math.max(1, q - 1))} type="button">−</button>
                <div className="qtyNum">{qty}</div>
                <button className="qtyBtn" onClick={() => setQty((q) => q + 1)} type="button">+</button>
              </div>
            </div>

            {p.details?.size && (
              <p style={{ marginTop: 10, marginBottom: 0, color: "var(--muted)" }}>
                {p.category !== "clothing" ? (
                  <>Size: <b style={{ color: "var(--text)" }}>{p.details.size}</b></>
                ) : (
                  <span style={{ color: "var(--muted)" }}>Available: {p.details.size}</span>
                )}
              </p>
            )}

            {Array.isArray(p.details?.features) && (
              <ul style={{ marginTop: 14, paddingLeft: 18, color: "var(--muted)" }}>
                {p.details.features.map((f, idx) => (
                  <li key={idx} style={{ marginBottom: 8 }}>
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {p.details?.howToUse && (
              <div style={{ marginTop: 12, color: "var(--muted)" }}>
                <b style={{ color: "var(--text)" }}>How to use:</b> {p.details.howToUse}
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <button className="btnPrimary" onClick={add} type="button">
                Add to Cart
              </button>
            </div>

            <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 12, textAlign: "center" }}>
              Secure checkout with Whish Money coming next.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** ✅ Wishlist page */
function WishlistPage({ products, wishlistIds, toggleWishlist, addToCart }) {
  const navigate = useNavigate();
  const wished = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="pageWrap">
      <div className="pageCard">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <div>
            <h1 className="pageTitle">Wishlist</h1>
            <p className="pageSub">{wished.length} item(s)</p>
          </div>
          <Link className="backLink" to="/">← Back</Link>
        </div>

        {wished.length === 0 ? (
          <div className="empty" style={{ marginTop: 14 }}>
            <div className="emptyIcon">♡</div>
            <div className="emptyTitle">No saved items</div>
            <div className="emptyText">Tap the heart on a product to save it here.</div>
          </div>
        ) : (
          <div className="grid" style={{ marginTop: 14 }}>
            {wished.map((p) => {
              const coverImg = p.img || (Array.isArray(p.images) ? p.images[0] : "") || "https://via.placeholder.com/900x900";
              const needsSize = p.category === "clothing" && parseSizes(p?.details?.size).length > 0;

              return (
                <article
                  key={p.id}
                  className="card"
                  onClick={() => navigate(`/product/${p.id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="imgWrap">
                    <img src={coverImg} alt={p.name} className="img" />
                    <button
                      className={`wishBtn ${wishlistIds.includes(p.id) ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                      type="button"
                      aria-label="Toggle wishlist"
                    >
                      {wishlistIds.includes(p.id) ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="cardBody">
                    <div className="cardTop">
                      <h3 className="cardTitle">{p.name}</h3>
                      <div className="price">{money(p.price)}</div>
                    </div>

                    <button
                      className="btnPrimary"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (needsSize) {
                          navigate(`/product/${p.id}`);
                          alert("Select size on the product page.");
                          return;
                        }
                        addToCart(p, { qty: 1, size: "" });
                      }}
                      type="button"
                    >
                      Add to Cart
                    </button>

                    <button
                      className="btnCheckout"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${p.id}`);
                      }}
                    >
                      View Product
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/** ✅ Success / Cancel pages */
function SuccessPage({ clearCart }) {
  useEffect(() => {
    // In real life, clear cart only after server confirms payment (webhook).
    clearCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="pageWrap">
      <div className="pageCard">
        <h1 className="pageTitle">Payment successful ✅</h1>
        <p className="pageSub">Thank you! Your order is being processed.</p>
        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="backLink" to="/">Continue shopping</Link>
          <div className="badge">Secure payment via Whish Money</div>
        </div>
      </div>
    </div>
  );
}

function CancelPage() {
  return (
    <div className="pageWrap">
      <div className="pageCard">
        <h1 className="pageTitle">Payment canceled</h1>
        <p className="pageSub">No worries. Your cart is still saved.</p>
        <div style={{ marginTop: 14 }}>
          <Link className="backLink" to="/">← Back to shop</Link>
        </div>
      </div>
    </div>
  );
}

/** ✅ Home page */
function HomePage({
  selectedCategory,
  setSelectedCategory,
  clothingGender,
  setClothingGender,
  filteredProducts,
  user,
  wishlistIds,
  toggleWishlist,
  cartItems,
  addToCart,
  removeFromCart,
  updateQty,
  subtotal,
  promoCode,
  promoInput,
  setPromoInput,
  promoMessage,
  applyPromo,
  applyBrandFilter,
  discount,
  shipping,
  total,
  checkout,
  setAuthOpen,
  setMode,
  setSearch,
setMinPrice,
setMaxPrice,
setOnlyWished,
setSort
}) {
  const navigate = useNavigate();
  const categoryTitle = selectedCategory === "cosmetics" ? "Cosmetics" : "Clothing";
  const slides = [
    { src: "/banners/rimmel.jpg", brandSearch: "rimmel", label: "Rimmel London" },
    { src: "/banners/maxfactor.jpg", brandSearch: "max factor", label: "Max Factor" },
    { src: "/banners/bourjois.jpg", brandSearch: "bourjois", label: "Bourjois" },
    { src: "/banners/loreal.jpg", brandSearch: "l'oréal", label: "L'Oréal" },
  ];

  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, []);

  const goBrand = (brandSearch) => {
    setSelectedCategory("cosmetics");
    setSearch(brandSearch);      // ✅ filters products
    setSort("featured");
    setMinPrice("");
    setMaxPrice("");
    setOnlyWished(false);

    // optional: scroll to products section
    window.scrollTo({ top: 520, behavior: "smooth" });
  };

  return (
    <main className="main">
            {/* ✅ CLICKABLE BRAND BANNERS */}
      <section className="brandCarousel">
        <div className="brandHint">Tap banner to shop brand</div>

        <button
          className="brandSlideBtn"
          type="button"
          onClick={() => applyBrandFilter(slides[slide].brandSearch)}
          aria-label={`Shop ${slides[slide].label}`}
        >
          <img className="brandSlideImg" src={slides[slide].src} alt={slides[slide].label} />
        </button>
<div className="brandLabel">{slides[slide].label}</div>

        <div className="brandDots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`brandDot ${i === slide ? "active" : ""}`}
              onClick={() => setSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* HERO */}
      <section
        style={{
          gridColumn: "1 / -1",
          padding: "40px 32px",
          borderRadius: 22,
          background: "linear-gradient(135deg, #ffffff 0%, #f4f4f6 100%)",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow2)",
          marginBottom: 24,
        }}
      >
  
        <div className="sectionHeader">
          <div style={{ width: "100%" }}>
            <h2 style={{ fontSize: 22, margin: 0, fontWeight: 900 }}>Best Sellers</h2>

            <h1 className="h1" style={{ marginTop: 10 }}>
              {categoryTitle}
            </h1>

            <p className="sub">Curated essentials designed to feel effortless.</p>

            {user && (
              <p className="sub" style={{ marginTop: 6 }}>
                Shopping as <b>{user.mode === "guest" ? "Guest" : user.name}</b>
              </p>
            )}

            {/* ✅ Men/Women option appears when Clothing is selected */}
            {selectedCategory === "clothing" && (
              <div style={{ marginTop: 12, maxWidth: 420 }}>
                <div className="label" style={{ marginBottom: 8 }}>
                  Clothing section
                </div>
                <div className="tabs" style={{ margin: 0 }}>
                  <button className={`tab ${clothingGender === "women" ? "active" : ""}`} onClick={() => setClothingGender("women")} type="button">
                    Women
                  </button>
                  <button className={`tab ${clothingGender === "men" ? "active" : ""}`} onClick={() => setClothingGender("men")} type="button">
                    Men
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: 12, color: "var(--muted)", fontSize: 12 }}>
              💡 Tip: Click a product card to open the product page (sizes + quantity).
            </div>
          </div>

          <div className="sortHint">
            Showing <b>{filteredProducts.length}</b> items
          </div>
        </div>

        <div className="grid">
          {filteredProducts.map((p) => {
            const coverImg = p.img || (Array.isArray(p.images) ? p.images[0] : "") || "https://via.placeholder.com/900x900";
            const isWished = wishlistIds.includes(p.id);
            const needsSize = p.category === "clothing" && parseSizes(p?.details?.size).length > 0;

            return (
              <article
                key={p.id}
                className="card"
                onClick={() => navigate(`/product/${p.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigate(`/product/${p.id}`);
                }}
              >
                <div className="imgWrap">
                  <img src={coverImg} alt={p.name} className="img" />
                  <button
                    className={`wishBtn ${isWished ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    type="button"
                    aria-label="Toggle wishlist"
                    title={isWished ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {isWished ? "♥" : "♡"}
                  </button>
                </div>

                <div className="cardBody">
                  <div className="cardTop">
                    <h3 className="cardTitle">{p.name}</h3>
                    <div className="price">{money(p.price)}</div>
                  </div>

                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: -6 }}>
                    ⭐ 4.8 · 120+ reviews
                  </div>

                  <button
                    className="btnPrimary"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (needsSize) {
                        navigate(`/product/${p.id}`);
                        alert("Select size on the product page.");
                        return;
                      }
                      addToCart(p, { qty: 1, size: "" });
                    }}
                    type="button"
                  >
                    Add to Cart
                  </button>

                  <button
                    className="btnCheckout"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${p.id}`);
                    }}
                  >
                    View Product
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Right side cart panel */}
      
    </main>
  );
}

/** ✅ Main App */
export default function App() {
  // ✅ State
  const [selectedCategory, setSelectedCategory] = useState("cosmetics");
  const [clothingGender, setClothingGender] = useState("women");
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [filtersOpen, setFiltersOpen] = useState(false);
const [sort, setSort] = useState("featured"); // featured | price_asc | price_desc | name_asc
const [minPrice, setMinPrice] = useState("");
const [maxPrice, setMaxPrice] = useState("");
const [onlyWished, setOnlyWished] = useState(false);
const [accountOpen, setAccountOpen] = useState(false);
const [accountForm, setAccountForm] = useState({
  displayName: "",
  currentPassword: "",
  newPassword: "",
});
const saveAccount = async () => {
  try {
    const u = auth.currentUser;
    if (!u) return;
 // update display name
    const nextName = accountForm.displayName.trim();
    if (nextName && nextName !== (u.displayName || "")) {
      await updateProfile(u, { displayName: nextName });
      setUser((prev) => (prev ? { ...prev, name: nextName } : prev));
    }

    // update password (requires re-auth)
    if (accountForm.newPassword.trim()) {
      if (!u.email) throw new Error("No email on this account.");
      if (!accountForm.currentPassword.trim()) {
        alert("Enter current password to change password.");
        return;
      }

      const cred = EmailAuthProvider.credential(u.email, accountForm.currentPassword);
      await reauthenticateWithCredential(u, cred);
      await updatePassword(u, accountForm.newPassword.trim());
    }

    alert("Account updated ✅");
    setAccountOpen(false);
    setAccountForm({ displayName: nextName, currentPassword: "", newPassword: "" });
  } catch (err) {
    alert(err?.code || err?.message || "Account update failed");
  }
};

 // user = { name, email, mode: "user" | "guest" }
  const [user, setUser] = useState(null);
useEffect(() => {
  if (user?.mode === "user") {
    setAccountForm((p) => ({ ...p, displayName: user.name || "" }));
  }
}, [user]);

  // ✅ Search in topbar
  const [search, setSearch] = useState("");

  // ✅ Cart modal
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ Intro overlay
  const [introOpen, setIntroOpen] = useState(true);


  // Auth modal
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // "signin" | "signup"
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  // ✅ Wishlist
  const [wishlistIds, setWishlistIds] = useState([]);

  // ✅ Cart: [{id,name,price,qty,size}]
  const [cartItems, setCartItems] = useState([]);

  // ✅ Promo
  const [promoCode, setPromoCode] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState(null);

  // Persist: wishlist + cart + promo
  useEffect(() => {
    try {
      const w = JSON.parse(localStorage.getItem("aurea_wishlist") || "[]");
      if (Array.isArray(w)) setWishlistIds(w);
      const c = JSON.parse(localStorage.getItem("aurea_cart") || "[]");
      if (Array.isArray(c)) setCartItems(c);
      const p = localStorage.getItem("aurea_promo") || "";
      setPromoCode(p);
      setPromoInput(p);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("aurea_wishlist", JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem("aurea_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("aurea_promo", promoCode || "");
  }, [promoCode]);

  const toggleWishlist = (id) => {
    setWishlistIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const resetAuthForm = () => setAuthForm({ name: "", email: "", password: "", confirmPassword: "" });

  const setMode = (mode) => {
    setAuthMode(mode);
    resetAuthForm();
  };

  // ✅ Intro: show only once per browser
  useEffect(() => {
    const seen = localStorage.getItem("aurea_intro_seen");
    if (seen === "1") setIntroOpen(false);
  }, []);

  const closeIntro = () => {
    localStorage.setItem("aurea_intro_seen", "1");
    setIntroOpen(false);
  };

  // ✅ Firebase: keep user logged in (source of truth)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
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
        setCartOpen(false);
        setIntroOpen(false);
        setFiltersOpen(false);
        setAccountOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // lock body scroll when drawer or modal open
useEffect(() => {
  const locked =
    sidebarOpen || authOpen || cartOpen || introOpen || filtersOpen || accountOpen;

  document.body.style.overflow = locked ? "hidden" : "";
  return () => (document.body.style.overflow = "");
}, [sidebarOpen, authOpen, cartOpen, introOpen, filtersOpen, accountOpen]);

  // ✅ Filters
const filteredProducts = useMemo(() => {
  const q = search.toLowerCase().trim();

  let list = products.filter((p) => {
    const inCategory = p.category === selectedCategory;
    const matchesSearch = !q || p.name.toLowerCase().includes(q);
    const matchesGender =
      selectedCategory !== "clothing" ? true : (p.gender || "women") === clothingGender;

    const wishedOk = !onlyWished || wishlistIds.includes(p.id);

    const price = Number(p.price || 0);
    const minOk = minPrice === "" ? true : price >= Number(minPrice);
    const maxOk = maxPrice === "" ? true : price <= Number(maxPrice);

    return inCategory && matchesGender && matchesSearch && wishedOk && minOk && maxOk;
  });

  if (sort === "price_asc") list.sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === "price_desc") list.sort((a, b) => Number(b.price) - Number(a.price));
  if (sort === "name_asc") list.sort((a, b) => String(a.name).localeCompare(String(b.name)));

  return list;
}, [selectedCategory, clothingGender, search, sort, minPrice, maxPrice, onlyWished, wishlistIds]);


  // ✅ Cart helpers (merge by product id + size)
  const addToCart = (product, opts = { qty: 1, size: "" }) => {
    const qty = Math.max(1, Number(opts.qty || 1));
    const size = (opts.size || "").trim();

    setCartItems((prev) => {
      const idx = prev.findIndex((x) => x.id === product.id && (x.size || "") === size);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { id: product.id, name: product.name, price: Number(product.price), qty, size }];
    });
  };
const applyBrandFilter = (brand) => {
  setSelectedCategory("cosmetics");
  setSearch(brand);
  setSort("featured");
  setMinPrice("");
  setMaxPrice("");
  setOnlyWished(false);
  window.scrollTo({ top: 520, behavior: "smooth" });
};

  const removeFromCart = (index) => setCartItems((prev) => prev.filter((_, i) => i !== index));

  const updateQty = (index, nextQty) => {
    setCartItems((prev) => {
      const q = Number(nextQty || 0);
      if (q <= 0) return prev.filter((_, i) => i !== index);
      return prev.map((x, i) => (i === index ? { ...x, qty: q } : x));
    });
  };

  const clearCart = () => setCartItems([]);

  // ✅ Promo logic
  const applyPromo = () => {
    const code = (promoInput || "").trim().toUpperCase();
    if (!code) {
      setPromoCode("");
      setPromoMessage({ ok: true, text: "Promo removed." });
      return;
    }
    if (!PROMOS[code]) {
      setPromoMessage({ ok: false, text: "Invalid promo code." });
      return;
    }
    setPromoCode(code);
    setPromoMessage({ ok: true, text: `Applied ${code} (${PROMOS[code].label})` });
  };

  // ✅ Totals (subtotal / discount / shipping / total)
  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0), [cartItems]);

  const discount = useMemo(() => {
    if (!promoCode || !PROMOS[promoCode]) return 0;
    const promo = PROMOS[promoCode];
    if (promo.type === "percent") return (subtotal * promo.value) / 100;
    if (promo.type === "fixed") return Math.min(subtotal, promo.value);
    return 0;
  }, [promoCode, subtotal]);

  const shipping = useMemo(() => {
    if (cartItems.length === 0) return 0;

    // Promo freeship overrides
    if (promoCode && PROMOS[promoCode]?.type === "freeship") return 0;

    // Free over threshold (based on subtotal BEFORE discount)
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;

    return SHIPPING_FEE;
  }, [cartItems.length, promoCode, subtotal]);

  const total = useMemo(() => Math.max(0, subtotal - discount + shipping), [subtotal, discount, shipping]);

  // ✅ Checkout (Whish Money) – frontend calls your backend, backend returns a secure payment URL
  const checkout = async () => {
    try {
      if (cartItems.length === 0) return;

      // You must implement this endpoint on your backend:
      // POST /create-whish-checkout  -> returns { url: "https://..." }
      const res = await fetch("http://localhost:4242/create-whish-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: "USD",
          promoCode: promoCode || "",
          cartItems,
          totals: { subtotal, discount, shipping, total },
          customer: user ? { name: user.name, email: user.email, mode: user.mode } : null,
          // recommended URLs for your backend to use:
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`,
        }),
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url; // redirect to Whish secure hosted payment page
      } else {
        alert(data?.error || "Checkout failed. Check your backend.");
      }
    } catch (e) {
      alert("Checkout error. Make sure your backend is running on port 4242.");
    }
  };

  // ✅ Firebase Email/Password sign in
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

  // ✅ Firebase Email/Password sign up
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

  // ✅ Google popup sign in
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
      setUser(null);
    } catch (err) {
      alert(err?.code || err?.message || "Sign out failed");
    }
  };

  return (
    <BrowserRouter>
      <div className="app">
        <style>{styles}</style>

        {/* ✅ INTRO OVERLAY */}
        {introOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 18,
            }}
          >
            <div
              style={{
                width: "min(980px, 96vw)",
                borderRadius: 22,
                overflow: "hidden",
                boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
                background: "#bbb",
              }}
            >
              <img
                src="/begin-experience.png"
                alt="Auréa intro"
                style={{ width: "100%", height: "auto", display: "block" }}
                onError={(e) => {
                  console.log("INTRO IMAGE FAILED:", e);
                  alert("Intro image not found. Check: public/begin-experience.png (exact name).");
                }}
              />

              <div
                style={{
                  padding: 16,
                  background: "rgba(0,0,0,0.65)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={closeIntro}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "#0e0e10",
                    color: "#fff",
                    fontWeight: 900,
                    cursor: "pointer",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  Begin Experience
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Bar */}
   <header className="ss-header">

  
  {/* Main header row */}
  <div className="ss-mainbar">

    {/* LEFT — SEARCH */}
   <div className="ss-search">
  <svg className="ss-search-icon" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.65" y1="16.65" x2="21" y2="21" />
  </svg>

  <input
    placeholder="SEARCH"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>


    {/* CENTER — LOGO */}
    <Link to="/" className="ss-logo">
      auréa
    </Link>

    {/* RIGHT — ACCOUNT / WISHLIST / CART */}
    <div className="ss-icons">

      <button
         className="ss-icon-btn" onClick={() => {
  if (user) setAccountOpen(true);
  else { setAuthOpen(true); setMode("signin"); }
}}>
  <svg className="ss-icon" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
  </svg>
  ACCOUNT
</button>

  
      <Link className="ss-icon-btn" to="/wishlist">
  <svg className="ss-icon" viewBox="0 0 24 24">
    <path d="M20.8 4.6c-1.9-1.8-5-1.5-6.8.6L12 7.1l-2-1.9c-1.8-2.1-4.9-2.4-6.8-.6-2.2 2.1-2.2 5.6 0 7.7l8.8 8.6 8.8-8.6c2.2-2.1 2.2-5.6 0-7.7z"/>
  </svg>
  WISHLIST
</Link>

<button className="ss-icon-btn" onClick={() => setFiltersOpen(true)} type="button">
  <svg className="ss-icon" viewBox="0 0 24 24">
    <path d="M3 5h18M6 12h12M10 19h4" />
  </svg>
  FILTERS
</button>


     <button className="ss-icon-btn" onClick={() => setCartOpen(true)}>
  <svg className="ss-icon" viewBox="0 0 24 24">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>
  </svg>
  CART <span className="ss-cart-count">({cartItems.reduce((s,x)=>s+x.qty,0)})</span>
</button>


    </div>

  </div>
</header>


    

        {/* Sidebar */}

<div className={`modal ${accountOpen ? "show" : ""}`} role="dialog" aria-modal="true">
  <div className="modalBackdrop" onClick={() => setAccountOpen(false)} />
  <div className="modalCard">
    <div className="modalTop">
      <div>
        <div className="modalTitle">My Account</div>
        <div className="help">Edit username + password.</div>
      </div>
      <button className="modalClose" onClick={() => setAccountOpen(false)} type="button">✕</button>
    </div>

    <div className="modalBody">
      {!user || user.mode !== "user" ? (
        <div className="empty">
          <div className="emptyIcon">🔒</div>
          <div className="emptyTitle">Sign in required</div>
          <div className="emptyText">Only signed-in users can edit account details.</div>
        </div>
      ) : (
        <>
          <div className="field">
            <div className="label">Username</div>
            <input
              className="input"
              value={accountForm.displayName}
              onChange={(e) => setAccountForm((p) => ({ ...p, displayName: e.target.value }))}
              placeholder="Your name"
            />
          </div>

          <div className="divider">Change password (optional)</div>

          <div className="field">
            <div className="label">Current password</div>
            <input
              className="input"
              type="password"
              value={accountForm.currentPassword}
              onChange={(e) => setAccountForm((p) => ({ ...p, currentPassword: e.target.value }))}
              placeholder="••••••••"
            />
          </div>

          <div className="field">
            <div className="label">New password</div>
            <input
              className="input"
              type="password"
              value={accountForm.newPassword}
              onChange={(e) => setAccountForm((p) => ({ ...p, newPassword: e.target.value }))}
              placeholder="••••••••"
            />
          </div>

          <div className="authActions">
            <button className="btnPrimary" type="button" onClick={saveAccount}>
              Save changes
            </button>
            <button className="btnGhost" type="button" onClick={() => setAccountOpen(false)}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  </div>
</div>
 

 <div className={`modal ${filtersOpen ? "show" : ""}`} role="dialog" aria-modal="true">
  <div className="modalBackdrop" onClick={() => setFiltersOpen(false)} />
  <div className="modalCard">
    <div className="modalTop">
      <div>
        <div className="modalTitle">Filters</div>
        <div className="help">Sort and filter products.</div>
      </div>
      <button className="modalClose" onClick={() => setFiltersOpen(false)} type="button">✕</button>
    </div>

    <div className="modalBody">
      <div className="field">
        <div className="label">Sort</div>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="name_asc">Name: A → Z</option>
        </select>
      </div>

      <div className="row2">
        <div className="field">
          <div className="label">Min price</div>
          <input className="input" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" inputMode="decimal" />
        </div>
        <div className="field">
          <div className="label">Max price</div>
          <input className="input" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="999" inputMode="decimal" />
        </div>
      </div>

      <div className="field" style={{ marginTop: 14 }}>
        <label style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 900 }}>
          <input type="checkbox" checked={onlyWished} onChange={(e) => setOnlyWished(e.target.checked)} />
          Only wishlist items
        </label>
      </div>

      <div className="authActions">
        <button
          className="btnGhost"
          type="button"
          onClick={() => {
            setSort("featured");
            setMinPrice("");
            setMaxPrice("");
            setOnlyWished(false);
          }}
        >
          Reset
        </button>
        <button className="btnPrimary" type="button" onClick={() => setFiltersOpen(false)}>
          Done
        </button>
      </div>
    </div>
  </div>
</div>

        {/* Auth Modal */}
        <div className={`modal ${authOpen ? "show" : ""}`} role="dialog" aria-modal="true">
          <div className="modalBackdrop" onClick={() => setAuthOpen(false)} aria-label="Close auth modal" />
          <div className="modalCard">
            <div className="modalTop">
              <div>
                <div className="modalTitle">Account</div>
                <div className="help">Sign in, create an account, or continue as a guest.</div>
              </div>
              <button className="modalClose" onClick={() => setAuthOpen(false)} aria-label="Close" type="button">
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
                    type="button"
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
                    type="button"
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

    {/* CART DRAWER OVERLAY */}
<div
  className={`cartDrawerOverlay ${cartOpen ? "show" : ""}`}
  onClick={() => setCartOpen(false)}
  aria-hidden={!cartOpen}
/>

{/* CART DRAWER */}
<aside className={`cartDrawer ${cartOpen ? "open" : ""}`} aria-hidden={!cartOpen}>
  <div className="cartDrawerHeader">
    <div>
      <div className="cartDrawerTitle">Your Cart</div>
      <div className="cartDrawerSub">{cartItems.reduce((s, x) => s + x.qty, 0)} item(s)</div>
    </div>

    <button className="modalClose" onClick={() => setCartOpen(false)} type="button" aria-label="Close cart">
      ✕
    </button>
  </div>

  <div className="cartDrawerBody">
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
            <li key={`${item.id}-${item.size || "nosize"}-${i}`} className="cartRow">
              <div style={{ minWidth: 0 }}>
                <div className="cartName">{item.name}</div>
                <div className="cartMeta">
                  {money(item.price)} {item.size ? `• Size ${item.size}` : ""} • Line:{" "}
                  <b style={{ color: "var(--text)" }}>{money(item.price * item.qty)}</b>
                </div>
                <div className="qtyBox">
                  <button className="qtyBtn" onClick={() => updateQty(i, item.qty - 1)} type="button">−</button>
                  <div className="qtyNum">{item.qty}</div>
                  <button className="qtyBtn" onClick={() => updateQty(i, item.qty + 1)} type="button">+</button>
                </div>
              </div>
              <button className="removeBtn" onClick={() => removeFromCart(i)} type="button">
                Remove
              </button>
            </li>
          ))}
        </ul>

        {/* Promo */}
        <div className="promoBox">
          <div className="label" style={{ marginBottom: 8 }}>Promo code</div>
          <div className="promoRow">
            <input
              className="input"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="AUREA10, SAVE5, FREESHIP…"
            />
            <button className="searchBtn" type="button" onClick={applyPromo}>
              Apply
            </button>
          </div>

          {promoMessage && (
            <div className={`promoMsg ${promoMessage.ok ? "ok" : "bad"}`}>
              {promoMessage.text}
            </div>
          )}
          {promoCode && PROMOS[promoCode] && (
            <div className="promoMsg ok">Applied: {promoCode} ({PROMOS[promoCode].label})</div>
          )}
        </div>

        {/* Summary */}
        <div className="summary">
          <div className="sumRow"><span>Subtotal</span><b>{money(subtotal)}</b></div>
          <div className="sumRow"><span>Discount</span><b>-{money(discount)}</b></div>
          <div className="sumRow"><span>Shipping</span><b>{shipping === 0 ? "Free" : money(shipping)}</b></div>
          <div className="sumRow total"><span>Total</span><b>{money(total)}</b></div>
        </div>

        <button
          className="btnCheckout"
          onClick={() => {
            if (!user) {
              setCartOpen(false);
              setAuthOpen(true);
              setMode("signin");
            } else {
              setCartOpen(false);
              checkout();
            }
          }}
          type="button"
        >
          Checkout (Whish Money)
        </button>

        <div className="cartNote">
          {user ? "You’ll be redirected to a secure Whish payment page." : "Sign in / sign up or continue as guest to proceed."}
        </div>
      </>
    )}
  </div>
</aside>


        {/* ✅ ROUTES */}
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
               setSearch={setSearch}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                clothingGender={clothingGender}
                 
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
                setClothingGender={setClothingGender}
                filteredProducts={filteredProducts}
                user={user}
                wishlistIds={wishlistIds}
                toggleWishlist={toggleWishlist}
                applyBrandFilter={applyBrandFilter}
                cartItems={cartItems}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                updateQty={updateQty}
                subtotal={subtotal}
                promoCode={promoCode}
                promoInput={promoInput}
                setPromoInput={setPromoInput}
                promoMessage={promoMessage}
                applyPromo={applyPromo}
                discount={discount}
                shipping={shipping}
                total={total}
                checkout={checkout}
                setAuthOpen={setAuthOpen}
                setMode={setMode}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductPage
                products={products}
                wishlistIds={wishlistIds}
                toggleWishlist={toggleWishlist}
                addToCart={addToCart}
              />
            }
          />
          <Route
            path="/wishlist"
            element={
              <WishlistPage
                products={products}
                wishlistIds={wishlistIds}
                toggleWishlist={toggleWishlist}
                addToCart={addToCart}
              />
            }
          />
          <Route path="/success" element={<SuccessPage clearCart={clearCart} />} />
          <Route path="/cancel" element={<CancelPage />} />
        </Routes>
{/* ✅ TRUST STRIP (SKINSOCIETY STYLE) */}
<section className="trustStrip">
  <div className="trustStripInner">
    
   <div className="trustItem">
  <div className="trustIcon">
    <img
      src="/icons/authentic-products.svg"
      alt="100% Authentic Products"
      className="trustImg"
    />
  </div>
  <div className="trustText">
    100% <span>Authentic Products</span>
  </div>
</div>

<div className="trustItem">
  <div className="trustIcon">
    <img
      src="/icons/secure-shopping.svg"
      alt="Secure Shopping"
      className="trustImg"
    />
  </div>
  <div className="trustText">
    Secure <span>Shopping</span>
  </div>
</div>

  </div>
</section>


        <footer className="footer">© 2026 auréa · Authentic products · Secure checkout · Easy returns</footer>
      </div>
    </BrowserRouter>
  );
}

/*
✅ IMPORTANT FOR FEATURE #5 (Whish Money checkout)

This frontend expects your BACKEND endpoint:

POST http://localhost:4242/create-whish-checkout
Body: { cartItems, currency:"USD", totals:{...}, successUrl, cancelUrl, customer }

Response: { url: "https://whish-hosted-payment-page/..." }

Your backend must create the Whish payment request and return the collect/checkout URL.
Then set Whish redirect to:
  successUrl = http://your-site/success
  cancelUrl  = http://your-site/cancel
*/
