import React, { useState } from 'react';

interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigateToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Call API to send password reset email
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay
      
      setEmailSent(true);
    } catch (err) {
      console.error('Forgot password failed:', err);
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Call API to resend password reset email
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
    } catch (err) {
      console.error('Resend email failed:', err);
      setError('Failed to resend email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col safe-area-inset">
        {/* Header */}
        <header className="px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={onNavigateToLogin}
              className="text-white hover:text-gray-300 transition-colors"
            >
              ← Back to Login
            </button>
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
            <div className="w-16" /> {/* Spacer */}
          </div>
        </header>

        {/* Main Content - Success State */}
        <main className="flex-1 px-6 py-4 flex items-center">
          <div className="w-full max-w-md mx-auto text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 mx-auto mb-6 bg-green-600/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">Check Your Email</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We've sent a password reset link to{' '}
              <span className="text-white font-medium">{email}</span>
            </p>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              
              <button
                onClick={handleResendEmail}
                disabled={isLoading}
                className="w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Sending...' : 'Resend Email'}
              </button>

              <button
                onClick={onNavigateToLogin}
                className="w-full text-gray-400 hover:text-gray-300 py-3 font-medium transition-colors"
              >
                Back to Login
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-600/20 border border-red-600/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col safe-area-inset">
      {/* Header */}
      <header className="px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateToLogin}
            className="text-white hover:text-gray-300 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <div className="w-16" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-4 flex items-center">
        <div className="w-full max-w-md mx-auto">
          {/* Instructions */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Forgot Your Password?</h2>
            <p className="text-gray-400 leading-relaxed">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 liquid-glass rounded-lg text-white placeholder-gray-400 focus:outline-none"
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-600/20 border border-red-600/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors"
            >
              {isLoading ? 'Sending Reset Email...' : 'Send Reset Email'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <button
              onClick={onNavigateToLogin}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};