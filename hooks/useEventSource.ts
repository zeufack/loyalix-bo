'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';

export interface SseEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

interface UseEventSourceOptions {
  /** Whether to enable the SSE connection (default: true) */
  enabled?: boolean;
  /** Callback when an event is received */
  onEvent?: (event: SseEvent) => void;
  /** Callback when the connection opens */
  onOpen?: () => void;
  /** Callback on connection error */
  onError?: (error: Error) => void;
  /** Reconnection delay in ms (default: 5000) */
  reconnectDelay?: number;
  /** Max reconnection attempts (default: 10) */
  maxReconnectAttempts?: number;
}

/**
 * Custom hook for SSE (Server-Sent Events) with JWT authentication.
 *
 * Uses fetch + ReadableStream to support custom Authorization headers,
 * since the native EventSource API doesn't support custom headers.
 */
export function useEventSource(options: UseEventSourceOptions = {}) {
  const {
    enabled = true,
    onEvent,
    onOpen,
    onError,
    reconnectDelay = 5000,
    maxReconnectAttempts = 10
  } = options;

  const { data: session } = useSession();
  const abortControllerRef = useRef<AbortController | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Keep the callbacks in refs so `connect` has a stable identity. Otherwise
  // inline callbacks (new identity each render) would churn the effect below
  // and trigger redundant reconnects.
  const onEventRef = useRef(onEvent);
  const onOpenRef = useRef(onOpen);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onEventRef.current = onEvent;
    onOpenRef.current = onOpen;
    onErrorRef.current = onError;
  });

  const connect = useCallback(async () => {
    if (!session?.accessToken) return;

    const apiUrl = process.env.NEXT_PUBLIC_NESTJS_API_URL;
    if (!apiUrl) return;

    // Clean up previous connection
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch(`${apiUrl}/events/stream`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: 'text/event-stream',
          'Cache-Control': 'no-cache'
        },
        signal: abortController.signal
      });

      if (!response.ok) {
        // Auth/permission failures are not transient — surface the error but
        // do NOT schedule a reconnect (avoids a 401/403 retry storm).
        if (response.status === 401 || response.status === 403) {
          setIsConnected(false);
          onErrorRef.current?.(
            new Error(`SSE connection failed: ${response.status}`)
          );
          return;
        }
        throw new Error(`SSE connection failed: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('SSE response has no body');
      }

      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
      onOpenRef.current?.();

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events from the buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep the incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data) {
              try {
                const event: SseEvent = JSON.parse(data);
                onEventRef.current?.(event);
              } catch {
                // Skip malformed events
                console.warn('Failed to parse SSE event:', data);
              }
            }
          }
        }
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // Connection was intentionally aborted
        return;
      }

      setIsConnected(false);
      onErrorRef.current?.(error as Error);

      // Attempt reconnection
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1;
        const delay =
          reconnectDelay * Math.pow(1.5, reconnectAttemptsRef.current - 1);
        console.info(
          `SSE reconnecting in ${Math.round(delay)}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
        );

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      }
    }
  }, [session?.accessToken, reconnectDelay, maxReconnectAttempts]);

  useEffect(() => {
    if (enabled && session?.accessToken) {
      connect();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      setIsConnected(false);
    };
  }, [enabled, session?.accessToken, connect]);

  const disconnect = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setIsConnected(false);
  }, []);

  return {
    isConnected,
    disconnect,
    reconnect: connect
  };
}
