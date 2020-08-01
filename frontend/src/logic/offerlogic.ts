import { db } from "../index";
import { Status } from "../types";
import { ensureNonEmpty, ensureNonNegative } from "./utilities";
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
    status: Status[status],
  }),
  fromFirestore: (offerSnapshot: firebase.firestore.DocumentSnapshot) => {
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
      Status[data.status],
    );
  },
});

/**
 * Gets open offer
 */
export const getOpenOffer: () => Promise<Offer[]> = async () => {
  const offers: Offer[] = [];
  const requestRef = await db.collection(COLLECTION_OFFERS).get();
  const temp: firebase.firestore.QueryDocumentSnapshot<
    firebase.firestore.DocumentData
  >[] = [];
  requestRef.forEach((offerSnapshot) => {
    temp.push(offerSnapshot);
  });
  await Promise.all(
    temp.map(async (offerSnapshot) => {
      try {
        const offer = await offerConverter.fromFirestore(offerSnapshot);
        offers.push(offer);
      } catch (e) {
        return console.error(
          `Encountered error while retrieving offer: ${e.message}`
        );
      }
    })
  );
  return offers.filter((value: Offer) => value.status === "OPEN");
};

/**
 * Gets offers that are associated with `uid`.
 * @throws Error if `uid` is empty.
 */
export const getOffers: (
  uid: string,
  status?: Status
) => Promise<Offer[]> = async (uid: string, status?: Status) => {
  try {
    ensureNonEmpty(uid);
  } catch {
    throw new Error("Unable to get offers for user when his/her id is empty");
  }
  if (status) {
    const offersRef = db
      .collection(COLLECTION_OFFERS)
      .where("uid", "==", uid)
      .where("status", "==", status);
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
        console.log("Encountered error while retrieving offers: " + e.message);
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
  expectedDeliveryTime: number,
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
    status,
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
 * Reopens an offer if it is already cancelled. If the offer's `expectedDeliveryTime` has past, no action will be taken.
 * @param id id of the offer that is to be reopened.
 * @throws Error if no `id` is provided
 */
const reopenOffer: (
  // TODO: if we have time
  id: string
) => Promise<void> = async (id) => {
  try {
    ensureNonEmpty(id);
  } catch (e) {
    throw new Error("Unable to reopen offer without its id");
  }

  const offerRef = db.collection(COLLECTION_OFFERS).doc(id);
  // TODO: deal with the case in which the offer has expired
  return offerRef.update({ status: Status.OPEN });
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
