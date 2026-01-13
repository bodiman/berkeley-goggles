import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../config/api';

let socket: Socket | null = null;

export const connectSocket = (userId: string): Socket => {
  if (socket?.connected) return socket;

  socket = io(API_CONFIG.baseURL, {
    query: { userId },
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('🔌 Socket connection error:', error.message);
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
