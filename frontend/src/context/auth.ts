import { createContext, useContext } from 'react';
import { ProfileObject } from './user';

// These functions will be created in app.tsx
export const AuthContext = createContext({
    authTokens: '',
    logout: (history: any) => {},
    login: (history: any, token: string, userProfile: ProfileObject) => {},
});

export function useAuth() {
    return useContext(AuthContext);
}
