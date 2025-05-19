'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { learningCourses, Course, Card } from '../../../data/learningCourses';
import Layout from '../../../components/Shared/Layout';
import BackButton from '../../../components/Shared/BackButton';
import { BookOpenText, Sparkles, PlayCircle } from 'lucide-react';

const CourseCatalogPage = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [coursesToDisplay, setCoursesToDisplay] = useState<Course[]>([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    setUsername(storedUsername);
    setUserRole(storedRole);
  }, []);

  useEffect(() => {
    let allDisplayCourses: Course[] = [...learningCourses];

    if (userRole) {
      const tailoredCourseCards: Card[] = [
        { title: "Welcome to your Role", body: `Learn how your role as a ${userRole} fits into FIDO's mission and vision.`, icon: "👋" },
        { title: "Tools You'll Use", body: "Get an overview of the key software, platforms, and internal tools essential for your role.", icon: "🛠️" },
        { title: "Your First 30 Days", body: "Understand key milestones, expectations, and how to achieve success during your initial onboarding phase.", icon: "🗓️" },
      ];

      const tailoredCourse: Course = {
        id: "tailored-course",
        title: `Your Personalized Onboarding – ${userRole}`,
        description: `A custom learning path designed specifically for your unique role as a ${userRole}. Let's get you started!`,
        badge: "Tailored Starter",
        role: userRole,
        cards: tailoredCourseCards,
      };
      allDisplayCourses = [tailoredCourse, ...learningCourses.filter(c => c.role === 'All' || c.id !== "role-personalized")];
    } else {
      allDisplayCourses = learningCourses.filter(c => c.role === 'All');
    }
    
    setCoursesToDisplay(
      allDisplayCourses.sort((a, b) => {
        if (a.id === "tailored-course") return -1;
        if (b.id === "tailored-course") return 1;
        if (a.role === userRole && b.role !== userRole) return -1;
        if (b.role === userRole && a.role !== userRole) return 1;
        return 0;
      })
    );

  }, [userRole]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 100,
      },
    }),
  };

  return (
    <Layout>
      <BackButton />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.header 
          className="mb-10 md:mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary font-heading drop-shadow-md">
            Hi {username || 'Explorer'}, choose a course to begin your journey <BookOpenText className="inline-block ml-2 mb-1 text-mauve" size={36}/>
          </h1>
        </motion.header>

        {coursesToDisplay.length === 0 && !userRole && (
          <p className="text-center text-gray-500 text-lg">Loading your courses or please log in to see personalized content!</p>
        )}
         {coursesToDisplay.length === 0 && userRole && (
          <p className="text-center text-gray-500 text-lg">No courses currently available for your role. Please check back later!</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {coursesToDisplay.map((course, index) => {
            const isDynamicallyTailored = course.id === "tailored-course";
            const courseLink = isDynamicallyTailored ? "/learning/course/tailored-course" : `/learning/course/${course.id}`;

            return (
              <motion.div
                key={course.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className={`rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 ease-in-out group ${
                  isDynamicallyTailored 
                    ? 'ring-2 ring-indigo-500 bg-indigo-50 shadow-lg hover:shadow-xl' 
                    : 'bg-white border border-gray-200 shadow-xl hover:shadow-2xl hover:scale-105'
                }`}
              >
                <div className={`p-6 flex-grow ${isDynamicallyTailored ? 'relative' : ''}`}>
                  {isDynamicallyTailored && (
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-xl flex items-center shadow-md">
                      <Sparkles size={14} className="mr-1" /> Tailored for You
                    </div>
                  )}
                  {!isDynamicallyTailored && course.role === userRole && course.role !== 'All' && (
                     <div className="absolute top-0 right-0 bg-lime text-primary text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-xl flex items-center shadow-md">
                        <Sparkles size={14} className="mr-1" /> For Your Role
                    </div>
                  )}
                  <h2 className={`text-xl md:text-2xl font-bold font-heading mb-2 group-hover:text-mauve transition-colors ${isDynamicallyTailored ? 'text-indigo-700' : 'text-primary'}`}>
                    {course.title}
                  </h2>
                  <p className={`text-sm mb-4 leading-relaxed min-h-[60px] max-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent ${isDynamicallyTailored ? 'text-indigo-600' : 'text-gray-600'}`}>
                    {course.description}
                  </p>
                  <p className={`text-xs mb-4 ${isDynamicallyTailored ? 'text-indigo-500' : 'text-gray-500'}`}>
                    Unlocks Badge: <span className={`font-semibold ${isDynamicallyTailored ? 'text-indigo-700' : 'text-mauve'}`}>{course.badge}</span>
                  </p>
                </div>
                
                <div className={`p-6 mt-auto transition-colors ${isDynamicallyTailored ? 'bg-indigo-50/50 group-hover:bg-indigo-100/70' : 'bg-gray-50/50 group-hover:bg-gray-100/70'}`}>
                  <Link href={courseLink} legacyBehavior>
                    <a className={`w-full font-semibold py-3 px-5 rounded-lg shadow-soft hover:shadow-lg transition-all duration-200 font-heading flex items-center justify-center group-hover:scale-105 transform ${
                      isDynamicallyTailored 
                        ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
                        : 'bg-primary hover:bg-primary/90 text-white'
                    }`}>
                       <PlayCircle size={20} className="mr-2"/> Start Course
                    </a>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default CourseCatalogPage; 