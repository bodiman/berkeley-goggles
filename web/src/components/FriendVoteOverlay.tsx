import React from 'react';

interface FriendVote {
  id: string;
  name: string;
  profilePhotoUrl: string | null;
}

interface FriendVoteOverlayProps {
  votes: FriendVote[];
  maxDisplay?: number;
  className?: string;
}

export const FriendVoteOverlay: React.FC<FriendVoteOverlayProps> = ({
  votes,
  maxDisplay = 3,
  className = '',
}) => {
  if (!votes || votes.length === 0) {
    return null;
  }

  const displayVotes = votes.slice(0, maxDisplay);
  const remainingCount = votes.length - maxDisplay;

  return (
    <div className={`flex items-center ${className}`}>
      {/* Stacked profile pictures */}
      <div className="flex -space-x-2">
        {displayVotes.map((vote, index) => (
          <div
            key={vote.id}
            className="relative"
            style={{ zIndex: maxDisplay - index }}
            title={vote.name}
          >
            {vote.profilePhotoUrl ? (
              <img
                src={vote.profilePhotoUrl}
                alt={vote.name}
                className="w-7 h-7 rounded-full border-2 border-white/80 object-cover shadow-md"
              />
            ) : (
              <div className="w-7 h-7 rounded-full border-2 border-white/80 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">
                  {vote.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* +N indicator for remaining friends */}
        {remainingCount > 0 && (
          <div
            className="relative w-7 h-7 rounded-full border-2 border-white/80 bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-md"
            style={{ zIndex: 0 }}
          >
            <span className="text-white text-[10px] font-bold">
              +{remainingCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
