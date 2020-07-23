import { db } from "../index";
import { ensureNonEmpty } from "./utilities";
import { Task, getTaskById, addTask } from "./tasklogic";

const COLLECTION_REQUESTS = "requests";

class Request {
    uid: string;
    id: string;
    task: Task;

    constructor(
        uid: string,
        id: string,
        task: Task
    ) {
        ensureNonEmpty(uid, id, task);
        this.uid = uid;
        this.id = id;
        this.task = task;
    }
}

const requestConverter = Object.freeze({
	toFirestore: (
        uid: string,
        task: Task
	) => ({
		uid: uid,
        taskId: task.id
	}),
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

export const getRequests: (
    uid: string
) => Promise<Request[]> = async (
    uid: string
) => {
    ensureNonEmpty(uid);
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

export const addRequest: (
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
    ensureNonEmpty(uid);
    // TODO: handle exceptions
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
};
