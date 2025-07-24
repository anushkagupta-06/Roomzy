import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MatchCard from '../cards/MatchCards'
import Lottie from "lottie-react"
import roboAnimation from "../../assets/lottie/Robo.json";


const mockMatches = [
  {
    id: 1,
    name: 'name',
    age: 'age',
    occupation: 'branch',
    compatibility: 92,
    room: 'Room 201-B, Floor 2 (Window Seat)',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
    reason: 'Both of you are early risers, have similar cleanliness standards, and prefer a quiet social environment at home.'
  },
  {
    id: 2,
    name: 'Emily Carter',
    age: 29,
    occupation: 'Graphic Designer',
    compatibility: 85,
    room: 'Room 305-A, Floor 3',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
    reason: 'You share similar work-from-home schedules and a passion for creative hobbies. She is also a night owl.'
  },
  {
    id: 3,
    name: 'Emily Carter',
    age: 29,
    occupation: 'Graphic Designer',
    compatibility: 85,
    room: 'Room 305-A, Floor 3',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
    reason: 'You share similar work-from-home schedules and a passion for creative hobbies. She is also a night owl.'
  }
];

const Matching = () => {
  const [matches, setMatches] = useState([]);
  const [surveyTaken, setSurveyTaken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const questions = [
    "Are you an early bird or night owl?",
    "How tidy are you on a scale of 1–5?",
    "Do you enjoy socializing at home?",
  ];

  const handleTakeSurvey = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStep(0)
      setSurveyTaken(true);
      setIsLoading(false);
      setMatches(mockMatches);
    }, 2000);
  };

  const handleStartAI = () => {
    setStep(1);
  };

  const handleNextStep = () => {
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      handleTakeSurvey();
    }
  }

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setStep(0); // Go back to "Start Survey" screen
    }
  }  

  const shouldShowRobo = !surveyTaken || (step > 0 && step <= questions.length);


  return (
    <>
    <div  className="min-h-screen p-8 bg-gray-50 dark:bg-black transition-colors duration-300">
    {!surveyTaken && (
  <>
      <motion.h1 
      className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      Find Your Perfect Roommate
    </motion.h1>

    <motion.p 
      className="text-gray-700 dark:text-gray-300 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      Take our quick, voice-powered survey to get matched with the most compatible roommates.
    </motion.p>
  </>
)}


      {!surveyTaken && !step && (
  <motion.div
    className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-indigo-100 via-purple-100 to-violet-100 dark:from-indigo-200 dark:via-indigo-300 dark:to-indigo-200 text-center rounded-2xl shadow-lg p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <motion.div
      className="text-6xl mb-4"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      🎤
    </motion.div>
    <h2 className="text-2xl font-semibold text-gray-800 dark:text-black mb-2">
      Ready to Meet Your Match?
    </h2>
    <p className="text-gray-600 dark:text-gray-700 max-w-md mb-6">
      We'll ask you 3 quick, voice-powered questions to understand your lifestyle and preferences better.
    </p>
    <motion.button
      onClick={handleStartAI}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-3 bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700 text-white font-bold rounded-xl shadow-md transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-violet-300"
    >
      Start the Compatibility Survey
    </motion.button>
  </motion.div>
)}


{step > 0 && step <= questions.length && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="relative flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-r from-indigo-100 via-purple-100 to-violet-100 dark:from-indigo-200 dark:via-indigo-100 dark:to-indigo-200 rounded-3xl p-8 shadow-xl mx-auto w-full max-w-2xl"
  >
    <div className="absolute top-4 right-4 text-sm text-gray-600 dark:text-gray-700">
      Question {step} of {questions.length}
    </div>

    <div className="text-5xl mb-4 animate-pulse">🔊</div>

    <p className="text-lg text-center text-gray-700 dark:text-black font-medium mb-6">
      {questions[step - 1]}
    </p>

    <div className="flex gap-4">
      <motion.button
        onClick={handleNextStep}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-300"
      >
        Answered
      </motion.button>
    </div>
  </motion.div>
)}


      {isLoading && (
        <motion.div
          className="text-center mt-10 text-xl font-semibold text-gray-600 dark:text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          🤖 Finding your matches...
        </motion.div>
      )}

      {surveyTaken && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          {matches.length > 0 ? (
            <>
  <div className="mb-10">
  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 mt-0 text-center">

    Your Top Matches ✨
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {matches.slice(0, 3).map((match, index) => (
    <motion.div
      key={match.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:bg-gray-900 dark:border-gray-700"
    >
      <MatchCard match={match} />
    </motion.div>
  ))}
</div>

</div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    setSurveyTaken(false);
                    setStep(0);
                    setMatches([]);
                  }}
                  className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 mt-5"
                >
                  Retake Survey
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-black-500 italic">No matches found yet.</p>
            </>
          )}
        </motion.div>
      )}
    </div>
    {shouldShowRobo && (
<div className="fixed bottom-4 right-4 w-40 h-50 z-50">
  <Lottie animationData={roboAnimation} loop autoplay />
</div>

    )}
    </>
  );
};

export default Matching;
