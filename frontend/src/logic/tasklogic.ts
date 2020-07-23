import { db } from "../index";
import { Status } from "../types";
import { ensureNonEmpty, ensureNonNegative, isEmptyString } from "./utilities";

const COLLECTION_TASKS: string = "tasks";

class Task {
    id: string;
    shopLocation: string;
    expectedDeliveryTime: string;
    item: string;
    payerName: string;
    fee: number;
    status: Status;
    uid?: string; // equivalent to doer's id
    doerName?: string;

    constructor(
        id: string, 
        shopLocation: string, 
        expectedDeliveryTime: string, 
        item: string, 
        payerName: string, 
        fee: number,
        status: Status, 
        uid?: string,
        doerName?: string
    ) {
        ensureNonEmpty(id, expectedDeliveryTime, item, payerName, fee, status);
        ensureNonNegative(fee);
        this.id = id;
        this.shopLocation = shopLocation;
        this.expectedDeliveryTime = expectedDeliveryTime;
        this.item = item;
        this.payerName = payerName;
        this.fee = fee;
        this.status = status;

        if (Task.isValidDoer(uid, doerName)) {
            throw new Error("Either task has doer (an owner of task) but no doer's id (i.e. uid) is missing, or" 
                + " task has doer's id but no doer.");
        }
 
        if (!Task.isValidState(uid, doerName, status)) {
            throw new Error("Missing doer for task with id " + id);
        }

        this.uid = uid === undefined ? "" : uid;
        this.doerName = doerName === undefined ? "" : doerName;
    }

    static isValidDoerPresent = (
        uid: string | undefined,
        doerName: string | undefined
    ) => (
        !isEmptyString(uid) && !isEmptyString(doerName)
    )

    // doer is only valid when task has a uid (i.e. doer's id) and doer's name
    static isValidDoer = (
        uid: string | undefined, 
        doerName: string | undefined
    ) => (
       Task.isValidDoerPresent(uid, doerName)
    ) || (
        isEmptyString(uid) && isEmptyString(doerName)
    );

    // state is invalid if doer information is present but status is OPEN
    static isValidState = (
        uid: string | undefined,
        doerName: string | undefined,
        status: Status
    ) => (
        (Task.isValidDoerPresent(uid, doerName) && status !== Status.OPEN)
        || 
        (isEmptyString(uid) && isEmptyString(doerName) && status === Status.OPEN)
    );
}

const taskConverter = {
    toFirestore: (
        shopLocation: string, 
        expectedDeliveryTime: string, 
        item: string, 
        payerName: string, 
        fee: number,
        status: Status, 
        uid: string,
        doerName: string
    ) => ({
        shopLocation: shopLocation,
        expectedDeliveryTime: expectedDeliveryTime,
        item: item,
        payerName: payerName,
        fee: fee,
        status: Status[status],
        uid: uid,
        doerName: doerName
    }),
    fromFirestore: (
        taskSnapshot: firebase.firestore.QueryDocumentSnapshot
    ) => {
        const data = taskSnapshot.data();
        if (data === undefined) {
            throw new Error("Unable to find snapshot for task.");
        } else {
            return new Task(
                taskSnapshot.id, 
                data.shopLocation, 
                data.expectedDeliveryTime, 
                data.item, 
                data.payerName, 
                data.fee, 
                Status[data.status], 
                data.uid, 
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

/** 
 * Adds a new task to the database. If a valid doer is present (i.e. both `uid` and `doerName` are given),
 * task's status will be `PENDING`. If no valid doer is present (i.e. both `uid` and `doerName` are not given),
 * task's status will be `OPEN`.
 * @throws Exception if `uid` is present but `doerName` is absent, or vice versa.
 */
export const addTask: ( 
    shopLocation: string, 
    expectedDeliveryTime: string, 
    item: string, 
    payerName: string, 
    fee: number,
    uid?: any,
    doerName?: any,
) => Promise<Task> 
= async function(
    shopLocation, 
    expectedDeliveryTime, 
    item, 
    payerName, 
    fee, 
    uid, 
    doerName,
) {
    ensureNonEmpty(shopLocation, expectedDeliveryTime, item, payerName, fee);
    ensureNonNegative(fee);
    
    if (!Task.isValidDoer(uid, doerName)) {
        throw new Error("Unable to add task. Either task has doer (an owner of task) " 
                + "but no doer's id (i.e. uid) is missing, or task has doer's id but no doer.");
    };

    let status;
    if (Task.isValidDoerPresent(uid, doerName)) {
        status = Status.PENDING;
    } else {
        status = Status.OPEN;
        uid = "";
        doerName = "";
    }

    const taskRef = await db.collection(COLLECTION_TASKS)
        .add(
            taskConverter.toFirestore(
                shopLocation, 
                expectedDeliveryTime, 
                item, 
                payerName, 
                fee, 
                Status[status],
                uid,
                doerName
            )
        );

    return new Task(
        taskRef.id, 
        shopLocation, 
        expectedDeliveryTime, 
        item, 
        payerName, 
        fee, 
        status,
        uid,
        doerName
    );
}
