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
// ===== EVENT HANDLERS =====
export type ReviewCompletedHandler = (review: ReviewCompleted) => void;

  class SignalRService {
    // ===== CONNECTION STATE =====
    private hubConnection: HubConnection | null = null;
    private connectionPromise: Promise<void> | null = null;
    private isInitializing = false;
    private reconnectAttempts = 0;
    private readonly maxReconnectAttempts = 5;
    private currentConversationId: string | null = null;
    private isServerUnavailable = false; // Track if server is clearly unavailable

    private reviewCompletedHandler: ReviewCompletedHandler | null = null;

    constructor() {
        //this.initializeConnection();
      }
      // ===== CONNECTION INITIALIZATION =====
  public initializeConnection(): void {
    // Only initialize on client-side
    if (typeof window === 'undefined') {
      console.warn('⚠️ [SIGNALR] Cannot initialize on server-side');
      return;
    }

    // Check if environment variable is available (must have NEXT_PUBLIC_ prefix for client-side)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_BACKEND || process.env.NEXT_PUBLIC_BE_API_URL;
    if (!apiUrl) {
      console.error('❌ [SIGNALR] NEXT_PUBLIC_API_URL_BACKEND or NEXT_PUBLIC_BE_API_URL is not defined');
      return;
    }

    if (this.hubConnection || this.isInitializing) {
      return;
    }

    this.isInitializing = true;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${apiUrl}/hubs/reviewer`, {
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
    //backend :await _hubContext.Clients.Group("Reviewers").SendAsync("reviewCompleted", new{learnerAnswerId, remainin  });
    if (!this.hubConnection) return;
    this.hubConnection.on('reviewCompleted', (review: ReviewCompleted) => {
      console.log('Received review:', review);
      this.reviewCompletedHandler?.(review);
    });
  }

  public setReviewCompletedHandler(handler: ReviewCompletedHandler | null): void {
    this.reviewCompletedHandler = handler;
  }

  // Helper to check if error indicates server is unavailable
  private isConnectionRefusedError(error: any): boolean {
    if (!error) return false;
    
    const errorMessage = error.message || error.toString() || '';
    const errorString = errorMessage.toLowerCase();
    
    // Check for various connection refused indicators
    return (
      errorString.includes('connection refused') ||
      errorString.includes('failed to fetch') ||
      errorString.includes('networkerror') ||
      errorString.includes('err_connection_refused') ||
      errorString.includes('err_connection_reset') ||
      errorString.includes('err_name_not_resolved') ||
      (error instanceof TypeError && errorMessage.includes('Failed to fetch'))
    );
  }

  // Join the Reviewers group on the hub
  private async joinReviewerGroup(): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== 'Connected') {
      console.warn('⚠️ [SIGNALR] Cannot join reviewer group: connection not established');
      return;
    }

    try {
      await this.hubConnection.invoke('JoinReviewerGroup');
      console.log('✅ [SIGNALR] Successfully joined Reviewers group');
    } catch (error) {
      console.error('❌ [SIGNALR] Failed to join Reviewers group:', error);
      // Don't throw - connection is still valid even if group join fails
    }
  }

  // Leave the Reviewers group
  private async leaveReviewerGroup(): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== 'Connected') {
      return;
    }

    try {
      await this.hubConnection.invoke('LeaveReviewerGroup');
      console.log('✅ [SIGNALR] Successfully left Reviewers group');
    } catch (error) {
      console.warn('⚠️ [SIGNALR] Failed to leave Reviewers group:', error);
    }
  }

  public async connect(): Promise<void> {
    // Only connect on client-side
    if (typeof window === 'undefined') {
      console.warn('⚠️ [SIGNALR] Cannot connect on server-side');
      return Promise.resolve();
    }

    // Check if environment variable is available (must have NEXT_PUBLIC_ prefix for client-side)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_BACKEND || process.env.NEXT_PUBLIC_BE_API_URL;
    if (!apiUrl) {
      const errorMsg = 'NEXT_PUBLIC_API_URL_BACKEND or NEXT_PUBLIC_BE_API_URL is not defined';
      console.error(`❌ [SIGNALR] ${errorMsg}`);
      return Promise.reject(new Error(errorMsg));
    }

    if (!this.hubConnection) {
      this.initializeConnection();
    }

    if (!this.hubConnection) {
      return Promise.reject(new Error('Failed to initialize SignalR connection'));
    }

    if (this.hubConnection.state === 'Connected') {
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
      this.isServerUnavailable = true;
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
      this.isServerUnavailable = false; // Reset flag on successful connection
      console.log('✅ [SIGNALR] Successfully connected to SignalR hub');
      
      // Join the Reviewers group after successful connection
      await this.joinReviewerGroup();
    } catch (err) {
      this.connectionPromise = null;
      
      // Check if this is a connection refused error
      if (this.isConnectionRefusedError(err)) {
        this.isServerUnavailable = true;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL_BACKEND || process.env.NEXT_PUBLIC_BE_API_URL;
        console.error(`❌ [SIGNALR] Backend server at ${apiUrl} is not available. Please ensure the server is running.`);
        console.error('❌ [SIGNALR] Connection error details:', err);
        
        // Don't attempt reconnection for connection refused errors
        throw new Error(`Backend server at ${apiUrl} is not available. Please ensure the server is running.`);
      }
      
      console.error('❌ [SIGNALR] Failed to connect:', err);

      const reconnected = await this.attemptReconnection();
      if (!reconnected) {
        throw err;
      }
    }
  }
  
  public async disconnect(): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
      // Leave the group before disconnecting
      await this.leaveReviewerGroup();
      await this.hubConnection.stop();
    }
    this.hubConnection = null;
    this.isInitializing = false;
    this.currentConversationId = null;
    this.isServerUnavailable = false; // Reset on manual disconnect
    this.reconnectAttempts = 0;
  }

  public getConnectionState(): string {
    return this.hubConnection?.state || 'Disconnected';
  }

  // Reset connection state to allow retry after server becomes available
  public resetConnectionState(): void {
    this.isServerUnavailable = false;
    this.reconnectAttempts = 0;
    this.connectionPromise = null;
  }

  // ===== CONNECTION MONITORING =====
  private setupConnectionMonitoring(): void {
    if (!this.hubConnection) return;

    this.hubConnection.onclose(error => {
      console.warn('⚠️ [SIGNALR] Connection closed:', error);
      this.connectionPromise = null;

      // Only attempt automatic reconnection if server is not marked as unavailable
      if (!this.isServerUnavailable) {
        setTimeout(() => {
          if (!this.hubConnection || this.hubConnection.state !== 'Connected') {
            this.connect().catch(err => {
              // Check if it's a connection refused error
              if (this.isConnectionRefusedError(err)) {
                this.isServerUnavailable = true;
                console.warn('⚠️ [SIGNALR] Server unavailable. Stopping automatic reconnection attempts.');
              } else {
                console.warn('⚠️ [SIGNALR] Automatic reconnection failed:', err);
              }
            });
          }
        }, 3000);
      } else {
        console.warn('⚠️ [SIGNALR] Server unavailable. Skipping automatic reconnection.');
      }
    });

    this.hubConnection.onreconnecting(() => {});

    this.hubConnection.onreconnected(() => {
      this.reconnectAttempts = 0;
      this.isServerUnavailable = false;

      // Rejoin the Reviewers group after reconnection
      this.joinReviewerGroup().catch((err: any) =>
        console.warn('⚠️ [SIGNALR] Failed to rejoin Reviewers group after reconnect:', err)
      );

      // Rejoin current conversation if exists (if you have this feature)
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