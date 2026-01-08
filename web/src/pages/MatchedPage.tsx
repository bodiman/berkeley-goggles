import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Match {
  id: string;
  name: string;
  profilePhotoUrl?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isYourTurn: boolean;
  isHidden?: boolean;
  age?: number;
  height?: number; // Height in inches
}

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  isFromOski?: boolean;
}

// Oski's preprogrammed responses
const oskiResponses = [
  "Go Bears! 🐻",
  "What's your major?",
  "Have you been to a Cal game?",
  "Memorial Stadium is the best!",
  "Are you ready for Big Game?",
  "Go Bears! We're the best!",
  "What's your favorite spot on campus?",
  "Cal pride! 💙💛",
];

export const MatchedPage: React.FC = () => {
  const { user } = useAuth();
  const [yourTurnMatches, setYourTurnMatches] = useState<Match[]>([]);
  const [theirTurnMatches] = useState<Match[]>([]);
  const [hiddenMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showYourTurn, setShowYourTurn] = useState(true);
  const [showTheirTurn, setShowTheirTurn] = useState(true);
  const [showHidden, setShowHidden] = useState(false);
  const [showEnlargedPhoto, setShowEnlargedPhoto] = useState(false);

  // Initialize with Oski
  useEffect(() => {
    const oskiMatch: Match = {
      id: 'oski-bear',
      name: 'Oski',
      profilePhotoUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=400&fit=crop&q=80',
      lastMessage: 'heyy',
      lastMessageTime: 'Just now',
      isYourTurn: true,
      age: 118, // Oski was created in 1906, so he's quite old!
      height: 66, // 5'6" - reasonable bear height
    };
    setYourTurnMatches([oskiMatch]);
    setIsLoading(false);
  }, []);

  const formatHeight = (inches: number): string => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  // Load chat messages when a match is selected
  useEffect(() => {
    if (selectedMatch) {
      if (selectedMatch.id === 'oski-bear') {
        // Initialize Oski chat with first message
        setChatMessages([
          {
            id: '1',
            senderId: 'oski-bear',
            receiverId: user?.id || '',
            message: 'heyy',
            timestamp: new Date(),
            isFromOski: true,
          },
        ]);
      } else {
        // Load real chat messages from API
        loadChatMessages(selectedMatch.id);
      }
    }
  }, [selectedMatch, user?.id]);

  const loadChatMessages = async (_matchId: string) => {
    // TODO: Load actual chat messages from API
    setChatMessages([]);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      receiverId: selectedMatch.id,
      message: newMessage.trim(),
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');

    // If chatting with Oski, get a response after a delay
    if (selectedMatch.id === 'oski-bear') {
      setTimeout(() => {
        const randomResponse = oskiResponses[Math.floor(Math.random() * oskiResponses.length)];
        const oskiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: 'oski-bear',
          receiverId: user?.id || '',
          message: randomResponse,
          timestamp: new Date(),
          isFromOski: true,
        };
        setChatMessages(prev => [...prev, oskiMessage]);
      }, 1500);
    } else {
      // TODO: Send message to API
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center" style={{
        background: '#4A90E2', // Solid blueish-yellow background
      }}>
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="drop-shadow-lg" style={{
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
          }}>Loading matches...</p>
        </div>
      </div>
    );
  }

  // Chat view
  if (selectedMatch) {
    return (
      <div className="absolute inset-0 flex flex-col" style={{
        background: '#4A90E2', // Solid blueish-yellow background
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100dvh',
      }}>
        {/* Chat Header */}
        <header className="bg-white/20 backdrop-blur-sm border-b border-white/30 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSelectedMatch(null)}
            className="text-white hover:text-white/80"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setShowEnlargedPhoto(true)}
            className="flex items-center space-x-3 flex-1 ml-4 text-left"
          >
            <img
              src={selectedMatch.profilePhotoUrl || 'https://via.placeholder.com/50'}
              alt={selectedMatch.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/50 shadow-lg"
            />
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-white drop-shadow-lg" style={{
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
              }}>{selectedMatch.name}</h2>
              {(selectedMatch.age || selectedMatch.height) && (
                <span className="text-white/70 drop-shadow" style={{
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                }}>•</span>
              )}
              {selectedMatch.age && (
                <span className="text-sm text-white/90 drop-shadow" style={{
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                }}>{selectedMatch.age}</span>
              )}
              {selectedMatch.age && selectedMatch.height && (
                <span className="text-white/70 drop-shadow" style={{
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                }}>•</span>
              )}
              {selectedMatch.height && (
                <span className="text-sm text-white/90 drop-shadow" style={{
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                }}>{formatHeight(selectedMatch.height)}</span>
              )}
            </div>
          </button>
          <div className="w-6 h-6"></div> {/* Spacer to center content */}
        </header>

        {/* Enlarged Photo Modal */}
        {showEnlargedPhoto && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-4"
            onClick={() => setShowEnlargedPhoto(false)}
          >
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setShowEnlargedPhoto(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedMatch.profilePhotoUrl || 'https://via.placeholder.com/400'}
                alt={selectedMatch.name}
                className="w-full h-auto rounded-lg object-contain max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{
          paddingBottom: '16px',
          minHeight: 0,
          maxHeight: 'calc(100vh - 180px)',
        }}>
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                  msg.senderId === user?.id
                    ? 'bg-blue-500 text-white rounded-tr-sm'
                    : 'bg-white text-gray-900 rounded-tl-sm'
                }`}
                style={{
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                }}
              >
                <p className="text-base leading-relaxed">{msg.message}</p>
                <p
                  className={`text-xs mt-1.5 ${
                    msg.senderId === user?.id ? 'text-blue-50' : 'text-gray-500'
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </main>

        {/* Message Input */}
        <div className="bg-white/20 backdrop-blur-sm border-t border-white/30 px-4 py-3 flex-shrink-0" style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 64px)',
          marginBottom: 0,
        }}>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-white border border-white/40 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500 text-base"
              style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed ml-2"
              style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Matches list view
  return (
    <div className="absolute inset-0 flex flex-col" style={{
      background: '#4A90E2', // Solid blueish-yellow background
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: '100dvh',
    }}>
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4 flex-shrink-0">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg" style={{
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        }}>Matches</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-4" style={{
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
        minHeight: 0,
        paddingBottom: '80px', // Space for bottom navigation
      }}>
        {/* Your Turn Section */}
        <div className="mb-6">
          <button
            onClick={() => setShowYourTurn(!showYourTurn)}
            className="w-full flex items-center justify-between py-4 text-left"
          >
            <span className="text-xl font-bold text-white drop-shadow-lg" style={{
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
            }}>
              Your turn ({yourTurnMatches.length})
            </span>
            <svg
              className={`w-6 h-6 text-white/90 transition-transform ${showYourTurn ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showYourTurn && (
            <div className="space-y-3">
              {yourTurnMatches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className="w-full flex items-center space-x-4 p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all border border-white/30"
                >
                  <img
                    src={match.profilePhotoUrl || 'https://via.placeholder.com/80'}
                    alt={match.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/50 shadow-lg"
                  />
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-lg text-white drop-shadow-lg mb-1" style={{
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                    }}>{match.name}</h3>
                    <p className="text-base text-white/90 truncate drop-shadow" style={{
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                    }}>{match.lastMessage}</p>
                  </div>
                  {match.lastMessageTime && (
                    <span className="text-sm text-white/80 drop-shadow" style={{
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                    }}>{match.lastMessageTime}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Their Turn Section */}
        <div className="mb-6">
          <button
            onClick={() => setShowTheirTurn(!showTheirTurn)}
            className="w-full flex items-center justify-between py-4 text-left"
          >
            <span className="text-xl font-bold text-white drop-shadow-lg" style={{
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
            }}>
              Their turn ({theirTurnMatches.length})
            </span>
            <svg
              className={`w-6 h-6 text-white/90 transition-transform ${showTheirTurn ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showTheirTurn && (
            <div className="space-y-3">
              {theirTurnMatches.length === 0 ? (
                <p className="text-white/80 text-base py-4 drop-shadow" style={{
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                }}>No matches waiting for your response</p>
              ) : (
                theirTurnMatches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => setSelectedMatch(match)}
                    className="w-full flex items-center space-x-4 p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all border border-white/30"
                  >
                    <img
                      src={match.profilePhotoUrl || 'https://via.placeholder.com/80'}
                      alt={match.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-white/50 shadow-lg"
                    />
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-lg text-white drop-shadow-lg mb-1" style={{
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                      }}>{match.name}</h3>
                      <p className="text-base text-white/90 truncate drop-shadow" style={{
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                      }}>{match.lastMessage}</p>
                    </div>
                    {match.lastMessageTime && (
                      <span className="text-sm text-white/80 drop-shadow" style={{
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                      }}>{match.lastMessageTime}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Hidden Section */}
        <div className="mb-6">
          <button
            onClick={() => setShowHidden(!showHidden)}
            className="w-full flex items-center justify-between py-4 text-left"
          >
            <span className="text-xl font-bold text-white drop-shadow-lg" style={{
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
            }}>
              Hidden ({hiddenMatches.length})
            </span>
            <svg
              className={`w-6 h-6 text-white/90 transition-transform ${showHidden ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showHidden && (
            <div className="space-y-3">
              {hiddenMatches.length === 0 ? (
                <p className="text-white/80 text-base py-4 drop-shadow" style={{
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                }}>No hidden matches</p>
              ) : (
                hiddenMatches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => setSelectedMatch(match)}
                    className="w-full flex items-center space-x-4 p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all border border-white/30"
                  >
                    <img
                      src={match.profilePhotoUrl || 'https://via.placeholder.com/80'}
                      alt={match.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-white/50 shadow-lg"
                    />
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-lg text-white drop-shadow-lg mb-1" style={{
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                      }}>{match.name}</h3>
                      <p className="text-base text-white/90 truncate drop-shadow" style={{
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                      }}>{match.lastMessage}</p>
                    </div>
                    {match.lastMessageTime && (
                      <span className="text-sm text-white/80 drop-shadow" style={{
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                      }}>{match.lastMessageTime}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};