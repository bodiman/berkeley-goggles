import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { APIError } from '@shared/types';

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error details
  logger.error('API Error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError' || err.message.includes('jwt')) {
    statusCode = 401;
    code = 'UNAUTHORIZED';
    message = 'Invalid or expired token';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID';
    message = 'Invalid ID format';
  } else if (err.message.includes('duplicate') || err.message.includes('unique')) {
    statusCode = 409;
    code = 'DUPLICATE_RESOURCE';
    message = 'Resource already exists';
  }

  // Prepare error response
  const errorResponse: APIError = {
    code,
    message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { 
      details: {
        stack: err.stack,
        original: err.details
      }
    })
  };

  res.status(statusCode).json({
    success: false,
    error: errorResponse,
    timestamp: new Date().toISOString()
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};