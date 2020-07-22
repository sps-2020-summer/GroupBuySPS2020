import { Status } from "../types";
import { COLLECTION_USERS } from "./userlogic";
import { db, ensureNonNull, ensureNonNegative } from "./utilities";

const COLLECTION_TASKS: string = "tasks";

class Task {
    id: string;
    shopLocation: string;
    expectedDeliveryTime: string;
    item: string;
    payerName: string;
    fee: number;
    doerName?: string;
    status: Status;

    constructor(id: string, shopLocation: string, expectedDeliveryTime: string, item: string, payerName: string, fee: number,
        status: Status, doerName?: string) {
            ensureNonNull(id, expectedDeliveryTime, item, payerName, fee, status);
            ensureNonNegative(fee);
            this.id = id;
            this.shopLocation = shopLocation;
            this.expectedDeliveryTime = expectedDeliveryTime;
            this.item = item;
            this.payerName = payerName;
            this.fee = fee;
            this.status = status;

            if ((doerName === null || doerName === "") && status !== Status.OPEN) {
                throw new Error("Missing doer for task with id " + id);
            }
            this.id = id;
        }
}

const taskConverter = {
    toFirestore: (shopLocation: string, expectedDeliveryTime: string, item: string, payerName: string, fee: number,
        status: Status, doerName?: string) => ({
            shopLocation: shopLocation,
            expectedDeliveryTime: expectedDeliveryTime,
            item: item,
            payerName: payerName,
            fee: fee,
            status: Status[status],
            doerName: doerName === null ? "" : doerName
    }),
    fromFirestore: (taskSnapshot: firebase.firestore.QueryDocumentSnapshot) => {
        const data = taskSnapshot.data();
        if (data === undefined) {
            throw new Error("Unable to find snapshot for task.");
        } else {
            return new Task(taskSnapshot.id, data.shopLocation, data.expectedDeliveryTime, data.item, data.payerName, 
                data.fee, Status[data.status], data.doerName);
        }
    }
}

export const getTasks: (uid: string) => Promise<void | Task[]> = (uid: string) => {
    const tasksRef = db.collection(COLLECTION_USERS).doc(uid).collection(COLLECTION_TASKS);
    const tasks: Task[] = [];
    return tasksRef.get()
        .then(tasksQuerySnapshot => {
            tasksQuerySnapshot.forEach(taskSnapshot => {
                try {
                    const task = taskConverter.fromFirestore(taskSnapshot);
                    tasks.push(task);
                } catch (e) {
                    e => console.error("Encountered error while retrieving task: " + e.message);
                }
            });
        })
};

export const addTask: (uid: string, shopLocation: string, expectedDeliveryTime: string, item: string, payerName: string, fee: number,
    givenStatus?: Status) => Promise<void | Task> 
    = function(uid, shopLocation, expectedDeliveryTime, item, payerName, fee, givenStatus) {
        const status = givenStatus === undefined ? Status.OPEN : givenStatus;
        ensureNonNull(uid, shopLocation, expectedDeliveryTime, status, item, payerName, fee);
        ensureNonNegative(fee);

        return db.collection(COLLECTION_USERS).doc(uid).collection(COLLECTION_TASKS)
            .add(taskConverter.toFirestore(shopLocation, expectedDeliveryTime, item, payerName, fee, Status[status]))
            .then(taskRef => new Task(taskRef.id, shopLocation, expectedDeliveryTime, item, payerName, fee, status))
    }
