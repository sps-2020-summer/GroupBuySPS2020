import { db } from "../index";
import { Status } from "../types";
import { ensureNonEmpty } from "./utilities";

const COLLECTION_OFFERS: string = "offer";

class Offer {
	uid: string;
	id: string;
	title: string;
	description: string;
	shopLocation: string;
	expectedDeliveryTime: string;
	status: Status;

	constructor(
		uid: string,
		id: string,
		title: string,
		description: string,
		shopLocation: string,
		expectedDeliveryTime: string,
		status: Status
	) {
		try {
			ensureNonEmpty(id, shopLocation, expectedDeliveryTime, status, title, description);
		} catch (e) {
			throw new Error("Unable to create offer. Reason: " + e.message);
		}

		this.uid = uid;
		this.id = id;
		this.title = title;
		this.description = description;
		this.shopLocation = shopLocation;
		this.expectedDeliveryTime = expectedDeliveryTime;
		this.status = status;
	}
}

const offerConverter = Object.freeze({
	toFirestore: (
		uid: string,
		title: string,
		description: string,
		shopLocation: string,
		expectedDeliveryTime: string,
		status: Status
	) => ({
		uid: uid,
		title: title,
		description: description,
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
			data.title,
			data.description,
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
	status?: Status,
) => Promise<Offer[]> = async (
	uid: string,
	status?: Status,
	) => {
		try {
			ensureNonEmpty(uid);
		} catch {
			throw new Error("Unable to get offers for user when his/her id is empty");
		}
		if (status) {
			const offersRef = db.collection(COLLECTION_OFFERS).where("uid", "==", uid).where("status", "==", status);
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
		} else {
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
		}
	};

/** 
 *	Adds an offer to the database.
 *  @throws Error if `uid`, `title`, `description`, `shopLocation`, `expectedDeliveryTime`or `status` are empty.
 */
export const addOffer: (
	uid: string,
	title: string,
	description: string,
	shopLocation: string,
	expectedDeliveryTime: string,
	status: Status,
) => Promise<Offer> = async function (
	uid,
	title,
	description,
	shopLocation,
	expectedDeliveryTime,
	status,
	) {
		if (status === null) {
			status = Status.OPEN;
		}


		try {
			ensureNonEmpty(uid, shopLocation, expectedDeliveryTime, status);
		} catch (e) {
			throw new Error(`Unable to add offer: ${e.message}`);
		}

		const res = offerConverter.toFirestore(
			uid,
			title,
			description,
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
						title,
						description,
						shopLocation,
						expectedDeliveryTime,
						status
					)
				);

			return new Offer(
				uid,
				offersRef.id,
				title,
				description,
				shopLocation,
				expectedDeliveryTime,
				status
			);
		} catch (e) {
			throw new Error(`Unable to add offer: ${e.message}`);
		}
	};
