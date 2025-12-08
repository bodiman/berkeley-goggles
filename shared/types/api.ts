export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface APIError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  filter?: Record<string, any>;
}

export interface AuthHeaders {
  Authorization: string;
  'Content-Type'?: string;
  'User-Agent'?: string;
}

export interface FileUploadResponse {
  url: string;
  thumbnailUrl: string;
  filename: string;
  size: number;
  contentType: string;
}

export interface WebSocketMessage {
  type: 'ranking_update' | 'new_comparison' | 'achievement_unlocked' | 'system_notification';
  data: any;
  timestamp: Date;
  userId?: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}