import { useState, useEffect, createContext, useContext, useReducer } from "react";
import { auth } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged 
} from "firebase/auth";
// ============================================================
// GLOBAL STYLES
// ============================================================
// eslint-disable-next-line no-unused-vars
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --black: #090909;
      --void: #0d0d0d;
      --surface: #141414;
      --card: #1a1a1a;
      --border: #242424;
      --muted: #2e2e2e;
      --text-dim: #6b6b6b;
      --text-mid: #a0a0a0;
      --text: #e8e8e8;
      --white: #f5f5f0;
      --accent: #ff4d1c;
      --accent2: #ff8c42;
      --neon: #00ff88;
      --blue: #3b82f6;
      --gold: #f59e0b;
      --font-display: 'Syne', sans-serif;
      --font-body: 'DM Sans', sans-serif;
      --r-sm: 8px;
      --r-md: 14px;
      --r-lg: 20px;
      --r-xl: 28px;
      --shadow: 0 4px 24px rgba(0,0,0,0.4);
      --glow: 0 0 40px rgba(255,77,28,0.2);
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--black);
      color: var(--text);
      font-family: var(--font-body);
      font-size: 15px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--void); }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

    button { cursor: pointer; border: none; outline: none; font-family: var(--font-body); }
    input, textarea, select { font-family: var(--font-body); outline: none; }
    a { text-decoration: none; color: inherit; }
    img { max-width: 100%; display: block; }

    .page { min-height: 100vh; padding-top: 72px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .animate-fadeUp { animation: fadeUp 0.6s ease forwards; }
    .animate-fadeIn { animation: fadeIn 0.4s ease forwards; }

    .skeleton {
      background: linear-gradient(90deg, var(--card) 25%, var(--muted) 50%, var(--card) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--r-sm);
    }

    /* Btn Styles */
    .btn-primary {
      background: var(--accent);
      color: white;
      padding: 12px 28px;
      border-radius: var(--r-md);
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.5px;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-primary:hover {
      background: var(--accent2);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(255,77,28,0.35);
    }
    .btn-primary:active { transform: translateY(0); }

    .btn-outline {
      background: transparent;
      color: var(--text);
      padding: 11px 28px;
      border-radius: var(--r-md);
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 14px;
      border: 1.5px solid var(--border);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-outline:hover {
      border-color: var(--accent);
      color: var(--accent);
      transform: translateY(-2px);
    }

    .btn-ghost {
      background: transparent;
      color: var(--text-mid);
      padding: 10px 20px;
      border-radius: var(--r-sm);
      font-size: 14px;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-ghost:hover { background: var(--surface); color: var(--text); }

    /* Card */
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      transition: all 0.25s ease;
    }
    .card:hover {
      border-color: rgba(255,77,28,0.3);
      transform: translateY(-4px);
      box-shadow: var(--shadow), var(--glow);
    }

    /* Input */
    .input {
      background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: var(--r-md);
      padding: 12px 16px;
      color: var(--text);
      font-size: 14px;
      width: 100%;
      transition: border-color 0.2s;
    }
    .input:focus { border-color: var(--accent); }
    .input::placeholder { color: var(--text-dim); }

    /* Badge */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .badge-accent { background: rgba(255,77,28,0.15); color: var(--accent); border: 1px solid rgba(255,77,28,0.25); }
    .badge-neon { background: rgba(0,255,136,0.1); color: var(--neon); border: 1px solid rgba(0,255,136,0.2); }
    .badge-gold { background: rgba(245,158,11,0.12); color: var(--gold); border: 1px solid rgba(245,158,11,0.2); }

    /* Star Rating */
    .stars { color: var(--gold); letter-spacing: 2px; }

    /* Section */
    .section { padding: 80px 0; }
    .section-sm { padding: 48px 0; }
    .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

    /* Grid */
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }

    @media (max-width: 1024px) {
      .grid-4 { grid-template-columns: repeat(2, 1fr); }
      .grid-3 { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
      .section { padding: 48px 0; }
      .container { padding: 0 16px; }
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--card);
      border: 1px solid var(--border);
      border-left: 3px solid var(--neon);
      padding: 16px 20px;
      border-radius: var(--r-md);
      box-shadow: var(--shadow);
      animation: slideIn 0.3s ease;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 320px;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease;
    }
    .modal {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--r-xl);
      padding: 32px;
      max-width: 480px;
      width: 90%;
      animation: fadeUp 0.3s ease;
    }

    /* Nav */
    .nav-link {
      color: var(--text-mid);
      font-size: 14px;
      font-weight: 500;
      transition: color 0.15s;
      padding: 4px 0;
    }
    .nav-link:hover, .nav-link.active { color: var(--white); }

    /* Tag */
    .tag {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      border: 1.5px solid var(--border);
      color: var(--text-mid);
      cursor: pointer;
      transition: all 0.15s;
    }
    .tag:hover, .tag.active {
      border-color: var(--accent);
      color: var(--accent);
      background: rgba(255,77,28,0.08);
    }

    /* Divider */
    .divider { height: 1px; background: var(--border); margin: 24px 0; }

    /* Accordion */
    .accordion-item { border-bottom: 1px solid var(--border); }
    .accordion-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      cursor: pointer;
      font-weight: 500;
      transition: color 0.15s;
    }
    .accordion-header:hover { color: var(--accent); }
    .accordion-body { padding-bottom: 20px; color: var(--text-mid); line-height: 1.7; }

    /* Progress */
    .progress-bar { height: 6px; background: var(--muted); border-radius: 3px; overflow: hidden; }
    .progress-fill { height: 100%; background: var(--accent); border-radius: 3px; transition: width 0.5s ease; }

    /* Floating cart */
    .cart-sidebar {
      position: fixed;
      top: 0; right: 0;
      height: 100vh;
      width: 420px;
      background: var(--void);
      border-left: 1px solid var(--border);
      z-index: 500;
      transform: translateX(100%);
      transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
      display: flex;
      flex-direction: column;
    }
    .cart-sidebar.open { transform: translateX(0); }

    @media (max-width: 480px) {
      .cart-sidebar { width: 100vw; }
    }

     @media (max-width: 768px) {
      .desktop-nav { display: none !important; }
      .mobile-menu-btn { display: flex !important; }
    }

  `}</style>
);
  

// ============================================================
// CONTEXT & STATE
// ============================================================
const AppContext = createContext();

const initialState = {
  cart: [],
  wishlist: [],
  user: null,
  isCartOpen: false,
  toast: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.cart.find(i => i.id === action.item.id && i.variant === action.item.variant);
      if (existing) {
        return { ...state, cart: state.cart.map(i => i.id === action.item.id && i.variant === action.item.variant ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, cart: [...state.cart, { ...action.item, qty: 1 }] };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter(i => !(i.id === action.id && i.variant === action.variant)) };
    case "UPDATE_QTY":
      return { ...state, cart: state.cart.map(i => i.id === action.id && i.variant === action.variant ? { ...i, qty: Math.max(1, action.qty) } : i) };
    case "TOGGLE_WISHLIST": {
      const exists = state.wishlist.find(i => i.id === action.item.id);
      return { ...state, wishlist: exists ? state.wishlist.filter(i => i.id !== action.item.id) : [...state.wishlist, action.item] };
    }
    case "SET_USER":
      return { ...state, user: action.user };
    case "LOGOUT":
      return { ...state, user: null };
    case "TOGGLE_CART":
      return { ...state, isCartOpen: !state.isCartOpen };
    case "CLOSE_CART":
      return { ...state, isCartOpen: false };
    case "SET_TOAST":
      return { ...state, toast: action.toast };
    case "CLEAR_TOAST":
      return { ...state, toast: null };
    default:
      return state;
  }
}

// ============================================================
// MOCK DATA
// ============================================================
const PRODUCTS = [
  { id: 1, name: "Obsidian Pro Runner", category: "Footwear", price: 189, originalPrice: 249, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", rating: 4.8, reviews: 342, badge: "Bestseller", variants: ["US 8", "US 9", "US 10", "US 11"], colors: ["#1a1a1a", "#ff4d1c", "#3b82f6"], description: "Engineered for performance. Built for the streets. The Obsidian Pro combines reactive foam cushioning with a breathable knit upper for all-day comfort." },
  { id: 2, name: "Volt Urban Hoodie", category: "Apparel", price: 129, originalPrice: 169, image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80", rating: 4.7, reviews: 218, badge: "New", variants: ["S", "M", "L", "XL", "XXL"], colors: ["#090909", "#2e2e2e", "#ff4d1c"], description: "Premium heavyweight fleece with a brushed interior. Oversized fit with dropped shoulders for that perfect streetwear silhouette." },
  { id: 3, name: "Cipher Tech Watch", category: "Accessories", price: 349, originalPrice: 499, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", rating: 4.9, reviews: 156, badge: "Limited", variants: ["42mm", "46mm"], colors: ["#1a1a1a", "#f5f5f0", "#f59e0b"], description: "Swiss-inspired movement meets digital precision. Sapphire crystal glass, titanium case, and 7-day battery life." },
  { id: 4, name: "Nova Cargo Pants", category: "Apparel", price: 149, originalPrice: 199, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", rating: 4.6, reviews: 89, badge: null, variants: ["28", "30", "32", "34", "36"], colors: ["#2e2e2e", "#3d3d3d", "#1a2535"], description: "Tactical-inspired 8-pocket design with water-resistant ripstop fabric. Built for urban explorers." },
  { id: 5, name: "Phantom Slide 2.0", category: "Footwear", price: 89, originalPrice: null, image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80", rating: 4.5, reviews: 203, badge: "Popular", variants: ["US 7", "US 8", "US 9", "US 10"], colors: ["#f5f5f0", "#090909", "#ff4d1c"], description: "Cloud-soft EVA footbed with a minimalist strap system. Your new everyday essential." },
  { id: 6, name: "Arc Sunglasses", category: "Accessories", price: 219, originalPrice: 289, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80", rating: 4.8, reviews: 127, badge: "New", variants: ["One Size"], colors: ["#1a1a1a", "#f59e0b", "#3b82f6"], description: "Polarized lenses with UV400 protection. Geometric acetate frames inspired by brutalist architecture." },
  { id: 7, name: "Stealth Backpack 30L", category: "Bags", price: 179, originalPrice: 229, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", rating: 4.7, reviews: 445, badge: "Bestseller", variants: ["One Size"], colors: ["#1a1a1a", "#2e2e2e"], description: "30L capacity with laptop compartment, hidden pockets, and RFID-blocking technology." },
  { id: 8, name: "Flux Tee Pack (3x)", category: "Apparel", price: 79, originalPrice: 99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", rating: 4.4, reviews: 678, badge: "Value", variants: ["S", "M", "L", "XL"], colors: ["#090909", "#f5f5f0", "#ff4d1c"], description: "Triple-pack of our signature heavyweight cotton tees. 240gsm Pima cotton. Pre-shrunk. Built to last." },
];

const CATEGORIES = ["All", "Footwear", "Apparel", "Accessories", "Bags"];

const TESTIMONIALS = [
  { name: "Marcus T.", rating: 5, text: "The quality is insane. Got the Obsidian Pro Runners and they're the most comfortable shoes I've ever owned. Will definitely be buying more.", avatar: "MT", verified: true },
  { name: "Aisha K.", rating: 5, text: "Ordered on Tuesday, arrived Thursday. The packaging alone made me feel like I was opening a luxury product. The hoodie is perfection.", avatar: "AK", verified: true },
  { name: "Dev R.", rating: 5, text: "Finally a brand that gets it. The design, quality, and customer service are all 10/10. The watch gets compliments every single day.", avatar: "DR", verified: true },
];

const FAQS = [
  { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy. Items must be in original condition with tags attached. Simply initiate a return from your profile page and we'll send a prepaid label." },
  { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available at checkout. Free standard shipping on orders over ₹2,999 / $50." },
  { q: "Do you ship internationally?", a: "Yes! We ship to 40+ countries. International orders typically arrive in 7-14 business days. Import duties may apply depending on your country." },
  { q: "How do I track my order?", a: "You'll receive a tracking link via email once your order ships. You can also track in real-time from your profile under 'Order History'." },
  { q: "Are your products authentic?", a: "100% authentic. We manufacture all products in-house with ethically sourced materials. Every product comes with an authenticity certificate." },
  { q: "Can I change my order after placing it?", a: "Orders can be modified within 1 hour of placement. After that, they enter fulfillment. Contact support immediately if you need changes." },
];

// ============================================================
// COMPONENTS
// ============================================================

// --- ICONS ---
const Icon = ({ name, size = 18 }) => {
  const icons = {
    cart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    heart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    heartFill: <svg width={size} height={size} viewBox="0 0 24 24" fill="#ff4d1c" stroke="#ff4d1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    minus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    arrowRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    truck: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    refresh: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    tag: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18l3-.01a2 2 0 0 1 2 1.72c.13 1 .36 1.98.71 2.93a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.02-.87a2 2 0 0 1 2.11-.45c.95.35 1.93.58 2.93.71a2 2 0 0 1 1.72 2.04z"/></svg>,
    grid: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    list: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    google: <svg width={size} height={size} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>,
    chevronDown: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
    chevronUp: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>,
    bolt: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    upload: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    package: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  };
  return icons[name] || null;
};

// --- TOAST ---
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [toast, onClose]);

  if (!toast) return null;
  return (
    <div className="toast">
      <span style={{ color: "var(--neon)", fontSize: 20 }}>✓</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, color: "var(--white)" }}>{toast.title}</div>
        <div style={{ fontSize: 12, color: "var(--text-mid)", marginTop: 2 }}>{toast.msg}</div>
      </div>
      <button className="btn-ghost" onClick={onClose} style={{ padding: "4px", marginLeft: "auto" }}>
        <Icon name="x" size={14} />
      </button>
    </div>
  );
};

// --- STAR RATING ---
const StarRating = ({ rating, size = 14 }) => (
  <span className="stars" style={{ fontSize: size }}>
    {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
  </span>
);

// --- PRODUCT CARD ---
const ProductCard = ({ product, onView }) => {
  const { state, dispatch } = useContext(AppContext);
  const inWishlist = state.wishlist.find(i => i.id === product.id);

  const addToCart = (e) => {
    e.stopPropagation();
    dispatch({ type: "ADD_TO_CART", item: { ...product, variant: product.variants[0] } });
    dispatch({ type: "SET_TOAST", toast: { title: "Added to Cart!", msg: product.name } });
  };

  const toggleWish = (e) => {
    e.stopPropagation();
    dispatch({ type: "TOGGLE_WISHLIST", item: product });
    dispatch({ type: "SET_TOAST", toast: { title: inWishlist ? "Removed from Wishlist" : "Added to Wishlist!", msg: product.name } });
  };

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <div className="card" onClick={() => onView(product)} style={{ cursor: "pointer", overflow: "hidden" }}>
      <div style={{ position: "relative", paddingTop: "100%", overflow: "hidden", borderRadius: "var(--r-lg) var(--r-lg) 0 0" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
          onMouseEnter={e => e.target.style.transform = "scale(1.07)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
        />
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          {product.badge && <span className="badge badge-accent">{product.badge}</span>}
          {discount && <span className="badge badge-neon">-{discount}%</span>}
        </div>
        <button
          onClick={toggleWish}
          style={{
            position: "absolute", top: 12, right: 12,
            width: 36, height: 36,
            background: "rgba(9,9,9,0.7)",
            backdropFilter: "blur(8px)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.2s ease"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <Icon name={inWishlist ? "heartFill" : "heart"} size={16} />
        </button>
      </div>
      <div style={{ padding: "16px" }}>
        <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{product.category}</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 8, color: "var(--white)" }}>{product.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <StarRating rating={product.rating} />
          <span style={{ fontSize: 12, color: "var(--text-dim)" }}>({product.reviews})</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--white)" }}>${product.price}</span>
            {product.originalPrice && <span style={{ fontSize: 13, color: "var(--text-dim)", textDecoration: "line-through" }}>${product.originalPrice}</span>}
          </div>
          <button className="btn-primary" onClick={addToCart} style={{ padding: "8px 16px", fontSize: 12 }}>
            <Icon name="plus" size={13} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

// --- CART SIDEBAR ---
const CartSidebar = () => {
  const { state, dispatch } = useContext(AppContext);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const discountAmt = (subtotal * discount) / 100;
  const total = subtotal - discountAmt + shipping;
  const totalItems = state.cart.reduce((s, i) => s + i.qty, 0);
  const freeShippingLeft = Math.max(0, 50 - subtotal);

  const COUPONS = { "ZROM10": 10, "STREET20": 20, "NEWDROP": 15 };

  const applyCoupon = () => {
    if (COUPONS[coupon.toUpperCase()]) {
      setDiscount(COUPONS[coupon.toUpperCase()]);
      setCouponMsg(`✅ ${COUPONS[coupon.toUpperCase()]}% off applied!`);
    } else {
      setCouponMsg("❌ Invalid coupon code");
      setDiscount(0);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {state.isCartOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", zIndex: 499 }}
          onClick={() => dispatch({ type: "CLOSE_CART" })}
        />
      )}

      <div className={`cart-sidebar ${state.isCartOpen ? "open" : ""}`}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 24px", borderBottom: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--white)" }}>
              Your Cart
              <span style={{ marginLeft: 8, background: "var(--accent)", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 13 }}>
                {totalItems}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>ZROM SS26 Collection</div>
          </div>
          <button onClick={() => dispatch({ type: "CLOSE_CART" })}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text)" }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* ── FREE SHIPPING PROGRESS ── */}
        {state.cart.length > 0 && (
          <div style={{ padding: "14px 24px", background: "rgba(0,255,136,0.05)", borderBottom: "1px solid var(--border)" }}>
            {freeShippingLeft > 0 ? (
              <>
                <div style={{ fontSize: 12, color: "var(--text-mid)", marginBottom: 8 }}>
                  Add <span style={{ color: "var(--neon)", fontWeight: 700 }}>${freeShippingLeft.toFixed(2)}</span> more for free shipping! 🚚
                </div>
                <div style={{ height: 4, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min((subtotal / 50) * 100, 100)}%`, background: "var(--neon)", borderRadius: 4, transition: "width 0.4s ease" }} />
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: "var(--neon)", fontWeight: 600 }}>🎉 You've unlocked FREE shipping!</div>
            )}
          </div>
        )}

        {/* ── CART ITEMS ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 24px" }}>
          {state.cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-dim)" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-mid)", marginBottom: 8 }}>Cart is empty</div>
              <div style={{ fontSize: 14, marginBottom: 24 }}>Add something amazing!</div>
              <button onClick={() => dispatch({ type: "CLOSE_CART" })}
                style={{ padding: "10px 24px", background: "var(--accent)", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                Shop Now 🔥
              </button>
            </div>
          ) : (
            state.cart.map(item => (
              <div key={`${item.id}-${item.variant}`}
                style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
                {/* Image */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img src={item.image} alt={item.name}
                    style={{ width: 76, height: 76, objectFit: "cover", borderRadius: "var(--r-sm)" }} />
                  {item.badge && (
                    <span style={{ position: "absolute", top: -4, left: -4, background: "var(--accent)", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4 }}>
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, color: "var(--white)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 10 }}>
                    {item.variant} · {item.category}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {/* Qty controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: 0, background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)", overflow: "hidden" }}>
                      <button
                        onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, variant: item.variant, qty: item.qty - 1 })}
                        style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer", padding: "6px 10px", display: "flex", alignItems: "center" }}>
                        <Icon name="minus" size={12} />
                      </button>
                      <span style={{ fontSize: 14, fontWeight: 700, minWidth: 24, textAlign: "center", color: "var(--white)" }}>{item.qty}</span>
                      <button
                        onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, variant: item.variant, qty: item.qty + 1 })}
                        style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer", padding: "6px 10px", display: "flex", alignItems: "center" }}>
                        <Icon name="plus" size={12} />
                      </button>
                    </div>

                    {/* Price + Remove */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--white)" }}>
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                      <button
                        onClick={() => dispatch({ type: "REMOVE_FROM_CART", id: item.id, variant: item.variant })}
                        style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", display: "flex", padding: 4 }}
                        onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                        onMouseLeave={e => e.currentTarget.style.color = "var(--text-dim)"}
                      >
                        <Icon name="x" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── BOTTOM SECTION ── */}
        {state.cart.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border)", background: "var(--void)" }}>

            {/* Coupon */}
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                value={coupon}
                onChange={e => { setCoupon(e.target.value); setCouponMsg(""); }}
                placeholder="Coupon code"
                style={{ flex: 1, padding: "9px 12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--white)", fontSize: 13, fontFamily: "var(--font-body)", outline: "none" }}
              />
              <button onClick={applyCoupon}
                style={{ padding: "9px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                Apply
              </button>
            </div>
            {couponMsg && <div style={{ fontSize: 12, marginBottom: 12, color: discount > 0 ? "var(--neon)" : "#ff6b6b" }}>{couponMsg}</div>}

            {/* Price breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--text-mid)" }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--neon)" }}>
                  <span>Discount ({discount}%)</span>
                  <span>-${discountAmt.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--text-mid)" }}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? "var(--neon)" : "var(--text-mid)" }}>
                  {shipping === 0 ? "FREE 🎉" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>Total</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--white)" }}>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout button */}
            <button
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "15px", fontSize: 15, fontWeight: 800 }}
              onClick={() => dispatch({ type: "CLOSE_CART" })}>
              Checkout <Icon name="arrowRight" size={16} />
            </button>

            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 14 }}>
              {["💳", "🔒", "📦"].map((icon, i) => (
                <span key={i} style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 4 }}>
                  {icon} {["Secure Pay", "SSL Encrypted", "Fast Delivery"][i]}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// --- NAVBAR ---
const Navbar = ({ page, setPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { pg: "home", label: "Home" },
    { pg: "products", label: "Shop" },
    { pg: "reviews", label: "Reviews" },
    { pg: "about", label: "About" },
    { pg: "contact", label: "Contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(9,9,9,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "all 0.4s ease",
      padding: "0 24px",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        height: scrolled ? 60 : 72,
        transition: "height 0.4s ease",
      }}>

        {/* ── LOGO ── */}
        <button onClick={() => { setPage("home"); setMenuOpen(false); }}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontWeight: 900,
            fontSize: 16, color: "#fff", letterSpacing: -1,
          }}>Z</div>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: 22, color: "var(--white)", letterSpacing: -1,
          }}>ZROM</span>
        </button>

        {/* ── DESKTOP LINKS ── */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}
          className="desktop-nav">
          {navLinks.map(l => (
            <button key={l.pg}
              onClick={() => setPage(l.pg)}
              style={{
                background: page === l.pg ? "rgba(255,77,28,0.12)" : "none",
                border: "none", cursor: "pointer",
                fontFamily: "var(--font-body)", fontWeight: 500,
                fontSize: 14, color: page === l.pg ? "var(--accent)" : "var(--text-mid)",
                padding: "8px 16px", borderRadius: 8,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { if (page !== l.pg) e.target.style.color = "var(--white)"; }}
              onMouseLeave={e => { if (page !== l.pg) e.target.style.color = "var(--text-mid)"; }}
            >{l.label}</button>
          ))}
        </div>

        {/* ── RIGHT SIDE ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setPage("products")}
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              border: "none", cursor: "pointer", color: "#fff",
              fontFamily: "var(--font-body)", fontWeight: 600,
              fontSize: 13, padding: "9px 20px", borderRadius: 8,
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={e => e.target.style.opacity = 0.85}
            onMouseLeave={e => e.target.style.opacity = 1}
            className="desktop-nav"
          >Shop Now</button>

          {/* Hamburger — mobile only */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 8, cursor: "pointer",
              width: 40, height: 40,
              display: "none", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 5,
              padding: 0,
            }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: "block", width: 18, height: 2,
                background: "var(--white)", borderRadius: 2,
                transition: "all 0.3s ease",
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(5px,5px)"
                  : i === 1 ? "opacity: 0"
                  : "rotate(-45deg) translate(5px,-5px)"
                  : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <div style={{
        maxHeight: menuOpen ? 400 : 0,
        overflow: "hidden",
        transition: "max-height 0.4s ease",
        background: "rgba(9,9,9,0.98)",
        borderTop: menuOpen ? "1px solid var(--border)" : "none",
      }}>
        <div style={{ padding: menuOpen ? "16px 0 24px" : 0 }}>
          {navLinks.map(l => (
            <button key={l.pg}
              onClick={() => { setPage(l.pg); setMenuOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                background: page === l.pg ? "rgba(255,77,28,0.1)" : "none",
                border: "none", cursor: "pointer",
                fontFamily: "var(--font-body)", fontWeight: 500,
                fontSize: 16, color: page === l.pg ? "var(--accent)" : "var(--text)",
                padding: "14px 24px", transition: "all 0.2s ease",
              }}
            >{l.label}</button>
          ))}
          <div style={{ padding: "12px 24px 0" }}>
            <button onClick={() => { setPage("products"); setMenuOpen(false); }}
              style={{
                width: "100%", padding: "14px",
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                border: "none", borderRadius: 8, cursor: "pointer",
                color: "#fff", fontWeight: 700, fontSize: 15,
              }}>Shop Now 🔥</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- FOOTER ---
const Footer = ({ setPage }) => (
  <footer style={{ background: "var(--void)", borderTop: "1px solid var(--border)", padding: "80px 0 32px" }}>
    <div className="container">

      {/* ── TOP CTA BANNER ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(255,77,28,0.12), rgba(255,140,66,0.08))",
        border: "1px solid rgba(255,77,28,0.25)",
        borderRadius: "var(--r-xl)", padding: "40px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 24, marginBottom: 64,
      }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px, 3vw, 28px)", color: "var(--white)", letterSpacing: -1, marginBottom: 8 }}>
            Join the ZROM Movement 🔥
          </div>
          <p style={{ color: "var(--text-mid)", fontSize: 14 }}>
            Get early access to drops, exclusive deals & member-only offers.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            type="email"
            placeholder="your@email.com"
            style={{
              padding: "12px 18px", borderRadius: 10,
              background: "var(--card)", border: "1px solid var(--border)",
              color: "var(--white)", fontSize: 14, outline: "none",
              fontFamily: "var(--font-body)", minWidth: 220,
            }}
          />
          <button style={{
            padding: "12px 24px", borderRadius: 10,
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            border: "none", color: "#fff", fontWeight: 700,
            fontSize: 14, cursor: "pointer", fontFamily: "var(--font-body)",
          }}>Subscribe</button>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>

        {/* Brand column */}
        <div>
          <button onClick={() => setPage("home")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: 0 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8,
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 16, color: "#fff",
            }}>Z</div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--white)", letterSpacing: -1 }}>ZROM</span>
          </button>

          <p style={{ color: "var(--text-mid)", fontSize: 14, lineHeight: 1.8, maxWidth: 260, marginBottom: 24 }}>
            Premium streetwear built for those who move forward. Every piece is a statement.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "IG", name: "Instagram" },
              { label: "TW", name: "Twitter/X" },
              { label: "TK", name: "TikTok" },
              { label: "YT", name: "YouTube" },
            ].map(s => (
              <div key={s.label} title={s.name} style={{
                width: 36, height: 36, borderRadius: 8,
                background: "var(--card)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 11, fontWeight: 800,
                color: "var(--text-mid)", transition: "all 0.2s ease",
                fontFamily: "var(--font-display)",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-mid)"; }}
              >{s.label}</div>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        {[
          { title: "Shop", links: [["All Products", "products"], ["New Arrivals", "products"], ["Bestsellers", "products"], ["Sale", "products"]] },
          { title: "Support", links: [["Help Center", "help"], ["Returns", "refunds"], ["Contact Us", "contact"], ["Track Order", "profile"]] },
          { title: "Company", links: [["Privacy Policy", "privacy"], ["Terms of Service", "terms"], ["Reviews", "reviews"], ["Login", "login"]] },
        ].map(col => (
          <div key={col.title}>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
              color: "var(--text-dim)", marginBottom: 20,
            }}>{col.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {col.links.map(([label, pg]) => (
                <button key={label} onClick={() => setPage(pg)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 14, color: "var(--text-mid)", textAlign: "left",
                    padding: 0, fontFamily: "var(--font-body)",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={e => e.target.style.color = "var(--white)"}
                  onMouseLeave={e => e.target.style.color = "var(--text-mid)"}
                >{label}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── TRUST BADGES ── */}
      <div style={{
        display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center",
        padding: "24px 0", borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)", marginBottom: 32,
      }}>
        {[
          ["🚚", "Free Shipping over $50"],
          ["🔒", "Secure Checkout"],
          ["↩️", "30-Day Returns"],
          ["✅", "100% Authentic"],
          ["🌍", "Ships to 40+ Countries"],
        ].map(([icon, text]) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-dim)" }}>
            <span>{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 13, color: "var(--text-dim)" }}>
          © 2026 ZROM. All rights reserved. Made with 🔥
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Cookies"].map(l => (
            <button key={l}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, color: "var(--text-dim)", fontFamily: "var(--font-body)",
                transition: "color 0.2s ease", padding: 0,
              }}
              onMouseEnter={e => e.target.style.color = "var(--white)"}
              onMouseLeave={e => e.target.style.color = "var(--text-dim)"}
            >{l}</button>
          ))}
        </div>
      </div>

    </div>
  </footer>
);

// ============================================================
// PAGES
// ============================================================

// --- HOME PAGE ---
const HomePage = ({ setPage, onViewProduct }) => {
  const [email, setEmail] = useState("");
  const [subDone, setSubDone] = useState(false);

  return (
    <div className="page">
      {/* Hero */}
      <section style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center",
        background: "linear-gradient(135deg, #090909 0%, #0d0d0d 50%, #120a06 100%)",
        position: "relative", overflow: "hidden"
      }}>
        {/* BG elements */}
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(255,77,28,0.12) 0%, transparent 70%)", borderRadius: "50%", animation: "float 6s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 300, height: 300, background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", borderRadius: "50%", animation: "float 8s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)", backgroundSize: "40px 40px" }} />

        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", padding: "80px 24px" }}>
          <div style={{ animation: "fadeUp 0.8s ease" }}>
            <div className="badge badge-neon" style={{ marginBottom: 24 }}>
              <Icon name="bolt" size={11} /> NEW DROP SS26
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(40px, 6vw, 80px)",
              lineHeight: 1.05,
              letterSpacing: -2,
              marginBottom: 24,
              color: "var(--white)",
            }}>
              Wear<br />
              <span style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>ZROM.</span>
            </h1>
            <p style={{ fontSize: 18, color: "var(--text-mid)", lineHeight: 1.7, maxWidth: 420, marginBottom: 40 }}>
              Born on the streets. Built for the bold. ZROM is not just clothing — it's identity.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => setPage("products")} style={{ padding: "16px 36px", fontSize: 15 }}>
                Shop Collection <Icon name="arrowRight" size={16} />
              </button>
              <button className="btn-outline" onClick={() => setPage("reviews")} style={{ padding: "16px 28px", fontSize: 15 }}>
                See Reviews
              </button>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
              {[["500+", "Orders Delivered"], ["15+", "Cities Reached"], ["4.9★", "Average Rating"]].map(([val, lab]) => (
                <div key={lab}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--white)" }}>{val}</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{lab}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", animation: "fadeUp 0.8s ease 0.2s both" }}>
            <div style={{ borderRadius: "var(--r-xl)", overflow: "hidden", aspectRatio: "3/4" }}>
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&q=85"
                alt="Hero"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {/* Floating cards */}
            <div style={{ position: "absolute", bottom: 32, left: -32, background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "16px 20px", backdropFilter: "blur(12px)", animation: "float 5s ease-in-out infinite" }}>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Just Purchased</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginTop: 2 }}>Obsidian Pro Runner</div>
              <div style={{ fontSize: 12, color: "var(--neon)", marginTop: 4 }}>2 min ago · US 10</div>
            </div>
            <div style={{ position: "absolute", top: 32, right: -24, background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "14px 18px", animation: "float 7s ease-in-out infinite reverse" }}>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Free Shipping</div>
              <div style={{ fontWeight: 700, color: "var(--neon)", fontSize: 14 }}>Orders over $50</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="section-sm" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { icon: "truck", title: "Free Shipping", sub: "On orders over $50" },
              { icon: "shield", title: "Secure Checkout", sub: "256-bit SSL encryption" },
              { icon: "refresh", title: "30-Day Returns", sub: "Hassle-free policy" },
              { icon: "star", title: "4.9/5 Rating", sub: "10,000+ reviews" },
            ].map(b => (
              <div key={b.title} style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", background: "var(--surface)", borderRadius: "var(--r-md)", border: "1px solid var(--border)" }}>
                <div style={{ width: 44, height: 44, borderRadius: "var(--r-sm)", background: "rgba(255,77,28,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}>
                  <Icon name={b.icon} size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{b.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>Featured</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, letterSpacing: -1 }}>Trending Now</h2>
            </div>
            <button className="btn-outline" onClick={() => setPage("products")}>View All <Icon name="arrowRight" size={15} /></button>
          </div>
          <div className="grid-4">
            {PRODUCTS.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} onView={onViewProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section style={{ margin: "0 0 80px" }}>
        <div className="container">
          <div style={{
            borderRadius: "var(--r-xl)", overflow: "hidden", position: "relative",
            background: "linear-gradient(135deg, #1a0800, #0d0d0d)",
            padding: "64px 56px", border: "1px solid var(--border)"
          }}>
            <div style={{ position: "absolute", right: -40, top: -40, width: 400, height: 400, background: "radial-gradient(circle, rgba(255,77,28,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
            <div style={{ position: "relative", maxWidth: 500 }}>
              <div className="badge badge-accent" style={{ marginBottom: 20 }}>Limited Time</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 44, letterSpacing: -1, lineHeight: 1.1, marginBottom: 16 }}>
                Up to <span style={{ color: "var(--accent)" }}>40% Off</span><br />Summer Edit
              </h2>
              <p style={{ color: "var(--text-mid)", marginBottom: 32, fontSize: 16 }}>
                Shop the season's best picks before they're gone.
              </p>
              <button className="btn-primary" onClick={() => setPage("products")} style={{ padding: "16px 36px", fontSize: 15 }}>
                Shop the Sale <Icon name="tag" size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: "var(--void)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>Social Proof</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, letterSpacing: -1 }}>What They're Saying</h2>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card" style={{ padding: "28px" }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {Array(t.rating).fill(0).map((_, j) => <span key={j} style={{ color: "var(--gold)" }}>★</span>)}
                </div>
                <p style={{ color: "var(--text-mid)", lineHeight: 1.7, marginBottom: 20, fontSize: 15 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    {t.verified && <div style={{ fontSize: 11, color: "var(--neon)" }}>✓ Verified Buyer</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section">
        <div className="container">
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--r-xl)", padding: "56px",
            textAlign: "center", position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,77,28,0.04) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            <div style={{ position: "relative" }}>
              <div className="badge badge-neon" style={{ marginBottom: 20 }}>Newsletter</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, letterSpacing: -1, marginBottom: 12 }}>Get Early Access</h2>
              <p style={{ color: "var(--text-mid)", fontSize: 16, marginBottom: 36 }}>New drops, exclusive deals, and behind-the-scenes — straight to your inbox.</p>
              {!subDone ? (
                <div style={{ display: "flex", gap: 12, maxWidth: 420, margin: "0 auto" }}>
                  <input className="input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                  <button className="btn-primary" style={{ whiteSpace: "nowrap", flexShrink: 0 }} onClick={() => { if (email) { setSubDone(true); } }}>
                    Subscribe
                  </button>
                </div>
              ) : (
                <div style={{ color: "var(--neon)", fontSize: 18, fontWeight: 600 }}>
                  <Icon name="check" size={20} /> You're in! Welcome to the family 🎉
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- PRODUCTS PAGE ---
const ProductsPage = ({ onViewProduct }) => {
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState(500);
  const { addToCart } = useContext(AppContext);

  let filtered = PRODUCTS.filter(p =>
    (cat === "All" || p.category === cat) &&
    (search === "" || p.name.toLowerCase().includes(search.toLowerCase())) &&
    p.price <= priceRange
  );

  if (sort === "price-low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "price-high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else if (sort === "discount") filtered = [...filtered].sort((a, b) =>
    ((b.originalPrice - b.price) / b.originalPrice) - ((a.originalPrice - a.price) / a.originalPrice)
  );

  const totalProducts = PRODUCTS.length;
  const inStockCount = filtered.length;

  return (
    <div className="page">
      <section className="section">
        <div className="container">

          {/* ── HEADER ── */}
          <div style={{ marginBottom: 40, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
                SS26 Collection
              </div>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 5vw, 48px)", letterSpacing: -2, color: "var(--white)" }}>
                All Products
              </h1>
              <p style={{ color: "var(--text-dim)", fontSize: 14, marginTop: 8 }}>
                {totalProducts} pieces. Zero compromise.
              </p>
            </div>
            {/* Live badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 20, padding: "8px 16px" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--neon)", display: "inline-block", boxShadow: "0 0 8px var(--neon)" }} />
              <span style={{ fontSize: 12, color: "var(--neon)", fontWeight: 600 }}>In Stock — Ships Today</span>
            </div>
          </div>

          {/* ── FILTER BAR ── */}
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)", padding: "20px 24px",
            marginBottom: 32, display: "flex",
            flexDirection: "column", gap: 16
          }}>
            {/* Category tabs */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATEGORIES.map(c => (
                <button key={c}
                  onClick={() => setCat(c)}
                  style={{
                    padding: "8px 18px", borderRadius: 20, cursor: "pointer",
                    fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13,
                    background: cat === c ? "var(--accent)" : "var(--card)",
                    color: cat === c ? "#fff" : "var(--text-mid)",
                    border: cat === c ? "none" : "1px solid var(--border)",
                    transition: "all 0.2s ease",
                  }}
                >{c}</button>
              ))}
            </div>

            {/* Search + Sort + View + Price */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {/* Search */}
              <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontSize: 14 }}>🔍</span>
                <input
                  className="input"
                  style={{ width: "100%", padding: "10px 14px 10px 34px", background: "var(--card)" }}
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Sort */}
              <select
                className="input"
                style={{ padding: "10px 14px", background: "var(--card)", minWidth: 160 }}
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="featured">⭐ Featured</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="rating">🏆 Top Rated</option>
                <option value="discount">🔥 Best Discount</option>
              </select>

              {/* Price range */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-mid)", fontSize: 13 }}>
                <span>Max:</span>
                <input type="range" min={50} max={500} value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  style={{ width: 100, accentColor: "var(--accent)" }}
                />
                <span style={{ color: "var(--white)", fontWeight: 700, minWidth: 40 }}>${priceRange}</span>
              </div>

              {/* View toggle */}
              <div style={{ display: "flex", gap: 4, background: "var(--card)", borderRadius: 8, padding: 4, border: "1px solid var(--border)" }}>
                {["grid", "list"].map(v => (
                  <button key={v}
                    onClick={() => setView(v)}
                    style={{
                      padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                      background: view === v ? "var(--accent)" : "transparent",
                      color: view === v ? "#fff" : "var(--text-dim)",
                      fontSize: 13, fontWeight: 600, transition: "all 0.2s ease",
                    }}
                  >{v === "grid" ? "⊞ Grid" : "☰ List"}</button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RESULTS COUNT ── */}
          <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-dim)", fontSize: 14 }}>
              Showing <span style={{ color: "var(--white)", fontWeight: 700 }}>{inStockCount}</span> of {totalProducts} products
            </span>
            {cat !== "All" && (
              <button onClick={() => { setCat("All"); setSearch(""); setPriceRange(500); }}
                style={{ fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Clear filters
              </button>
            )}
          </div>

          {/* ── PRODUCTS ── */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-dim)" }}>
              <div style={{ fontSize: 56 }}>🔍</div>
              <div style={{ marginTop: 16, fontSize: 20, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-mid)" }}>No products found</div>
              <button onClick={() => { setCat("All"); setSearch(""); setPriceRange(500); }}
                style={{ marginTop: 20, padding: "10px 24px", background: "var(--accent)", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontWeight: 600 }}>
                Reset Filters
              </button>
            </div>
          ) : view === "grid" ? (
            <div className="grid-4">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onView={onViewProduct} />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map(p => (
                <div key={p.id}
                  onClick={() => onViewProduct(p)}
                  style={{
                    display: "flex", gap: 20, padding: 20, cursor: "pointer",
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: "var(--r-md)", transition: "border-color 0.2s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  <img src={p.image} alt={p.name}
                    style={{ width: 110, height: 110, objectFit: "cover", borderRadius: "var(--r-sm)", flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1 }}>{p.category}</span>
                        {p.badge && (
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "rgba(255,77,28,0.15)", color: "var(--accent)", border: "1px solid rgba(255,77,28,0.3)" }}>
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{p.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <StarRating rating={p.rating} />
                        <span style={{ fontSize: 12, color: "var(--text-dim)" }}>({p.reviews} reviews)</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--white)" }}>${p.price}</span>
                        {p.originalPrice && (
                          <>
                            <span style={{ fontSize: 14, color: "var(--text-dim)", textDecoration: "line-through" }}>${p.originalPrice}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--neon)" }}>
                              -{Math.round((1 - p.price / p.originalPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); addToCart(p); }}
                        style={{
                          padding: "8px 20px", background: "var(--accent)", border: "none",
                          borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                        }}
                      >Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
// --- PRODUCT DETAIL PAGE ---
const ProductDetailPage = ({ product, onBack }) => {
  const { state, dispatch } = useContext(AppContext);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedColor, setSelectedColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const inWishlist = state.wishlist.find(i => i.id === product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const addToCart = () => {
    for (let i = 0; i < qty; i++) {
      dispatch({ type: "ADD_TO_CART", item: { ...product, variant: selectedVariant } });
    }
    dispatch({ type: "SET_TOAST", toast: { title: "Added to Cart!", msg: `${product.name} × ${qty}` } });
    dispatch({ type: "TOGGLE_CART" });
  };

  return (
    <div className="page">
      <section className="section">
        <div className="container">
          <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 32, color: "var(--text-dim)" }}>
            ← Back to Products
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
            {/* Image */}
            <div>
              <div style={{ borderRadius: "var(--r-xl)", overflow: "hidden", aspectRatio: "1", position: "relative" }}>
                <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {discount && <span className="badge badge-neon" style={{ position: "absolute", top: 20, left: 20 }}>-{discount}%</span>}
              </div>
            </div>

            {/* Info */}
            <div style={{ animation: "fadeUp 0.5s ease" }}>
              <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{product.category}</div>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, letterSpacing: -1, marginBottom: 16 }}>{product.name}</h1>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <StarRating rating={product.rating} size={16} />
                <span style={{ fontSize: 14, color: "var(--text-mid)" }}>{product.rating} ({product.reviews} reviews)</span>
                <span className="badge badge-neon">Verified</span>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 32 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 42, color: "var(--white)" }}>${product.price}</span>
                {product.originalPrice && (
                  <span style={{ fontSize: 20, color: "var(--text-dim)", textDecoration: "line-through" }}>${product.originalPrice}</span>
                )}
                {discount && <span className="badge badge-accent">Save {discount}%</span>}
              </div>

              {/* Colors */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "var(--text-mid)" }}>COLOR</div>
                <div style={{ display: "flex", gap: 10 }}>
                  {product.colors.map((c, i) => (
                    <button key={i} onClick={() => setSelectedColor(i)} style={{
                      width: 32, height: 32, borderRadius: "50%", background: c,
                      border: selectedColor === i ? "2px solid var(--accent)" : "2px solid transparent",
                      outline: selectedColor === i ? "2px solid var(--accent)" : "none",
                      outlineOffset: 3, cursor: "pointer", transition: "all 0.15s"
                    }} />
                  ))}
                </div>
              </div>

              {/* Variants */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "var(--text-mid)" }}>
                  {product.category === "Footwear" ? "SIZE" : "SELECT"}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.variants.map(v => (
                    <button key={v} className={`tag ${selectedVariant === v ? "active" : ""}`} onClick={() => setSelectedVariant(v)}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty + Actions */}
              <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "4px 8px" }}>
                  <button style={{ background: "none", color: "var(--text)", padding: 8, display: "flex" }} onClick={() => setQty(Math.max(1, qty - 1))}>
                    <Icon name="minus" size={16} />
                  </button>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, minWidth: 28, textAlign: "center" }}>{qty}</span>
                  <button style={{ background: "none", color: "var(--text)", padding: 8, display: "flex" }} onClick={() => setQty(qty + 1)}>
                    <Icon name="plus" size={16} />
                  </button>
                </div>
                <button className="btn-primary" onClick={addToCart} style={{ flex: 1, justifyContent: "center", padding: "14px 24px", fontSize: 15 }}>
                  <Icon name="cart" size={18} /> Add to Cart
                </button>
                <button
                  className="btn-outline"
                  onClick={() => { dispatch({ type: "TOGGLE_WISHLIST", item: product }); dispatch({ type: "SET_TOAST", toast: { title: inWishlist ? "Removed" : "Wishlisted!", msg: product.name } }); }}
                  style={{ padding: "14px 16px" }}
                >
                  <Icon name={inWishlist ? "heartFill" : "heart"} size={18} />
                </button>
              </div>

              {/* Benefits */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "truck", text: "Free shipping on this order" },
                  { icon: "refresh", text: "30-day hassle-free returns" },
                  { icon: "shield", text: "2-year warranty included" },
                ].map(b => (
                  <div key={b.icon} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-mid)", fontSize: 14 }}>
                    <Icon name={b.icon} size={16} />
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ marginTop: 64 }}>
            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", marginBottom: 32 }}>
              {[["desc", "Description"], ["specs", "Specifications"], ["reviews", "Reviews"]].map(([t, l]) => (
                <button key={t} onClick={() => setTab(t)} style={{
                  background: "none", padding: "16px 24px", fontWeight: 600,
                  color: tab === t ? "var(--white)" : "var(--text-dim)",
                  borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
                  transition: "all 0.15s", fontSize: 15
                }}>{l}</button>
              ))}
            </div>
            {tab === "desc" && <p style={{ color: "var(--text-mid)", lineHeight: 1.8, fontSize: 16, maxWidth: 700 }}>{product.description}</p>}
            {tab === "specs" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 600 }}>
                {[["Category", product.category], ["Available Sizes", product.variants.join(", ")], ["Rating", `${product.rating}/5 ★`], ["Reviews", product.reviews], ["Material", "Premium Quality"], ["Origin", "Ethically Made"]].map(([k, v]) => (
                  <div key={k} style={{ padding: "16px 20px", background: "var(--surface)", borderRadius: "var(--r-sm)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</div>
                    <div style={{ fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            )}
            {tab === "reviews" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 40, maxWidth: 700 }}>
                  <div style={{ textAlign: "center", padding: "32px 24px", background: "var(--surface)", borderRadius: "var(--r-md)", border: "1px solid var(--border)" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 64, color: "var(--white)", lineHeight: 1 }}>{product.rating}</div>
                    <StarRating rating={product.rating} size={20} />
                    <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 8 }}>{product.reviews} reviews</div>
                  </div>
                  <div>
                    {TESTIMONIALS.map((t, i) => (
                      <div key={i} style={{ padding: "20px 0", borderBottom: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                          {Array(t.rating).fill(0).map((_, j) => <span key={j} style={{ color: "var(--gold)", fontSize: 14 }}>★</span>)}
                        </div>
                        <p style={{ color: "var(--text-mid)", fontSize: 14, marginBottom: 10 }}>"{t.text}"</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{t.avatar}</div>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</span>
                          {t.verified && <span style={{ fontSize: 11, color: "var(--neon)" }}>✓ Verified</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

// --- HELP PAGE ---
const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = FAQS.filter(f =>
    search === "" || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>Support</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 44, letterSpacing: -1, marginBottom: 16 }}>Help Center</h1>
            <p style={{ color: "var(--text-mid)", fontSize: 16 }}>Find answers to frequently asked questions.</p>
            <div style={{ marginTop: 28, position: "relative", maxWidth: 480, margin: "28px auto 0" }}>
              <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }}><Icon name="search" /></div>
              <input className="input" style={{ paddingLeft: 46 }} placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div>
            {filtered.map((f, i) => (
              <div key={i} className="accordion-item">
                <div className="accordion-header" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{f.q}</span>
                  {openFaq === i ? <Icon name="chevronUp" size={18} /> : <Icon name="chevronDown" size={18} />}
                </div>
                {openFaq === i && <div className="accordion-body">{f.a}</div>}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-dim)" }}>No results found for "{search}"</div>
            )}
          </div>

          <div style={{ marginTop: 56, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "36px", textAlign: "center" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Still need help?</h3>
            <p style={{ color: "var(--text-mid)", marginBottom: 24 }}>Our support team is available 24/7 to assist you.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary">Live Chat</button>
              <button className="btn-outline">Email Support</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- CONTACT PAGE ---
const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const { dispatch } = useContext(AppContext);

  const handleSubmit = () => {
    if (form.name && form.email && form.message) {
      setSent(true);
      dispatch({ type: "SET_TOAST", toast: { title: "Message Sent!", msg: "We'll reply within 24 hours." } });
    }
  };

  return (
    <div className="page">
      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ marginBottom: 56, textAlign: "center" }}>
            <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>Get in Touch</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 44, letterSpacing: -1 }}>Contact Us</h1>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48 }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 24 }}>Reach Out</h3>
              {[
                { icon: "mail", label: "Email", val: "hello@ZROM.store" },
                { icon: "phone", label: "Phone", val: "+1 (555) 000-1234" },
                { icon: "truck", label: "Hours", val: "Mon-Fri, 9AM-6PM EST" },
              ].map(c => (
                <div key={c.icon} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "var(--r-sm)", background: "rgba(255,77,28,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}>
                    <Icon name={c.icon} size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{c.val}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: "36px" }}>
              {!sent ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-mid)" }}>Name</label>
                      <input className="input" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-mid)" }}>Email</label>
                      <input className="input" placeholder="john@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-mid)" }}>Subject</label>
                    <input className="input" placeholder="What's it about?" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-mid)" }}>Message</label>
                    <textarea className="input" rows={5} placeholder="Tell us everything..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: "vertical" }} />
                  </div>
                  <button className="btn-primary" onClick={handleSubmit} style={{ justifyContent: "center", padding: "14px" }}>
                    Send Message <Icon name="arrowRight" size={16} />
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, marginBottom: 8 }}>Message Sent!</h3>
                  <p style={{ color: "var(--text-mid)" }}>We'll get back to you within 24 hours.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- REVIEWS PAGE ---
const ReviewsPage = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState({ name: "", review: "" });
  const [submitted, setSubmitted] = useState(false);
  const { dispatch } = useContext(AppContext);

  const submitReview = () => {
    if (rating && form.name && form.review) {
      setSubmitted(true);
      dispatch({ type: "SET_TOAST", toast: { title: "Review Submitted!", msg: "Thank you for your feedback!" } });
    }
  };

  return (
    <div className="page">
      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>Reviews</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 44, letterSpacing: -1 }}>Customer Reviews</h1>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 40, marginBottom: 56 }}>
            <div style={{ textAlign: "center", padding: "40px 32px", background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 72, color: "var(--white)", lineHeight: 1 }}>4.9</div>
              <StarRating rating={5} size={24} />
              <div style={{ color: "var(--text-dim)", marginTop: 8 }}>Based on 1,285 reviews</div>
            </div>
            <div style={{ padding: "24px 0" }}>
              {[5, 4, 3, 2, 1].map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: "var(--text-mid)", width: 12 }}>{s}</span>
                  <span style={{ color: "var(--gold)", fontSize: 14 }}>★</span>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${[88, 8, 2, 1, 1][5 - s]}%` }} />
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-dim)", width: 28 }}>{[88, 8, 2, 1, 1][5 - s]}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews list */}
          <div style={{ marginBottom: 56 }}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} style={{ padding: "24px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, flexShrink: 0 }}>{t.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600 }}>{t.name}</span>
                      {t.verified && <span className="badge badge-neon" style={{ fontSize: 10 }}>✓ Verified</span>}
                    </div>
                    <StarRating rating={t.rating} />
                    <p style={{ color: "var(--text-mid)", marginTop: 10, lineHeight: 1.7 }}>{t.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Write Review */}
          {!submitted ? (
            <div className="card" style={{ padding: "40px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, marginBottom: 28 }}>Write a Review</h3>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: "var(--text-mid)" }}>Your Rating</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}
                      style={{ background: "none", fontSize: 32, color: (hover || rating) >= s ? "var(--gold)" : "var(--muted)", transition: "color 0.1s", cursor: "pointer" }}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <textarea className="input" rows={4} placeholder="Share your experience..." value={form.review} onChange={e => setForm({ ...form, review: e.target.value })} style={{ resize: "vertical" }} />
                <div style={{ display: "flex", gap: 12 }}>
                  <button className="btn-outline" style={{ gap: 8 }}><Icon name="upload" size={15} /> Add Photo</button>
                  <button className="btn-primary" onClick={submitReview}>Submit Review</button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "48px", background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 48 }}>⭐</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, marginTop: 16, marginBottom: 8 }}>Thanks for your review!</h3>
              <p style={{ color: "var(--text-mid)" }}>Your feedback helps others make better decisions.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// --- LOGIN PAGE ---
const LoginPage = ({ setPage }) => {
  const { dispatch } = useContext(AppContext);
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  // eslint-disable-next-line no-unused-vars
  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (tab === "signup" && !form.name.trim()) e.name = "Name required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAuth = async () => {
  setLoading(true);
  try {
    if (tab === "login") {
      await signInWithEmailAndPassword(auth, form.email, form.password);
    } else {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
    }
    dispatch({ type: "SET_TOAST", toast: { title: "Welcome! 🔥", msg: form.email } });
    setPage("profile");
  } catch (err) {
    setErrors({ email: err.message });
  }
  setLoading(false);
};

  const handleGoogle = async () => {
  setLoading(true);
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    dispatch({ type: "SET_TOAST", toast: { title: "Welcome! 🔥", msg: "Signed in with Google" } });
    setPage("profile");
  } catch (err) {
    setErrors({ email: err.message });
  }
  setLoading(false);
};

  return (
    <div className="page" style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", position: "relative", overflow: "hidden",
    }}>
      {/* BG glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, background: "radial-gradient(circle, rgba(255,77,28,0.08) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 440, padding: "0 24px", position: "relative", zIndex: 1 }}>

        {/* ── LOGO ── */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <button onClick={() => setPage("home")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 20, color: "#fff",
            }}>Z</div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--white)", letterSpacing: -1 }}>ZROM</span>
          </button>
          <p style={{ color: "var(--text-dim)", fontSize: 14 }}>
            {tab === "login" ? "Welcome back! Sign in to continue." : "Join ZROM. Be different."}
          </p>
        </div>

        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "var(--r-xl)", padding: "36px 32px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
        }}>

          {/* ── TABS ── */}
          <div style={{ display: "flex", background: "var(--surface)", borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {["login", "signup"].map(t => (
              <button key={t} onClick={() => { setTab(t); setErrors({}); }}
                style={{
                  flex: 1, padding: "11px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: tab === t ? "var(--accent)" : "transparent",
                  color: tab === t ? "#fff" : "var(--text-dim)",
                  fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14,
                  transition: "all 0.25s ease",
                }}>
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* ── GOOGLE ── */}
          <button onClick={handleGoogle}
            style={{
              width: "100%", padding: "13px", borderRadius: 10,
              background: "var(--surface)", border: "1px solid var(--border)",
              color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 600,
              fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 10, marginBottom: 20,
              transition: "border-color 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <span style={{ fontSize: 18 }}>G</span> Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 12, color: "var(--text-dim)" }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* ── FORM ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {tab === "signup" && (
              <div>
                <input className="input" placeholder="Full Name"
                  value={form.name}
                  onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                  style={{ width: "100%", borderColor: errors.name ? "#ff6b6b" : undefined }}
                />
                {errors.name && <div style={{ fontSize: 11, color: "#ff6b6b", marginTop: 4 }}>⚠ {errors.name}</div>}
              </div>
            )}

            <div>
              <input className="input" type="email" placeholder="Email address"
                value={form.email}
                onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                style={{ width: "100%", borderColor: errors.email ? "#ff6b6b" : undefined }}
              />
              {errors.email && <div style={{ fontSize: 11, color: "#ff6b6b", marginTop: 4 }}>⚠ {errors.email}</div>}
            </div>

            <div>
              <div style={{ position: "relative" }}>
                <input className="input" type={showPass ? "text" : "password"} placeholder="Password"
                  value={form.password}
                  onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: "" }); }}
                  style={{ width: "100%", paddingRight: 44, borderColor: errors.password ? "#ff6b6b" : undefined }}
                />
                <button onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)", fontSize: 14 }}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && <div style={{ fontSize: 11, color: "#ff6b6b", marginTop: 4 }}>⚠ {errors.password}</div>}
            </div>

            {tab === "login" && (
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--accent)", textAlign: "right", padding: 0, fontFamily: "var(--font-body)" }}>
                Forgot password?
              </button>
            )}

            {/* Submit */}
            <button onClick={handleAuth} disabled={loading}
              style={{
                padding: "15px", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer",
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                opacity: loading ? 0.8 : 1, transition: "opacity 0.2s ease",
              }}>
              {loading ? (
                <span style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
              ) : (
                tab === "login" ? "Sign In to ZROM 🔥" : "Create My Account 🚀"
              )}
            </button>
          </div>

          {/* ── BOTTOM NOTE ── */}
          <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-dim)", marginTop: 20, lineHeight: 1.6 }}>
            By continuing, you agree to ZROM's{" "}
            <span style={{ color: "var(--accent)", cursor: "pointer" }}>Terms</span> &{" "}
            <span style={{ color: "var(--accent)", cursor: "pointer" }}>Privacy Policy</span>
          </p>
        </div>

        {/* Trust */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 24 }}>
          {["🔒 Secure", "✅ Verified", "🚀 Fast"].map(t => (
            <span key={t} style={{ fontSize: 12, color: "var(--text-dim)" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- PROFILE PAGE ---
const ProfilePage = ({ setPage }) => {
  const { state, dispatch } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("orders");

  if (!state.user) {
    return (
      <div className="page" style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "100vh", gap: 20,
        background: "radial-gradient(circle at 50% 40%, rgba(255,77,28,0.06) 0%, transparent 60%)",
      }}>
        <div style={{ fontSize: 64 }}>👤</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, letterSpacing: -1 }}>
          Sign in to ZROM
        </h2>
        <p style={{ color: "var(--text-dim)", fontSize: 15 }}>Access your orders, wishlist & rewards</p>
        <button className="btn-primary" onClick={() => setPage("login")}
          style={{ padding: "14px 36px", fontSize: 15 }}>
          Sign In / Register 🔥
        </button>
      </div>
    );
  }

  const orders = [
    { id: "#ZR-00123", date: "May 8, 2026", status: "Delivered", total: 189, items: 1 },
    { id: "#ZR-00118", date: "Apr 22, 2026", status: "Shipped", total: 348, items: 2 },
    { id: "#ZR-00102", date: "Apr 5, 2026", status: "Delivered", total: 79, items: 3 },
  ];

  const statusColor = {
    Delivered: "var(--neon)",
    Shipped: "var(--blue)",
    Processing: "var(--gold)",
  };

  const statusBg = {
    Delivered: "rgba(0,255,136,0.08)",
    Shipped: "rgba(59,130,246,0.08)",
    Processing: "rgba(245,158,11,0.08)",
  };

  const tabs = [
    { id: "orders", label: "Orders", emoji: "📦" },
    { id: "wishlist", label: "Wishlist", emoji: "❤️" },
    { id: "rewards", label: "Rewards", emoji: "⭐" },
    { id: "settings", label: "Settings", emoji: "⚙️" },
  ];

  return (
    <div className="page">
      <section className="section">
        <div className="container" style={{ maxWidth: 960 }}>

          {/* ── PROFILE HEADER ── */}
          <div style={{
            display: "flex", alignItems: "center", gap: 24,
            marginBottom: 32, padding: "28px 32px",
            background: "linear-gradient(135deg, var(--surface), var(--card))",
            borderRadius: "var(--r-xl)", border: "1px solid var(--border)",
            position: "relative", overflow: "hidden",
          }}>
            {/* BG glow */}
            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, background: "radial-gradient(circle, rgba(255,77,28,0.08) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

            {/* Avatar */}
            <div style={{
              width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 28, color: "#fff",
              boxShadow: "0 0 24px rgba(255,77,28,0.3)",
            }}>
              {state.user.name.charAt(0).toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--white)" }}>
                  {state.user.name}
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: "rgba(255,77,28,0.15)", color: "var(--accent)", border: "1px solid rgba(255,77,28,0.3)" }}>
                  ZROM MEMBER
                </span>
              </div>
              <div style={{ color: "var(--text-dim)", fontSize: 14 }}>{state.user.email}</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>
                Member since SS26 · 3 orders placed
              </div>
            </div>

            <button
              onClick={() => { dispatch({ type: "LOGOUT" }); setPage("home"); }}
              style={{
                padding: "10px 20px", borderRadius: 10,
                background: "var(--surface)", border: "1px solid var(--border)",
                color: "var(--text-mid)", fontFamily: "var(--font-body)",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff6b6b"; e.currentTarget.style.color = "#ff6b6b"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-mid)"; }}
            >Sign Out</button>
          </div>

          {/* ── STATS ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
            {[
              { label: "Orders", val: "3", icon: "📦", color: "var(--accent)" },
              { label: "Wishlist", val: state.wishlist?.length || 0, icon: "❤️", color: "#ff6b9d" },
              { label: "Points", val: "820", icon: "⭐", color: "var(--gold)" },
              { label: "Saved", val: "$68", icon: "💰", color: "var(--neon)" },
            ].map(s => (
              <div key={s.label} style={{
                padding: "20px", background: "var(--surface)",
                borderRadius: "var(--r-md)", border: "1px solid var(--border)",
                textAlign: "center", transition: "border-color 0.2s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = s.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── TABS ── */}
          <div style={{ display: "flex", gap: 4, background: "var(--surface)", borderRadius: 12, padding: 4, marginBottom: 28, border: "1px solid var(--border)" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{
                  flex: 1, padding: "10px 8px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: activeTab === t.id ? "var(--accent)" : "transparent",
                  color: activeTab === t.id ? "#fff" : "var(--text-dim)",
                  fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13,
                  transition: "all 0.2s ease", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 6,
                }}>
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* ── ORDERS TAB ── */}
          {activeTab === "orders" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {orders.map(o => (
                <div key={o.id} style={{
                  padding: "20px 24px", display: "flex", alignItems: "center", gap: 20,
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--r-md)", transition: "border-color 0.2s ease",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: "var(--r-sm)", flexShrink: 0,
                    background: "rgba(255,77,28,0.1)", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 20,
                  }}>📦</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--white)", marginBottom: 2 }}>{o.id}</div>
                    <div style={{ fontSize: 13, color: "var(--text-dim)" }}>{o.date} · {o.items} item{o.items > 1 ? "s" : ""}</div>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                    color: statusColor[o.status], background: statusBg[o.status],
                    border: `1px solid ${statusColor[o.status]}33`,
                  }}>{o.status}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--white)" }}>${o.total}</span>
                  <button style={{
                    padding: "7px 16px", borderRadius: 8, background: "var(--card)",
                    border: "1px solid var(--border)", color: "var(--text-mid)",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
                  }}>Track</button>
                </div>
              ))}
            </div>
          )}

          {/* ── WISHLIST TAB ── */}
          {activeTab === "wishlist" && (
            state.wishlist?.length > 0 ? (
              <div className="grid-4">
                {state.wishlist.map(p => (
                  <ProductCard key={p.id} product={p} onView={() => {}} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-dim)" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>❤️</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-mid)", marginBottom: 8 }}>Wishlist is empty</div>
                <button className="btn-primary" onClick={() => setPage("products")} style={{ marginTop: 8 }}>
                  Browse Products
                </button>
              </div>
            )
          )}

          {/* ── REWARDS TAB ── */}
          {activeTab === "rewards" && (
            <div>
              {/* Points card */}
              <div style={{
                padding: "32px", borderRadius: "var(--r-xl)", marginBottom: 24,
                background: "linear-gradient(135deg, rgba(255,77,28,0.15), rgba(255,140,66,0.08))",
                border: "1px solid rgba(255,77,28,0.25)", textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>⭐</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 48, color: "var(--accent)" }}>820</div>
                <div style={{ color: "var(--text-mid)", fontSize: 15, marginBottom: 16 }}>ZROM Points</div>
                <div style={{ fontSize: 13, color: "var(--text-dim)" }}>180 points away from <span style={{ color: "var(--gold)", fontWeight: 700 }}>Gold Status 🏆</span></div>
                {/* Progress */}
                <div style={{ height: 6, background: "var(--border)", borderRadius: 4, margin: "16px auto", maxWidth: 300, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "82%", background: "linear-gradient(90deg, var(--accent), var(--accent2))", borderRadius: 4 }} />
                </div>
              </div>
              {/* Perks */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                {[
                  { emoji: "🎁", title: "Free Gift", desc: "At 1000 points", locked: true },
                  { emoji: "💸", title: "10% Off", desc: "Next order", locked: false },
                  { emoji: "🚚", title: "Free Express", desc: "Shipping upgrade", locked: false },
                ].map(p => (
                  <div key={p.title} style={{
                    padding: "20px", background: "var(--surface)", borderRadius: "var(--r-md)",
                    border: `1px solid ${p.locked ? "var(--border)" : "rgba(255,77,28,0.3)"}`,
                    textAlign: "center", opacity: p.locked ? 0.5 : 1,
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{p.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--white)" }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>{p.desc}</div>
                    {p.locked && <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 8 }}>🔒 Locked</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Full Name", value: state.user.name, type: "text" },
                { label: "Email", value: state.user.email, type: "email" },
                { label: "Phone", value: "+1 (555) 000-0000", type: "tel" },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{f.label}</label>
                  <input className="input" type={f.type} defaultValue={f.value} style={{ width: "100%" }} />
                </div>
              ))}
              <button className="btn-primary" style={{ alignSelf: "flex-start", padding: "12px 28px", marginTop: 8 }}>
                Save Changes
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

// --- REFUNDS PAGE ---
const RefundsPage = () => {
  const [form, setForm] = useState({ order: "", email: "", reason: "", details: "" });
  const [submitted, setSubmitted] = useState(false);
  const { dispatch } = useContext(AppContext);

  return (
    <div className="page">
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>Policy</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 44, letterSpacing: -1 }}>Returns & Refunds</h1>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 48 }}>
            {[
              { icon: "refresh", title: "30-Day Returns", desc: "Return any item within 30 days of delivery." },
              { icon: "shield", title: "Full Refunds", desc: "100% refund to original payment method." },
              { icon: "truck", title: "Free Return Shipping", desc: "We cover the return shipping cost." },
            ].map(c => (
              <div key={c.title} className="card" style={{ padding: "24px", textAlign: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "var(--r-md)", background: "rgba(255,77,28,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", margin: "0 auto 16px" }}>
                  <Icon name={c.icon} size={22} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-dim)" }}>{c.desc}</div>
              </div>
            ))}
          </div>

          {!submitted ? (
            <div className="card" style={{ padding: "40px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginBottom: 28 }}>Request a Return</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-mid)" }}>Order Number</label>
                    <input className="input" placeholder="#NX-00000" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-mid)" }}>Email Address</label>
                    <input className="input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-mid)" }}>Reason for Return</label>
                  <select className="input" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}>
                    <option value="">Select a reason...</option>
                    <option>Doesn't fit</option>
                    <option>Changed my mind</option>
                    <option>Defective or damaged</option>
                    <option>Wrong item received</option>
                    <option>Not as described</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "var(--text-mid)" }}>Additional Details</label>
                  <textarea className="input" rows={4} placeholder="Any additional information..." value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} style={{ resize: "vertical" }} />
                </div>
                <button className="btn-primary" style={{ justifyContent: "center", padding: "14px" }}
                  onClick={() => { if (form.order && form.email && form.reason) { setSubmitted(true); dispatch({ type: "SET_TOAST", toast: { title: "Return Requested!", msg: "We'll email you a prepaid label." } }); } }}>
                  Submit Return Request
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px", background: "var(--surface)", borderRadius: "var(--r-xl)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, marginBottom: 8 }}>Return Approved</h3>
              <p style={{ color: "var(--text-mid)" }}>Check your email for a prepaid return shipping label.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// --- PRIVACY PAGE ---
const PrivacyPage = () => (
  <div className="page">
    <section className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>Legal</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 44, letterSpacing: -1 }}>Privacy Policy</h1>
          <p style={{ color: "var(--text-dim)", marginTop: 8 }}>Last updated: January 1, 2025</p>
        </div>
        {[
          { title: "Information We Collect", body: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes name, email address, shipping address, and payment information (processed securely by our payment providers)." },
          { title: "How We Use Your Information", body: "We use the information we collect to process orders, send transactional emails, provide customer support, improve our products and services, and send promotional communications (with your consent)." },
          { title: "Information Sharing", body: "We do not sell or rent your personal information to third parties. We may share information with service providers who assist in our operations, subject to confidentiality agreements." },
          { title: "Data Security", body: "We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal information from unauthorized access or disclosure." },
          { title: "Your Rights", body: "You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time by clicking the unsubscribe link or contacting us." },
          { title: "Cookies", body: "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser." },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: 32 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 12 }}>{s.title}</h3>
            <p style={{ color: "var(--text-mid)", lineHeight: 1.8 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

// --- 404 PAGE ---
const NotFoundPage = ({ setPage }) => (
  <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
    <div style={{ textAlign: "center", padding: "0 24px" }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(100px, 20vw, 200px)", lineHeight: 1, background: "linear-gradient(135deg, var(--accent), var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>404</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, marginBottom: 12 }}>Page not found</h2>
      <p style={{ color: "var(--text-mid)", marginBottom: 36 }}>The page you're looking for doesn't exist or has been moved.</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={() => setPage("home")}>Go Home</button>
        <button className="btn-outline" onClick={() => setPage("products")}>Browse Shop</button>
      </div>
    </div>
  </div>
);

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [page, setPage] = useState("home");
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch({ type: "SET_USER", user });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  });
  return () => unsubscribe();
}, []);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setPage("product-detail");
  };

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} onViewProduct={handleViewProduct} />;
      case "products": return <ProductsPage onViewProduct={handleViewProduct} />;
      case "product-detail": return selectedProduct ? <ProductDetailPage product={selectedProduct} onBack={() => setPage("products")} /> : <ProductsPage onViewProduct={handleViewProduct} />;
      case "help": return <HelpPage />;
      case "contact": return <ContactPage />;
      case "reviews": return <ReviewsPage />;
      case "login": return <LoginPage setPage={setPage} />;
      case "profile": return <ProfilePage setPage={setPage} />;
      case "refunds": return <RefundsPage />;
      case "privacy": case "terms": return <PrivacyPage />;
      default: return <NotFoundPage setPage={setPage} />;
    }
  };

  const showNav = page !== "login";

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <GlobalStyles />
      {showNav && <Navbar page={page} setPage={setPage} />}
      <CartSidebar />
      <Toast toast={state.toast} onClose={() => dispatch({ type: "CLEAR_TOAST" })} />
      <main>
        {renderPage()}
      </main>
      {showNav && page !== "product-detail" && <Footer setPage={setPage} />}
    </AppContext.Provider>
  );
}
