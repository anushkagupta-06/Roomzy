import React, { useState } from 'react';
import MatchCard from '../cards/MatchCards';

const mockMatches = [
    {
        id: 1,
        name: 'Sarah Chen',
        age: 26,
        occupation: 'Software Engineer',
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
    }
    ];

const Matching = () => {
  const [matches, setMatches] = useState([]);
  const [surveyTaken, setSurveyTaken] = useState(false);

  const handleTakeSurvey = () => {
    // Simulated voice survey process
    alert("Initiating voice survey... (This is a demo)\n\nAnswering simulated questions:\n1. Early Bird\n2. Very Tidy\n3. Social on Weekends\n\nFinding your matches!");
    setMatches(mockMatches); // You might want to put dummy matches here
    setSurveyTaken(true);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-text-primary mb-4">Find Your Perfect Roommate</h1>
      <p className="text-text-secondary mb-8">Take our quick, voice-powered survey to get matched with the most compatible roommates.</p>

      {!surveyTaken && (
        <div className="flex justify-center items-center h-64 bg-card rounded-xl shadow-md">
          <button
            onClick={handleTakeSurvey}
            className="px-8 py-4 bg-primary text-black font-bold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Take Voice-Based Compatibility Survey
          </button>
        </div>
      )}

      {surveyTaken && (
        <div>
          {matches.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold text-text-primary mb-6">Your Top Matches ✨</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button
                    onClick={() => setSurveyTaken(false)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Retake Survey
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button
                    onClick={() => setActiveComponent('Survey')}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Retake Survey
                  </button>

                  <button
                    onClick={() => alert('Room suggested based on AI and availability!')}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    Single room
                  </button>
                </div>
              </div> 
            <p className="text-black-500 italic">No matches found yet.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Matching;
