import { db } from "../index";
import { Status } from "../types";
import { ensureNonEmpty } from "./utilities";

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
			ensureNonEmpty(id, shopLocation, expectedDeliveryTime, status);
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

const offerConverter = Object.freeze({
	toFirestore: (
		uid: string,
		shopLocation: string,
		expectedDeliveryTime: string,
		status: Status
	) => ({
		uid: uid,
		shopLocation: shopLocation,
		expectedDeliveryTime: expectedDeliveryTime,
		status: Status[status],
	}),
	fromFirestore: (
		offerSnapshot: firebase.firestore.DocumentSnapshot
	) => {
		const data = offerSnapshot.data();
		if (data === undefined) {
			throw new Error("Unable to find snapshot for offer.");
		} 
		return new Offer(
			data.uid,
			offerSnapshot.id,
			data.shopLocation,
			data.expectedDeliveryTime,
			Status[data.status]
		);
	},
});

/**
 * Gets offers that are associated with `uid`.
 * @throws Error if `uid` is empty.
 */
export const getOffers: (
	uid: string,
) => Promise<Offer[]> = async (
	uid: string,
	) => {
		try {
			ensureNonEmpty(uid);
		} catch {
			throw new Error("Unable to get offers for user when his/her id is empty");
		}
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

/** 
 *	Adds an offer to the database.
 *  @throws Error if `uid`, `shopLocation`, `expectedDeliveryTime`or `status` are empty.
 */
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
		console.log(uid);

		try {
			ensureNonEmpty(uid, shopLocation, expectedDeliveryTime, status);
		} catch (e) {
			throw new Error(`Unable to add offer: ${e.message}`);
		}
		
		const res = offerConverter.toFirestore(
			uid,
			shopLocation,
			expectedDeliveryTime,
			status
		);
		console.log(res);

		try {
			const offersRef = await db
			.collection(COLLECTION_OFFERS)
			.add(
				offerConverter.toFirestore(
					uid,
					shopLocation,
					expectedDeliveryTime,
					status
				)
			);

			return new Offer(
				uid,
				offersRef.id,
				shopLocation,
				expectedDeliveryTime,
				status
			);
		} catch (e) {
			throw new Error(`Unable to add offer: ${e.message}`);
		}
	};
