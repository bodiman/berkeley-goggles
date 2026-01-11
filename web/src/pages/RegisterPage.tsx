import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterPageProps {
  onNavigateToLogin: () => void;
  onNavigateToWelcome: () => void;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateToLogin,
  onNavigateToWelcome,
}) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.email.toLowerCase().endsWith('@berkeley.edu')) {
      setError('Registration is restricted to @berkeley.edu email addresses');
      return;
    }

    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }


    setIsLoading(true);
    setError(null);

    try {
      const success = await register(formData);
      
      if (!success) {
        setError('Registration failed. This email might already be in use.');
      }
      // Success is handled by AuthContext navigation
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Registration failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };


  return (
    <div className="min-h-screen flex flex-col safe-area-inset">
      {/* Header */}
      <header className="px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateToWelcome}
            className="text-white hover:text-gray-300 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">Sign Up</h1>
          <div className="w-16" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-4">
        <div className="w-full max-w-md mx-auto">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Join Berkeley Goggles</h2>
            <p className="text-gray-400">Create your account to get started</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange('name')}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 liquid-glass rounded-lg text-white placeholder-gray-400 focus:outline-none"
                autoComplete="name"
                autoFocus
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="yourname@berkeley.edu"
                className="w-full px-4 py-3 liquid-glass rounded-lg text-white placeholder-gray-400 focus:outline-none"
                autoComplete="email"
              />
              <p className="mt-1.5 text-xs text-gray-500">Must be a @berkeley.edu address</p>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  placeholder="Create a password (8+ characters)"
                  className="w-full px-4 py-3 liquid-glass rounded-lg text-white placeholder-gray-400 focus:outline-none pr-12"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 liquid-glass rounded-lg text-white placeholder-gray-400 focus:outline-none pr-12"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};