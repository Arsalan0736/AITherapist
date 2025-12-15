'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Terms() {
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Terms of <span className="text-primary">Service</span></h1>
          <p className="text-xl opacity-60 max-w-2xl mx-auto">
            Please read these terms carefully before using TherapAIst.
          </p>
        </motion.div>

        <motion.div
          className="bento-card bg-white dark:bg-stone-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using TherapAIst, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
            </p>
            <p>
              These Terms of Service apply to all users of the platform, including without limitation users who are browsers, researchers, students, and contributors of content.
            </p>

            <h2>2. Academic Project Disclaimer</h2>
            <p>
              TherapAIst is a final year academic project and is provided for educational and research purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p>
              <strong>Important limitations:</strong>
            </p>
            <ul>
              <li>The AI therapist is not a licensed mental health professional</li>
              <li>The platform may not be continuously available beyond the academic project timeline</li>
              <li>The service is provided "as is" without warranties of any kind</li>
              <li>The emotion detection and response systems are experimental technologies</li>
            </ul>
            <p>
              Always seek the advice of qualified health providers with any questions you may have regarding medical or mental health conditions.
            </p>

            <h2>3. User Responsibilities</h2>
            <p>
              As a user of TherapAIst, you agree to:
            </p>
            <ul>
              <li>Provide accurate information during interactions with the platform</li>
              <li>Use the platform responsibly and for its intended purpose</li>
              <li>Not attempt to manipulate, hack, or disrupt the service</li>
              <li>Not use the platform to harm yourself or others</li>
              <li>Seek professional help for serious mental health concerns</li>
              <li>Not share access to your therapy sessions with others</li>
              <li>Report any technical issues or concerning responses from the AI</li>
            </ul>
            <p>
              In case of emergency or if you're experiencing thoughts of self-harm, please contact a crisis helpline or emergency services immediately.
            </p>

            <h2>4. Intellectual Property</h2>
            <p>
              TherapAIst and its original content, features, and functionality are owned by the project team and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            <p>
              As this is an academic project, certain components may be made available under open-source licenses. The specific licensing terms for such components will be provided separately.
            </p>

            <h2>5. Data Usage and Research</h2>
            <p>
              By using TherapAIst, you acknowledge and agree that:
            </p>
            <ul>
              <li>Anonymized data from your interactions may be used for academic research purposes</li>
              <li>Such research may be published in academic journals or presented at conferences</li>
              <li>All published research will maintain user anonymity and confidentiality</li>
              <li>You can request the deletion of your data at any time (subject to academic research requirements)</li>
            </ul>
            <p>
              For more details on how we collect, use, and protect your data, please refer to our <Link href="/privacy">Privacy Policy</Link>.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, the project team and its members shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul>
              <li>Your access to or use of or inability to access or use the service</li>
              <li>Any conduct or content of any third party on the service</li>
              <li>Any content obtained from the service</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
            <p>
              This limitation applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis, even if we have been advised of the possibility of such damage.
            </p>

            <h2>7. Modifications to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            <p>
              By continuing to access or use our platform after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the platform.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <ul>
              <li><strong>By email:</strong> terms@therapaist-project.edu</li>
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