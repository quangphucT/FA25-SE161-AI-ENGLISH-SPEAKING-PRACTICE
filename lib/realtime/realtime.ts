import {
    HubConnectionBuilder,
    HubConnection,
    LogLevel,
    HttpTransportType,
  } from '@microsoft/signalr';
import { getCookie } from 'cookies-next';

export interface ReviewCompleted {
    learnerAnswerId: string;
    remaining: number;
}
  class SignalRService {
    // ===== CONNECTION STATE =====
    private hubConnection: HubConnection | null = null;
    private connectionPromise: Promise<void> | null = null;
    private isInitializing = false;
    private reconnectAttempts = 0;
    private readonly maxReconnectAttempts = 5;
    private currentConversationId: string | null = null;



    constructor() {
        this.initializeConnection();
      }
      // ===== CONNECTION INITIALIZATION =====
  public initializeConnection(): void {
    if (this.hubConnection || this.isInitializing) {
      return;
    }

    this.isInitializing = true;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL_BACKEND}/hubs/reviewer`, {
        transport:
          HttpTransportType.WebSockets |
          HttpTransportType.LongPolling |
          HttpTransportType.ServerSentEvents,
        withCredentials: true,
        accessTokenFactory: () => {
          const token = getCookie('auth-token');
          return typeof token === 'string' ? token : '';
        },
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.previousRetryCount === 0) return 0;
          if (retryContext.previousRetryCount < 3) return 2000;
          return 5000;
        },
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.setupConnectionMonitoring();
    this.setupHubEventHandlers();
    this.isInitializing = false;
  }
  private setupHubEventHandlers(): void {
    if (!this.hubConnection) return;
    this.hubConnection.on('reviewCompleted', (review: ReviewCompleted) => {
      console.log('Received review:', review);
    });
  }
  public async connect(): Promise<void> {
    if (!this.hubConnection) {
      this.initializeConnection();
    }

    if (this.hubConnection?.state === 'Connected') {
      return Promise.resolve();
    }

    if (!this.connectionPromise) {
      this.connectionPromise = this.connectInternal();
    }

    return this.connectionPromise;
  }
  private async attemptReconnection(): Promise<boolean> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('⚠️ [SIGNALR] Max reconnection attempts reached');
      return false;
    }

    this.reconnectAttempts++;

    try {
      if (this.hubConnection) {
        await this.hubConnection.stop();
      }
      this.hubConnection = null;
      this.connectionPromise = null;

      await new Promise(resolve => setTimeout(resolve, 2000 * this.reconnectAttempts));
      await this.connect();
      return true;
    } catch (error) {
      console.warn(`⚠️ [SIGNALR] Reconnection attempt ${this.reconnectAttempts} failed:`, error);
      return false;
    }
  }
  private async connectInternal(): Promise<void> {
    try {
      await this.hubConnection!.start();
      this.connectionPromise = null;
      this.reconnectAttempts = 0;
    } catch (err) {
      this.connectionPromise = null;
      console.error('❌ [SIGNALR] Failed to connect:', err);

      const reconnected = await this.attemptReconnection();
      if (!reconnected) {
        throw err;
      }
    }
  }
  
  public async disconnect(): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
      await this.hubConnection.stop();
    }
    this.hubConnection = null;
    this.isInitializing = false;
    this.currentConversationId = null;
  }

  public getConnectionState(): string {
    return this.hubConnection?.state || 'Disconnected';
  }

  // ===== CONNECTION MONITORING =====
  private setupConnectionMonitoring(): void {
    if (!this.hubConnection) return;

    this.hubConnection.onclose(error => {
      console.warn('⚠️ [SIGNALR] Connection closed:', error);
      this.connectionPromise = null;

      // Attempt automatic reconnection
      setTimeout(() => {
        if (!this.hubConnection || this.hubConnection.state !== 'Connected') {
          this.connect().catch(err => {
            console.warn('⚠️ [SIGNALR] Automatic reconnection failed:', err);
          });
        }
      }, 3000);
    });

    this.hubConnection.onreconnecting(() => {});

    this.hubConnection.onreconnected(() => {
      this.reconnectAttempts = 0;

      // Rejoin current conversation if exists
      if (this.currentConversationId) {
        this.hubConnection
          ?.invoke('JoinConversation', this.currentConversationId)
          .catch(err =>
            console.warn('⚠️ [SIGNALR] Failed to rejoin conversation after reconnect:', err)
          );
      }
    });
  }
}  
export const signalRService = new SignalRService();