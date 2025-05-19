'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Layout from '@/components/Shared/Layout';
import BackButton from '@/components/Shared/BackButton';
import { Award as AwardIcon, CheckCircle, XCircle, CalendarDays, BarChart3, Sparkles, History, HelpCircle } from 'lucide-react';

// Reflects the structure stored in localStorage from CourseQuizPage
interface QuizResult {
  courseId: string;
  title: string;
  score: number; // Percentage, e.g., 80
  date: string; // ISO date string
  passed: boolean;
  badge?: string; // Badge emoji/name
  xpAwarded?: number;
}

const QuizHistoryPage = () => {
  const router = useRouter();
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedHistory = localStorage.getItem('quizHistory');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory) as QuizResult[];
        // Sort by date, most recent first
        parsedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setQuizHistory(parsedHistory);
      } catch (e) {
        console.error("Failed to parse quizHistory from localStorage", e);
        setQuizHistory([]);
      }
    }
    setLoading(false);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120 } },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <BackButton />
        <div className="container mx-auto px-4 py-12 text-center">
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-xl text-slate-500">Loading quiz history...</motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="absolute top-4 left-4 z-20">
        <BackButton />
      </div>
      <motion.div 
        className="container mx-auto px-4 py-10 md:py-16 min-h-screen"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-10 md:mb-12">
            <History className="mx-auto text-mauve mb-3 h-16 w-16 drop-shadow-lg" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary font-heading mb-2">
                My Quiz History
            </h1>
            <p className="text-lg text-slate-600">
                Review your past quiz attempts and achievements.
            </p>
        </motion.div>

        {quizHistory.length > 0 ? (
          <motion.div variants={containerVariants} className="space-y-5">
            {quizHistory.map((result, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className={`p-5 md:p-6 rounded-2xl shadow-lg ring-1 ${result.passed ? 'bg-gradient-to-r from-green-500/10 via-lime-500/10 to-bg ring-green-300' : 'bg-gradient-to-r from-red-500/10 via-rose-500/10 to-bg ring-red-300'}`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
                    <h3 className={`text-lg md:text-xl font-semibold ${result.passed ? 'text-green-700' : 'text-red-700'}`}>{result.title}</h3>
                    <p className={`text-sm font-medium mt-1 sm:mt-0 flex items-center ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                        {result.passed ? <CheckCircle size={18} className="mr-1.5"/> : <XCircle size={18} className="mr-1.5"/>}
                        {result.passed ? 'Passed' : 'Failed'}
                    </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm text-slate-700">
                    <div className="flex items-center">
                        <BarChart3 size={16} className="mr-2 text-primary/70"/> 
                        Score: <span className="font-semibold ml-1">{result.score}%</span>
                    </div>
                    <div className="flex items-center">
                        <CalendarDays size={16} className="mr-2 text-primary/70"/> 
                        Date: <span className="font-medium ml-1">{formatDate(result.date)}</span>
                    </div>
                    {result.badge && (
                        <div className="flex items-center text-green-600">
                            <AwardIcon size={16} className="mr-2"/> 
                            Badge: <span className="font-semibold ml-1">{result.badge}</span>
                        </div>
                    )}
                     {result.xpAwarded && result.xpAwarded > 0 && (
                        <div className="flex items-center text-yellow-600">
                            <Sparkles size={16} className="mr-2"/> 
                            XP: <span className="font-semibold ml-1">+{result.xpAwarded}</span>
                        </div>
                    )}
                </div>
                
                {/* Future: Link to course or retry quiz? */}
                {/* {!result.passed && (
                     <button 
                        onClick={() => router.push(`/learning/course/${result.courseId}/quiz`)}
                        className="mt-3 text-sm text-primary hover:underline"
                    >
                        Retry Quiz
                    </button>
                )} */} 
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="text-center bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg ring-1 ring-slate-200">
            <HelpCircle size={40} className="mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-semibold text-primary mb-2">No Quizzes Taken Yet!</h3>
            <p className="text-slate-500 mb-4">Complete courses and their quizzes to see your history here.</p>
            <button 
                onClick={() => router.push('/learning/courses')}
                className="bg-primary text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:bg-primary/80 transition-colors"
            >
                Explore Courses
            </button>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default QuizHistoryPage; 