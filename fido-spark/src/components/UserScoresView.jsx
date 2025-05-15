import React, { useState, useEffect } from 'react';

function UserScoresView({ currentUser, onGoHome }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      const userScoresKey = `fidoSparkScores_${currentUser}`;
      const storedScores = localStorage.getItem(userScoresKey);
      if (storedScores) {
        try {
          setScores(JSON.parse(storedScores));
        } catch (error) {
          console.error("Error parsing scores from localStorage:", error);
          setScores([]); // Set to empty if parsing fails
        }
      } else {
        setScores([]); // No scores found
      }
      setLoading(false);
    } else {
      setScores([]); // No user, no scores
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-fido-white bg-fido-black">
        <p className="text-xl text-aqua flex items-center gap-2"><span role="img" aria-label="loading">⏳</span> Loading scores...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-6 text-fido-white bg-fido-black overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-10 pt-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-lime drop-shadow-md">
            Your Quiz Scores, <span className="text-aqua">{currentUser}</span>!
          </h2>
          <button 
            onClick={onGoHome} 
            className="bg-cherry text-fido-white font-semibold py-2 px-5 rounded-lg hover:bg-opacity-80 transition-colors duration-200 shadow-md flex items-center gap-2"
          >
            <span role="img" aria-label="home">🏠</span> App Home
          </button>
        </div>

        {scores.length === 0 ? (
          <div className="text-center bg-fido-white/5 p-8 rounded-xl shadow-lg flex flex-col items-center gap-3">
            <p className="text-xl text-mauve flex items-center gap-2"><span role="img" aria-label="empty mailbox">📭</span> No scores recorded yet.</p>
            <p className="mt-2 text-fido-white/80">Complete some quizzes in the Learning Hub to see your progress here!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {scores.map((scoreEntry, index) => (
              <div key={index} className="bg-fido-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-2xl font-bold text-mauve mb-1 flex items-center gap-2"><span role="img" aria-label="books">📚</span> {scoreEntry.section}</h3>
                  <p className="text-sm text-aqua flex items-center gap-2">
                    <span role="img" aria-label="calendar">📅</span> Date: {new Date(scoreEntry.date).toLocaleDateString()} - {new Date(scoreEntry.date).toLocaleTimeString()}
                  </p>
                </div>
                <p className={`text-3xl font-bold mt-3 md:mt-0 flex items-center gap-2 ${scoreEntry.score / scoreEntry.total >= 0.7 ? 'text-lime' : 'text-cherry'}`}>
                  <span role="img" aria-label="target">🎯</span> {scoreEntry.score} / {scoreEntry.total}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserScoresView; 