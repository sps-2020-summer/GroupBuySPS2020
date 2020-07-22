import { Status } from "../types";
import { COLLECTION_USERS } from "./userlogic";
import { ensureNonNull } from "./utilities";

// const COLLECTION_OFFERS: string = "offers";
// i accidentally created test databse in cloud firestore it as offer lol
const COLLECTION_OFFERS: string = "offer";
class Offer {
	id: string;
	shopLocation: string;
	expectedDeliveryTime: string;
	status: Status;

	constructor(
		id: string,
		shopLocation: string,
		expectedDeliveryTime: string,
		status: Status
	) {
		try {
			ensureNonNull(id, shopLocation, expectedDeliveryTime, status);
		} catch (e) {
			throw new Error("Unable to create offer. Reason: " + e.message);
		}

		this.id = id;
		this.shopLocation = shopLocation;
		this.expectedDeliveryTime = expectedDeliveryTime;
		this.status = status;
	}
}

/** For firebase purposes. */
const offerConverter = {
	toFirestore: (
		shopLocation: string,
		expectedDeliveryTime: string,
		status: string
	) => ({
		shopLocation: shopLocation,
		expectedDeliveryTime: expectedDeliveryTime,
		status: status,
	}),
	fromFirestore: (
		offerSnapshot: firebase.firestore.QueryDocumentSnapshot
	) => {
		const data = offerSnapshot.data();
		if (data === undefined) {
			throw new Error("Unable to find snapshot for offer.");
		} else {
			return new Offer(
				offerSnapshot.id,
				data.shopLocation,
				data.expectedDeliveryTime,
				Status[data.status]
			);
		}
	},
};
// convert to use async await to wrap
// else need to wrap in new Promise(resolve, reject) => ......
export const getOffers: (
	uid: string,
	db: firebase.firestore.Firestore
) => Promise<void | Offer[]> = async (
	uid: string,
	db: firebase.firestore.Firestore
) => {
	console.log(uid);
	const offersRef = db.collection(COLLECTION_OFFERS).where("uuid", "==", uid);
	const offers: Offer[] = [];
	const offersQuerySnapshot = await offersRef.get();
	offersQuerySnapshot.forEach((offerSnapshot) => {
		try {
			const offer = offerConverter.fromFirestore(offerSnapshot);
			offers.push(offer);
		} catch (e) {
			console.log(
				"Encountered error while retrieving offers: " + e.message
			);
		}
	});
	return offers;
};

/*
export const addOffer: (
	uid: string,
	shopLocation: string,
	expectedDeliveryTime: string,
	status: Status
) => Promise<void | Offer> = function (
	uid,
	shopLocation,
	expectedDeliveryTime,
	status
) {
	if (status === null) {
		status = Status.OPEN;
	}
	ensureNonNull(uid, shopLocation, expectedDeliveryTime, status);
	return db
		.collection(COLLECTION_USERS)
		.doc(uid)
		.collection(COLLECTION_OFFERS)
		.add(
			offerConverter.toFirestore(
				shopLocation,
				expectedDeliveryTime,
				Status[status]
			)
		)
		.then(
			(offerRef) =>
				new Offer(
					offerRef.id,
					shopLocation,
					expectedDeliveryTime,
					status
				)
		);
};*/
