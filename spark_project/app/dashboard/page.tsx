'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Layout from '@/components/Shared/Layout';
import BackButton from '@/components/Shared/BackButton';
import { Award as AwardIcon, Star, BookOpen, CheckCircle, TrendingUp, UserCircle, Sparkles, Layers, Briefcase } from 'lucide-react';
import { learningCourses, Course } from '@/data/learningCourses';

const DashboardPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [userXP, setUserXP] = useState<number>(0);
  const [userBadges, setUserBadges] = useState<string[]>([]); // Stores badge strings/emojis
  const [courseProgress, setCourseProgress] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);

    const storedXP = localStorage.getItem('userXP');
    if (storedXP) setUserXP(parseInt(storedXP, 10) || 0);

    const storedBadges = localStorage.getItem('userBadges');
    if (storedBadges) {
      try {
        setUserBadges(JSON.parse(storedBadges));
      } catch (e) {
        console.error("Failed to parse userBadges from localStorage", e);
        setUserBadges([]);
      }
    }

    const progressMap = new Map<string, boolean>();
    learningCourses.forEach(course => {
      const completed = localStorage.getItem(`course_completed_${course.id}`) === 'true';
      progressMap.set(course.id, completed);
    });
    const tailoredCompleted = localStorage.getItem('course_completed_tailored-course') === 'true';
    if (tailoredCompleted) {
        progressMap.set('tailored-course', true);
    }
    setCourseProgress(progressMap);
  }, []);

  const getTailoredCourseDetailsIfNeeded = (): Course | null => {
    if (courseProgress.get('tailored-course')) {
        const userRole = localStorage.getItem('userRole');
        const baseCourseForTailoring = learningCourses.find(c => c.id === 'role-personalized');
        if (baseCourseForTailoring && userRole) {
            return {
                ...baseCourseForTailoring,
                id: 'tailored-course',
                title: `✨ Tailored Onboarding for ${userRole} ✨`,
                description: `Your special fast-track course based on your role as an ${userRole}.`,
                badge: baseCourseForTailoring.badge,
            };
        }
    }
    return null;
  };

  const allDisplayCourses = [...learningCourses];
  const tailoredCourseDetails = getTailoredCourseDetailsIfNeeded();
  if (tailoredCourseDetails && !learningCourses.find(c => c.id === 'tailored-course')) {
    allDisplayCourses.unshift(tailoredCourseDetails);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <Layout>
      <div className="absolute top-4 left-4 z-20">
          <BackButton />
      </div>
      <motion.div
        className="container mx-auto px-4 py-12 md:py-16 min-h-screen bg-gradient-to-br from-bg via-slate-50 to-aqua/10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* User Summary Section */}
        <motion.section variants={itemVariants} className="mb-10 md:mb-12 text-center">
          <UserCircle className="mx-auto text-mauve mb-3 h-20 w-20 drop-shadow-lg" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary font-heading mb-2">
            Welcome Back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-cherry to-mauve">{username || 'Spark User'}</span>!
          </h1>
          <p className="text-lg text-slate-600">
            Your FIDO Spark Journey So Far
          </p>
          <div className="mt-4 inline-flex items-center justify-center gap-2 bg-lime/30 text-primary font-semibold px-6 py-3 rounded-xl shadow-md">
            <Star size={24} className="text-yellow-400"/>
            <span className="text-2xl">{userXP}</span> XP Earned
            <Sparkles size={20} className="ml-1 text-yellow-500 opacity-80"/>
          </div>
        </motion.section>

        {/* Badges Section */}
        <motion.section variants={itemVariants} className="mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary font-heading mb-6 flex items-center">
            <AwardIcon size={30} className="mr-3 text-cherry" /> My Badges & Achievements
          </h2>
          {userBadges.length > 0 ? (
            <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {userBadges.map((badgeName, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-lg text-center aspect-square flex flex-col items-center justify-center ring-1 ring-slate-200 hover:shadow-lime/30 transition-shadow duration-300"
                >
                  {badgeName === 'Product Pro' ? (
                    <motion.div
                      className="mb-2"
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Briefcase size={64} className="text-primary" />
                    </motion.div>
                  ) : (
                    <div className="text-5xl md:text-6xl mb-2 motion-safe:animate-bounce">{badgeName}</div>
                  )}
                  {badgeName === 'Product Pro' ? (
                    <p className="text-sm font-medium text-primary mt-1">Product Pro</p>
                  ) : null}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-slate-500 bg-white/50 p-6 rounded-xl text-center shadow">
              <Layers size={28} className="mx-auto mb-2 text-slate-400"/>
              No badges earned yet. Keep learning and playing to unlock them!
            </p>
          )}
        </motion.section>

        {/* Course Progress Section */}
        <motion.section variants={itemVariants}>
          <h2 className="text-2xl md:text-3xl font-bold text-primary font-heading mb-6 flex items-center">
            <TrendingUp size={30} className="mr-3 text-aqua" /> My Learning Progress
          </h2>
          <div className="space-y-5">
            {allDisplayCourses.map((course) => {
              const isCompleted = courseProgress.get(course.id) || false;
              return (
                <motion.div
                  key={course.id}
                  variants={itemVariants}
                  className={`p-5 md:p-6 rounded-2xl shadow-lg transition-all duration-300 ring-1 ${isCompleted ? 'bg-gradient-to-r from-green-500/20 to-lime/20 ring-green-300' : 'bg-white/70 backdrop-blur-md ring-slate-200 hover:shadow-mauve/20'}`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <h3 className={`text-lg md:text-xl font-semibold ${isCompleted ? 'text-green-700' : 'text-primary'}`}>{course.title}</h3>
                      <p className={`text-sm text-slate-600 mt-1 mb-3 sm:mb-0 ${isCompleted ? 'text-slate-500' : 'text-slate-500'}`}>{course.description}</p>
                    </div>
                    <motion.button
                      onClick={() => router.push(`/learning/course/${course.id}`)}
                      className={`mt-3 sm:mt-0 flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-transform hover:scale-105 ${isCompleted ? 'bg-lime text-primary hover:bg-lime/80' : 'bg-primary text-white hover:bg-primary/80'}`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {isCompleted ? (
                        <><CheckCircle size={18} className="inline mr-1.5" /> View Details</>
                      ) : (
                        <><BookOpen size={18} className="inline mr-1.5" /> Start Course</>
                      )}
                    </motion.button>
                  </div>
                  {isCompleted && (
                    <div className="mt-3 pt-3 border-t border-green-300/50 flex items-center text-green-600 text-xs font-medium">
                        <AwardIcon size={14} className="mr-1.5"/> Badge Unlocked: {course.badge}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </motion.div>
    </Layout>
  );
};

export default DashboardPage; 