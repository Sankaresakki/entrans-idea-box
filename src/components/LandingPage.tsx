/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

interface LandingPageProps {
  onSignIn: () => void;
}

const NAV_LINKS = [
  { label: "What is Ripple?", href: "#what-is-ripple" },
  { label: "Our Objectives",  href: "#objectives" },
  { label: "The Workflow",    href: "#workflow" },
  { label: "Employee Manual", href: "#manual" },
  { label: "Get Started",     href: "#cta" },
];

const OBJECTIVES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M3 12h1m16 0h1m-2.929-7.071-.707.707M5.636 18.364l-.707.707m12.728 0-.707-.707M5.636 5.636l-.707-.707" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    title: "Build One Ion Culture",
    desc: "Fostering a unified culture of innovation and collaboration across the organization."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0" />
      </svg>
    ),
    color: "bg-violet-50 text-violet-600 border-violet-100",
    title: "Enhance Engagement",
    desc: "Increasing employee participation and engagement through active contribution to the platform."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2m-6 9 2 2 4-4" />
      </svg>
    ),
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    title: "Employee Listening",
    desc: "Capturing feedback and insights directly from the grassroots level of the organization."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    ),
    color: "bg-amber-50 text-amber-600 border-amber-100",
    title: "Financial Impact",
    desc: "Creating new avenues for financial impact and cost optimization across all functions."
  },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Submission",
    desc: "Employee submits idea proposal with Area of Impact via the Ripple Platform.",
    color: "border-indigo-200 bg-indigo-50",
    badge: "bg-indigo-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Evaluation",
    desc: "Idea Review Committee evaluates proposals monthly. Selected ideas get immediate appreciation.",
    color: "border-violet-200 bg-violet-50",
    badge: "bg-violet-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Execution",
    desc: "Function Head implements the idea. Central POC tracks milestones monthly.",
    color: "border-emerald-200 bg-emerald-50",
    badge: "bg-emerald-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    step: "04",
    title: "Impact & Reward",
    desc: "Financial impact evaluated by Audit/Finance. Rewards distributed based on impact.",
    color: "border-amber-200 bg-amber-50",
    badge: "bg-amber-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16 2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onSignIn }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">

      {/* ── NAVIGATION ──────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80"
            : "bg-gradient-to-b from-black/30 to-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo — left, small in nav */}
          <img
            src="/image001.png"
            className="h-10 w-auto object-contain"
            alt="Ripple"
          />

          {/* Desktop Nav — center */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  scrolled ? "text-slate-600 hover:text-indigo-600" : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Sign In + Mobile Toggle — right */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSignIn}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              className="md:hidden p-2 rounded-lg cursor-pointer"
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label="Menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke={scrolled ? "#1e293b" : "#fff"} strokeWidth="2" className="w-5 h-5">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3 shadow-lg">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left text-sm font-medium text-slate-700 hover:text-indigo-600 py-1 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </motion.nav>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1)     translateX(0)       translateY(0); }
          50%  { transform: scale(1.07)  translateX(-1%)     translateY(-0.5%); }
          100% { transform: scale(1.12)  translateX(0.5%)    translateY(-1%); }
        }
        .ken-burns { animation: kenBurns 14s ease-in-out infinite alternate; }
        @keyframes logoGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,0), 0 25px 60px rgba(0,0,0,0.35); }
          50%     { box-shadow: 0 0 70px 20px rgba(255,255,255,0.18), 0 25px 60px rgba(0,0,0,0.35); }
        }
        .logo-glow { animation: logoGlow 3.5s ease-in-out infinite; }
        @keyframes orbit-a { from{transform:rotate(0deg)   translateX(230px) rotate(0deg)}   to{transform:rotate(360deg)  translateX(230px) rotate(-360deg)} }
        @keyframes orbit-b { from{transform:rotate(72deg)  translateX(220px) rotate(-72deg)}  to{transform:rotate(432deg)  translateX(220px) rotate(-432deg)} }
        @keyframes orbit-c { from{transform:rotate(144deg) translateX(235px) rotate(-144deg)} to{transform:rotate(504deg)  translateX(235px) rotate(-504deg)} }
        @keyframes orbit-d { from{transform:rotate(216deg) translateX(225px) rotate(-216deg)} to{transform:rotate(576deg)  translateX(225px) rotate(-576deg)} }
        @keyframes orbit-e { from{transform:rotate(288deg) translateX(228px) rotate(-288deg)} to{transform:rotate(648deg)  translateX(228px) rotate(-648deg)} }
      `}</style>
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Ken Burns background */}
        <div className="ken-burns absolute inset-0 bg-gradient-to-br from-[#002D47] via-[#00466B] to-[#0086C0]" />

        {/* Layered glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[950px] rounded-full border border-white/[0.04]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full border border-white/[0.04]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-white/[0.06]" />
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-sky-400/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
          <div className="absolute top-2/3 right-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        {/* ─── CENTERED HERO CONTENT ─── */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-3xl mx-auto w-full">

          {/* ══ LOGO — THE HIGHLIGHT (Saturn Orbit) ══ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: -24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-4 relative flex items-center justify-center flex-shrink-0"
            style={{ width: 500, height: 500 }}
          >
            {/* ── Saturn rings — behind logo ── */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] w-[450px] h-[145px] rounded-[50%] border-2 border-white/[0.22] pointer-events-none"
              style={{ zIndex: 1 }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] w-[475px] h-[160px] rounded-[50%] border border-white/[0.10] pointer-events-none"
              style={{ zIndex: 1 }}
            />

            {/* ── Orbiting icons ── */}
            {([
              { anim: 'orbit-a', dur: '10s', emoji: '💡', label: 'Idea'     },
              { anim: 'orbit-b', dur: '14s', emoji: '🎯', label: 'Evaluate' },
              { anim: 'orbit-c', dur: '9s',  emoji: '🚀', label: 'Execute'  },
              { anim: 'orbit-d', dur: '16s', emoji: '🏆', label: 'Impact'   },
              { anim: 'orbit-e', dur: '12s', emoji: '⚡', label: 'Action'   },
            ] as const).map(item => (
              <div
                key={item.label}
                title={item.label}
                className="absolute top-1/2 left-1/2 -mt-5 -ml-5 w-10 h-10 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-lg shadow-lg shadow-black/20 pointer-events-none"
                style={{ animation: `${item.anim} ${item.dur} linear infinite`, zIndex: 2 }}
              >
                {item.emoji}
              </div>
            ))}

            {/* ── Logo glow halo ── */}
            <div
              className="absolute w-64 h-44 bg-white/10 blur-3xl rounded-full pointer-events-none"
              style={{ zIndex: 2 }}
            />

            {/* ── White logo card ── */}
            <div
              className="logo-glow relative bg-white rounded-[2rem] px-10 py-6 shadow-2xl border border-white/30"
              style={{ zIndex: 3 }}
            >
              <img src="/image001.png" className="h-20 w-auto object-contain" alt="Ripple — One Idea Many Ripples" />
            </div>

            {/* ── Saturn ring — front arc (lower portion, in front of logo) ── */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] w-[450px] h-[145px] rounded-[50%] border-2 border-white/[0.18] pointer-events-none"
              style={{ zIndex: 4, clipPath: 'polygon(0 52%, 100% 52%, 100% 100%, 0 100%)' }}
            />
          </motion.div>

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-semibold tracking-wide"
          >
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Employee Innovation Platform &nbsp;·&nbsp; One Ion
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.58 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.04] mb-6"
          >
            One Small{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300">
              Idea,
            </span>
            <br />
            Massive{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300">
              Impact.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.73 }}
            className="text-lg text-sky-100/80 leading-relaxed max-w-xl mx-auto mb-8"
          >
            Ripple captures, evaluates, and implements high-value employee ideas
            — driving innovation and growth at every level of the organization.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.88 }}
            className="flex flex-wrap gap-4 justify-center mb-10"
          >
            <button
              onClick={onSignIn}
              className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-full text-base shadow-2xl hover:shadow-white/20 hover:bg-sky-50 transition-all cursor-pointer flex items-center gap-2 group"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 group-hover:rotate-12 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Submit Your Idea
            </button>
            <button
              onClick={() => scrollTo("#workflow")}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-full text-base hover:bg-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              How It Works
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 text-xs">
          <span>Scroll to explore</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 animate-bounce">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── WHAT IS RIPPLE? ──────────────────────────────────────────── */}
      <section id="what-is-ripple" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 text-indigo-600 text-sm font-semibold uppercase tracking-widest">
              <span className="w-8 h-px bg-indigo-300" />
              About the Program
            </span>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">
              What is Ripple?
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              A structured employee ideation platform that enables employees to submit ideas
              with the potential to create measurable business impact. We aim to capture,
              evaluate, and implement high-value ideas that contribute to innovation, operational
              excellence, cost optimization, customer value, and organizational growth.
            </p>

            {/* Why the Name card */}
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <span className="text-xl">💡</span>
                Why the Name "Ripple"?
              </div>
              <blockquote className="text-slate-700 text-base leading-relaxed italic pl-4 border-l-2 border-indigo-300">
                "One small idea, shared by one employee, can create a much larger impact across
                the organization."
              </blockquote>
            </div>
          </div>

          {/* Features grid (replaces numbered stat cards) */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "💡", title: "Employee-Led Ideas",    desc: "Every associate can contribute impactful ideas." },
              { icon: "🔍", title: "Structured Evaluation", desc: "IRC reviews each idea with a transparent scorecard." },
              { icon: "🚀", title: "Implementation Support", desc: "Functional Heads lead execution with dedicated teams." },
              { icon: "🌟", title: "Recognized Contribution", desc: "Certificates and rewards for every selected idea." },
            ].map(card => (
              <div key={card.title} className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl mb-3">{card.icon}</div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{card.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR OBJECTIVES ──────────────────────────────────────────── */}
      <section id="objectives" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 space-y-4">
            <span className="inline-flex items-center gap-2 text-indigo-600 text-sm font-semibold uppercase tracking-widest">
              <span className="w-8 h-px bg-indigo-300" />
              Purpose &amp; Vision
              <span className="w-8 h-px bg-indigo-300" />
            </span>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">Our Objectives</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Driving value through structured ideation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OBJECTIVES.map(obj => (
              <div
                key={obj.title}
                className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${obj.color} group-hover:scale-110 transition-transform`}>
                  {obj.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{obj.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE RIPPLE WORKFLOW ──────────────────────────────────────── */}
      <section id="workflow" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 space-y-4">
            <span className="inline-flex items-center gap-2 text-indigo-600 text-sm font-semibold uppercase tracking-widest">
              <span className="w-8 h-px bg-indigo-300" />
              How It Works
              <span className="w-8 h-px bg-indigo-300" />
            </span>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">The Ripple Workflow</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              From idea submission to business impact
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-indigo-200 via-violet-200 to-amber-200 z-0" />

            {WORKFLOW_STEPS.map((step, idx) => (
              <div key={step.step} className={`relative z-10 border ${step.color} rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl ${step.badge} flex items-center justify-center text-white`}>
                    {step.icon}
                  </div>
                  <span className={`text-3xl font-black opacity-20 ${idx === 0 ? "text-indigo-800" : idx === 1 ? "text-violet-800" : idx === 2 ? "text-emerald-800" : "text-amber-800"}`}>
                    {step.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMPLOYEE USER MANUAL ─────────────────────────────────────── */}
      <section id="manual" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 space-y-12">

          {/* Section header */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-2 text-indigo-600 text-sm font-semibold uppercase tracking-widest">
              <span className="w-8 h-px bg-indigo-300" />
              Employee User Manual
              <span className="w-8 h-px bg-indigo-300" />
            </span>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">
              How to Use{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Ripple
              </span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              A step-by-step visual guide to submitting your first idea and navigating the platform.
              Download the full guide PDF or log in to access the interactive manual.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <a
                href="/employee-manual.pdf"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-full shadow hover:bg-indigo-700 transition-all cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4" />
                </svg>
                Download PDF Guide
              </a>
              <button
                onClick={onSignIn}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-indigo-200 text-indigo-700 text-sm font-semibold rounded-full hover:bg-indigo-50 transition-all cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4m-5-4 5-5-5-5m5 5H3" />
                </svg>
                Open Interactive Guide
              </button>
            </div>
          </div>

          {/* 6-step visual cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { step: "01", title: "Log In", desc: "Sign in with your corporate credentials on the Ripple platform.", color: "border-indigo-200 bg-indigo-50", badge: "bg-indigo-600" },
              { step: "02", title: "Fill the Proposal Form", desc: "Complete all sections — problem, proposed idea, risks, and estimated impact.", color: "border-violet-200 bg-violet-50", badge: "bg-violet-600" },
              { step: "03", title: "Submit & Track", desc: "Submit your idea and monitor its journey through the evaluation pipeline.", color: "border-emerald-200 bg-emerald-50", badge: "bg-emerald-600" },
              { step: "04", title: "Respond to Queries", desc: "If C-POC requests more detail, update and resubmit within the platform.", color: "border-amber-200 bg-amber-50", badge: "bg-amber-500" },
              { step: "05", title: "Pitch to IRC", desc: "Present your idea to the Idea Review Committee in a 5-minute Teams session.", color: "border-sky-200 bg-sky-50", badge: "bg-sky-600" },
              { step: "06", title: "Get Recognised", desc: "Receive your Certificate of Selection and Rs. 2,000 reward on IRC selection.", color: "border-rose-200 bg-rose-50", badge: "bg-rose-600" },
            ].map(card => (
              <div key={card.step} className={`p-5 rounded-2xl border ${card.color} space-y-3 relative overflow-hidden`}>
                <span className={`absolute top-4 right-4 text-[9px] font-black font-mono text-white px-2 py-0.5 rounded-full ${card.badge}`}>
                  {card.step}
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm pr-10">{card.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Embedded PDF viewer — visible once /public/employee-manual.pdf is placed */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 text-indigo-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
              </svg>
              <span className="text-xs font-semibold text-slate-700">Employee Platform Guide — Ripple PDF</span>
              <a href="/employee-manual.pdf" download className="ml-auto text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4" />
                </svg>
                Download
              </a>
            </div>
            <div className="bg-slate-100 flex items-center justify-center" style={{ height: '480px' }}>
              <object
                data="/employee-manual.pdf"
                type="application/pdf"
                className="w-full h-full"
              >
                <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-slate-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
                  </svg>
                  <p className="text-sm font-semibold text-slate-500">PDF guide not yet uploaded</p>
                  <p className="text-xs text-slate-400 max-w-sm">Place <code className="bg-slate-200 px-1 rounded">employee-manual.pdf</code> in the <code className="bg-slate-200 px-1 rounded">/public</code> folder to display here.</p>
                </div>
              </object>
            </div>
          </div>

        </div>
      </section>

      {/* ── READY TO CREATE A RIPPLE? (CTA) ─────────────────────────── */}
      <section id="cta" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
          <span className="inline-flex items-center gap-2 text-indigo-600 text-sm font-semibold uppercase tracking-widest">
            <span className="w-8 h-px bg-indigo-300" />
            Get Started
            <span className="w-8 h-px bg-indigo-300" />
          </span>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">
            Ready to Create a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Ripple?
            </span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto">
            Have an idea that could improve our operations, reduce costs, or delight our customers?
            Submit it now and start the ripple effect.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onSignIn}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-full text-base shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:to-violet-700 transition-all cursor-pointer flex items-center gap-2.5"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.82m2.56-5.84a14.98 14.98 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              </svg>
              Launch Idea Submission Portal
            </button>
          </div>

          <p className="text-sm text-slate-400">
            Sign in to access your personalized ideation workspace.
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" fill="white" />
                <circle cx="12" cy="12" r="7" strokeOpacity="0.5" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-white text-sm">Ripple</div>
              <div className="text-xs text-slate-400">Ion Exchange (India) Limited</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center sm:text-right">
            &copy; {new Date().getFullYear()} Ripple Initiative. All rights reserved.
            <br className="sm:hidden" />
            <span className="sm:ml-2">Ion Exchange (India) Limited · RIPPLE Ideation Platform</span>
          </p>
        </div>
      </footer>
    </div>
  );
};
