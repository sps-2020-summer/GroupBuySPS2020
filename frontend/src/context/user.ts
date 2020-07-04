import { createContext, useContext } from 'react';

// These functions will be created in app.tsx
export interface ProfileObject {
    email: string;
    familyName: string;
    givenName: string;
    googleId: string;
    imageUrl: string;
    name: string;
}

const user: { profileObj: ProfileObject } = {
    profileObj: {
        email: '',
        familyName: '',
        givenName: '',
        googleId: '',
        imageUrl: '',
        name: '',
    },
};

export const UserContext = createContext(user);

export function useUser() {
    return useContext(UserContext);
}
