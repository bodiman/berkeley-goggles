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
  age: number;
  gender: 'male' | 'female';
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
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
    age: 18,
    gender: 'male',
    agreedToTerms: false,
    agreedToPrivacy: false,
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

    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.age < 18) {
      setError('You must be at least 18 years old');
      return;
    }

    if (!formData.agreedToTerms || !formData.agreedToPrivacy) {
      setError('Please accept the terms of service and privacy policy');
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
    const value = field === 'agreedToTerms' || field === 'agreedToPrivacy' 
      ? e.target.checked 
      : field === 'age' 
        ? parseInt(e.target.value) 
        : e.target.value;
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleGenderChange = (gender: 'male' | 'female') => {
    setFormData(prev => ({ ...prev, gender }));
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col safe-area-inset">
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
            <h2 className="text-3xl font-bold text-white mb-2">Join Elo Check</h2>
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="email"
              />
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
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

            {/* Age Input */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-white mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                min="18"
                max="99"
                value={formData.age}
                onChange={handleInputChange('age')}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleGenderChange('male')}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    formData.gender === 'male'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderChange('female')}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    formData.gender === 'female'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Terms and Privacy */}
            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange('agreedToTerms')}
                  className="w-5 h-5 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 mt-0.5"
                />
                <span className="text-sm text-gray-300 leading-relaxed">
                  I agree to the{' '}
                  <span className="text-blue-400 underline">Terms of Service</span>
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreedToPrivacy}
                  onChange={handleInputChange('agreedToPrivacy')}
                  className="w-5 h-5 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 mt-0.5"
                />
                <span className="text-sm text-gray-300 leading-relaxed">
                  I agree to the{' '}
                  <span className="text-blue-400 underline">Privacy Policy</span>
                </span>
              </label>
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