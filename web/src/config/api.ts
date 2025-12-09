// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 
           (import.meta.env.MODE === 'production' 
             ? 'https://your-backend-url.railway.app' 
             : 'http://localhost:3001'),
  timeout: 10000,
} as const;

// Create API fetch helper with proper configuration
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.baseURL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
  },
  user: {
    profile: '/api/user/profile',
    update: '/api/user/profile',
  },
  photos: {
    upload: '/api/photos/upload',
    get: (id: string) => `/api/photos/${id}`,
  },
  comparisons: {
    pair: '/api/comparisons/pair',
    submit: '/api/comparisons/submit',
  },
} as const;