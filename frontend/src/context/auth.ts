import { createContext, useContext } from "react";
import firebase from "firebase";
// These functions will be created in app.tsx
export const AuthContext = createContext({
	firebase: firebase,
	authTokens: "",
	logout: (history: any) => {},
	login: (token: string) => {},
});

export function useAuth() {
	return useContext(AuthContext);
}
