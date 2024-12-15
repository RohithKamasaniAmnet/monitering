// Feature flags configuration
export const FEATURES = {
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
} as const;