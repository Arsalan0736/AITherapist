'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/10 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <span>Therap<span className="text-indigo-400">AI</span>st</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/research" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
                Research
              </Link>
              <Link href="/contact" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
                Contact
              </Link>
            </nav>
          </div>
          <Link
            href="/session"
            className="px-5 py-2 rounded-full bg-white text-slate-950 text-sm font-medium hover:bg-indigo-50 transition-all shadow-lg shadow-indigo-500/20"
          >
            Start Session
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">About <span className="text-primary">Us</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We are bridging the gap between advanced technology and compassionate mental health support.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="bento-grid">

          {/* Mission Card */}
          <motion.div
            className="bento-card md:col-span-2 bg-gradient-to-br from-primary/10 to-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg opacity-80 leading-relaxed mb-6">
              TherapAIst was created with a clear mission: to make mental health support accessible to everyone, everywhere, at any time.
              By leveraging cutting-edge artificial intelligence, we've developed a platform that provides empathetic, personalized therapeutic interactions without the barriers of traditional therapy.
            </p>
            <div className="flex gap-4 flex-wrap">
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium">Accessibility</div>
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium">Privacy</div>
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium">Empathy</div>
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            className="bento-card bg-white text-slate-950 flex flex-col justify-center items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-5xl font-bold mb-2 text-indigo-600">24/7</div>
            <div className="font-medium opacity-80">Availability</div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            className="bento-card md:col-span-1 bg-secondary/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-4">The Vision</h3>
            <p className="text-muted-foreground">
              A world where mental health support is immediate, stigma-free, and personalized to every individual's unique needs.
            </p>
          </motion.div>

          {/* Team Card - Spans 2 columns */}
          <motion.div
            className="bento-card md:col-span-2 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-6">The Team</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { name: "Dr. Sarah Chen", role: "Clinical Psychologist" },
                  { name: "James Wilson", role: "AI Researcher" },
                  { name: "Elena Rodriguez", role: "UX Designer" },
                  { name: "David Kim", role: "Lead Engineer" }
                ].map((member) => (
                  <div key={member.name} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold">
                      {member.name[0]}
                    </div>
                    <div>
                      <div className="font-bold">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            className="bento-card bg-indigo-600 text-white flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">Join Us</h3>
              <p className="opacity-90 text-sm">We are always looking for talent.</p>
            </div>
            <Link href="/contact" className="mt-8 px-6 py-3 bg-white text-indigo-600 rounded-full text-center font-bold hover:bg-indigo-50 transition-colors">
              Contact
            </Link>
          </motion.div>

        </div>
      </main>
    </div>
  );
}