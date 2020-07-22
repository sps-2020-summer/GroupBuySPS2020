import firebase from "firebase";

export const ensureNonNull = (...objects: any[]) => {
    objects.forEach(o => {
        if (o === null) {
            throw new Error("Parameter is null");
        } else if (o === undefined) {
            throw new Error("Parameter is undefined");
        } else if (typeof o === "string" && o === "") {
            throw new Error("Given string parameter is empty");
        } 
    })
}

export const ensureNonNegative = (num: number) => {
	if (num < 0) {
		throw new Error("Given number is negative");
	}
};

// TODO: set it up
/*
const firebaseApp = null;
export const db: firebase.firestore.Firestore = firebase.firestore(firebaseApp as unknown as firebase.app.App);
*/
