import { db } from "../index";
import { ensureNonEmpty } from "./utilities";
import { Task, getTaskById, addTask } from "./tasklogic";

const COLLECTION_REQUESTS = "requests";

class Request {
    uid: string;
    id: string;
    task: Task;

    /** @throws Error if `uid`, `id` or `task` is empty. */
    constructor(
        uid: string,
        id: string,
        task: Task
    ) {
        try {
            ensureNonEmpty(uid, id, task);
        } catch (e) {
            throw new Error(`Unable to create request: ${e.message}`);
        }
        this.uid = uid;
        this.id = id;
        this.task = task;
    }
}

const requestConverter = Object.freeze({
    /** 
     * Assumes that `task` is valid (i.e. exists in db).
     * @throws Error if `uid` or `task` is invalid/empty. 
     */
	toFirestore: (
        uid: string,
        task: Task
	) => {
        try {
            ensureNonEmpty(uid, task);
        } catch (e) {
            throw new Error("Unable to convert request to firestore because uid/task is empty");
        }

        return {
            uid: uid,
            taskId: task.id
        }
    },
	fromFirestore: async (
		requestSnapshot: firebase.firestore.DocumentSnapshot
	) => {
		const data = requestSnapshot.data();
		if (data === undefined) {
			throw new Error("Unable to find snapshot for request.");
        } 
        
        const task = await getTaskById(data.taskId);
        return new Request(
            data.uid, 
            requestSnapshot.id, 
            task);
	},
});

/**
 * Gets all requests that are associated with `uid`.
 * @throws Error if `uid` is empty.
 */
export const getRequests: (
    uid: string
) => Promise<Request[]> = async (
    uid: string
) => {
    try {
        ensureNonEmpty(uid);
    } catch (e) {
        throw new Error("Unable to get requests when uid is empty");
    }
    const requestRef = db.collection(COLLECTION_REQUESTS).where("uid", "==", uid);
    const requests: Request[] = [];
    const requestQuerySnapshot = await requestRef.get();
    requestQuerySnapshot.forEach(async requestSnapshot => {
        try {
            const request = await requestConverter.fromFirestore(requestSnapshot);
            requests.push(request);
        } catch (e) {
            e => console.error(`Encountered error while retrieving request: ${e.message}`);
        }
    });
    return requests;
};

/** 
 * Adds request to database.
 * @throws Error if `uid` is empty.
 * @throws Error if given arguments cannot be used to create a valid request.
 */
const addRequest: (
    uid: string,
    payerName: string,
	shopLocation: string,
    expectedDeliveryTime: string,
    item: string,
    fee: number,
    doerId?: string,
    doerName?: string
) => Promise<Request> = async function (
    uid,
    payerName,
    shopLocation,
    expectedDeliveryTime,
    item, 
    fee,
    doerId, 
    doerName
) {
    try {
        ensureNonEmpty(uid);
    } catch (e) {
        throw new Error("Unable to add request when user id is not specified");
    }
    
    try {
        const task = await addTask(
            shopLocation,
            expectedDeliveryTime,
            item,
            payerName,
            fee,
            doerId,
            doerName
        );
    
        const requestRef = await db
            .collection(COLLECTION_REQUESTS)
            .add(
                requestConverter.toFirestore(
                    uid,
                    task
                )
            );
        
        return new Request(
            uid,
            requestRef.id,
            task
        );
    } catch (e) {
        throw new Error(`Unable to add request: ${e.message}`);
    }
};

/** 
 * Adds a regular request to database.
 * @throws Error if any argument is empty.
 */
export const addRegularRequest: (
    uid: string,
    payerName: string,
	shopLocation: string,
    expectedDeliveryTime: string,
    item: string,
    fee: number
) => Promise<Request> = async (
    uid,
    payerName,
    shopLocation,
    expectedDeliveryTime,
    item, 
    fee
) => (
    addRequest(uid, payerName, shopLocation, expectedDeliveryTime, item, fee)
);

/**
 * Adds a pending request, i.e. request with doer information specified.
 * @throws Error if any argument is empty.
 */
 export const addPendingRequest: (
    uid: string,
    payerName: string,
	shopLocation: string,
    expectedDeliveryTime: string,
    item: string,
    fee: number,
    doerId: string,
    doerName: string
) => Promise<Request> = async function (
    uid,
    payerName,
    shopLocation,
    expectedDeliveryTime,
    item, 
    fee,
    doerId, 
    doerName
) {
    return addRequest(uid, payerName, shopLocation, expectedDeliveryTime, item, fee, doerId, doerName);
}
