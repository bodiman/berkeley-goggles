export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAge = (age: number): boolean => {
  return age >= 18 && age <= 100;
};

export const validateGender = (gender: string): gender is 'male' | 'female' => {
  return gender === 'male' || gender === 'female';
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePhotoFile = (file: File | { size: number; type: string }): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
  
  if (file.size > maxSize) {
    errors.push('File size must be less than 10MB');
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('File must be JPEG, PNG, or HEIC format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateLocation = (location: { city: string; country: string }): boolean => {
  return location.city.trim().length > 0 && location.country.trim().length > 0;
};