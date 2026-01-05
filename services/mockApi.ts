
// This file is deprecated. All logic has been moved to services/api.ts
// Redirecting all calls to the unified api service to maintain compatibility.
import { api as unifiedApi } from './api';

export const api = unifiedApi;
export const initializeStorage = () => {}; 
