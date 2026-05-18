import { useState, useEffect, useRef } from "react";

/* ─── CSS ────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary: #d97940;
    --primary-hover: #c96a30;
    --primary-light: #f0a06a;
    --primary-pale: #fdf3ec;
    --bg: #fdf6f0;
    --white: #ffffff;
    --text: #2a1a0e;
    --text-muted: #9b8878;
    --text-light: #c5b3a5;
    --border: #eeddd2;
    --success: #38a169;
    --success-pale: #f0fff4;
    --error: #e53e3e;
    --error-pale: #fff5f5;
    --shadow: 0 8px 48px rgba(180,100,40,0.10);
    --card-shadow: 0 2px 16px rgba(180,100,40,0.07);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Cairo', sans-serif;
    background: var(--bg);
    color: var(--text);
    direction: rtl;
    font-size: 15px;
    line-height: 1.6;
    min-height: 100vh;
  }

  a { text-decoration: none; color: inherit; }

  /* ══════════════════════════════════════════════ */
  /* HOMEPAGE STYLES                                */
  /* ══════════════════════════════════════════════ */

  /* ── NAVBAR ─────────────────────────────────── */
  .navbar {
    background: var(--white);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 0 5%;
  }

  .navbar-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 68px;
    gap: 24px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    cursor: pointer;
  }

  .logo-icon {
    width: 38px; height: 38px;
    background: var(--primary);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }

  .logo-text {
    font-size: 22px;
    font-weight: 900;
    color: var(--primary);
    letter-spacing: -0.5px;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 28px;
    list-style: none;
    font-size: 14px;
    font-weight: 600;
  }

  .nav-links a { cursor: pointer; transition: color .2s; }
  .nav-links a:hover { color: var(--primary); }

  .nav-actions { display: flex; align-items: center; gap: 10px; }

  .nav-btn-outline {
    padding: 8px 20px;
    border: 1.5px solid var(--primary);
    border-radius: 30px;
    color: var(--primary);
    font-size: 13px; font-weight: 700;
    background: transparent; cursor: pointer;
    font-family: 'Cairo', sans-serif;
    transition: all .2s;
  }

  .nav-btn-outline:hover { background: var(--primary-pale); }

  .nav-btn-fill {
    padding: 8px 20px;
    border: none; border-radius: 30px;
    background: var(--primary); color: #fff;
    font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'Cairo', sans-serif;
    transition: all .2s;
  }

  .nav-btn-fill:hover { background: #c96a30; }

  /* ── HERO ─────────────────────────────────────── */
  .hero {
    background: var(--white);
    padding: 0;
    overflow: hidden;
  }

  .hero-inner {
    max-width: 100%;
    display: grid; grid-template-columns: 1fr 1fr;
    align-items: stretch; gap: 0;
    min-height: 540px;
  }

  .hero-content { padding: 60px 5% 60px 5%; max-width: 600px; }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--primary-pale); color: var(--primary);
    font-size: 12px; font-weight: 700;
    padding: 5px 14px; border-radius: 30px;
    margin-bottom: 20px; border: 1px solid #f0c9a8;
  }

  .hero-title {
    font-size: 38px; font-weight: 900; color: var(--text);
    line-height: 1.25; margin-bottom: 16px;
  }

  .hero-title span { color: var(--primary); }

  .hero-desc {
    font-size: 15px; color: var(--text-muted);
    line-height: 1.75; margin-bottom: 28px; max-width: 440px;
  }

  .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 36px; }

  .hero-btn-main {
    padding: 13px 28px; background: var(--primary); color: #fff;
    border: none; border-radius: 30px; font-size: 15px; font-weight: 700;
    cursor: pointer; font-family: 'Cairo', sans-serif; transition: all .2s;
  }

  .hero-btn-main:hover { background: #c96a30; transform: translateY(-1px); }

  .hero-btn-sec {
    padding: 13px 28px; background: transparent; color: var(--primary);
    border: 2px solid var(--primary); border-radius: 30px;
    font-size: 15px; font-weight: 700; cursor: pointer;
    font-family: 'Cairo', sans-serif; transition: all .2s;
  }

  .hero-btn-sec:hover { background: var(--primary-pale); }

  .hero-stats { display: flex; gap: 32px; }
  .stat-num { font-size: 22px; font-weight: 900; color: var(--primary); }
  .stat-label { font-size: 12px; color: var(--text-muted); font-weight: 500; }

  .hero-image {
    position: relative; display: flex; align-items: stretch;
    justify-content: flex-end; height: 100%; min-height: 480px;
    margin-left: -40px; margin-right: -5%;
    overflow: hidden;
  }

  .hero-img-bg {
    width: 100%; height: 100%;
    object-fit: cover; object-position: center;
    display: block; border-radius: 0;
  }

  .hero-float-card {
    position: absolute; background: var(--white);
    border-radius: 16px; padding: 12px 16px;
    box-shadow: 0 4px 20px rgba(180,100,40,0.12);
    border: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
    font-size: 12px; font-weight: 600; white-space: nowrap;
  }

  .float-icon {
    width: 34px; height: 34px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
  }

  .float-card-1 { top: 30px; right: 10px; animation: floatY 3s ease-in-out infinite; }
  .float-card-2 { bottom: 60px; left: 10px; animation: floatY 3s ease-in-out infinite 1s; }
  .float-card-3 { top: 50%; right: 10px; transform: translateY(-50%); animation: floatY 3s ease-in-out infinite 2s; }

  @keyframes floatY {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  /* ── FEATURES BAR ─────────────────────────────── */
  .features-bar {
    background: var(--white); border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border); padding: 20px 5%;
  }

  .features-bar-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-around;
    gap: 20px; flex-wrap: wrap;
  }

  .feature-bar-item {
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; font-weight: 600; color: var(--text-muted);
  }

  .feature-bar-icon {
    width: 36px; height: 36px; background: var(--primary-pale);
    border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 17px; flex-shrink: 0;
  }

  .divider-dot { width: 5px; height: 5px; background: var(--border); border-radius: 50%; }

  /* ── SECTIONS ─────────────────────────────────── */
  section { padding: 70px 5%; }

  .section-header { text-align: center; margin-bottom: 48px; }

  .section-tag {
    display: inline-block; background: var(--primary-pale); color: var(--primary);
    font-size: 12px; font-weight: 700; padding: 4px 14px; border-radius: 30px;
    margin-bottom: 12px; border: 1px solid #f0c9a8;
  }

  .section-title { font-size: 28px; font-weight: 900; color: var(--text); margin-bottom: 12px; }
  .section-title span { color: var(--primary); }
  .section-desc { font-size: 14px; color: var(--text-muted); max-width: 520px; margin: 0 auto; line-height: 1.75; }
  .section-inner { max-width: 1200px; margin: 0 auto; }

  /* ── DOCTORS ─────────────────────────────────── */
  .section-doctors { background: var(--bg); }

  .doctors-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 36px;
  }

  .doctor-card {
    background: var(--white); border-radius: 20px; padding: 24px 20px;
    text-align: center; border: 1px solid var(--border);
    box-shadow: var(--card-shadow); transition: transform .2s, box-shadow .2s; cursor: pointer;
  }

  .doctor-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(180,100,40,0.12); }

  .doctor-avatar {
    width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 14px;
    background: var(--primary-pale); display: flex; align-items: center;
    justify-content: center; font-size: 36px; border: 3px solid var(--border);
  }

  .doctor-name { font-size: 15px; font-weight: 800; color: var(--text); margin-bottom: 4px; }
  .doctor-specialty { font-size: 12px; color: var(--text-muted); margin-bottom: 10px; }

  .stars { display: flex; align-items: center; justify-content: center; gap: 2px; margin-bottom: 10px; }
  .star { color: #f5b942; font-size: 14px; }
  .star-muted { color: #e0d0c5; font-size: 14px; }

  .doctor-meta {
    display: flex; justify-content: center; gap: 14px;
    font-size: 11px; color: var(--text-muted); margin-bottom: 14px;
  }

  .btn-book {
    width: 100%; padding: 9px; background: var(--primary-pale);
    color: var(--primary); border: 1.5px solid #f0c9a8;
    border-radius: 30px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'Cairo', sans-serif; transition: all .2s;
  }

  .btn-book:hover { background: var(--primary); color: #fff; border-color: var(--primary); }

  /* ── SERVICES ─────────────────────────────────── */
  .section-services { background: var(--white); }

  .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

  .service-card {
    background: var(--bg); border-radius: 20px; padding: 30px 24px;
    border: 1px solid var(--border); transition: all .2s; cursor: pointer;
  }

  .service-card:hover { background: var(--white); box-shadow: var(--card-shadow); transform: translateY(-3px); }

  .service-icon {
    width: 54px; height: 54px; background: var(--primary-pale);
    border-radius: 16px; display: flex; align-items: center;
    justify-content: center; font-size: 26px; margin-bottom: 16px;
  }

  .service-title { font-size: 16px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
  .service-desc { font-size: 13px; color: var(--text-muted); line-height: 1.7; }

  /* ── HOW IT WORKS ─────────────────────────────── */
  .section-how { background: var(--bg); }

  .steps-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
    position: relative; margin-top: 36px;
  }

  .step-card { text-align: center; position: relative; }

  .step-num {
    width: 52px; height: 52px; border-radius: 50%;
    background: var(--primary); color: #fff;
    font-size: 20px; font-weight: 900;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px; box-shadow: 0 4px 16px rgba(217,121,64,0.35);
  }

  .step-icon { font-size: 30px; margin-bottom: 12px; }
  .step-title { font-size: 14px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
  .step-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.65; }

  /* ── TESTIMONIALS ─────────────────────────────── */
  .section-reviews { background: var(--white); }

  .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

  .testimonial-card {
    background: var(--bg); border-radius: 20px; padding: 28px 24px;
    border: 1px solid var(--border); position: relative;
  }

  .quote-icon {
    position: absolute; top: 20px; left: 24px;
    font-size: 40px; color: var(--primary-light); opacity: 0.4;
    font-family: Georgia, serif; line-height: 1;
  }

  .testimonial-text { font-size: 13.5px; color: var(--text-muted); line-height: 1.75; margin-bottom: 20px; }

  .testimonial-author { display: flex; align-items: center; gap: 12px; }
  .testimonial-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--primary-pale); display: flex;
    align-items: center; justify-content: center; font-size: 20px;
  }

  .testimonial-name { font-size: 13px; font-weight: 800; color: var(--text); }
  .testimonial-meta { font-size: 11.5px; color: var(--text-light); }

  /* ── CTA SECTION ─────────────────────────────── */
  .section-cta {
    background: linear-gradient(160deg, #d97940 0%, #c96a30 60%, #b85c22 100%);
    padding: 80px 5%; text-align: center;
  }

  .cta-inner { max-width: 700px; margin: 0 auto; }
  .cta-title { font-size: 32px; font-weight: 900; color: #fff; margin-bottom: 16px; line-height: 1.3; }
  .cta-desc { font-size: 15px; color: rgba(255,255,255,0.85); line-height: 1.75; margin-bottom: 32px; }

  .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

  .cta-btn-white {
    padding: 14px 32px; background: #fff; color: var(--primary);
    border: none; border-radius: 30px; font-size: 15px; font-weight: 800;
    cursor: pointer; font-family: 'Cairo', sans-serif; transition: all .2s;
  }

  .cta-btn-white:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.15); }

  .cta-btn-outline {
    padding: 14px 32px; background: transparent; color: #fff;
    border: 2px solid rgba(255,255,255,0.6); border-radius: 30px;
    font-size: 15px; font-weight: 800; cursor: pointer;
    font-family: 'Cairo', sans-serif; transition: all .2s;
  }

  .cta-btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; }

  /* ── FOOTER ──────────────────────────────────── */
  .footer {
    background: #2a1a0e; padding: 60px 5% 0;
  }

  .footer-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.2fr; gap: 48px;
    padding-bottom: 48px; border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .footer-logo-icon {
    width: 40px; height: 40px; background: var(--primary);
    border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 20px;
  }

  .footer-logo-text { font-size: 24px; font-weight: 900; color: #fff; }

  .footer-brand-desc { font-size: 13px; color: #7a6a5e; line-height: 1.75; margin-bottom: 20px; max-width: 260px; }

  .footer-social { display: flex; gap: 10px; }
  .footer-social-btn {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; cursor: pointer; transition: all .2s; color: #fff;
  }

  .footer-social-btn:hover { background: var(--primary); border-color: var(--primary); }

  .footer-col-title { font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 18px; }

  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .footer-links a { font-size: 13px; color: #7a6a5e; cursor: pointer; transition: color .2s; }
  .footer-links a:hover { color: var(--primary-light); }

  .footer-contact { display: flex; flex-direction: column; gap: 12px; }
  .contact-row { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #7a6a5e; }
  .contact-row-icon {
    width: 28px; height: 28px; background: rgba(217,121,64,0.15);
    border-radius: 8px; display: flex; align-items: center;
    justify-content: center; font-size: 14px; flex-shrink: 0; margin-top: 1px;
  }

  .footer-bottom {
    max-width: 1200px; margin: 0 auto; padding: 22px 0;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 12px; color: #4a3a2e; flex-wrap: wrap; gap: 10px;
  }

  .footer-bottom-links { display: flex; gap: 20px; }
  .footer-bottom-links a { color: #4a3a2e; cursor: pointer; transition: color .2s; }
  .footer-bottom-links a:hover { color: #7a6a5e; }

  /* ══════════════════════════════════════════════ */
  /* AUTH STYLES                                    */
  /* ══════════════════════════════════════════════ */

  .overlay {
    position: fixed; inset: 0;
    background: rgba(42,26,14,0.45); backdrop-filter: blur(4px);
    z-index: 200; display: flex; align-items: center; justify-content: center;
    animation: fadeIn .2s ease;
  }

  .toast-wrap {
    position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
    z-index: 300; display: flex; flex-direction: column; align-items: center; gap: 10px;
    pointer-events: none;
  }

  .toast {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 22px; border-radius: 14px;
    font-size: 14px; font-weight: 700;
    box-shadow: 0 4px 24px rgba(0,0,0,0.12);
    animation: slideDown .3s cubic-bezier(.34,1.56,.64,1);
    pointer-events: auto; min-width: 260px;
  }

  .toast.success { background: var(--success-pale); color: var(--success); border: 1.5px solid #9ae6b4; }
  .toast.error   { background: var(--error-pale);   color: var(--error);   border: 1.5px solid #fc8181; }
  .toast.info    { background: var(--primary-pale);  color: var(--primary); border: 1.5px solid #f0c9a8; }
  .toast-icon { font-size: 20px; }

  .spinner-wrap {
    background: var(--white); border-radius: 20px;
    padding: 40px 48px; display: flex; flex-direction: column; align-items: center; gap: 16px;
    box-shadow: var(--shadow); animation: scaleIn .2s ease;
  }

  .spinner {
    width: 48px; height: 48px; border: 4px solid var(--border);
    border-top-color: var(--primary); border-radius: 50%;
    animation: spin .8s linear infinite;
  }

  .spinner-text { font-size: 14px; font-weight: 700; color: var(--text-muted); }

  .result-modal {
    background: var(--white); border-radius: 24px; padding: 48px 52px;
    text-align: center; box-shadow: var(--shadow); max-width: 360px; width: 90%;
    animation: scaleIn .25s cubic-bezier(.34,1.56,.64,1);
  }

  .result-icon { font-size: 56px; margin-bottom: 16px; }
  .result-title { font-size: 22px; font-weight: 900; color: var(--text); margin-bottom: 8px; }
  .result-msg { font-size: 14px; color: var(--text-muted); line-height: 1.7; }

  .result-btn {
    margin-top: 24px; padding: 12px 32px; background: var(--primary);
    color: #fff; border: none; border-radius: 12px;
    font-size: 14px; font-weight: 800; cursor: pointer;
    font-family: 'Cairo', sans-serif; transition: all .2s;
  }

  .result-btn:hover { background: var(--primary-hover); }

  .auth-wrapper {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 32px 20px;
    background: linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 100%);
  }

  .auth-container {
    display: flex; width: 100%; max-width: 960px;
    background: var(--white); border-radius: 28px; box-shadow: var(--shadow);
    overflow: hidden; border: 1px solid var(--border); min-height: 560px;
    animation: slideUp .4s cubic-bezier(.34,1.2,.64,1);
  }

  .auth-container.wide { max-width: 1020px; }

  .auth-brand {
    width: 42%; flex-shrink: 0;
    background: linear-gradient(160deg, #d97940 0%, #c96a30 60%, #b85c22 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 48px 36px; position: relative; overflow: hidden;
  }

  .auth-brand::before {
    content: ''; position: absolute; top: -60px; left: -60px;
    width: 220px; height: 220px; background: rgba(255,255,255,0.07); border-radius: 50%;
  }

  .auth-brand::after {
    content: ''; position: absolute; bottom: -80px; right: -40px;
    width: 280px; height: 280px; background: rgba(255,255,255,0.05); border-radius: 50%;
  }

  .brand-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; position: relative; z-index: 1; }
  .brand-logo-icon {
    width: 52px; height: 52px; background: rgba(255,255,255,0.2);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 26px; border: 2px solid rgba(255,255,255,0.3);
  }

  .brand-logo-text { font-size: 30px; font-weight: 900; color: #fff; letter-spacing: -0.5px; }

  .brand-title {
    font-size: 22px; font-weight: 800; color: #fff;
    text-align: center; margin-bottom: 12px; position: relative; z-index: 1; line-height: 1.4;
  }

  .brand-desc {
    font-size: 13px; color: rgba(255,255,255,0.82);
    text-align: center; line-height: 1.75; position: relative; z-index: 1; max-width: 240px;
  }

  .brand-features { margin-top: 32px; display: flex; flex-direction: column; gap: 12px; position: relative; z-index: 1; width: 100%; }

  .brand-feature { display: flex; align-items: center; gap: 10px; font-size: 12.5px; color: rgba(255,255,255,0.9); font-weight: 600; }
  .brand-feature-icon {
    width: 30px; height: 30px; background: rgba(255,255,255,0.15);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }

  .brand-paws {
    position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
    font-size: 20px; opacity: 0.25; letter-spacing: 6px; z-index: 1;
  }

  .auth-form-panel {
    flex: 1; display: flex; flex-direction: column; justify-content: center;
    padding: 48px 44px; overflow-y: auto;
  }

  .form-header { margin-bottom: 28px; }

  .tag-badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--primary-pale); color: var(--primary);
    font-size: 11.5px; font-weight: 700; padding: 3px 12px;
    border-radius: 20px; border: 1px solid #f0c9a8; margin-bottom: 10px;
  }

  .form-title { font-size: 24px; font-weight: 900; color: var(--text); margin-bottom: 6px; }
  .form-subtitle { font-size: 13.5px; color: var(--text-muted); }
  .form-subtitle a { color: var(--primary); font-weight: 700; cursor: pointer; }
  .form-subtitle a:hover { text-decoration: underline; }

  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
  .required { color: var(--primary); margin-right: 2px; }

  .input-wrap { position: relative; display: flex; align-items: center; }
  .input-icon { position: absolute; right: 14px; font-size: 15px; color: var(--text-light); pointer-events: none; }
  .input-icon-left { position: absolute; left: 14px; font-size: 15px; color: var(--text-light); cursor: pointer; z-index: 1; }

  .form-input {
    width: 100%; padding: 11px 42px 11px 16px;
    border: 1.5px solid var(--border); border-radius: 12px;
    font-size: 14px; font-family: 'Cairo', sans-serif;
    color: var(--text); background: var(--white);
    transition: border-color .2s, box-shadow .2s; outline: none;
  }

  .form-input.has-left-icon { padding-left: 42px; }
  .form-input::placeholder { color: var(--text-light); }
  .form-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(217,121,64,0.10); }
  .form-input.error-field { border-color: var(--error); }

  .form-select {
    width: 100%; padding: 11px 42px 11px 16px;
    border: 1.5px solid var(--border); border-radius: 12px;
    font-size: 14px; font-family: 'Cairo', sans-serif;
    color: var(--text); background: var(--white);
    outline: none; appearance: none; cursor: pointer; transition: border-color .2s;
  }

  .form-select:focus { border-color: var(--primary); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .field-error { font-size: 12px; color: var(--error); font-weight: 600; margin-top: 4px; }

  .form-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .checkbox-label { display: flex; align-items: center; gap: 7px; font-size: 13px; color: var(--text-muted); cursor: pointer; font-weight: 600; }
  .checkbox-label input { accent-color: var(--primary); width: 15px; height: 15px; cursor: pointer; }
  .forgot-link { font-size: 13px; color: var(--primary); font-weight: 700; cursor: pointer; }
  .forgot-link:hover { text-decoration: underline; }

  .btn-primary {
    width: 100%; padding: 13px; background: var(--primary); color: #fff;
    border: none; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer;
    font-family: 'Cairo', sans-serif; transition: all .2s;
    display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 4px;
  }

  .btn-primary:hover:not(:disabled) { background: var(--primary-hover); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(217,121,64,0.3); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  .btn-outline-auth {
    width: 100%; padding: 12px; background: transparent; color: var(--text-muted);
    border: 1.5px solid var(--border); border-radius: 12px;
    font-size: 14px; font-weight: 700; cursor: pointer;
    font-family: 'Cairo', sans-serif; transition: all .2s;
    display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 8px;
  }

  .btn-outline-auth:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-pale); }

  .form-divider { display: flex; align-items: center; gap: 12px; margin: 18px 0; }
  .form-divider-line { flex: 1; height: 1px; background: var(--border); }
  .form-divider-text { font-size: 12px; color: var(--text-light); font-weight: 600; white-space: nowrap; }

  .social-row { display: flex; gap: 10px; }
  .social-btn {
    flex: 1; padding: 10px; border: 1.5px solid var(--border); border-radius: 10px;
    background: var(--white); cursor: pointer; font-size: 20px;
    display: flex; align-items: center; justify-content: center; transition: all .2s;
  }
  .social-btn:hover { border-color: var(--primary); background: var(--primary-pale); }

  .form-footer-text { text-align: center; font-size: 13px; color: var(--text-muted); margin-top: 18px; }
  .form-footer-text a { color: var(--primary); font-weight: 700; cursor: pointer; }
  .form-footer-text a:hover { text-decoration: underline; }

  .type-selector { display: flex; gap: 12px; margin-bottom: 24px; }
  .type-btn {
    flex: 1; padding: 16px 12px; border: 2px solid var(--border);
    border-radius: 16px; background: var(--white); cursor: pointer;
    text-align: center; transition: all .22s; font-family: 'Cairo', sans-serif;
  }
  .type-btn:hover { border-color: var(--primary-light); background: var(--primary-pale); }
  .type-btn.selected { border-color: var(--primary); background: var(--primary-pale); box-shadow: 0 0 0 3px rgba(217,121,64,0.10); }
  .type-btn-icon { font-size: 32px; margin-bottom: 6px; }
  .type-btn-label { font-size: 13.5px; font-weight: 800; color: var(--text); }
  .type-btn-sub { font-size: 11.5px; color: var(--text-muted); margin-top: 3px; }

  .otp-row { display: flex; gap: 12px; justify-content: center; direction: ltr; margin: 24px 0; }
  .otp-input {
    width: 56px; height: 60px; border: 1.5px solid var(--border); border-radius: 12px;
    font-size: 24px; font-weight: 800; text-align: center;
    font-family: 'Cairo', sans-serif; color: var(--primary); outline: none; transition: all .2s;
  }
  .otp-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(217,121,64,0.12); }

  .steps-row { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 28px; }
  .step-dot {
    width: 32px; height: 32px; border-radius: 50%;
    border: 2px solid var(--border); display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; color: var(--text-light);
    background: var(--white); position: relative; z-index: 1;
  }
  .step-dot.done { border-color: var(--primary); background: var(--primary); color: #fff; }
  .step-dot.active { border-color: var(--primary); color: var(--primary); box-shadow: 0 0 0 3px rgba(217,121,64,0.15); }
  .step-line { flex: 1; height: 2px; background: var(--border); max-width: 48px; }
  .step-line.done { background: var(--primary); }

  .avatar-upload { display: flex; flex-direction: column; align-items: center; margin-bottom: 20px; }
  .avatar-circle {
    width: 80px; height: 80px; border-radius: 50%; background: var(--primary-pale);
    border: 2.5px dashed var(--primary-light); display: flex; align-items: center;
    justify-content: center; font-size: 30px; cursor: pointer; transition: all .2s; margin-bottom: 6px;
  }
  .avatar-circle:hover { border-color: var(--primary); background: #fce8d8; }
  .avatar-label { font-size: 12px; color: var(--text-muted); font-weight: 600; }

  .resend-row { text-align: center; font-size: 13px; color: var(--text-muted); margin-top: 12px; }
  .resend-link { color: var(--primary); font-weight: 700; cursor: pointer; }
  .resend-link:hover { text-decoration: underline; }
  .resend-timer { color: var(--text-light); font-weight: 600; }

  /* ── KEYFRAMES ─────────────────────────────────── */
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.88); } to { opacity: 1; transform: scale(1); } }

  /* ── RESPONSIVE ─────────────────────────────────── */
  @media (max-width: 1024px) {
    .doctors-grid { grid-template-columns: repeat(2, 1fr); }
    .steps-grid { grid-template-columns: repeat(2, 1fr); }
    .footer-inner { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 768px) {
    .hero-inner { grid-template-columns: 1fr; }
    .hero-image { display: none; }
    .hero-title { font-size: 28px; }
    .nav-links { display: none; }
    .services-grid { grid-template-columns: 1fr; }
    .testimonials-grid { grid-template-columns: 1fr; }
    .doctors-grid { grid-template-columns: repeat(2, 1fr); }
    .section-title { font-size: 22px; }
    .footer-inner { grid-template-columns: 1fr; }
    .auth-brand { display: none; }
    .auth-form-panel { padding: 32px 22px; }
    .auth-container { border-radius: 20px; }
    .form-row { grid-template-columns: 1fr; }
    .otp-input { width: 44px; height: 52px; font-size: 20px; }
  }
`;

/* ─── HELPERS ─────────────────────────────────────────────── */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ─── SHARED COMPONENTS ───────────────────────────────────── */
function Toast({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className="toast-icon">
            {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}
          </span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function LoadingOverlay({ text = "جاري المعالجة..." }) {
  return (
    <div className="overlay">
      <div className="spinner-wrap">
        <div className="spinner" />
        <div className="spinner-text">{text}</div>
      </div>
    </div>
  );
}

function ResultModal({ icon, title, msg, btnLabel, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="result-modal" onClick={(e) => e.stopPropagation()}>
        <div className="result-icon">{icon}</div>
        <div className="result-title">{title}</div>
        <div className="result-msg">{msg}</div>
        <button className="result-btn" onClick={onClose}>{btnLabel}</button>
      </div>
    </div>
  );
}

function BrandPanel({ icon, title, desc, features }) {
  return (
    <div className="auth-brand">
      <div className="brand-logo">
        <img src="data:image/png;base64,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ZTcKn4j3McMRdt8hzv5jS6z9U22mt2nKueouNynlMZYzrKp3bcdwGyMA+XctZotj5ejS6RsBLnCYADiewFvqey3C4PdVX+eJ0vVuZDTwj7OHaGC7fxdj2WBom06is05t9RHS/VvWOe6QOy52RgAd2/HEI6FxqWvDCGkEeeOpRsreA5heC4EHy6Bfvole12ly0YyyoeD8Ct/qR7Y9P3B7yABTv4/ylaKlst009dZ6myxR1dDUnafSukDHMPLZJ3f9eq/V7pNQ6hhbb5aSO10bnAzOdM2R7wOQDVPC6SGl4JYd4C2WB5G+VlFK1ktTxQ4bpN88RzwzWi0vDI3ouuri0gSGRzfEANH5FUPRgQdH02OT35/xFbmC10kNl+qY2YpuqMWOZBG8+amNO0OptNiaght8Nyoy8uieKhsZbnvz8lHFTupJInEEgN3TYXxz0Xck7amOQAgEuuL4YZLH6Y5migoIM9p0rnY8AP8AmqbU37pV/wD6R/8ApWg1Hpe6Xm3TVVVJCbkXNMUTT2I2DPYBPM5yT3rbQU17rdK1lJdI6eOslifHG2M7sbOBk9+V6wSGaYlp8YFuwIx8/JeOMYiiAcPCce9vRePRh+5tJ/NJ/rcqZaDQVurrXp5lFcI2xyse4gB4duJzy8yt+r9C0tpow4WIAVKscHVDyDcElERFaVZERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERf/9k=" alt="Raouf" style={{height: "70px", width: "auto", filter: "brightness(0) invert(1)"}} />
      </div>
      <div className="brand-title" dangerouslySetInnerHTML={{ __html: title }} />
      <div className="brand-desc">{desc}</div>
      {features && (
        <div className="brand-features">
          {features.map((f, i) => (
            <div key={i} className="brand-feature">
              <div className="brand-feature-icon">{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      )}
      <div className="brand-paws">🐾 🐾 🐾</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/* PAGE: HOME                                                  */
/* ══════════════════════════════════════════════════════════ */
function HomePage({ navigate }) {
  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="logo" onClick={() => navigate("home")}>
            <img src="data:image/png;base64,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ZTcKn4j3McMRdt8hzv5jS6z9U22mt2nKueouNynlMZYzrKp3bcdwGyMA+XctZotj5ejS6RsBLnCYADiewFvqey3C4PdVX+eJ0vVuZDTwj7OHaGC7fxdj2WBom06is05t9RHS/VvWOe6QOy52RgAd2/HEI6FxqWvDCGkEeeOpRsreA5heC4EHy6Bfvole12ly0YyyoeD8Ct/qR7Y9P3B7yABTv4/ylaKlst009dZ6myxR1dDUnafSukDHMPLZJ3f9eq/V7pNQ6hhbb5aSO10bnAzOdM2R7wOQDVPC6SGl4JYd4C2WB5G+VlFK1ktTxQ4bpN88RzwzWi0vDI3ouuri0gSGRzfEANH5FUPRgQdH02OT35/xFbmC10kNl+qY2YpuqMWOZBG8+amNO0OptNiaght8Nyoy8uieKhsZbnvz8lHFTupJInEEgN3TYXxz0Xck7amOQAgEuuL4YZLH6Y5migoIM9p0rnY8AP8AmqbU37pV/wD6R/8ApWg1Hpe6Xm3TVVVJCbkXNMUTT2I2DPYBPM5yT3rbQU17rdK1lJdI6eOslifHG2M7sbOBk9+V6wSGaYlp8YFuwIx8/JeOMYiiAcPCce9vRePRh+5tJ/NJ/rcqZaDQVurrXp5lFcI2xyse4gB4duJzy8yt+r9C0tpow4WIAVKscHVDyDcElERFaVZERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERf/9k=" alt="Raouf" style={{height: "52px", width: "auto"}} />
          </div>

          <ul className="nav-links">
            <li><a href="#doctors">الأطباء</a></li>
            <li><a href="#services">الخدمات</a></li>
            <li><a href="#how">كيف يعمل</a></li>
            <li><a href="#reviews">آراء العملاء</a></li>
          </ul>

          <div className="nav-actions">
            <button className="nav-btn-outline" onClick={() => navigate("login")}>
              تسجيل الدخول
            </button>
            <button className="nav-btn-fill" onClick={() => navigate("choose-type")}>
              إنشاء حساب
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🐾</span>
              <span>عيادة بيطرية متخصصة في رعاية القطط</span>
            </div>
            <h1 className="hero-title">
              استشارات بيطرية<br />
              <span>لقطتك في المنزل</span>
            </h1>
            <p className="hero-desc">
              تواصل مع أفضل الأطباء البيطريين المتخصصين في رعاية القطط، احصل على استشارة فورية عبر الفيديو أو الدردشة دون مغادرة منزلك.
            </p>
            <div className="hero-btns">
              <button className="hero-btn-main" onClick={() => navigate("choose-type")}>
                ابدأ استشارتك الآن
              </button>
              <button className="hero-btn-sec" onClick={() => {
                document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                تصفح الأطباء
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-num">+١٢٠</div>
                <div className="stat-label">طبيب بيطري</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">+٥٠٠٠</div>
                <div className="stat-label">استشارة ناجحة</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">٤.٩ ⭐</div>
                <div className="stat-label">متوسط التقييم</div>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <img className="hero-img-bg" src="data:image/png;base64,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" alt="قطة لطيفة مع باقة زهور" />
            <div className="hero-float-card float-card-1">
              <div className="float-icon" style={{ background: "#e8f5e9" }}>✅</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>استشارة مكتملة</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>منذ دقيقتين</div>
              </div>
            </div>
            <div className="hero-float-card float-card-2">
              <div className="float-icon" style={{ background: "var(--primary-pale)" }}>🩺</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>٤٨ طبيب متاح الآن</div>
                <div style={{ fontSize: 10, color: "var(--success)" }}>● متصل الآن</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES BAR */}
      <div className="features-bar">
        <div className="features-bar-inner">
          {[
            { icon: "⚡", text: "استشارة فورية في دقائق" },
            { icon: "🔒", text: "خصوصية تامة وآمنة" },
            { icon: "🩺", text: "أطباء معتمدون" },
            { icon: "💳", text: "دفع آمن ومحمي" },
            { icon: "📅", text: "متاح ٢٤/٧" },
          ].map((f, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div className="feature-bar-item">
                <div className="feature-bar-icon">{f.icon}</div>
                <span>{f.text}</span>
              </div>
              {i < arr.length - 1 && <div className="divider-dot" />}
            </div>
          ))}
        </div>
      </div>

      {/* DOCTORS */}
      <section className="section-doctors" id="doctors">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">🩺 فريقنا الطبي</div>
            <div className="section-title">أطباؤنا <span>المتخصصون</span></div>
            <div className="section-desc">نخبة من الأطباء البيطريين المعتمدين والمتخصصين في رعاية القطط</div>
          </div>
          <div className="doctors-grid">
            {[
              { avatar: "👩‍⚕️", name: "د. سارة المالكي", specialty: "أمراض القطط الداخلية", rate: "4.9", reviews: "٢٤٧", exp: "١٢", price: "١٥٠" },
              { avatar: "🧑‍⚕️", name: "د. خالد الزهراني", specialty: "جراحة عامة بيطرية", rate: "4.8", reviews: "١٨٥", exp: "٨", price: "١٢٠" },
              { avatar: "👩‍⚕️", name: "د. نوف العتيبي", specialty: "أمراض الجلد والفراء", rate: "4.9", reviews: "٣١٢", exp: "١٠", price: "١٣٠" },
              { avatar: "👨‍⚕️", name: "د. محمد القحطاني", specialty: "تغذية القطط والحميات", rate: "4.7", reviews: "٩٧", exp: "٦", price: "١٠٠" },
            ].map((doc, i) => (
              <div className="doctor-card" key={i} onClick={() => navigate("login")}>
                <div className="doctor-avatar">{doc.avatar}</div>
                <div className="doctor-name">{doc.name}</div>
                <div className="doctor-specialty">{doc.specialty}</div>
                <div className="stars">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={s <= Math.floor(parseFloat(doc.rate)) ? "star" : "star-muted"}>★</span>
                  ))}
                  <span style={{ fontSize: 12, color: "#7a6a5e", marginRight: 4 }}>{doc.rate}</span>
                </div>
                <div className="doctor-meta">
                  <span>📅 {doc.exp} سنوات خبرة</span>
                  <span>🏅 {doc.reviews} تقييم</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", marginBottom: 12 }}>
                  {doc.price} ر.س / ٣٠ دقيقة
                </div>
                <button className="btn-book">احجز استشارة</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-services" id="services">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">🌟 خدماتنا</div>
            <div className="section-title">كل ما <span>تحتاجه قطتك</span></div>
            <div className="section-desc">نقدم طيفاً شاملاً من الخدمات البيطرية المتخصصة عن بُعد</div>
          </div>
          <div className="services-grid">
            {[
              { icon: "📹", title: "استشارة فيديو", desc: "تحدث مع طبيبك البيطري وجهاً لوجه عبر الفيديو. الأنسب للفحص البصري وتقييم حالة قطتك." },
              { icon: "💬", title: "دردشة نصية", desc: "تواصل مكتوب مع الطبيب لطرح أسئلتك وتلقي الإجابات في أي وقت يناسبك." },
              { icon: "💊", title: "وصفات طبية رقمية", desc: "احصل على وصفتك الطبية إلكترونياً وأرسلها مباشرة لأقرب صيدلية بيطرية." },
              { icon: "📋", title: "ملف صحي متكامل", desc: "سجّل التاريخ الطبي كاملاً لقطتك: التطعيمات، الأدوية، الزيارات السابقة." },
              { icon: "🚑", title: "استشارة طارئة", desc: "خدمة ٢٤/٧ للحالات الطارئة مع أولوية تواصل فورية مع أقرب طبيب متاح." },
              { icon: "🍽️", title: "استشارة التغذية", desc: "خطط غذائية مخصصة لقطتك حسب عمرها وحالتها الصحية ونشاطها اليومي." },
            ].map((s, i) => (
              <div className="service-card" key={i}>
                <div className="service-icon">{s.icon}</div>
                <div className="service-title">{s.title}</div>
                <div className="service-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-how" id="how">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">🚀 كيف يعمل</div>
            <div className="section-title">أربع خطوات <span>بسيطة</span></div>
            <div className="section-desc">ابدأ استشارتك في دقائق دون تعقيدات</div>
          </div>
          <div className="steps-grid">
            {[
              { num: "١", icon: "📝", title: "أنشئ حسابك", desc: "سجّل بياناتك الأساسية وبيانات قطتك في دقيقتين فقط" },
              { num: "٢", icon: "🔍", title: "اختر طبيبك", desc: "تصفح الأطباء وفلتر حسب التخصص والسعر والتوفر" },
              { num: "٣", icon: "📅", title: "احجز موعدك", desc: "اختر الوقت المناسب وادفع بأمان عبر منصتنا" },
              { num: "٤", icon: "🎉", title: "ابدأ الاستشارة", desc: "تواصل مع طبيبك عبر فيديو أو دردشة واحصل على رعاية احترافية" },
            ].map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-reviews" id="reviews">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">💬 آراء عملائنا</div>
            <div className="section-title">ماذا يقول <span>أصحاب القطط</span></div>
            <div className="section-desc">أكثر من ٥٠٠٠ تجربة ناجحة وتقييمات حقيقية من مستخدمينا</div>
          </div>
          <div className="testimonials-grid">
            {[
              { avatar: "👩", name: "نورة العتيبي", cat: "صاحبة قطة لولو", text: "خدمة رائعة! تواصلت مع الدكتورة سارة في دقائق وشخّصت حالة قطتي بدقة. وفّرت عليّ ساعات من التنقل.", rate: 5 },
              { avatar: "👨", name: "أحمد الشمري", cat: "صاحب قطط منذ ٥ سنوات", text: "أفضل منصة بيطرية في السعودية. الأطباء محترفون والأسعار معقولة جداً مقارنة بالعيادات التقليدية.", rate: 5 },
              { avatar: "👩", name: "ريم المطيري", cat: "أم لثلاث قطط", text: "استخدمت خدمة الطوارئ ليلاً وكانت الاستجابة فورية. الطبيب أرشدني بشكل ممتاز وطمأنني على قطتي.", rate: 5 },
            ].map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="quote-icon">"</div>
                <div className="stars" style={{ justifyContent: "flex-start", marginBottom: 12 }}>
                  {[1,2,3,4,5].map(s => <span key={s} className="star">★</span>)}
                </div>
                <div className="testimonial-text">{t.text}</div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-meta">{t.cat}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-cta">
        <div className="cta-inner">
          <div className="cta-title">ابدأ رحلتك مع Raouf اليوم 🐾</div>
          <div className="cta-desc">
            انضم لآلاف أصحاب القطط الذين يثقون بـ Raouf للحصول على أفضل رعاية بيطرية. استشارتك الأولى مجانية!
          </div>
          <div className="cta-btns">
            <button className="cta-btn-white" onClick={() => navigate("choose-type")}>
              أنشئ حسابك مجاناً ←
            </button>
            <button className="cta-btn-outline" onClick={() => navigate("login")}>
              تسجيل الدخول
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo">
              <img src="data:image/png;base64,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ZTcKn4j3McMRdt8hzv5jS6z9U22mt2nKueouNynlMZYzrKp3bcdwGyMA+XctZotj5ejS6RsBLnCYADiewFvqey3C4PdVX+eJ0vVuZDTwj7OHaGC7fxdj2WBom06is05t9RHS/VvWOe6QOy52RgAd2/HEI6FxqWvDCGkEeeOpRsreA5heC4EHy6Bfvole12ly0YyyoeD8Ct/qR7Y9P3B7yABTv4/ylaKlst009dZ6myxR1dDUnafSukDHMPLZJ3f9eq/V7pNQ6hhbb5aSO10bnAzOdM2R7wOQDVPC6SGl4JYd4C2WB5G+VlFK1ktTxQ4bpN88RzwzWi0vDI3ouuri0gSGRzfEANH5FUPRgQdH02OT35/xFbmC10kNl+qY2YpuqMWOZBG8+amNO0OptNiaght8Nyoy8uieKhsZbnvz8lHFTupJInEEgN3TYXxz0Xck7amOQAgEuuL4YZLH6Y5migoIM9p0rnY8AP8AmqbU37pV/wD6R/8ApWg1Hpe6Xm3TVVVJCbkXNMUTT2I2DPYBPM5yT3rbQU17rdK1lJdI6eOslifHG2M7sbOBk9+V6wSGaYlp8YFuwIx8/JeOMYiiAcPCce9vRePRh+5tJ/NJ/rcqZaDQVurrXp5lFcI2xyse4gB4duJzy8yt+r9C0tpow4WIAVKscHVDyDcElERFaVZERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERf/9k=" alt="Raouf" style={{height: "60px", width: "auto", filter: "brightness(0) invert(1)"}} />
            </div>
            <div className="footer-brand-desc">
              عيادة متخصصة في تقديم استشارات بيطرية عن بُعد لأصحاب القطط في المملكة العربية السعودية.
            </div>
            <div className="footer-social">
              {["𝕏", "📸", "👻", "▶"].map((s, i) => (
                <div key={i} className="footer-social-btn">{s}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-col-title">روابط سريعة</div>
            <ul className="footer-links">
              {["الصفحة الرئيسية", "تصفح الأطباء", "خدماتنا", "كيف يعمل Raouf", "المدونة", "عن Raouf"].map((l, i) => (
                <li key={i}><a>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">الدعم والمساعدة</div>
            <ul className="footer-links">
              {["مركز المساعدة", "الأسئلة الشائعة", "سياسة الاسترداد", "سياسة الخصوصية", "الشروط والأحكام", "تواصل معنا"].map((l, i) => (
                <li key={i}><a>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">تواصل معنا</div>
            <div className="footer-contact">
              {[
                { icon: "📍", text: "الرياض، المملكة العربية السعودية، حي العليا" },
                { icon: "📞", text: "920-XXX-XXX+ (966)" },
                { icon: "📧", text: "support@raouf.sa" },
                { icon: "🕐", text: "متاحون ٢٤ ساعة، ٧ أيام أسبوعياً" },
              ].map((c, i) => (
                <div key={i} className="contact-row">
                  <div className="contact-row-icon">{c.icon}</div>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© ٢٠٢٥ Raouf جميع الحقوق محفوظة 🐾</span>
          <div className="footer-bottom-links">
            <a>سياسة الخصوصية</a>
            <a>الشروط والأحكام</a>
            <a>خريطة الموقع</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/* PAGE: LOGIN                                                */
/* ══════════════════════════════════════════════════════════ */
function LoginPage({ navigate, addToast }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email) e.email = "البريد الإلكتروني مطلوب";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "بريد إلكتروني غير صحيح";
    if (!pass) e.pass = "كلمة المرور مطلوبة";
    else if (pass.length < 6) e.pass = "كلمة المرور قصيرة جداً";
    return e;
  };

  const handleLogin = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await sleep(2000);
    setLoading(false);
    addToast("success", "تم تسجيل الدخول بنجاح!");
    await sleep(600);
    navigate("dashboard");
  };

  return (
    <>
      {loading && <LoadingOverlay text="جاري تسجيل الدخول..." />}
      <div className="auth-wrapper">
        <div className="auth-container">
          <BrandPanel
            icon="🐾"
            title="مرحباً بعودتك!"
            desc="سجّل دخولك للوصول إلى طبيبك البيطري واحجز استشارتك القادمة."
            features={[
              { icon: "✅", text: "أطباء بيطريون معتمدون" },
              { icon: "⚡", text: "استشارة فورية في دقائق" },
              { icon: "🔒", text: "خصوصيتك مضمونة تماماً" },
            ]}
          />
          <div className="auth-form-panel">
            <div style={{ marginBottom: 12 }}>
              <button
                onClick={() => navigate("home")}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, fontFamily: "Cairo, sans-serif", fontWeight: 600, padding: 0 }}
              >
                ← العودة للرئيسية
              </button>
            </div>
            <div className="form-header">
              <div className="tag-badge">🐱 مرحباً بك</div>
              <div className="form-title">تسجيل الدخول</div>
              <div className="form-subtitle">
                ليس لديك حساب؟{" "}
                <a onClick={() => navigate("choose-type")}>أنشئ حساباً مجانياً</a>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">البريد الإلكتروني <span className="required">*</span></label>
              <div className="input-wrap">
                <span className="input-icon">📧</span>
                <input type="email" className={`form-input ${errors.email ? "error-field" : ""}`}
                  placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">كلمة المرور <span className="required">*</span></label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input type={showPass ? "text" : "password"}
                  className={`form-input has-left-icon ${errors.pass ? "error-field" : ""}`}
                  placeholder="أدخل كلمة المرور" value={pass} onChange={(e) => setPass(e.target.value)} />
                <span className="input-icon-left" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "🙈" : "👁"}
                </span>
              </div>
              {errors.pass && <div className="field-error">{errors.pass}</div>}
            </div>

            <div className="form-meta">
              <label className="checkbox-label">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                تذكرني
              </label>
              <span className="forgot-link" onClick={() => navigate("forgot")}>نسيت كلمة المرور؟</span>
            </div>

            <button className="btn-primary" onClick={handleLogin} disabled={loading}>
              <span>تسجيل الدخول</span>
              <span>←</span>
            </button>

            <div className="form-divider">
              <div className="form-divider-line" />
              <div className="form-divider-text">أو الدخول عبر</div>
              <div className="form-divider-line" />
            </div>

            <div className="social-row">
              <button className="social-btn">
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.5 0 6.5 1.2 8.9 3.2l6.6-6.6C35.6 2.6 30.2.5 24 .5 14.8.5 6.9 5.9 3 13.6l7.7 6C12.4 13.3 17.7 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.5 24.5c0-1.5-.1-3-.4-4.5H24v8.5h12.7c-.6 3-2.4 5.5-4.9 7.2l7.6 5.9c4.5-4.1 7.1-10.2 7.1-17.1z"/>
                  <path fill="#FBBC05" d="M10.7 28.4A14.6 14.6 0 0 1 9.5 24c0-1.5.3-3 .8-4.4l-7.7-6A24.1 24.1 0 0 0-.5 24c0 3.8.9 7.4 2.6 10.6l8.6-6.2z"/>
                  <path fill="#34A853" d="M24 47.5c6.2 0 11.5-2 15.3-5.5l-7.6-5.9c-2.1 1.4-4.8 2.2-7.7 2.2-6.3 0-11.6-3.8-13.3-9.1l-8.6 6.2C6.9 42.1 14.8 47.5 24 47.5z"/>
                </svg>
              </button>
              <button className="social-btn">
                <svg width="20" height="20" viewBox="0 0 814 1000">
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46.7 790 0 661 0 541.8c0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
                </svg>
              </button>

            </div>

            <div className="form-footer-text">
              بتسجيلك أنت توافق على{" "}
              <a>الشروط والأحكام</a> و<a>سياسة الخصوصية</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════ */
/* PAGE: CHOOSE ACCOUNT TYPE                                  */
/* ══════════════════════════════════════════════════════════ */
function ChooseTypePage({ navigate }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <BrandPanel
          icon="🐾"
          title="انضم إلى<br/>عائلة Raouf 🐱"
          desc="اختر نوع حسابك للبدء في رحلتك مع أفضل رعاية بيطرية."
          features={[
            { icon: "🎁", text: "استشارة أولى مجانية" },
            { icon: "🩺", text: "أطباء معتمدون ومتخصصون" },
            { icon: "⚡", text: "ردود سريعة في دقائق" },
          ]}
        />
        <div className="auth-form-panel" style={{ justifyContent: "center" }}>
          <div style={{ marginBottom: 12 }}>
            <button
              onClick={() => navigate("home")}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, fontFamily: "Cairo, sans-serif", fontWeight: 600, padding: 0 }}
            >
              ← العودة للرئيسية
            </button>
          </div>
          <div className="form-header" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👋</div>
            <div className="form-title">نوع الحساب</div>
            <div className="form-subtitle">اختر كيف تريد استخدام Raouf</div>
          </div>

          <div className="type-selector">
            <div className={`type-btn ${selected === "user" ? "selected" : ""}`} onClick={() => setSelected("user")}>
              <div className="type-btn-icon">🐱</div>
              <div className="type-btn-label">صاحب قطة</div>
              <div className="type-btn-sub">احصل على استشارات بيطرية</div>
            </div>
            <div className={`type-btn ${selected === "doctor" ? "selected" : ""}`} onClick={() => setSelected("doctor")}>
              <div className="type-btn-icon">🩺</div>
              <div className="type-btn-label">طبيب بيطري</div>
              <div className="type-btn-sub">قدّم خدماتك البيطرية</div>
            </div>
          </div>

          <button
            className="btn-primary"
            disabled={!selected}
            onClick={() => navigate(selected === "doctor" ? "doctor-register" : "register")}
          >
            <span>متابعة</span>
            <span>←</span>
          </button>

          <div className="form-footer-text">
            لديك حساب بالفعل؟{" "}
            <a onClick={() => navigate("login")}>سجّل دخولك</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/* PAGE: USER REGISTER                                        */
/* ══════════════════════════════════════════════════════════ */
function RegisterPage({ navigate, addToast }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", city: "", pass: "" });
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.firstName) e.firstName = "الاسم الأول مطلوب";
    if (!form.lastName) e.lastName = "اسم العائلة مطلوب";
    if (!form.email) e.email = "البريد الإلكتروني مطلوب";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "بريد غير صحيح";
    if (!form.phone) e.phone = "رقم الجوال مطلوب";
    if (!form.pass || form.pass.length < 8) e.pass = "كلمة المرور يجب أن تكون ٨ أحرف على الأقل";
    if (!agree) e.agree = "يجب الموافقة على الشروط";
    return e;
  };

  const handleRegister = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await sleep(2000);
    setLoading(false);
    navigate("otp", { flow: "register", redirect: "login" });
  };

  return (
    <>
      {loading && <LoadingOverlay text="جاري إنشاء الحساب..." />}
      <div className="auth-wrapper">
        <div className="auth-container">
          <BrandPanel
            icon="🐾"
            title="حساب صاحب قطة"
            desc="انضم لآلاف أصحاب القطط الذين يثقون بـ Raouf."
            features={[
              { icon: "🎁", text: "استشارة أولى مجانية" },
              { icon: "📅", text: "حجز مواعيد سهل ومرن" },
              { icon: "💊", text: "وصفات طبية رقمية" },
            ]}
          />
          <div className="auth-form-panel">
            <div style={{ marginBottom: 12 }}>
              <button
                onClick={() => navigate("choose-type")}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, fontFamily: "Cairo, sans-serif", fontWeight: 600, padding: 0 }}
              >
                ← العودة لاختيار نوع الحساب
              </button>
            </div>
            <div className="form-header">
              <div className="tag-badge">🐱 حساب جديد</div>
              <div className="form-title">إنشاء حساب</div>
              <div className="form-subtitle">
                لديك حساب؟ <a onClick={() => navigate("login")}>سجّل دخولك</a>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">الاسم الأول <span className="required">*</span></label>
                <div className="input-wrap">
                  <span className="input-icon">👤</span>
                  <input type="text" className={`form-input ${errors.firstName ? "error-field" : ""}`}
                    placeholder="محمد" value={form.firstName} onChange={set("firstName")} />
                </div>
                {errors.firstName && <div className="field-error">{errors.firstName}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">اسم العائلة <span className="required">*</span></label>
                <div className="input-wrap">
                  <span className="input-icon">👤</span>
                  <input type="text" className={`form-input ${errors.lastName ? "error-field" : ""}`}
                    placeholder="الأحمدي" value={form.lastName} onChange={set("lastName")} />
                </div>
                {errors.lastName && <div className="field-error">{errors.lastName}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">البريد الإلكتروني <span className="required">*</span></label>
              <div className="input-wrap">
                <span className="input-icon">📧</span>
                <input type="email" className={`form-input ${errors.email ? "error-field" : ""}`}
                  placeholder="example@email.com" value={form.email} onChange={set("email")} />
              </div>
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">رقم الجوال <span className="required">*</span></label>
                <div className="input-wrap">
                  <span className="input-icon">📱</span>
                  <input type="tel" className={`form-input ${errors.phone ? "error-field" : ""}`}
                    placeholder="05xxxxxxxx" value={form.phone} onChange={set("phone")} />
                </div>
                {errors.phone && <div className="field-error">{errors.phone}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">المدينة</label>
                <div className="input-wrap">
                  <span className="input-icon">📍</span>
                  <select className="form-select" value={form.city} onChange={set("city")}>
                    <option value="">اختر المدينة</option>
                    <option>الرياض</option><option>جدة</option>
                    <option>الدمام</option><option>مكة المكرمة</option>
                    <option>المدينة المنورة</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">كلمة المرور <span className="required">*</span></label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input type={showPass ? "text" : "password"}
                  className={`form-input has-left-icon ${errors.pass ? "error-field" : ""}`}
                  placeholder="٨ أحرف على الأقل" value={form.pass} onChange={set("pass")} />
                <span className="input-icon-left" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "🙈" : "👁"}
                </span>
              </div>
              {errors.pass && <div className="field-error">{errors.pass}</div>}
            </div>

            <label className="checkbox-label" style={{ marginBottom: 16 }}>
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>أوافق على <a style={{ color: "var(--primary)" }}>الشروط والأحكام</a> و<a style={{ color: "var(--primary)" }}>سياسة الخصوصية</a></span>
            </label>
            {errors.agree && <div className="field-error" style={{ marginBottom: 8 }}>{errors.agree}</div>}

            <button className="btn-primary" onClick={handleRegister} disabled={loading}>
              <span>إنشاء الحساب</span>
              <span>←</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════ */
/* PAGE: DOCTOR REGISTER                                      */
/* ══════════════════════════════════════════════════════════ */
function DoctorRegisterPage({ navigate, addToast }) {
  const [form, setForm] = useState({ name: "", license: "", email: "", phone: "", specialty: "", experience: "", pass: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "الاسم مطلوب";
    if (!form.license) e.license = "رقم الترخيص مطلوب";
    if (!form.email) e.email = "البريد مطلوب";
    if (!form.phone) e.phone = "رقم الجوال مطلوب";
    if (!form.specialty) e.specialty = "التخصص مطلوب";
    if (!form.pass || form.pass.length < 8) e.pass = "كلمة المرور يجب أن تكون ٨ أحرف على الأقل";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await sleep(2200);
    setLoading(false);
    navigate("otp", { flow: "doctor-register", redirect: "login" });
  };

  return (
    <>
      {loading && <LoadingOverlay text="جاري تسجيل الطلب..." />}
      <div className="auth-wrapper">
        <div className="auth-container wide">
          <BrandPanel
            icon="🩺"
            title="انضم كطبيب بيطري<br/>وابنِ مسيرتك"
            desc="سجّل بياناتك المهنية وانضم لشبكة أطباء Raouf المعتمدين."
            features={[
              { icon: "💰", text: "دخل إضافي مرن من منزلك" },
              { icon: "📱", text: "إدارة سهلة عبر التطبيق" },
              { icon: "🏅", text: "شهادة اعتماد رقمية" },
            ]}
          />
          <div className="auth-form-panel">
            <div style={{ marginBottom: 12 }}>
              <button
                onClick={() => navigate("choose-type")}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, fontFamily: "Cairo, sans-serif", fontWeight: 600, padding: 0 }}
              >
                ← العودة لاختيار نوع الحساب
              </button>
            </div>
            <div className="form-header">
              <div className="tag-badge">🩺 حساب طبيب</div>
              <div className="form-title">تسجيل طبيب بيطري</div>
              <div className="form-subtitle">
                لديك حساب؟ <a onClick={() => navigate("login")}>سجّل دخولك</a>
              </div>
            </div>

            <div className="avatar-upload">
              <div className="avatar-circle">🩺</div>
              <div className="avatar-label">رفع صورة شخصية (اختياري)</div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">الاسم الكامل <span className="required">*</span></label>
                <div className="input-wrap">
                  <span className="input-icon">👤</span>
                  <input type="text" className={`form-input ${errors.name ? "error-field" : ""}`}
                    placeholder="د. محمد الأحمد" value={form.name} onChange={set("name")} />
                </div>
                {errors.name && <div className="field-error">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">رقم الترخيص المهني <span className="required">*</span></label>
                <div className="input-wrap">
                  <span className="input-icon">🪪</span>
                  <input type="text" className={`form-input ${errors.license ? "error-field" : ""}`}
                    placeholder="VET-XXXXX" value={form.license} onChange={set("license")} />
                </div>
                {errors.license && <div className="field-error">{errors.license}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">البريد الإلكتروني <span className="required">*</span></label>
                <div className="input-wrap">
                  <span className="input-icon">📧</span>
                  <input type="email" className={`form-input ${errors.email ? "error-field" : ""}`}
                    placeholder="doctor@email.com" value={form.email} onChange={set("email")} />
                </div>
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">رقم الجوال <span className="required">*</span></label>
                <div className="input-wrap">
                  <span className="input-icon">📱</span>
                  <input type="tel" className={`form-input ${errors.phone ? "error-field" : ""}`}
                    placeholder="05xxxxxxxx" value={form.phone} onChange={set("phone")} />
                </div>
                {errors.phone && <div className="field-error">{errors.phone}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">التخصص <span className="required">*</span></label>
                <div className="input-wrap">
                  <span className="input-icon">🩺</span>
                  <select className={`form-select ${errors.specialty ? "error-field" : ""}`}
                    value={form.specialty} onChange={set("specialty")}>
                    <option value="">اختر تخصصك</option>
                    <option>أمراض القطط الداخلية</option>
                    <option>جراحة بيطرية عامة</option>
                    <option>أمراض الجلد والفراء</option>
                    <option>تغذية الحيوانات الأليفة</option>
                    <option>طب الأسنان البيطري</option>
                    <option>أمراض العيون البيطرية</option>
                  </select>
                </div>
                {errors.specialty && <div className="field-error">{errors.specialty}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">سنوات الخبرة</label>
                <div className="input-wrap">
                  <span className="input-icon">📅</span>
                  <select className="form-select" value={form.experience} onChange={set("experience")}>
                    <option value="">اختر</option>
                    <option>أقل من سنة</option>
                    <option>١–٣ سنوات</option>
                    <option>٣–٥ سنوات</option>
                    <option>٥–١٠ سنوات</option>
                    <option>أكثر من ١٠ سنوات</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">كلمة المرور <span className="required">*</span></label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input type={showPass ? "text" : "password"}
                  className={`form-input has-left-icon ${errors.pass ? "error-field" : ""}`}
                  placeholder="٨ أحرف على الأقل" value={form.pass} onChange={set("pass")} />
                <span className="input-icon-left" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "🙈" : "👁"}
                </span>
              </div>
              {errors.pass && <div className="field-error">{errors.pass}</div>}
            </div>

            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              <span>إرسال طلب التسجيل</span>
              <span>←</span>
            </button>

            <div className="form-footer-text">
              سيتم مراجعة طلبك من فريقنا خلال ٢٤–٤٨ ساعة
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════ */
/* PAGE: FORGOT PASSWORD                                      */
/* ══════════════════════════════════════════════════════════ */
function ForgotPage({ navigate }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSMS = async () => {
    if (!phone) { setErrors({ phone: "رقم الجوال مطلوب" }); return; }
    setErrors({});
    setLoading(true);
    await sleep(1500);
    setLoading(false);
    navigate("otp", { flow: "forgot", redirect: "login" });
  };

  return (
    <>
      {loading && <LoadingOverlay text="جاري إرسال الرمز..." />}
      <div className="auth-wrapper">
        <div className="auth-container">
          <BrandPanel
            icon="🔐"
            title="استعادة<br/>كلمة المرور 🔑"
            desc="لا تقلق، سنرسل لك رمز التحقق على جوالك لإعادة تعيين كلمتك."
            features={[
              { icon: "📱", text: "رمز SMS آمن" },
              { icon: "⏱", text: "صالح لـ ٥ دقائق فقط" },
            ]}
          />
          <div className="auth-form-panel">
            <div style={{ marginBottom: 12 }}>
              <button
                onClick={() => navigate("login")}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, fontFamily: "Cairo, sans-serif", fontWeight: 600, padding: 0 }}
              >
                ← العودة لتسجيل الدخول
              </button>
            </div>
            <div className="form-header">
              <div className="tag-badge">🔐 استعادة الحساب</div>
              <div className="form-title">نسيت كلمة المرور؟</div>
              <div className="form-subtitle">أدخل رقم جوالك وسنرسل لك رمز التحقق</div>
            </div>

            <div className="form-group">
              <label className="form-label">رقم الجوال المسجّل</label>
              <div className="input-wrap">
                <span className="input-icon">📱</span>
                <input type="tel" className={`form-input ${errors.phone ? "error-field" : ""}`}
                  placeholder="05xxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              {errors.phone && <div className="field-error">{errors.phone}</div>}
            </div>

            <button className="btn-primary" onClick={handleSMS} disabled={loading}>
              <span>إرسال رمز التحقق</span>
              <span>📲</span>
            </button>

            <div className="form-footer-text">
              تذكرت كلمة المرور؟ <a onClick={() => navigate("login")}>تسجيل الدخول</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════ */
/* PAGE: OTP VERIFICATION                                     */
/* ══════════════════════════════════════════════════════════ */
function OtpPage({ navigate, addToast, params = {} }) {
  const [digits, setDigits] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef()];

  const startTimer = () => setTimer(60);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleInput = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 4) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs[i - 1].current?.focus();
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < 5) { addToast("error", "أدخل الرمز كاملاً (٥ أرقام)"); return; }
    setLoading(true);
    await sleep(2000);
    setLoading(false);

    if (code === "12345") {
      const isRegister = params.flow === "register" || params.flow === "doctor-register";
      setResult({
        ok: true,
        icon: "🎉",
        title: isRegister ? "تم إنشاء الحساب!" : "تم التحقق بنجاح!",
        msg: isRegister
          ? "تم إنشاء حسابك بنجاح. سيتم توجيهك لصفحة تسجيل الدخول."
          : "تم التحقق من هويتك بنجاح.",
        redirect: params.redirect || "login",
      });
    } else {
      setResult({
        ok: false,
        icon: "❌",
        title: "رمز خاطئ",
        msg: "الرمز الذي أدخلته غير صحيح. تأكد من الرمز وحاول مجدداً.",
        redirect: null,
      });
    }
  };

  const handleResultClose = () => {
    if (result.ok) {
      addToast("success", result.title);
      navigate(result.redirect || "login");
    }
    setResult(null);
  };

  const isRegister = params.flow === "register" || params.flow === "doctor-register";

  return (
    <>
      {loading && <LoadingOverlay text="جاري التحقق من الرمز..." />}
      {result && (
        <ResultModal
          icon={result.icon}
          title={result.title}
          msg={result.msg}
          btnLabel={result.ok ? "متابعة" : "حاول مجدداً"}
          onClose={handleResultClose}
        />
      )}

      <div className="auth-wrapper">
        <div className="auth-container" style={{ maxWidth: 820 }}>
          <BrandPanel
            icon="📲"
            title="خطوة واحدة<br/>وأنت داخل! 📲"
            desc="أرسلنا رمز التحقق المكوّن من ٥ أرقام. الرمز صالح لمدة ٥ دقائق."
            features={[
              { icon: "🔐", text: "رمز مشفّر وآمن" },
              { icon: "⏱", text: "صالح لـ ٥ دقائق فقط" },
            ]}
          />
          <div className="auth-form-panel">
            <div className="steps-row">
              <div className="step-dot done">✓</div>
              <div className={`step-line ${isRegister ? "done" : ""}`} />
              <div className="step-dot active">٢</div>
              <div className="step-line" />
              <div className="step-dot">٣</div>
            </div>

            <div className="form-header" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>📱</div>
              <div className="form-title">أدخل رمز التحقق</div>
              <div className="form-subtitle">
                أرسلنا رمزاً مكوناً من ٥ أرقام إلى جوالك
                <br />
                <small style={{ color: "var(--text-light)", fontSize: 12 }}>
                  (للتجربة: استخدم الرمز <strong>12345</strong>)
                </small>
              </div>
            </div>

            <div className="otp-row">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={refs[i]}
                  className="otp-input"
                  maxLength={1}
                  type="text"
                  inputMode="numeric"
                  value={d}
                  onChange={(e) => handleInput(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                />
              ))}
            </div>

            <button className="btn-primary" onClick={handleVerify} disabled={loading}>
              <span>تأكيد الرمز</span>
              <span>✓</span>
            </button>

            <div className="resend-row">
              لم تستلم الرمز؟&nbsp;
              {timer > 0 ? (
                <span className="resend-timer">(إعادة الإرسال بعد {timer}ث)</span>
              ) : (
                <span className="resend-link" onClick={startTimer}>إعادة الإرسال</span>
              )}
            </div>

            <div className="form-footer-text">
              <a onClick={() => navigate("login")}>← العودة لتسجيل الدخول</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════ */
/* PAGE: DASHBOARD                                            */
/* ══════════════════════════════════════════════════════════ */
function DashboardPage({ navigate }) {
  return (
    <div className="auth-wrapper" style={{ minHeight: "100vh" }}>
      <div style={{
        textAlign: "center", background: "var(--white)",
        borderRadius: 28, padding: "52px 48px", maxWidth: 480, width: "90%",
        boxShadow: "var(--shadow)", border: "1px solid var(--border)",
        animation: "scaleIn .3s cubic-bezier(.34,1.56,.64,1)"
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🐾</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", marginBottom: 10 }}>
          مرحباً في Raouf!
        </div>
        <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.75, marginBottom: 28 }}>
          تم تسجيل دخولك بنجاح. هذه صفحة لوحة التحكم الخاصة بك.
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" style={{ width: "auto", padding: "12px 28px" }} onClick={() => navigate("home")}>
            → الصفحة الرئيسية
          </button>
          <button
            onClick={() => navigate("login")}
            style={{
              padding: "12px 28px", background: "transparent", color: "var(--text-muted)",
              border: "1.5px solid var(--border)", borderRadius: 12,
              fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo, sans-serif"
            }}
          >
            ← تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/* ROOT APP                                                   */
/* ══════════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [params, setParams] = useState({});
  const [toasts, setToasts] = useState([]);

  const navigate = (dest, p = {}) => {
    setPage(dest);
    setParams(p);
    window.scrollTo(0, 0);
  };

  const addToast = (type, msg) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, msg }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const pages = {
    home:            <HomePage navigate={navigate} />,
    login:           <LoginPage navigate={navigate} addToast={addToast} />,
    "choose-type":   <ChooseTypePage navigate={navigate} />,
    register:        <RegisterPage navigate={navigate} addToast={addToast} />,
    "doctor-register": <DoctorRegisterPage navigate={navigate} addToast={addToast} />,
    forgot:          <ForgotPage navigate={navigate} />,
    otp:             <OtpPage navigate={navigate} addToast={addToast} params={params} />,
    dashboard:       <DashboardPage navigate={navigate} />,
  };

  return (
    <>
      <style>{css}</style>
      <Toast toasts={toasts} />
      {pages[page] || pages.home}
    </>
  );
}
