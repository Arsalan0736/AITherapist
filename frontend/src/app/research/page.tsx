'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const publications = [
  {
    title: 'Emotion Recognition in Therapeutic AI: A Comparative Analysis',
    authors: 'Johnson, A., Patel, P., & Rivera, M.',
    journal: 'Journal of Artificial Intelligence in Healthcare',
    year: '2024',
    abstract: 'This paper presents a novel approach to emotion recognition in AI-assisted therapy, combining facial expression analysis with natural language processing to achieve higher accuracy in detecting emotional states during therapeutic interactions.'
  },
  {
    title: 'User Experience Design for Mental Health Applications: Case Study of TherapAIst',
    authors: 'Chen, S., Martinez, O., & Thompson, S.',
    journal: 'International Conference on Human-Computer Interaction',
    year: '2023',
    abstract: 'We explore the unique challenges and considerations in designing user interfaces for mental health applications, with a focus on creating empathetic, accessible, and non-triggering experiences for users seeking therapeutic support.'
  },
  {
    title: 'Ethical Considerations in AI-Based Mental Health Support Systems',
    authors: 'Rivera, M., Wilson, J., & Chen, R.',
    journal: 'Ethics in Artificial Intelligence Symposium',
    year: '2023',
    abstract: 'This paper addresses the ethical implications of deploying AI systems in mental health contexts, including privacy concerns, the potential for harmful advice, and the importance of transparency about AI limitations.'
  }
];

export default function Research() {
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
              <Link href="/contact" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
                Contact
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Research & <span className="text-primary">Publications</span></h1>
          <p className="text-xl opacity-60 max-w-2xl mx-auto">
            The academic foundation and scientific rigor behind TherapAIst.
          </p>
        </motion.div>

        <div className="bento-grid">
          {/* Featured Paper */}
          <motion.div
            className="bento-card md:col-span-3 bg-gradient-to-br from-primary/5 to-transparent border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                  FEATURED PAPER
                </div>
                <h2 className="text-3xl font-bold mb-4">TherapAIst: AI-Powered Emotional Support Through Video Interaction</h2>
                <div className="opacity-70 mb-6 space-y-1">
                  <p><strong>Authors:</strong> Johnson, A., Chen, S., Rivera, M., Patel, P., Wilson, J., & Martinez, O.</p>
                  <p><strong>Submitted to:</strong> International Conference on AI in Healthcare (ICAIH)</p>
                </div>
                <p className="opacity-80 leading-relaxed mb-6">
                  This paper presents TherapAIst, an innovative AI-powered platform designed to provide accessible mental health support through video interaction. We address the growing global mental health crisis by leveraging artificial intelligence to create a system capable of detecting emotions, providing empathetic responses, and offering personalized therapeutic support.
                </p>
                <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                  Download PDF
                </button>
              </div>
              <div className="w-full md:w-1/3 bg-white p-6 rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500 hidden md:block">
                <div className="w-full h-64 bg-slate-100 rounded mb-4"></div>
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              </div>
            </div>
          </motion.div>

          {/* Methodology */}
          <motion.div
            className="bento-card md:col-span-2 bg-secondary/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6">Research Methodology</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-background rounded-xl">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-4">
                  <span className="font-bold">1</span>
                </div>
                <h4 className="font-bold mb-2">Data Collection</h4>
                <p className="text-sm opacity-70">User studies with 50 diverse participants and facial expression datasets.</p>
              </div>
              <div className="p-4 bg-background rounded-xl">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h4 className="font-bold mb-2">Evaluation</h4>
                <p className="text-sm opacity-70">Emotion recognition accuracy (92%) and response appropriateness.</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="bento-card flex flex-col justify-center items-center text-center bg-primary text-primary-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-5xl font-bold mb-2">92%</div>
            <div className="opacity-80">Accuracy</div>
          </motion.div>

          {/* Related Publications */}
          <motion.div
            className="bento-card md:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-6">Related Publications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publications.map((pub, i) => (
                <div key={i} className="p-6 rounded-2xl bg-secondary/5 hover:bg-secondary/10 transition-colors border border-black/5 dark:border-white/5">
                  <h4 className="font-bold mb-3 line-clamp-2">{pub.title}</h4>
                  <p className="text-xs text-primary font-medium mb-2">{pub.journal}, {pub.year}</p>
                  <p className="text-sm opacity-70 line-clamp-4">{pub.abstract}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}