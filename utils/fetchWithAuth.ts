import { handleTokenExpiration, handleLogout } from "./auth";

// utils/fetchWithAuth.ts
interface FetchQueue {
  resolve: (value: Response) => void;
  reject: (reason?: any) => void;
  input: RequestInfo | URL;
  init?: RequestInit;
}

class AuthFetch {
  private isRefreshing = false;
  private failedQueue: FetchQueue[] = [];

  private processQueue(error: Error | null) {
    this.failedQueue.forEach(({ resolve, reject, input, init }) => {
      if (error) {
        reject(error);
      } else {
        // Retry with new token
        fetch(input, init).then(resolve).catch(reject);
      }
    });

    this.failedQueue = [];
  }

  async fetchWithAuth(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const response = await fetch(input, {
      ...init,
      credentials: "include", // Always include cookies
    });
    // If 401 and not already refreshing
    if (response.status === 401 && !this.isRefreshing) {
      this.isRefreshing = true;

      try {
        // Try to refresh token
        const refreshResponse = await fetch("/api/auth/refresh-token", {
          method: "POST",
          credentials: "include",
        });

        if (refreshResponse.ok) {
          // Refresh successful, retry all queued requests
          this.isRefreshing = false;
          this.processQueue(null);

          // Retry current request
          return fetch(input, {
            ...init,
            credentials: "include",
          });
        } else {
          // Refresh failed
          const refreshData = await refreshResponse.json();

          if (refreshData.status === 401 || refreshData.status === 403 || refreshData.status === 400) {
            await handleLogout();
         
          }
          this.isRefreshing = false;
          const error = new Error("Authentication failed");
          this.processQueue(error);
          throw error;
        }
      } catch (error) {
        this.isRefreshing = false;
        const authError = new Error("Refresh token failed");
        this.processQueue(authError);
        throw authError;
      }
    }

    // If 401 and already refreshing, add to queue
    if (response.status === 401 && this.isRefreshing) {
      return new Promise<Response>((resolve, reject) => {
        this.failedQueue.push({ resolve, reject, input, init });
      });
    }

    return response;
  }
}

// Export singleton instance
const authFetch = new AuthFetch();
export const fetchWithAuth = authFetch.fetchWithAuth.bind(authFetch);

// Default export for convenience
export default fetchWithAuth;
