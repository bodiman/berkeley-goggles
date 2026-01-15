import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../config/api';

let socket: Socket | null = null;

export const connectSocket = (userId: string): Socket => {
  // Return existing connected socket
  if (socket?.connected) return socket;

  // Disconnect stale socket if exists
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  console.log('🔌 Connecting to Socket.IO:', API_CONFIG.baseURL);

  socket = io(API_CONFIG.baseURL, {
    query: { userId },
    withCredentials: true,
    transports: ['polling', 'websocket'], // Start with polling, upgrade to websocket
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    if (reason === 'io client disconnect') {
      console.log('🔌 Socket manually disconnected');
    } else {
      console.log('🔌 Socket disconnected, will reconnect:', reason);
    }
  });

  socket.on('connect_error', (error) => {
    console.error('🔌 Socket connect_error:', error.message);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('🔌 Socket reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('🔌 Socket reconnect attempt:', attemptNumber);
  });

  socket.on('reconnect_error', (error) => {
    console.error('🔌 Socket reconnect_error:', error.message);
  });

  socket.on('reconnect_failed', () => {
    console.error('🔌 Socket reconnect failed after all attempts');
  });

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔌 Socket manually disconnected');
  }
};

export const getSocket = (): Socket | null => socket;

// Type definitions for socket events
export interface MessageNewEvent {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    profilePhotoUrl: string | null;
  };
}

export interface ChallengeVoteEvent {
  challengeId: string;
  challengerVotes: number;
  challengedVotes: number;
  totalVotes: number;
  voterId: string;
  chosenUserId: string;
  isComplete: boolean;
  winnerId: string | null;
}

export interface ChallengeNewEvent {
  id: string;
  challengerId: string;
  challengedId: string;
  status: string;
  challenger: {
    id: string;
    name: string;
    profilePhotoUrl: string | null;
  };
  challenged: {
    id: string;
    name: string;
    profilePhotoUrl: string | null;
  };
}

export interface ChallengeAcceptedEvent extends ChallengeNewEvent {
  acceptedAt: string;
}
