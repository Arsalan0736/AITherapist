'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: 'Alex Johnson',
    role: 'Project Lead & AI Developer',
    bio: 'Alex specializes in machine learning and natural language processing, with a focus on emotional intelligence in AI systems.',
    initials: 'AJ',
    color: 'bg-blue-500'
  },
  {
    name: 'Samantha Chen',
    role: 'Frontend Developer',
    bio: 'Samantha is passionate about creating intuitive user interfaces and has expertise in React and modern web technologies.',
    initials: 'SC',
    color: 'bg-purple-500'
  },
  {
    name: 'Dr. Michael Rivera',
    role: 'Psychology Consultant',
    bio: 'Dr. Rivera brings clinical psychology expertise to ensure the AI responses align with therapeutic best practices.',
    initials: 'MR',
    color: 'bg-green-500'
  },
  {
    name: 'Priya Patel',
    role: 'Computer Vision Specialist',
    bio: 'Priya developed the emotion detection algorithms that analyze facial expressions in real-time video.',
    initials: 'PP',
    color: 'bg-pink-500'
  },
  {
    name: 'James Wilson',
    role: 'Backend Developer',
    bio: 'James architected the system infrastructure, ensuring secure data handling and efficient API responses.',
    initials: 'JW',
    color: 'bg-orange-500'
  },
  {
    name: 'Olivia Martinez',
    role: 'UX Researcher',
    bio: 'Olivia conducted user testing and gathered feedback to refine the therapeutic experience and interface.',
    initials: 'OM',
    color: 'bg-teal-500'
  }
];

export default function Team() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/10 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Therap<span className="text-primary">AI</span>st
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/about" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
                About
              </Link>
              <Link href="/research" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
                Research
              </Link>
            </nav>
          </div>
          <Link
            href="/session"
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
          >
            Start Session
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Meet the <span className="text-primary">Team</span></h1>
          <p className="text-xl opacity-60 max-w-2xl mx-auto">
            The talented individuals bridging the gap between AI and mental health.
          </p>
        </motion.div>

        <div className="bento-grid">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="bento-card flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full ${member.color} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                  {member.initials}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-sm text-primary font-medium">{member.role}</p>
                </div>
              </div>
              <p className="opacity-70 leading-relaxed">
                {member.bio}
              </p>
            </motion.div>
          ))}

          {/* Collaboration CTA */}
          <motion.div
            className="bento-card md:col-span-3 bg-secondary/10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4">Interested in Collaboration?</h2>
            <p className="opacity-60 max-w-2xl mx-auto mb-8">
              We're always open to collaborating with researchers, developers, and mental health professionals who share our vision.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}