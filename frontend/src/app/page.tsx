'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroBackground from '@/components/HeroBackground';

// Premium Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Parallax & Fade Effects
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, 100]);
  const navBackground = scrolled ? 'rgba(15, 23, 42, 0.8)' : 'transparent';
  const navBorder = scrolled ? 'rgba(255, 255, 255, 0.1)' : 'transparent';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 selection:text-indigo-200 font-sans overflow-x-hidden">

      {/* Premium Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 transition-all duration-500 backdrop-blur-md"
        style={{ backgroundColor: navBackground, borderBottom: `1px solid ${navBorder}` }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <span>Therap<span className="text-indigo-400">AI</span>st</span>
            </Link>

            <div className="hidden md:flex items-center space-x-10">
              {['About', 'Research', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors tracking-wide"
                >
                  {item}
                </Link>
              ))}
              <Link
                href="/session"
                className="group relative px-6 py-3 rounded-full bg-white text-slate-950 text-sm font-semibold transition-all hover:bg-indigo-50"
              >
                <span className="relative z-10">Start Session</span>
                <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-10 blur-md transition-opacity" />
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <HeroBackground />

        {/* Ambient Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950 pointer-events-none" />

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-10"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/30 border border-indigo-500/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-medium text-indigo-200 tracking-wide uppercase">The Future of Mental Wellness</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9]"
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400">
                Clarity in
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-indigo-300 via-indigo-400 to-indigo-600">
                Every Word.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light"
            >
              Experience the next generation of therapeutic support.
              Advanced emotion recognition meets compassionate AI to provide
              insights that truly matter.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Link
                href="/session"
                className="w-full sm:w-auto px-10 py-5 rounded-full bg-white text-slate-950 text-lg font-semibold hover:bg-slate-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105"
              >
                Begin Journey
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto px-10 py-5 rounded-full bg-slate-900/50 border border-slate-800 text-white text-lg font-medium hover:bg-slate-800/50 transition-all backdrop-blur-sm hover:border-slate-700"
              >
                Discover More
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-slate-500 to-transparent" />
        </motion.div>
      </section>

      {/* Premium Bento Grid Section */}
      <section className="py-32 relative bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-6 gap-6"
          >
            {/* Header Card */}
            <motion.div variants={scaleIn} className="md:col-span-4 bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">
                Intelligence that <br />
                <span className="text-indigo-400">Understands You</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-md relative z-10">
                Our proprietary algorithms analyze micro-expressions and vocal patterns to detect emotions with clinical-grade accuracy.
              </p>
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
            </motion.div>

            {/* Stat Card */}
            <motion.div variants={scaleIn} className="md:col-span-2 bg-indigo-600 rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10">
                <div className="text-6xl font-bold text-white mb-2">24/7</div>
                <div className="text-indigo-200 font-medium">Availability</div>
              </div>
              <div className="relative z-10 mt-8">
                <p className="text-indigo-100 text-sm leading-relaxed">
                  Support whenever you need it. No appointments, no waiting rooms.
                </p>
              </div>
            </motion.div>

            {/* Feature Card 1 */}
            <motion.div variants={scaleIn} className="md:col-span-2 bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 min-h-[300px] flex flex-col justify-end relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
              <Image
                src="/neural-pattern.jpeg"
                alt="Privacy"
                fill
                className="object-cover opacity-30 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="relative z-20">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Private by Design</h3>
                <p className="text-slate-400 text-sm">End-to-end encryption and local processing ensure your data never leaves your device.</p>
              </div>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div variants={scaleIn} className="md:col-span-2 bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 min-h-[300px] flex flex-col justify-end relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-20">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 backdrop-blur-md flex items-center justify-center mb-4 border border-indigo-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Evidence Based</h3>
                <p className="text-slate-400 text-sm">Built on proven CBT and mindfulness frameworks to provide effective support.</p>
              </div>
            </motion.div>

            {/* Feature Card 3 */}
            <motion.div variants={scaleIn} className="md:col-span-2 bg-white text-slate-950 rounded-[2.5rem] p-8 min-h-[300px] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />

              <div className="relative z-10">
                <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-xs font-bold uppercase tracking-wider mb-4">
                  New Feature
                </div>
                <h3 className="text-2xl font-bold mb-2">Voice Analysis</h3>
              </div>

              <div className="relative z-10">
                <p className="text-slate-600 text-sm mb-6">
                  Beyond words, we analyze tone, pitch, and cadence to understand the full context.
                </p>
                <Link href="/research" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                  Read the Research <span className="ml-2">→</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2 text-white">TherapAIst</h3>
              <p className="text-slate-500 text-sm">Empowering mental wellness through AI.</p>
            </div>
            <div className="flex gap-8 text-sm text-slate-500">
              <Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link>
            </div>
            <div className="text-slate-600 text-sm">
              © 2024 TherapAIst. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
