'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { learningCourses, Course, QuizQuestion, Card as CourseCardInterface } from '@/data/learningCourses';
import Layout from '@/components/Shared/Layout';
import BackButton from '@/components/Shared/BackButton';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Award, RotateCcw, Home, ChevronRight, ChevronLeft, HelpCircle, ShieldCheck, Star } from 'lucide-react';

const SimpleConfetti = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: -20, opacity: 0, x: Math.random() * window.innerWidth - window.innerWidth / 2 }}
                    animate={{ 
                        y: window.innerHeight + 50, 
                        opacity: [1, 0.8, 0], 
                        x: Math.random() * window.innerWidth - window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                        rotate: Math.random() * 360 
                    }}
                    transition={{ duration: Math.random() * 2 + 2, delay: Math.random() * 1, repeat: Infinity, repeatType: "loop" }}
                    className="absolute text-2xl"
                    style={{ color: [`#D6086B`, `#A3F8FF`, `#E8FF34`, `#FABAFF`][Math.floor(Math.random()*4)] }}
                >
                    {['●', '▲', '■', '◆'][Math.floor(Math.random()*4)]}
                </motion.div>
            ))}
        </div>
    );
};

type QuizState = 'loading' | 'takingQuiz' | 'results' | 'noQuizFound';

interface QuizResult {
  courseId: string;
  title: string;
  score: number;
  date: string;
  passed: boolean;
  badge: string;
  xpAwarded?: boolean;
}

const CourseQuizPage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = typeof params.id === 'string' ? params.id : null;

  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>('loading');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  useEffect(() => {
    if (!courseId) {
      setQuizState('noQuizFound'); 
      return;
    }
    let courseData: Course | undefined | null = null;
    if (courseId === 'tailored-course') {
      if (userRole) {
        const tailoredCourseQuiz: QuizQuestion[] = [
          { question: "Purpose of personalized onboarding?", options: ["Holiday schedules", "Role, responsibilities, tools", "HR paperwork only", "Meet CEO"], answer: "Role, responsibilities, tools"},
          { question: "Key component of first 30 days?", options: ["Lead product launch", "Company financials deep dive", "Key milestones & objectives", "Performance review"], answer: "Key milestones & objectives"},
          { question: "Who to contact for tool help?", options: ["Community forum", "Buddy or team lead", "External vendor", "Legal department"], answer: "Buddy or team lead"}
        ];
        const tailoredCourseCards: CourseCardInterface[] = [ { title: "Welcome!", body: "..." } ];
        courseData = {
          id: "tailored-course", title: `Quiz: Personalized Onboarding – ${userRole}`,
          description: `Test your knowledge for ${userRole}s.`, badge: "Tailored Spark Starter",
          role: userRole, cards: tailoredCourseCards, quiz: tailoredCourseQuiz,
        };
      } else { setQuizState('noQuizFound'); return; }
    } else {
      courseData = learningCourses.find(c => c.id === courseId);
    }

    if (courseData) {
      setCurrentCourse(courseData);
      if (courseData.quiz && courseData.quiz.length > 0) {
        setQuizQuestions(courseData.quiz);
        setQuizState('takingQuiz');
      } else { setQuizState('noQuizFound'); }
    } else { setQuizState('noQuizFound'); }
  }, [courseId, userRole]);

  const handleOptionSelect = (option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateScoreAndFinish();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScoreAndFinish = () => {
    let correctAnswers = 0;
    quizQuestions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) correctAnswers++;
    });
    const calculatedScore = Math.round((correctAnswers / quizQuestions.length) * 100);
    setScore(calculatedScore);
    const passed = calculatedScore >= 60;
    let awardedNewBadge = false;

    if (passed && currentCourse) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      const userBadgesRaw = localStorage.getItem("userBadges");
      let userBadges: string[] = userBadgesRaw ? JSON.parse(userBadgesRaw) : [];
      if (!userBadges.includes(currentCourse.badge)) {
        userBadges.push(currentCourse.badge);
        localStorage.setItem("userBadges", JSON.stringify(userBadges));
        awardedNewBadge = true; 

        const userXPRaw = localStorage.getItem("userXP");
        let userXP = userXPRaw ? parseInt(userXPRaw, 10) : 0;
        userXP += 50;
        localStorage.setItem("userXP", userXP.toString());
      }
    }

    if (currentCourse && courseId) {
        const quizHistoryRaw = localStorage.getItem("quizHistory");
        let quizHistory: QuizResult[] = quizHistoryRaw ? JSON.parse(quizHistoryRaw) : [];
        const newResult: QuizResult = {
            courseId: courseId,
            title: currentCourse.title.replace("Quiz: ",""),
            score: calculatedScore,
            date: new Date().toLocaleDateString(),
            passed: passed,
            badge: currentCourse.badge,
            xpAwarded: passed && awardedNewBadge
        };
        quizHistory.unshift(newResult);
        localStorage.setItem("quizHistory", JSON.stringify(quizHistory));
    }
    setQuizState('results');
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setShowConfetti(false);
    setQuizState('takingQuiz');
  };

  const currentQuestion = useMemo(() => quizQuestions[currentQuestionIndex], [quizQuestions, currentQuestionIndex]);

  const questionVariants = { enter: { opacity: 0, x: 50 }, center: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -50 } };

  if (quizState === 'loading') return <Layout><BackButton /><div className="flex justify-center items-center min-h-screen"><p className="text-xl animate-pulse text-primary">Loading Quiz Sparkles...</p></div></Layout>;
  if (quizState === 'noQuizFound' || !currentCourse) return <Layout><BackButton /><div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center p-6 bg-white rounded-xl shadow-lg m-4"><HelpCircle size={60} className="text-red-500 mb-4" /><h2 className="text-2xl font-bold text-primary mb-3">Quiz Not Found</h2><p className="text-gray-600 mb-6">{currentCourse ? `No quiz for "${currentCourse.title}" module yet.` : "Quiz not found."}</p><button onClick={() => router.push(courseId ? `/learning/course/${courseId}` : '/learning/courses')} className="bg-mauve hover:bg-mauve/80 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all">Back to Course</button></div></Layout>;

  return (
    <Layout>
      <BackButton />
      {showConfetti && <SimpleConfetti />}
      <div className="container mx-auto px-4 py-8 md:py-12 font-sans min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
        {quizState === 'takingQuiz' && currentQuestion && (
          <motion.div key={currentQuestionIndex} variants={questionVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full max-w-2xl">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl mb-8">
              <p className="text-sm text-mauve font-semibold mb-1">{currentCourse.title.replace("Quiz: ","")}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                <motion.div className="bg-gradient-to-r from-lime to-aqua h-2.5 rounded-full shadow-md" style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }} transition={{type:'spring', stiffness: 50}}></motion.div>
              </div>
              <p className="text-gray-500 text-xs mb-4">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
              <h2 className="text-xl md:text-2xl font-bold text-primary mb-6 font-heading">{currentQuestion.question}</h2>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.button key={index} onClick={() => handleOptionSelect(option)} className={`w-full text-left p-3 md:p-4 rounded-lg border-2 transition-all duration-150 ease-in-out ${selectedAnswers[currentQuestionIndex] === option ? 'bg-lime/30 border-lime ring-2 ring-lime text-primary font-semibold' : 'bg-gray-50 hover:bg-mauve/10 border-gray-200 text-gray-700'}`} whileHover={{ scale: selectedAnswers[currentQuestionIndex] === option ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}>{option}</motion.button>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <motion.button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className="bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><ChevronLeft size={20} className="mr-2"/> Previous</motion.button>
              <motion.button onClick={handleNextQuestion} disabled={!selectedAnswers[currentQuestionIndex]} className="bg-primary text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{currentQuestionIndex < quizQuestions.length - 1 ? 'Next' : 'Finish'}<ChevronRight size={20} className="ml-2"/></motion.button>
            </div>
          </motion.div>
        )}
        {quizState === 'results' && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 150, damping: 15 }} className="w-full max-w-lg text-center bg-white p-8 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-heading">Quiz Completed!</h2>
            {score >= 60 ? <CheckCircle size={60} className="text-green-500 mx-auto mb-4" /> : <XCircle size={60} className="text-red-500 mx-auto mb-4" />}
            <p className={`text-5xl md:text-6xl font-bold mb-1 ${score >=60 ? 'text-green-500' : 'text-red-500'}`}>{score}%</p>
            <p className={`text-xs font-medium mb-4 ${score >=60 ? 'text-green-400' : 'text-red-400'}`}>{score >= 60 ? 'PASSED' : 'NEEDS IMPROVEMENT'}</p>
            {score >= 60 ? (
              <div className="mb-6 p-4 bg-lime/20 rounded-lg">
                <motion.div initial={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1, transition:{delay:0.3, type:'spring'}}} className="flex items-center justify-center text-yellow-500 mb-2"><Award size={30} className="mr-2" /> <span className="text-xl font-semibold text-green-700">Badge Unlocked!</span></motion.div>
                <p className="text-lg text-gray-700"><span className="font-bold">{currentCourse.badge}</span></p>
                <p className="text-sm text-green-600 mt-1 font-semibold flex items-center justify-center"><Star size={16} className="mr-1 fill-yellow-400 text-yellow-500"/> +50 XP Gained!</p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-red-50 rounded-lg">
                <p className="text-xl font-semibold text-red-700">Keep Learning!</p>
                <p className="text-gray-700 mt-1">You need 60% to pass. Review the material and try again!</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              {score < 60 && <motion.button onClick={restartQuiz} className="bg-lime text-primary font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-lime/80 transition-colors flex items-center justify-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><RotateCcw size={18} className="mr-2"/> Retry Quiz</motion.button>}
              <motion.button onClick={() => router.push(courseId ? `/learning/course/${courseId}` : '/learning/courses')} className="bg-mauve text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-mauve/80 transition-colors flex items-center justify-center order-first sm:order-last" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><ShieldCheck size={18} className="mr-2"/> View Course</motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default CourseQuizPage; 