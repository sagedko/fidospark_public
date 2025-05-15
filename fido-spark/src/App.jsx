import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LearningMode from './components/LearningMode.jsx'
import QuizView from './components/QuizView.jsx'
import UserScoresView from './components/UserScoresView.jsx'
import WelcomeMessageView from './components/WelcomeMessageView.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import AnimatedBackground from './components/AnimatedBackground'
import { motion } from 'framer-motion'

// Animation Variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger effect for children
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

const backgroundShapeVariants = {
  animate: (custom) => ({
    x: custom.x,
    y: custom.y,
    scale: custom.scale,
    rotate: custom.rotate,
    opacity: custom.opacity,
    transition: {
      duration: custom.duration,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror",
    },
  }),
};

function App() {
  const [currentView, setCurrentView] = useState('login') // 'login', 'adminLogin', 'welcomeMessage', 'home', 'learning', 'quiz', 'game', 'userScores', 'adminDashboard'
  const [activeQuizSection, setActiveQuizSection] = useState(null) // To know which quiz to load
  const [currentSectionElapsedTime, setCurrentSectionElapsedTime] = useState(null); // For admin dashboard
  const [currentUser, setCurrentUser] = useState(null)
  const [userNameInput, setUserNameInput] = useState('')
  const [adminUserNameInput, setAdminUserNameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');

  // Check localStorage for an existing user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('fidoSparkCurrentUser')
    if (storedUser) {
      setCurrentUser(storedUser)
      // If admin was previously logged in, take them to admin dashboard directly on reload
      if (storedUser.toLowerCase() === 'admin') {
        setCurrentView('adminDashboard');
      } else {
        setCurrentView('welcomeMessage');
      }
    } else {
      setCurrentView('login');
    }
  }, [])

  const handleUserNameInputChange = (event) => {
    setUserNameInput(event.target.value)
  }
  const handleAdminUserNameInputChange = (event) => {
    setAdminUserNameInput(event.target.value)
  }
  const handleAdminPasswordInputChange = (event) => {
    setAdminPasswordInput(event.target.value)
  }

  const handleLogin = () => {
    const trimmedUserName = userNameInput.trim();
    if (trimmedUserName !== '') {
      localStorage.setItem('fidoSparkCurrentUser', trimmedUserName);
      setCurrentUser(trimmedUserName);
      setUserNameInput(''); // Clear input field
      
      if (trimmedUserName.toLowerCase() === 'admin') {
        setCurrentView('adminDashboard'); // Go to Admin Dashboard if user is admin
      } else {
        setCurrentView('welcomeMessage'); // Go to welcome message for other users
      }
    }
  }

  const handleNavigateToAdminLogin = () => {
    setCurrentView('adminLogin');
  }

  const handleAdminLogin = () => {
    // Logic to check adminUserNameInput and adminPasswordInput
    // For now, hardcode: username 'admin', password 'password123'
    if (adminUserNameInput.trim().toLowerCase() === 'admin' && adminPasswordInput === 'password123') {
      const adminUser = adminUserNameInput.trim(); // Could be a specific admin username
      localStorage.setItem('fidoSparkCurrentUser', adminUser); // Storing admin user
      setCurrentUser(adminUser);
      setAdminUserNameInput('');
      setAdminPasswordInput('');
      setCurrentView('adminDashboard');
    } else {
      alert('Invalid Admin Credentials'); // Simple feedback for now
      setAdminPasswordInput(''); // Clear password field
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fidoSparkCurrentUser')
    setCurrentUser(null)
    setCurrentView('login') // Go to login screen after logout
    setActiveQuizSection(null)
    setCurrentSectionElapsedTime(null);
    setAdminUserNameInput(''); // Clear admin fields on logout too
    setAdminPasswordInput('');
  }

  const handleContinueFromWelcome = () => {
    setCurrentView('home') // Navigate from welcome message to home menu
  }

  const handleNavigateToUserScores = () => {
    setCurrentView('userScores')
  }

  const handleLearningClick = () => {
    setCurrentView('learning')
    // Ensure activeQuizSection is null if coming from home to learning sections overview
    setActiveQuizSection(null)
  }

  const handlePlayGameClick = () => {
    setCurrentView('game') // Placeholder for game view
  }

  const handleGoHome = () => {
    setCurrentView('home')
    setActiveQuizSection(null) // Reset active quiz section when going home
  }

  // Called from LearningMode when "Start Quiz" is clicked
  const handleStartQuizFromLearning = (sectionKey, learningTime) => {
    setActiveQuizSection(sectionKey);
    setCurrentSectionElapsedTime(learningTime);
    setCurrentView('quiz');
  }

  // Called from QuizView results screen to go back to learning section selection
  const handleBackToLearningHub = () => {
    setCurrentView('learning')
    setActiveQuizSection(null) // Important to clear this so LearningMode shows sections
  }

  const handleBackToMainLogin = () => {
    setCurrentView('login');
    setAdminUserNameInput('');
    setAdminPasswordInput('');
  }

  const renderLoginView = () => (
    <motion.div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatedBackground shapeCount={4}/>

      <motion.div 
        className="bg-app-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md relative z-10"
      >
        <motion.h1 
          variants={itemVariants} 
          className="text-3xl sm:text-4xl font-bold text-center mb-3 sm:mb-4 text-fido-cherry"
        >
          Welcome to FIDO Spark!
        </motion.h1>
        <motion.p 
          variants={itemVariants} 
          className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-10"
        >
          Ignite your journey with us. Please login to continue.
        </motion.p>

        <motion.div variants={itemVariants} className="space-y-6">
          <motion.div variants={itemVariants}>
            <label htmlFor="login-name" className="sr-only">Your Name or FIDO Email</label>
            <motion.input 
              id="login-name"
              type="text"
              value={userNameInput}
              onChange={handleUserNameInputChange}
              placeholder="Your Name or FIDO Email"
              className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-fido-lime focus:border-fido-lime focus:outline-none text-gray-800 placeholder-gray-400 shadow-sm"
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          <motion.button 
            variants={itemVariants}
            onClick={handleLogin} 
            className="w-full bg-fido-lime text-primary-foreground font-bold py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-fido-lime focus:ring-offset-2 focus:ring-offset-app-white transform transition-transform duration-150 ease-in-out flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05, y: -3, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98, y: 0 }}
          >
            Login / Start <span role="img" aria-label="rocket">🚀</span>
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 sm:mt-8 text-center">
          <motion.button 
            onClick={handleNavigateToAdminLogin} 
            className="font-semibold text-fido-aqua hover:text-fido-cherry py-2 px-4 rounded-lg sm:rounded-xl transition-colors duration-200"
            whileHover={{ scale: 1.03, letterSpacing: "0.2px" }}
            whileTap={{ scale: 0.97 }}
          >
            <span role="img" aria-label="settings gear">⚙️</span> Admin Access
          </motion.button>
        </motion.div>
      </motion.div>
      <motion.p variants={itemVariants} className="text-xs text-fido-cherry/60 mt-8 text-center z-10 relative">
          Hint: Any name will work! For admin, use the Admin Access button.
      </motion.p>
    </motion.div>
  )

  const renderAdminLoginView = () => (
    <motion.div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-fido-aqua/80 overflow-hidden relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatedBackground shapeCount={3} />
      <motion.div 
        className="bg-app-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md relative z-10"
      >
        <motion.h1 
          variants={itemVariants} 
          className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-fido-cherry"
        >
          <span role="img" aria-label="shield">🛡️</span> Admin Portal
        </motion.h1>
        
        <motion.div variants={itemVariants} className="space-y-5">
          <motion.div variants={itemVariants}>
            <label htmlFor="admin-username" className="sr-only">Admin Username</label>
            <motion.input 
              id="admin-username"
              type="text"
              value={adminUserNameInput}
              onChange={handleAdminUserNameInputChange}
              placeholder="Admin Username"
              className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-fido-lime focus:border-fido-lime focus:outline-none text-gray-800 placeholder-gray-400 shadow-sm"
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="admin-password" className="sr-only">Admin Password</label>
            <motion.input 
              id="admin-password"
              type="password"
              value={adminPasswordInput}
              onChange={handleAdminPasswordInputChange}
              placeholder="Admin Password"
              className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-fido-lime focus:border-fido-lime focus:outline-none text-gray-800 placeholder-gray-400 shadow-sm"
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          <motion.button 
            variants={itemVariants}
            onClick={handleAdminLogin} 
            className="w-full bg-fido-lime text-primary-foreground font-bold py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-fido-lime focus:ring-offset-2 focus:ring-offset-app-white transform transition-transform duration-150 ease-in-out flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05, y: -3, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98, y: 0 }}
          >
            <span role="img" aria-label="key">🔑</span> Login to Admin
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 sm:mt-8 text-center">
          <motion.button 
            onClick={handleBackToMainLogin} 
            className="font-semibold text-fido-aqua hover:text-fido-cherry py-2 px-4 rounded-lg sm:rounded-xl transition-colors duration-200"
            whileHover={{ scale: 1.03, letterSpacing: "0.2px" }}
            whileTap={{ scale: 0.97 }}
          >
            <span role="img" aria-label="return arrow">↩️</span> Back to Main Login
          </motion.button>
        </motion.div>
         <motion.p variants={itemVariants} className="text-xs text-fido-cherry/60 mt-6 text-center z-10 relative">
          Hint: admin / password123
      </motion.p>
      </motion.div>
    </motion.div>
  );

  const renderAppHeader = () => (
    <header className="w-full flex justify-between items-center mb-8 pt-4 px-4 md:px-0">
      <div className="text-foreground">
        {currentUser && <span className="text-lg flex items-center gap-2"><span role="img" aria-label="waving hand">👋</span> Welcome, <span className="font-bold text-secondary">{currentUser}</span>!</span>}
      </div>
      {currentUser && (
        <motion.button 
          onClick={handleLogout} 
          className="bg-destructive text-destructive-foreground font-semibold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200 shadow-md flex items-center justify-center gap-2 transform hover:scale-105 hover:animate-button-bounce"
          whileHover={{ scale: 1.08, y: -2, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)"}}
          whileTap={{scale: 0.95}}
        >
          <span role="img" aria-label="waving hand goodbye">👋</span> Logout
        </motion.button>
      )}
    </header>
  )

  const renderHomeNavigation = () => (
    <>
      <motion.div className="text-center mb-10" variants={itemVariants}>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-3 md:mb-4 text-foreground drop-shadow-lg">
          FIDO Spark Menu
        </h1>
        <p className="text-xl md:text-2xl font-light text-secondary drop-shadow-md">
          Choose your next step.
        </p>
      </motion.div>
      <motion.main 
        className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-6"
        variants={containerVariants} // For staggering buttons if they have itemVariants
        initial="hidden"
        animate="visible" // Animate when this section becomes visible
      >
        <motion.button
          variants={itemVariants}
          onClick={handleLearningClick}
          className="w-full md:w-auto bg-primary text-primary-foreground font-semibold py-3 px-6 md:py-4 md:px-8 rounded-xl shadow-2xl transform hover:scale-105 hover:bg-primary/90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-ring focus:ring-opacity-70 flex flex-col items-center justify-center hover:animate-button-bounce"
          whileHover={{ scale: 1.08, y: -4, boxShadow: "0px 12px 22px rgba(0,0,0,0.12)"}}
          whileTap={{scale: 0.95}}
        >
          <span className="text-lg md:text-xl flex items-center gap-2"><span role="img" aria-label="light bulb">💡</span> Just Learning</span>
          <p className="text-xs md:text-sm font-normal mt-1">Explore FIDO at your own pace.</p>
        </motion.button>

        <motion.button
          variants={itemVariants}
          onClick={handlePlayGameClick}
          className="w-full md:w-auto bg-accent text-accent-foreground font-semibold py-3 px-6 md:py-4 md:px-8 rounded-xl shadow-2xl transform hover:scale-105 hover:bg-accent/90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-ring focus:ring-opacity-70 flex flex-col items-center justify-center hover:animate-button-bounce"
          whileHover={{ scale: 1.08, y: -4, boxShadow: "0px 12px 22px rgba(0,0,0,0.12)"}}
          whileTap={{scale: 0.95}}
        >
          <span className="text-lg md:text-xl flex items-center gap-2"><span role="img" aria-label="game die">🎲</span> Play Game</span>
          <p className="text-xs md:text-sm font-normal mt-1">Test your knowledge with a fun quiz.</p>
        </motion.button>
      </motion.main>
      <motion.div 
        variants={itemVariants} 
        className="flex flex-col items-center gap-4 mt-6 md:mt-10"
      >
        <motion.button
          onClick={handleNavigateToUserScores}
          className="bg-secondary text-secondary-foreground font-semibold py-3 px-8 rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-ring focus:ring-opacity-50 flex items-center justify-center gap-2 w-full md:w-auto max-w-xs hover:animate-button-bounce"
          whileHover={{ scale: 1.08, y: -4, boxShadow: "0px 12px 22px rgba(0,0,0,0.12)"}}
          whileTap={{scale: 0.95}}
        >
          <span role="img" aria-label="bar chart">📊</span> View My Quiz Scores
        </motion.button>
      </motion.div>
      <motion.footer variants={itemVariants} className="text-center mt-auto mb-4 pt-8">
        <p className="text-sm text-muted-foreground opacity-80">
          Built with Vibe Coding Tools & Cursor AI
        </p>
      </motion.footer>
    </>
  );

  // Placeholder for GameView - can be developed later
  const renderGameView = () => (
    <motion.div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-fido-mauve/70 text-foreground relative"
      variants={containerVariants} initial="hidden" animate="visible"
    >
      <AnimatedBackground shapeCount={3} />
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {renderAppHeader()} 
        <div className="flex-grow flex flex-col items-center justify-center text-center">
          <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4">Game Mode</motion.h2>
          <motion.p variants={itemVariants}>Quiz game will be here!</motion.p>
          <motion.button 
            variants={itemVariants}
            onClick={handleGoHome} 
            className="mt-8 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 hover:animate-button-bounce"
            whileHover={{ scale: 1.08, y: -4, boxShadow: "0px 12px 22px rgba(0,0,0,0.12)"}}
            whileTap={{scale: 0.95}}
          >
            Back to Main Menu
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  // Determine content based on currentView and currentUser
  let viewContent;
  if (!currentUser && currentView !== 'adminLogin') {
    viewContent = (
      <div className="w-full h-full flex items-center justify-center p-6">
        {renderLoginView()}
      </div>
    );
  } else if (currentView === 'login') {
    viewContent = (
      <div className="w-full h-full flex items-center justify-center p-6">
        {renderLoginView()}
      </div>
    );
  } else if (currentView === 'adminLogin') {
    viewContent = (
      <div className="w-full h-full flex items-center justify-center p-6">
        {renderAdminLoginView()}
      </div>
    );
  } else if (currentView === 'welcomeMessage') {
    viewContent = <WelcomeMessageView currentUser={currentUser} onContinue={handleContinueFromWelcome} />;
  } else if (currentView === 'home') {
    viewContent = (
      <motion.div 
        className="min-h-screen w-full flex flex-col p-6 overflow-y-auto bg-background relative"
        key="home-view" // Add key for AnimatePresence if used later
        variants={containerVariants} initial="hidden" animate="visible"
      >
        <AnimatedBackground shapeCount={5} />
        <div className="relative z-10 flex-grow flex flex-col">
            {renderAppHeader()}
            <div className="flex-grow flex flex-col items-center justify-center">
            {renderHomeNavigation()}
            </div>
        </div>
      </motion.div>
    );
  } else if (currentView === 'learning') {
    viewContent = <LearningMode onGoHome={handleGoHome} onStartQuiz={handleStartQuizFromLearning} />;
  } else if (currentView === 'quiz') {
    viewContent = <QuizView 
                    sectionKey={activeQuizSection} 
                    onQuizComplete={handleGoHome} 
                    onBackToLearning={handleBackToLearningHub} 
                    currentUser={currentUser} 
                    learningTime={currentSectionElapsedTime}
                  />;
  } else if (currentView === 'userScores') {
    viewContent = <UserScoresView currentUser={currentUser} onGoHome={handleGoHome} />;
  } else if (currentView === 'game') {
    viewContent = renderGameView();
  } 
  // else if (currentView === 'adminDashboard') {
  //   viewContent = <AdminDashboard onGoHome={handleGoHome} />;
  // } 
  else {
    // Fallback for unknown view or if !currentUser but view is not 'login'
    viewContent = (
      <div className="w-full h-full flex items-center justify-center p-6">
        {renderLoginView()} {/* Default to login if state is inconsistent */}
      </div>
    );
  }

  return (
    <div className="h-full bg-background"> {/* Base background, views can override */}
      {/* Consider AnimatePresence here for smooth transitions between views */}
      {viewContent}
    </div>
  )
}

export default App
