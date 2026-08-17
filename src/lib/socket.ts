import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from './api/core';

function resolveSocketUrl(): string | undefined {
  const configured = import.meta.env.VITE_SOCKET_URL?.trim();
  if (configured) return configured;
  // Same-origin when API is relative (Docker/nginx proxy).
  if (!API_URL.startsWith('http')) return undefined;
  return API_URL.replace(/\/api\/?$/, '');
}

export const SOCKET_URL = resolveSocketUrl();

export interface UseSocketResult {
  socket: Socket | null;
  connected: boolean;
  joinTrip: (tripId: string) => void;
  leaveTrip: (tripId: string) => void;
}

/**
 * Thin Socket.IO client wrapper mirroring `context/SocketContext.tsx`.
 * Connects when `token` is set, re-emits `join:trip` for every tracked room
 * on (re)connect, and tears the connection down when `token` becomes null.
 */
export function useSocket(token: string | null | undefined): UseSocketResult {
  const socketRef = useRef<Socket | null>(null);
  const activeRoomsRef = useRef<Set<string>>(new Set());
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      activeRoomsRef.current.clear();
      setSocket(null);
      setConnected(false);
      return;
    }

    const s = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    socketRef.current = s;
    setSocket(s);

    s.on('connect', () => {
      setConnected(true);
      activeRoomsRef.current.forEach((tripId) => {
        s.emit('join:trip', tripId);
      });
    });
    s.on('disconnect', () => setConnected(false));
    s.on('connect_error', (err: Error) => {
      console.warn('[socket] connect_error:', err.message);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    };
  }, [token]);

  const joinTrip = (tripId: string) => {
    activeRoomsRef.current.add(tripId);
    socketRef.current?.emit('join:trip', tripId);
  };

  const leaveTrip = (tripId: string) => {
    activeRoomsRef.current.delete(tripId);
    socketRef.current?.emit('leave:trip', tripId);
  };

  return { socket, connected, joinTrip, leaveTrip };
}
