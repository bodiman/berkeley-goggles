import React, { useState } from 'react';
import { apiRequest } from '../../config/api';

interface Question {
  id: string;
  question: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 'looking_for',
    question: "What are you looking for?",
    options: ['Serious relationship', 'Something casual', 'Friends first', 'Not sure yet'],
  },
  {
    id: 'age_range',
    question: "What's your ideal age range?",
    options: ['18-21', '21-24', '24-27', '27+', "Age doesn't matter"],
  },
  {
    id: 'physical_attraction',
    question: "How important is physical attraction?",
    options: ['Most important', 'Very important', 'Moderately important', 'Less than personality'],
  },
  {
    id: 'communication_style',
    question: "What's your communication style?",
    options: ['Constant texting', 'Few times daily', "When something's worth sharing", 'Phone calls > texts'],
  },
  {
    id: 'ideal_first_date',
    question: "Ideal first date?",
    options: ['Coffee/drinks', 'Active (hiking, sports)', 'Dinner', 'Something creative/unique'],
  },
  {
    id: 'fitness',
    question: "How do you feel about fitness?",
    options: ['Very active, need someone similar', 'Moderately active', 'Not a priority', 'Flexible'],
  },
  {
    id: 'partner_quality',
    question: "What matters most in a partner?",
    options: ['Humor', 'Intelligence', 'Ambition', 'Kindness'],
  },
  {
    id: 'smoking',
    question: "Dealbreaker: Smoking/vaping?",
    options: ['Complete dealbreaker', 'Prefer no', "Don't mind", 'I smoke too'],
  },
  {
    id: 'meet_irl',
    question: "How soon do you want to meet IRL?",
    options: ['ASAP', 'After some chatting', 'Take it slow', 'Depends on vibe'],
  },
  {
    id: 'love_language',
    question: "What's your love language?",
    options: ['Words of affirmation', 'Quality time', 'Physical touch', 'Acts of service', 'Gifts'],
  },
];

interface LoveQuestionnairePageProps {
  userId: string;
  onComplete: () => void;
}

export const LoveQuestionnairePage: React.FC<LoveQuestionnairePageProps> = ({
  userId,
  onComplete,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const handleSelect = async (option: string) => {
    const newAnswers = { ...answers, [question.id]: option };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit questionnaire
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await apiRequest('/api/love/questionnaire', {
          method: 'POST',
          body: JSON.stringify({
            userId,
            answers: newAnswers,
            version: 1,
          }),
        });

        const data = await response.json();

        if (data.success) {
          onComplete();
        } else {
          setError(data.error || 'Failed to save questionnaire');
        }
      } catch (err) {
        console.error('Failed to submit questionnaire:', err);
        setError('Failed to save questionnaire. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col safe-area-inset" style={{
      background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
    }}>
      {/* Header */}
      <header className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          {currentQuestion > 0 ? (
            <button
              onClick={handleBack}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="w-6" />
          )}
          <span className="text-white font-bold">
            {currentQuestion + 1} / {QUESTIONS.length}
          </span>
          <div className="w-6" />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          {/* Question */}
          <h2 className="text-3xl font-black text-white text-center mb-8 drop-shadow-lg">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-left transition-all duration-200 ${
                  answers[question.id] === option
                    ? 'bg-white text-purple-600 shadow-xl scale-[1.02]'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="inline-flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </span>
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-xl">
              <p className="text-red-200 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          {isSubmitting && (
            <div className="mt-6 text-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-white/80 text-sm">Saving your preferences...</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-xs text-white/40 font-medium">
          Your answers help us understand preferences better
        </p>
      </footer>
    </div>
  );
};
