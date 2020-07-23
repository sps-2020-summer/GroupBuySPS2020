import { db } from "../index";
import { Status } from "../types";
import { ensureNonNull } from "./utilities";

const COLLECTION_OFFERS: string = "offer";

class Offer {
    uid: string;
	id: string;
	shopLocation: string;
	expectedDeliveryTime: string;
	status: Status;

	constructor(
		uid: string,
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

		this.uid = uid;
		this.id = id;
		this.shopLocation = shopLocation;
		this.expectedDeliveryTime = expectedDeliveryTime;
		this.status = status;
	}
}

const offerConverter = {
	toFirestore: (
		uid: string,
		shopLocation: string,
		expectedDeliveryTime: string,
		status: string
	) => ({
		uid: uid,
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
				data.uid,
				offerSnapshot.id,
				data.shopLocation,
				data.expectedDeliveryTime,
				Status[data.status]
			);
		}
	},
};

export const getOffers: (
	uid: string,
) => Promise<Offer[]> = async (
	uid: string,
) => {
	const offersRef = db.collection(COLLECTION_OFFERS).where("uid", "==", uid);
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

export const addOffer: (
	uid: string,
	shopLocation: string,
	expectedDeliveryTime: string,
	status: Status,
) => Promise<Offer> = async function (
	uid,
	shopLocation,
	expectedDeliveryTime,
	status,
) {
	if (status === null) {
		status = Status.OPEN;
	}
	ensureNonNull(uid, shopLocation, expectedDeliveryTime, status);
	const offersRef = await db
		.collection(COLLECTION_OFFERS)
		.add(
			offerConverter.toFirestore(
				uid,
				shopLocation,
				expectedDeliveryTime,
				Status[status]
			)
		);

	return new Offer(
		uid, 
		offersRef.id,
		shopLocation,
		expectedDeliveryTime,
		status
	);
};
