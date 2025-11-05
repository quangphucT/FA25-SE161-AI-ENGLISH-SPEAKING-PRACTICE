declare global {
  interface Window {
    forceRefreshToken?: () => Promise<void>;
  }
}
export {};
