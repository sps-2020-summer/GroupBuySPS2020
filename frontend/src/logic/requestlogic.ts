import { db } from "../index";
import { ensureNonEmpty } from "./utilities";
import { Task, getTaskById, addTask, addDoerToTask, markTaskAsDone, cancelTask } from "./tasklogic";
import { Status } from "../types";

const COLLECTION_REQUESTS = "requests";

export class Request {
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
    uid: string,
    status?: Status
) => Promise<Request[]> = async (
    uid: string,
    status?: Status
) => {
    try {
    ensureNonEmpty(uid);
    } catch (e) {
    throw new Error("Unable to get requests when uid is empty");
    }
    if (status) {
        const requestRef = db.collection(COLLECTION_REQUESTS).where("uid", "==", uid).where("status", '==', status);
        const requests: Request[] = [];
        const requestQuerySnapshot = await requestRef.get();
        requestQuerySnapshot.forEach(async requestSnapshot => {
            try {
                const request = await requestConverter.fromFirestore(requestSnapshot);
                requests.push(request);
            } catch (e) {
                return console.error(`Encountered error while retrieving request: ${e.message}`);
            }
        });
        return requests;
    } else {
        const requestRef = db.collection(COLLECTION_REQUESTS).where("uid", "==", uid);
        const requests: Request[] = [];
        const requestQuerySnapshot = await requestRef.get();
        requestQuerySnapshot.forEach(async requestSnapshot => {
            try {
                const request = await requestConverter.fromFirestore(requestSnapshot);
                requests.push(request);
            } catch (e) {
                return console.error(`Encountered error while retrieving request: ${e.message}`);
            }
        });
        return requests;
    }
};

/** 
 * Help function which adds a request to the database.
 * @throws Error if `uid` is empty.
 * @throws Error if given arguments cannot be used to create a valid request.
 */
export const addRequestHelper: ( // NOTE: this should not be imported by FE
    uid: string,
    payerName: string,
    shopLocation: string,
    expectedDeliveryTime: number,
    item: string,
    fee: number,
    doerUid?: string,
    doerName?: string
) => Promise<Request> = async function (
    uid,
    payerName,
    shopLocation,
    expectedDeliveryTime,
    item,
    fee,
    doerUid,
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
            doerUid,
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
export const addRequest: (
    uid: string,
    payerName: string,
    shopLocation: string,
    expectedDeliveryTime: number,
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
    addRequestHelper(uid, payerName, shopLocation, expectedDeliveryTime, item, fee)
);

/**
 * Indicates that doer with the specified user id and name will fulfil the request with the given id.
 * @param id id of the request that is to be fulfilled
 * @param uid user id of doer
 * @param doerName name of doer
 * @throws Error if any of the arguments is empty
 * @throws Error if the request with `id` cannot be found
 */
export const fulfilRequest: (
    id: string,
    uid: string,
    doerName: string
) => Promise<void> = async (
    id,
    uid,
    doerName
) => {
    try {
        ensureNonEmpty(id, uid, doerName);
    } catch (e) {
        throw new Error(`Unable to fulfil request: ${e.message}`);
    }

    const requestRef = db.collection(COLLECTION_REQUESTS).doc(id);
    const requestSnapshot = await requestRef.get();
    const taskId = requestSnapshot.get("taskId");
    
    if (taskId === undefined) {
        throw new Error("Unable to find specified request, or request has missing task");
    }

    addDoerToTask(taskId, uid, doerName);
}

/**
 * Marks request with id `id` as complete. 
 * Note no checks are performed to ensure that the request is not `DONE` or `CANCELLED` before the operation.
 * @throws Error if `id` is empty.
 */
export const markRequestAsDone: (
    id: string
) => Promise<void> = async (
    id
) => {
    try {
        ensureNonEmpty(id);
    } catch (e) {
        throw new Error("Unable to mark request as done when its id is not provided");
    }

    const requestRef = db.collection(COLLECTION_REQUESTS).doc(id);
    const requestSnapshot = await requestRef.get();
    const taskId = requestSnapshot.get("taskId");
    
    if (taskId === undefined) {
        throw new Error("Unable to find specified request, or request has missing task");
    }

    markTaskAsDone(taskId);
}

/**
 * Cancels request with id `id`.
 * Note no checks are performed to ensure that the request is not `DONE`.
 */
export const cancelRequest: (
    id: string
) => Promise<void> = async (
    id
) => {
    try {
        ensureNonEmpty(id);
    } catch (e) {
        throw new Error("Unable to cancel request when its id is not provided");
    }

    const requestRef = db.collection(COLLECTION_REQUESTS).doc(id);
    const requestSnapshot = await requestRef.get();
    const taskId = requestSnapshot.get("taskId");
    
    if (taskId === undefined) {
        throw new Error("Unable to find specified request, or request has missing task");
    }

    cancelTask(id);
}
