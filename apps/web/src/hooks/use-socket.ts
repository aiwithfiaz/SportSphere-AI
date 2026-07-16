"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketOptions {
  url?: string;
  autoConnect?: boolean;
}

interface SocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (...args: any[]) => void) => () => void;
}

export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const { url = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001", autoConnect = false } = options;
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<SocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    const socket = io(url, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      setState({ isConnected: true, isConnecting: false, error: null });
    });

    socket.on("disconnect", (reason) => {
      setState((prev) => ({
        ...prev,
        isConnected: false,
        error: `Disconnected: ${reason}`,
      }));
    });

    socket.on("connect_error", (error) => {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message,
      }));
    });

    socketRef.current = socket;
    socket.connect();
  }, [url]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setState({ isConnected: false, isConnecting: false, error: null });
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    socketRef.current?.on(event, callback);
    return () => {
      socketRef.current?.off(event, callback);
    };
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    socket: socketRef.current,
    ...state,
    connect,
    disconnect,
    emit,
    on,
  };
}

export function useMatchUpdates(matchId: string) {
  const { socket, isConnected, on, connect } = useSocket();
  const [matchData, setMatchData] = useState<any>(null);

  useEffect(() => {
    if (!matchId) return;
    connect();
  }, [matchId, connect]);

  useEffect(() => {
    if (!isConnected || !matchId) return;

    socket?.emit("join:match", matchId);

    const unsubscribeScore = on("score:update", (data: any) => {
      if (data.matchId === matchId) {
        setMatchData((prev: any) => ({ ...prev, ...data }));
      }
    });

    const unsubscribeEvent = on("match:event", (data: any) => {
      if (data.matchId === matchId) {
        setMatchData((prev: any) => ({
          ...prev,
          events: [...(prev?.events || []), data],
        }));
      }
    });

    return () => {
      unsubscribeScore();
      unsubscribeEvent();
      socket?.emit("leave:match", matchId);
    };
  }, [isConnected, matchId, socket, on]);

  return { matchData, isConnected };
}

export function useLiveScores() {
  const { socket, isConnected, on, connect } = useSocket();
  const [scores, setScores] = useState<any[]>([]);

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = on("score:update", (data: any) => {
      setScores((prev) => {
        const index = prev.findIndex((s) => s.matchId === data.matchId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = data;
          return updated;
        }
        return [...prev, data];
      });
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected, on]);

  return { scores, isConnected };
}
