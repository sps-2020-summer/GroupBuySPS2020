import { db } from "../index";
import { Status } from "../types";
import { ensureNonEmpty, ensureNonNegative, isEmptyString } from "./utilities";

const COLLECTION_TASKS: string = "tasks";

export class Task {
    id: string;
    shopLocation: string;
    expectedDeliveryTime: string;
    item: string;
    payerName: string;
    fee: number;
    status: Status;
    uid?: string; // equivalent to doer's id
    doerName?: string;

    /** 
     * @throws Error if `uid` and `doerName` are not both empty, or are not both non-empty. 
     * @throws Error if `id`, `shopLocation`, `shopLocation`, `expectedDeliveryTime`, `item`, `payerName` or `status` are empty.
     * @throws Error if `fee` is not non-negative.
     */
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
        try {
            ensureNonEmpty(id, shopLocation, expectedDeliveryTime, item, payerName, fee, status);
            ensureNonNegative(fee);
        } catch (e) {
            throw new Error(`Unable to create task: e.message`);
        }

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

    /** Checks if a valid doer is present. */
    static isValidDoerPresent = (
        uid: string | undefined,
        doerName: string | undefined
    ) => (
            !isEmptyString(uid) && !isEmptyString(doerName)
        )

    /** 
     * Checks if doer is valid.
     * @returns `true` if `uid` (i.e. doer's id) and `doerName` are both empty, or both non-empty. 
     */
    static isValidDoer = (
        uid: string | undefined,
        doerName: string | undefined
    ) => (
        Task.isValidDoerPresent(uid, doerName)
    ) || (
            isEmptyString(uid) && isEmptyString(doerName)
        );

    /** 
     * Checks if state valid. 
     * @returns `true` if doer information is present but status is OPEN. 
     */
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

const taskConverter = Object.freeze({
    /** 
     * @throws Error if `id`, `shopLocation`, `expectedDeliveryTime`, `item`, `payerName` or `status` are empty.
     * @throws Error if `fee` is not a non-negative number.
     */
    toFirestore: (
        shopLocation: string,
        expectedDeliveryTime: string,
        item: string,
        payerName: string,
        fee: number,
        status: Status,
        uid: string,
        doerName: string
    ) => {
        try {
            ensureNonEmpty(shopLocation, expectedDeliveryTime, item, payerName, fee);
            ensureNonNegative(fee);
        } catch (e) {
            throw new Error(`Unable to convert task to firestore. Reason: ${e.message}`);
        }

        return {
            shopLocation: shopLocation,
            expectedDeliveryTime: expectedDeliveryTime,
            item: item,
            payerName: payerName,
            fee: fee,
            status: Status[status],
            uid: uid,
            doerName: doerName
        }
    },
    /** @throws Error if data associated with `taskSnapshot` cannot be found. */
    fromFirestore: (
        taskSnapshot: firebase.firestore.DocumentSnapshot
    ) => {
        const data = taskSnapshot.data();
        if (data === undefined) {
            throw new Error("Unable to find snapshot for task.");
        }
        // no error should occur here
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
});

/** 
 * Gets all tasks which are associated with `uid`. 
 * @throws Error if `uid` is `null`, `undefined` or `""`.
 */
export const getTasks: (
    uid: string
) => Promise<Task[]> = async (
    uid: string
) => {
        try {
            ensureNonEmpty(uid);
        } catch (e) {
            throw new Error(`Unable to get tasks for user with empty uid.`);
        }

        const tasksRef = db.collection(COLLECTION_TASKS).where("uid", "==", uid);
        const tasks: Task[] = [];
        const tasksQuerySnapshot = await tasksRef.get();
        tasksQuerySnapshot.forEach(taskSnapshot => {
            try {
                const task = taskConverter.fromFirestore(taskSnapshot);
                tasks.push(task);
            } catch (e) {
                return console.error(`Encountered error while retrieving task: ${e.message}`);
            }
        });
        return tasks;
    };

/**
 * Gets task by id.
 * @param id id of task to be retrieved.
 * @throws Error if `id` is not specified/empty.
 * @throws Error if no task with `id` can be found.
 */
export const getTaskById: (
    id: string
) => Promise<Task> = async (
    id: string
) => {
        try {
            ensureNonEmpty(id);
        } catch (e) {
            throw new Error("Unable to get task by id when id is not specified/empty");
        }

        const taskRef = db.collection(COLLECTION_TASKS).doc(id);
        const task = await taskRef.get();
        if (!task.exists) {
            throw new Error(`Unable to find task with id ${id}`);
        }
        return taskConverter.fromFirestore(task);
    }

/** 
 * Adds a new task to the database. If a valid doer is present (i.e. both `uid` and `doerName` are given),
 * task's status will be `PENDING`. If no valid doer is present (i.e. both `uid` and `doerName` are not given),
 * task's status will be `OPEN`.
 * @throws Exception if `uid` is present but `doerName` is absent, or vice versa.
 * @throws Error if `id`, `shopLocation`, `shopLocation`, `expectedDeliveryTime`, `item`, `payerName` or `status` are empty.
 * @throws Error if `fee` is not non-negative.
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
    = async function (
        shopLocation,
        expectedDeliveryTime,
        item,
        payerName,
        fee,
        uid,
        doerName,
    ) {
        try {
            ensureNonEmpty(shopLocation, expectedDeliveryTime, item, payerName, fee);
            ensureNonNegative(fee);
        } catch (e) {
            throw new Error(`Unable to add task: ${e.message}`);
        }


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

        try {
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
        } catch (e) {
            throw new Error(`Unable to add task: ${e.message}`);
        };
    }
