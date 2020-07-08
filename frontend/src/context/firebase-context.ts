import { createContext } from "react";
import firebase from "firebase";

const firebaseContext = {
	firebase: firebase,
};

export const FirebaseContext = createContext(firebaseContext);
