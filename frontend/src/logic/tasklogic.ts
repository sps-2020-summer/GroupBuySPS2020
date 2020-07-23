import { db } from "../index";
import { Status } from "../types";
import { ensureNonNull, ensureNonNegative } from "./utilities";

const COLLECTION_TASKS: string = "tasks";

class Task {
    uid: string;
    id: string;
    shopLocation: string;
    expectedDeliveryTime: string;
    item: string;
    payerName: string;
    fee: number;
    doerName?: string;
    status: Status;

    constructor(
        uid: string,
        id: string, 
        shopLocation: string, 
        expectedDeliveryTime: string, 
        item: string, 
        payerName: string, 
        fee: number,
        status: Status, 
        doerName?: string
    ) {
        ensureNonNull(uid, id, expectedDeliveryTime, item, payerName, fee, status);
        ensureNonNegative(fee);
        this.uid = uid;
        this.id = id;
        this.shopLocation = shopLocation;
        this.expectedDeliveryTime = expectedDeliveryTime;
        this.item = item;
        this.payerName = payerName;
        this.fee = fee;
        this.status = status;

        if ((doerName === null || doerName === "" || doerName === undefined) && status !== Status.OPEN) {
            throw new Error("Missing doer for task with id " + id);
        }
        this.id = id;
    }
}

const taskConverter = {
    toFirestore: (
        uid: string,
        shopLocation: string, 
        expectedDeliveryTime: string, 
        item: string, 
        payerName: string, 
        fee: number,
        status: Status, 
        doerName?: string
    ) => ({
        uid: uid,
        shopLocation: shopLocation,
        expectedDeliveryTime: expectedDeliveryTime,
        item: item,
        payerName: payerName,
        fee: fee,
        status: Status[status],
        doerName: (doerName === null || doerName === undefined) ? "" : doerName
    }),
    fromFirestore: (
        taskSnapshot: firebase.firestore.QueryDocumentSnapshot
    ) => {
        const data = taskSnapshot.data();
        if (data === undefined) {
            throw new Error("Unable to find snapshot for task.");
        } else {
            return new Task(
                data.uid, 
                taskSnapshot.id, 
                data.shopLocation, 
                data.expectedDeliveryTime, 
                data.item, 
                data.payerName, 
                data.fee, 
                Status[data.status], 
                data.doerName
            );
        }
    }
}

export const getTasks: (
    uid: string
) => Promise<Task[]> = async (
    uid: string
) => {
    const tasksRef = db.collection(COLLECTION_TASKS).where("uid", "==", uid);;
    const tasks: Task[] = [];
    const tasksQuerySnapshot = await tasksRef.get();
    tasksQuerySnapshot.forEach(taskSnapshot => {
        try {
            const task = taskConverter.fromFirestore(taskSnapshot);
            tasks.push(task);
        } catch (e) {
            e => console.error("Encountered error while retrieving task: " + e.message);
        }
    });
    return tasks;
};

export const addTask: (
    uid: string, 
    shopLocation: string, 
    expectedDeliveryTime: string, 
    item: string, 
    payerName: string, 
    fee: number,
    givenStatus?: Status
) => Promise<Task> 
= async function(
    uid, 
    shopLocation, 
    expectedDeliveryTime, 
    item, 
    payerName, 
    fee, 
    givenStatus
) {
    const status = givenStatus === undefined ? Status.OPEN : givenStatus;
    ensureNonNull(uid, shopLocation, expectedDeliveryTime, status, item, payerName, fee);
    ensureNonNegative(fee);

    const taskRef = await db.collection(COLLECTION_TASKS)
        .add(
            taskConverter.toFirestore(
                uid,
                shopLocation, 
                expectedDeliveryTime, 
                item, 
                payerName, 
                fee, 
                Status[status]
            )
        );

    return new Task(
        uid, 
        taskRef.id, 
        shopLocation, 
        expectedDeliveryTime, 
        item, 
        payerName, 
        fee, 
        status
    );
}
