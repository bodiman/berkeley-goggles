// API Configuration
const baseURL = import.meta.env.VITE_API_BASE_URL || 
                (import.meta.env.MODE === 'production' 
                  ? 'https://berkeley-goggles-production.up.railway.app' 
                  : 'http://localhost:3001');

// Debug logging to help troubleshoot API connection issues
console.log('🔧 API Configuration Debug:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  baseURL: baseURL,
  allEnvVars: import.meta.env
});

export const API_CONFIG = {
  baseURL,
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

  // Debug logging for API requests
  console.log('🌐 API Request:', {
    endpoint,
    fullURL: url,
    method: config.method || 'GET',
    headers: config.headers,
    body: config.body
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    
    console.log('📡 API Response:', {
      url,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      contentType: response.headers.get('content-type')
    });

    // Log response body for failed requests
    if (!response.ok) {
      try {
        const responseText = await response.clone().text();
        console.log('❌ API Error Response Body:', responseText.substring(0, 500));
      } catch (e) {
        console.log('❌ Could not read error response body');
      }
    }
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    console.log('💥 API Request Failed:', {
      url,
      error: error.message,
      stack: error.stack
    });
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