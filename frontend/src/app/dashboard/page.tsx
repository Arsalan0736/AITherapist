'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllSessionData } from '@/components/analytics/SessionAnalytics';
import { getEmotionColor } from '@/utils/emotionDetection';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 10;

export default function DashboardPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Load session data from localStorage
    const sessionData = getAllSessionData();
    // Sort by date descending (newest first)
    sessionData.sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    setSessions(sessionData);
    setLoading(false);
  }, []);

  // Calculate total stats
  const totalSessions = sessions.length;
  const totalMessages = sessions.reduce((sum, session) => sum + session.messageCount, 0);
  const averageSessionDuration = sessions.length > 0
    ? sessions.reduce((sum, session) => {
      if (!session.endTime) return sum;
      return sum + (new Date(session.endTime).getTime() - new Date(session.startTime).getTime());
    }, 0) / sessions.length / 60000 // Convert to minutes
    : 0;

  // Calculate emotion distribution
  const emotionCounts = sessions.reduce((counts, session) => {
    Object.entries(session.emotionCounts).forEach(([emotion, count]) => {
      counts[emotion] = (counts[emotion] || 0) + (count as number);
    });
    return counts;
  }, {} as Record<string, number>);

  const totalEmotions = Object.values(emotionCounts).reduce((sum: number, count) => sum + (count as number), 0);
  const emotionPercentages = Object.entries(emotionCounts).map(([emotion, count]) => ({
    emotion,
    percentage: Number(totalEmotions) > 0 ? Math.round((Number(count) / Number(totalEmotions)) * 100) : 0
  }));

  // Pagination Logic
  const totalPages = Math.ceil(sessions.length / ITEMS_PER_PAGE);
  const paginatedSessions = sessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
              <Link href="/session" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
                Session
              </Link>
            </nav>
          </div>
          <Link
            href="/session"
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
          >
            New Session
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
          <p className="opacity-60">Track your progress and emotional journey.</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="opacity-60">Loading analytics data...</p>
          </div>
        ) : sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bento-card text-center py-20"
          >
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">No sessions yet</h3>
            <p className="opacity-60 mb-8 max-w-md mx-auto">Start your first therapy session to begin tracking your emotional well-being and progress.</p>
            <Link
              href="/session"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Start Your First Session
            </Link>
          </motion.div>
        ) : (
          <div className="bento-grid">
            {/* Summary cards */}
            <motion.div
              className="bento-card flex flex-col justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-sm font-medium opacity-60 mb-1">Total Sessions</h3>
              <p className="text-4xl font-bold text-primary">{totalSessions}</p>
            </motion.div>

            <motion.div
              className="bento-card flex flex-col justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-sm font-medium opacity-60 mb-1">Total Messages</h3>
              <p className="text-4xl font-bold text-primary">{totalMessages}</p>
            </motion.div>

            <motion.div
              className="bento-card flex flex-col justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-medium opacity-60 mb-1">Avg. Duration</h3>
              <p className="text-4xl font-bold text-primary">
                {averageSessionDuration.toFixed(1)} <span className="text-lg font-normal opacity-60">min</span>
              </p>
            </motion.div>

            {/* Emotion distribution */}
            <motion.div
              className="bento-card md:col-span-3 lg:col-span-1 row-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-bold mb-6">Emotion Distribution</h3>

              <div className="space-y-6">
                {emotionPercentages.map(({ emotion, percentage }) => (
                  <div key={emotion} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium capitalize opacity-80">{emotion}</span>
                      <span className="opacity-60">{percentage}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${getEmotionColor(emotion as any).replace('bg-', 'bg-')}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Session history */}
            <motion.div
              className="bento-card md:col-span-3 lg:col-span-2 row-span-2 overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Session History</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-foreground opacity-60">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <div className="overflow-x-auto flex-grow">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-black/5 dark:border-white/5">
                      <th className="px-6 py-4 text-xs font-medium opacity-50 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-medium opacity-50 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-4 text-xs font-medium opacity-50 uppercase tracking-wider">Messages</th>
                      <th className="px-6 py-4 text-xs font-medium opacity-50 uppercase tracking-wider">Primary Emotion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {paginatedSessions.map((session, index) => {
                      // Calculate session duration
                      const duration = session.endTime
                        ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000)
                        : 0;

                      // Find primary emotion
                      const primaryEmotion = Object.entries(session.emotionCounts)
                        .reduce<{ emotion: string; count: number }>((max, [emotion, count]) =>
                          (count as number) > max.count ? { emotion, count: count as number } : max,
                          { emotion: 'neutral', count: 0 });

                      return (
                        <tr key={index} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm opacity-80">
                            {new Date(session.startTime).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm opacity-60">
                            {duration} min
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm opacity-60">
                            {session.messageCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-secondary text-foreground`}>
                              {primaryEmotion.emotion}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary hover:bg-secondary/80'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}