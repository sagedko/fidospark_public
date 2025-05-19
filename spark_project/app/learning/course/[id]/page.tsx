'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { learningCourses, Course, Card as CourseCardInterface } from '@/data/learningCourses';
import Layout from '@/components/Shared/Layout';
import BackButton from '@/components/Shared/BackButton';
import LearningCardCarousel from '@/components/LearningPath/LearningCardCarousel';
import BadgeUnlockAnimation from '@/components/LearningPath/BadgeUnlockAnimation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ThumbsUp, Rocket } from 'lucide-react';

type CoursePageView = 'loading' | 'cards' | 'moduleComplete' | 'badge' | 'notfound';

const CourseModulePage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = typeof params.id === 'string' ? params.id : null;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentView, setCurrentView] = useState<CoursePageView>('loading');
  const [userRole, setUserRole] = useState<string | null>(null);

  const [isPermanentlyCompleted, setIsPermanentlyCompleted] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);

    if (courseId) {
      const completedStatus = localStorage.getItem(`course_completed_${courseId}`);
      if (completedStatus === 'true') {
        setIsPermanentlyCompleted(true);
      }
    }
  }, [courseId]);

  useEffect(() => {
    if (!courseId) {
        setCurrentView('notfound');
        return;
    }

    let foundCourse: Course | undefined | null = null;

    if (courseId === 'tailored-course') {
      if (userRole) {
        const tailoredCourseCards: CourseCardInterface[] = [
          { title: "Welcome to your Role!", body: `An introduction to your responsibilities as a ${userRole} and how you contribute to FIDO Spark's success.`, icon: "👋", bgColor: "bg-gradient-to-br from-aqua/60 to-mauve/40"},
          { title: "Key Tools & Platforms", body: "Familiarize yourself with the essential software, communication channels, and platforms you'll be using daily.", icon: "🛠️", bgColor: "bg-gradient-to-br from-lime/60 to-aqua/40" },
          { title: "Your First 30 Days", body: "A roadmap for your initial month: key objectives, initial projects, and who to connect with.", icon: "🗓️", bgColor: "bg-gradient-to-br from-mauve/60 to-primary/30" },
        ];
        foundCourse = {
          id: "tailored-course",
          title: `Your Personalized Onboarding – ${userRole}`,
          description: `This custom learning path is designed specifically for your role as a ${userRole}. Let's dive in and get you up to speed with everything FIDO Spark! `,
          badge: "Tailored Spark Starter",
          role: userRole,
          cards: tailoredCourseCards,
        };
      } else {
        setCurrentView('notfound');
        return;
      }
    } else {
      foundCourse = learningCourses.find(c => c.id === courseId);
    }

    if (foundCourse) {
      setCourse(foundCourse);
      if (isPermanentlyCompleted) {
        setCurrentView('badge');
      } else {
        setCurrentView('cards');
      }
    } else {
      setCurrentView('notfound');
    }
  }, [courseId, userRole, isPermanentlyCompleted]);

  const handleCarouselComplete = () => {
    if (!isPermanentlyCompleted) {
        setCurrentView('moduleComplete');
    }
  };
  
  const handleStartQuiz = () => {
    if (course) {
        router.push(`/learning/course/${course.id}/quiz`);
    }
  };

  if (currentView === 'loading') {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
          <p className="text-xl text-primary animate-pulse">Loading Course Sparkles...</p>
        </div>
      </Layout>
    );
  }

  if (currentView === 'notfound' || !course) {
    return (
      <Layout>
        <div className="text-center py-10 bg-white rounded-xl shadow-md p-6 m-4">
          <motion.h1 
            initial={{opacity:0, y: -20}} animate={{opacity:1, y:0}} transition={{delay: 0.1}}
            className="text-3xl font-bold text-red-500 mb-4">😢 Course Not Found</motion.h1>
          <motion.p 
            initial={{opacity:0, y: -20}} animate={{opacity:1, y:0}} transition={{delay: 0.2}}
            className="text-gray-600 mb-6">We couldn't find the course you're looking for. It might be for a different role, or the link is incorrect.</motion.p>
          <Link href="/learning/courses" legacyBehavior>
            <motion.a 
              initial={{opacity:0, y: -20}} animate={{opacity:1, y:0}} transition={{delay: 0.3}}
              className="bg-lime hover:bg-lime/90 text-primary font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-colors">
              Back to Course Catalog
            </motion.a>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BackButton />
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <motion.div 
          className="mb-8 p-6 bg-white rounded-xl shadow-lg text-center border-b-4 border-mauve/50"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary font-heading mb-2 drop-shadow-md">
            {course.title}
          </h1>
          <p className="text-md text-gray-600 max-w-2xl mx-auto mb-3">
            {course.description}
          </p>
          <p className="text-sm text-mauve font-semibold">
            Complete this module to earn the <span className="font-bold">✨ {course.badge} ✨</span> badge!
          </p>
        </motion.div>

        {currentView === 'cards' && (
          <LearningCardCarousel cards={course.cards} onComplete={handleCarouselComplete} />
        )}

        {currentView === 'moduleComplete' && !isPermanentlyCompleted && (
          <motion.div 
            className="mt-8 text-center p-6 bg-gradient-to-r from-lime/30 to-aqua/30 rounded-xl shadow-xl flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness:150, damping:15, delay: 0.2}}
          >
            <ThumbsUp size={48} className="text-green-500 mb-4"/>
            <h2 className="text-2xl font-bold text-primary mb-3 font-heading">Module Cards Completed!</h2>
            <p className="text-gray-700 mb-6">Great job going through all the learning cards. Ready to test your knowledge?</p>
            <motion.button
              onClick={handleStartQuiz}
              className="bg-primary hover:bg-primary/80 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg font-heading flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Rocket size={20} className="mr-2"/> Start Quiz
            </motion.button>
          </motion.div>
        )}

        {currentView === 'badge' && isPermanentlyCompleted && (
          <BadgeUnlockAnimation badgeName={course.badge} courseId={course.id} />
        )}
      </div>
    </Layout>
  );
};

export default CourseModulePage; 