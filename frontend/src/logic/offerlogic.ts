import { db } from "../index";
import { Status } from "../types";
import { ensureNonEmpty, ensureNonNegative, shouldShowExpired } from "./utilities";
import { addRequestHelper, Request } from "./requestlogic";
import { addTask } from "./tasklogic";

const COLLECTION_OFFERS: string = "offer";

export class Offer {
  uid: string;
  id: string;
  title: string;
  description: string;
  shopLocation: string;
  expectedDeliveryTime: number;
  status: Status;

  constructor(
    uid: string,
    id: string,
    title: string,
    description: string,
    shopLocation: string,
    expectedDeliveryTime: number,
    status: Status,
  ) {
    try {
      ensureNonEmpty(
        id,
        shopLocation,
        expectedDeliveryTime,
        status,
        title,
        description
      );
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
    expectedDeliveryTime: number,
    status: Status
  ) => ({
    uid: uid,
    title: title,
    description: description,
    shopLocation: shopLocation,
    expectedDeliveryTime: expectedDeliveryTime,
    status: Status[status]
  }),
  fromFirestore: (offerSnapshot: firebase.firestore.DocumentSnapshot) => {
    const data = offerSnapshot.data();
    if (data === undefined) {
      throw new Error("Unable to find snapshot for offer.");
    }

    const expectedDeliveryTime: number = data.expectedDeliveryTime;
    const status: Status = Status[data.status];
    const newStatus = shouldShowExpired(expectedDeliveryTime, status) ? Status.EXPIRED : status;
    
    return new Offer(
      data.uid,
      offerSnapshot.id,
      data.title,
      data.description,
      data.shopLocation,
      expectedDeliveryTime,
      newStatus
    );
  },
});

/**
 * Gets open offers. The offers are sorted by `expectedDeliveryTime` in reverse-chronological order.
 */
export const getOpenOffers: () => Promise<Offer[]> = async () => {
  const offersRef = await db.collection(COLLECTION_OFFERS)
    .where("status", "==", Status.OPEN)
    .get();
  const offers: Offer[] = [];
  offersRef.forEach((offerSnapshot) => {
    try {
      const offer = offerConverter.fromFirestore(offerSnapshot);
      offers.push(offer);
    } catch (e) {
      console.log("Encountered error while retrieving offers: " + e.message);
    }
  });
  
  return offers.filter((value: Offer) => value.status === Status.OPEN)
    .sort((prev, curr) => curr.expectedDeliveryTime - prev.expectedDeliveryTime); 
};

type CurrentOffers = {
  open: Offer[]
}
/**
 * Gets current offers that are associated with `uid`. They are sorted in reverse-choronological order.
 * The offers are categorised based on `OPEN`.
 * @throws Error if `uid` is empty.
 */
export const getCurrentOffers: (
  uid: string
) => Promise<CurrentOffers> = async (uid: string) => {
  try {
    ensureNonEmpty(uid);
  } catch {
    throw new Error("Unable to get offers for user when his/her id is empty");
  }

  const offersRef = db.collection(COLLECTION_OFFERS)
    .where("uid", "==", uid)
    .where("status", "==", Status.OPEN);
  const offers: Offer[] = [];
  const offersQuerySnapshot = await offersRef.get();
  offersQuerySnapshot.forEach((offerSnapshot) => {
    try {
      const offer = offerConverter.fromFirestore(offerSnapshot);
      offers.push(offer);
    } catch (e) {
      console.log("Encountered error while retrieving offers: " + e.message);
    }
  });

  const categorisedOffers: CurrentOffers = {
    open: [],
  }
  offers.filter((value: Offer) => value.status === Status.OPEN)
    .sort((prev, curr) => curr.expectedDeliveryTime - prev.expectedDeliveryTime)
    .forEach(offer => categorisedOffers.open.push(offer));
  
  return categorisedOffers;
}

export type PastOffers = {
  cancelled: Offer[],
  expired: Offer[]
}
/**
 * Gets past offers that are associated with `uid`. 
 * The offers are categorised based on `CANCELLED` and `EXPIRED`.
 * @throws Error if `uid` is empty.
 */
export const getPastOffers: ( // should not be imported by FE
  uid: string
) => Promise<PastOffers> = async (uid: string) => {
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
      console.log("Encountered error while retrieving offers: " + e.message);
    }
  });
  // sort offers by `expectedDeliveryTime`
  offers.sort((prev, curr) => curr.expectedDeliveryTime - prev.expectedDeliveryTime);

  // categorise offers
  const categorisedOffers: PastOffers = {
    cancelled: [],
    expired: []
  }

  offers.forEach(offer => {
    const status = offer.status;
    if (status === Status.EXPIRED) {
      categorisedOffers.expired.push(offer);
    } else if (status === Status.CANCELLED) {
      categorisedOffers.cancelled.push(offer);
    } else {
      // ignore
    }
  })
  
  return categorisedOffers;
};

/**
 *	Adds an open offer to the database.
 *  @throws Error if `uid`, `title`, `description`, `shopLocation` or `expectedDeliveryTime` are empty.
 */
export const addOffer: (
  uid: string,
  title: string,
  description: string,
  shopLocation: string,
  expectedDeliveryTime: number
) => Promise<Offer> = async function (
  uid,
  title,
  description,
  shopLocation,
  expectedDeliveryTime
) {
  const status = Status.OPEN;

  try {
    ensureNonEmpty(uid, shopLocation, expectedDeliveryTime, status);
  } catch (e) {
    throw new Error(`Unable to add offer: ${e.message}`);
  }

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

/**
 * Cancels the offer which has the specified id.
 * Note: No checks are made to ensure that the offer's status is not 'DONE'. If it is 'DONE', then cancelling it
 * results in a bug.
 * @param id id of the offer that is to be closed.
 * @throws Error if no `id` is provided.
 */
export const cancelOffer: (id: string) => Promise<void> = async (id) => {
  try {
    ensureNonEmpty(id);
  } catch (e) {
    throw new Error("Unable to cancel offer without its id");
  }

  const offerRef = db.collection(COLLECTION_OFFERS).doc(id);
  return offerRef.update({ status: Status[Status.CANCELLED] });
};

/**
 * Adds a request to an offer.
 * @throws Error if any of the argument is empty.
 */
export const addRequestToOffer: (
  id: string,
  payerUid: string,
  item: string,
  fee: number
) => Promise<Request> = async (
  id,
  payerUid,
  item,
  fee
) => {
  try {
    ensureNonEmpty(id, payerUid, item, fee);
    ensureNonNegative(fee);
  } catch (e) {
    throw new Error(`Unable to add request to offer: ${e.message}`);
  }

  const offerRef = db.collection(COLLECTION_OFFERS).doc(id);
  const offerSnapshot = await offerRef.get();
  const offer = offerConverter.fromFirestore(offerSnapshot);

  // create and add new task for doer (i.e. owner of offer)
  addTask(
    offer.shopLocation,
    offer.expectedDeliveryTime,
    item,
    payerUid,
    fee,
    offer.uid
  );

  // 	create and add new request for payer
  return addRequestHelper(
    payerUid,
    offer.shopLocation,
    offer.expectedDeliveryTime,
    item,
    fee,
    offer.uid
  );
};
