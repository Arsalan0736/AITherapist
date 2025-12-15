'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Privacy() {
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

      <main className="max-w-4xl mx-auto pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Privacy <span className="text-primary">Policy</span></h1>
          <p className="text-xl opacity-60 max-w-2xl mx-auto">
            How we protect your data and privacy.
          </p>
        </motion.div>

        <motion.div
          className="bento-card bg-white dark:bg-stone-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>Introduction</h2>
            <p>
              At TherapAIst, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered therapy platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
            </p>
            <p>
              We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
            </p>

            <h2>Information We Collect</h2>

            <h3>Personal Data</h3>
            <p>
              When using our platform, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to:
            </p>
            <ul>
              <li>Email address (for account creation and communication)</li>
              <li>First name and last name (optional)</li>
              <li>Usage data and session analytics</li>
            </ul>

            <h3>Therapy Session Data</h3>
            <p>
              During therapy sessions, our platform collects:
            </p>
            <ul>
              <li>Text messages exchanged with the AI therapist</li>
              <li>Emotion analysis data from facial expressions (processed locally)</li>
              <li>Session duration and interaction metrics</li>
            </ul>
            <p>
              <strong>Important:</strong> Video data is processed in real-time on your device and is not stored on our servers. Facial expression analysis happens locally to protect your privacy.
            </p>

            <h2>How We Use Your Information</h2>
            <p>
              We use the collected data for various purposes:
            </p>
            <ul>
              <li>To provide and maintain our Service</li>
              <li>To personalize your therapy experience</li>
              <li>To improve our AI algorithms and therapeutic responses</li>
              <li>To generate anonymized analytics and research insights</li>
              <li>To communicate with you about service updates or respond to inquiries</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
            <p>
              All data used for research and improvement purposes is anonymized and aggregated to protect individual privacy.
            </p>

            <h2>Data Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
            <p>
              Our security measures include:
            </p>
            <ul>
              <li>End-to-end encryption for all communications</li>
              <li>Local processing of video data to minimize privacy risks</li>
              <li>Secure, anonymized storage of conversation data</li>
              <li>Regular security audits and vulnerability testing</li>
              <li>Strict access controls for all systems and databases</li>
            </ul>

            <h2>Your Data Rights</h2>
            <p>
              As a user of TherapAIst, you have certain rights regarding your personal data:
            </p>
            <ul>
              <li><strong>Right to Access</strong> - You have the right to request copies of your personal data.</li>
              <li><strong>Right to Rectification</strong> - You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
              <li><strong>Right to Erasure</strong> - You have the right to request that we erase your personal data, under certain conditions.</li>
              <li><strong>Right to Restrict Processing</strong> - You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
              <li><strong>Right to Data Portability</strong> - You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the information provided in the Contact section.
            </p>

            <h2>Limitations for Academic Project</h2>
            <p>
              TherapAIst is a final year academic project and is not intended to replace professional mental health services. As such:
            </p>
            <ul>
              <li>The platform is provided for educational and research purposes only</li>
              <li>Data collected may be used for academic research with appropriate anonymization</li>
              <li>The service may have limited availability beyond the academic project timeline</li>
            </ul>
            <p>
              We are committed to maintaining high standards of privacy and data protection despite these limitations.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul>
              <li><strong>By email:</strong> privacy@therapaist-project.edu</li>
              <li><strong>By visiting this page on our website:</strong> <Link href="/contact">Contact Page</Link></li>
            </ul>
            <p className="italic opacity-60">
              Last updated: May 15, 2024
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}