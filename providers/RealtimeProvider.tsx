'use client';

import { useCallback, useRef, useState, useEffect, createContext, useContext} from "react";
import { signalRService } from "@/lib/realtime/realtime";
import { useRouter } from "next/navigation";

interface RealtimeContextType {
    // Connection state
    isConnected: boolean;
    isConnecting: boolean;
    connectionError: string | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
}  
const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);
export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const isInitialized = useRef(false);
    //const { user: currentUser } = useUser();
    const router = useRouter();
  
  // ===== CONNECTION METHODS =====
  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;

    setIsConnecting(true);
    setConnectionError(null);

    try {
      await signalRService.connect();
      setIsConnected(true);
      console.log('✅ [REALTIME] Connected successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect';
      setConnectionError(errorMessage);
      console.error('❌ [REALTIME] Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnected, isConnecting]);

  const disconnect = useCallback(async () => {
    try {
      await signalRService.disconnect();
      setIsConnected(false);
      setConnectionError(null);
      console.log('🔌 [REALTIME] Disconnected');
    } catch (error) {
      console.error('❌ [REALTIME] Disconnect failed:', error);
    }
  }, []);

  // Auto-connect when provider mounts (only if env var is available)
  useEffect(() => {
    // Check if environment variable is available before attempting connection
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_BACKEND || process.env.NEXT_PUBLIC_BE_API_URL;
    if (!apiUrl) {
      console.warn('⚠️ [REALTIME] Skipping SignalR connection: NEXT_PUBLIC_API_URL_BACKEND or NEXT_PUBLIC_BE_API_URL is not defined. Please add it to your .env.local file.');
      return;
    }

    if (!isInitialized.current) {
      isInitialized.current = true;
      connect();
    }
  }, [connect]);

  // Monitor connection state from signalRService
  useEffect(() => {
    const checkConnection = () => {
      const state = signalRService.getConnectionState();
      if (state === 'Connected' && !isConnected) {
        setIsConnected(true);
      } else if (state !== 'Connected' && isConnected) {
        setIsConnected(false);
      }
    };

    const interval = setInterval(checkConnection, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isConnected]);

  const value: RealtimeContextType = {
    isConnected,
    isConnecting,
    connectionError,
    connect,
    disconnect,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = (): RealtimeContextType => {
    const context = useContext(RealtimeContext);
    if (context === undefined) {
      throw new Error('useRealtime must be used within a RealtimeProvider');
    }
    return context;
  };
  
  export default RealtimeProvider;
  