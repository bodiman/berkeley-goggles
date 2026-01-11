import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../config/api';

interface InvitePageProps {
  inviteToken: string; // Now a one-time-use token, not a user ID
  onComplete: () => void;
}

export const InvitePage: React.FC<InvitePageProps> = ({ inviteToken, onComplete }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'validating' | 'success' | 'error'>('loading');
  const [inviterName, setInviterName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleInvite = async () => {
      console.log('🎫 InvitePage: Received invite token:', inviteToken);
      console.log('🎫 InvitePage: Current user:', user ? user.id : 'NOT LOGGED IN');

      // First, validate the invite token
      setStatus('validating');
      try {
        console.log('🎫 InvitePage: Validating token with API...');
        const validateResponse = await apiRequest(`/api/invite/${inviteToken}`);
        const validateData = await validateResponse.json();
        console.log('🎫 InvitePage: API response:', validateData);

        if (!validateData.success || !validateData.valid) {
          // Token is invalid, used, or expired
          console.log('🎫 InvitePage: Token validation FAILED:', validateData.error);
          setErrorMessage(validateData.error || 'This invite link is no longer valid');
          setStatus('error');
          return;
        }

        // Token is valid
        console.log('🎫 InvitePage: Token is VALID, creator:', validateData.creator?.name);
        setInviterName(validateData.creator?.name || 'your friend');

        if (!user) {
          // User not logged in - store invite token and redirect to auth
          console.log('🎫 InvitePage: User not logged in, storing token in localStorage...');
          localStorage.setItem('inviteToken', inviteToken);
          console.log('🎫 InvitePage: Token stored! Verifying:', localStorage.getItem('inviteToken'));
          onComplete();
          return;
        }

        // User is logged in - call API to add friend using token
        const response = await apiRequest('/api/friends/accept-invite-token', {
          method: 'POST',
          body: JSON.stringify({
            userId: user.id,
            inviteToken: inviteToken,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          // Clear the URL and redirect after a delay
          setTimeout(() => {
            window.history.replaceState({}, '', '/');
            onComplete();
          }, 2000);
        } else {
          setErrorMessage(data.error || 'Failed to add friend');
          setStatus('error');
        }
      } catch (error) {
        console.error('Failed to process invite:', error);
        setErrorMessage('Failed to connect. Please try again.');
        setStatus('error');
      }
    };

    handleInvite();
  }, [user, inviteToken, onComplete]);

  // If user is not logged in, this will redirect quickly
  if (!user && status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold">Processing invite...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
        {(status === 'loading' || status === 'validating') && (
          <>
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-black text-white uppercase tracking-wide mb-2">
              {status === 'validating' ? 'Validating Invite' : 'Adding Friend'}
            </h2>
            <p className="text-white/60 text-sm">Please wait...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wide mb-2">
              Friend Added!
            </h2>
            <p className="text-white/80 text-sm mb-4">
              You are now friends with <span className="font-bold">{inviterName}</span>
            </p>
            <p className="text-white/40 text-xs">Redirecting...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-wide mb-2">
              Oops!
            </h2>
            <p className="text-white/80 text-sm mb-6">{errorMessage}</p>
            <button
              type="button"
              onClick={() => {
                window.history.replaceState({}, '', '/');
                onComplete();
              }}
              className="bg-white text-blue-700 font-black py-3 px-8 rounded-xl uppercase tracking-wide shadow-lg hover:bg-blue-50 transition-colors"
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
};
