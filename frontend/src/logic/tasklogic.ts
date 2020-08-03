import { db } from "../index"
import { Status } from "../types"
import {
    ensureNonEmpty,
    ensureNonNegative,
    isEmptyString,
    shouldShowExpired,
    sortByReverseOrder,
} from "./utilities"

const COLLECTION_TASKS: string = "tasks"

export class Task {
    id: string
    shopLocation: string
    expectedDeliveryTime: number
    item: string
    payerUid: string
    fee: number
    status: Status
    uid?: string // equivalent to doer's id

    /**
     * @throws Error if `id`, `shopLocation`, `shopLocation`, `expectedDeliveryTime`, `item`, `payerUid` or `status` are empty.
     * @throws Error if `fee` is not non-negative.
     */
    constructor(
        id: string,
        shopLocation: string,
        expectedDeliveryTime: number,
        item: string,
        payerUid: string,
        fee: number,
        status: Status,
        uid?: string
    ) {
        try {
            ensureNonEmpty(
                id,
                shopLocation,
                expectedDeliveryTime,
                item,
                payerUid,
                fee,
                status
            )
            ensureNonNegative(fee)
        } catch (e) {
            throw new Error(`Unable to create task: e.message`)
        }

        this.id = id
        this.shopLocation = shopLocation
        this.expectedDeliveryTime = expectedDeliveryTime
        this.item = item
        this.payerUid = payerUid
        this.fee = fee
        this.status = status

        
        
    if (!Task.isValidState(uid, status)) { 
      throw new Error("Missing doer for task with id " + id);
    }

        this.uid = uid === undefined ? "" : uid
    }

    /** Checks if a valid doer is present. */
    static isValidDoerPresent = (uid: string | undefined) => !isEmptyString(uid)

    /**
     * Checks if state valid.
     * @returns `true` if doer information is present but status is OPEN.
     */
    static isValidState = (uid: string | undefined, status: Status) =>
        (Task.isValidDoerPresent(uid) && (status === Status.PENDING || status === Status.DONE)) ||
        !Task.isValidDoerPresent(uid);
}

const markAsExpired: (id: string) => Promise<void> = async (id) => {
    try {
        ensureNonEmpty(id)
    } catch (e) {
        throw new Error("Unable to mark a task as expired without its id")
    }

    const taskRef = db.collection(COLLECTION_TASKS).doc(id)
    return taskRef.update({ status: Status[Status.EXPIRED] })
}

export const taskConverter = Object.freeze({
    /**
     * @throws Error if `id`, `shopLocation`, `expectedDeliveryTime`, `item`, `payerUid` or `status` are empty.
     * @throws Error if `fee` is not a non-negative number.
     */
    toFirestore: (
        shopLocation: string,
        expectedDeliveryTime: number,
        item: string,
        payerUid: string,
        fee: number,
        status: Status,
        uid: string
    ) => {
        try {
            ensureNonEmpty(
                shopLocation,
                expectedDeliveryTime,
                item,
                payerUid,
                fee
            )
            ensureNonNegative(fee)
        } catch (e) {
            throw new Error(
                `Unable to convert task to firestore. Reason: ${e.message}`
            )
        }

        return {
            shopLocation: shopLocation,
            expectedDeliveryTime: expectedDeliveryTime,
            item: item,
            payerUid: payerUid,
            fee: fee,
            status: Status[status],
            uid: uid,
        }
    },
    /** @throws Error if data associated with `taskSnapshot` cannot be found. */
    fromFirestore: async (taskSnapshot: firebase.firestore.DocumentSnapshot) => {
        const data = taskSnapshot.data()
        if (data === undefined) {
            throw new Error("Unable to find snapshot for task.")
        }
        // no error should occur here
        console.log(data)

        const expectedDeliveryTime: number = data.expectedDeliveryTime
        const status: Status = Status[data.status]
        const newStatus = shouldShowExpired(expectedDeliveryTime, status)
            ? Status.EXPIRED
            : status
        
        if (newStatus !== status) { // i.e. status changed
            await markAsExpired(taskSnapshot.id);
        }

        return new Task(
            taskSnapshot.id,
            data.shopLocation,
            expectedDeliveryTime,
            data.item,
            data.payerUid,
            data.fee,
            newStatus,
            data.uid
        )
    },
})

/**
 * Gets all tasks that are opened.
 * @returns An array of tasks that are sorted by reverse chronological order.
 * @throws Error if `uid` is `null`, `undefined` or `""`.
 */
export const getOpenTasks: (uid: string) => Promise<Task[]> = async (uid) => {
    try {
        ensureNonEmpty(uid)
    } catch (e) {
        throw new Error(`Unable to get tasks for user with empty uid.`)
    }
    const tasksRef = db
        .collection(COLLECTION_TASKS)
        .where("uid", "==", uid)
        .where("status", "==", Status.OPEN)

    const tasksQuerySnapshot = await tasksRef.get()
    const temp: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[] = [];
    tasksQuerySnapshot.forEach(taskSnapshot => temp.push(taskSnapshot));

    const tasks: Task[] = [];
    await Promise.all(temp.map(taskSnapShot => taskConverter.fromFirestore(taskSnapShot)))
        .then(values => {
            values.forEach(value => tasks.push(value))
        })
        .catch(e => console.error(`Encountered error while retrieving task: ${e.message}`));

    return tasks
        .filter((task) => task.status === Status.OPEN)
        .sort((prev, curr) =>
            sortByReverseOrder(
                prev.expectedDeliveryTime,
                curr.expectedDeliveryTime
            )
        )
}

type CurrentTasks = {
    open: Task[]
    pending: Task[]
}
/**
 * Gets all current tasks which are associated with `uid`.
 * Tasks are categorised by `OPEN` and `PENDING`, and sorted by reverse chronological order.
 * @throws Error if `uid` is `null`, `undefined` or `""`.
 */
export const getCurrentTasks: (uid: string) => Promise<CurrentTasks> = async (
    uid
) => {
    try {
        ensureNonEmpty(uid)
    } catch (e) {
        throw new Error(`Unable to get tasks for user with empty uid.`)
    }
    const tasksRef = db
        .collection(COLLECTION_TASKS)
        .where("uid", "==", uid)
        .where("status", "in", [Status.OPEN, Status.PENDING])

    const tasksQuerySnapshot = await tasksRef.get()
    const temp: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[] = [];
    tasksQuerySnapshot.forEach(taskSnapshot => temp.push(taskSnapshot));

    const tasks: Task[] = [];
    await Promise.all(temp.map(taskSnapShot => taskConverter.fromFirestore(taskSnapShot)))
        .then(values => {
            values.forEach(value => tasks.push(value))
        })
        .catch(e => console.error(`Encountered error while retrieving task: ${e.message}`));

    const currentTasks: CurrentTasks = {
        open: [],
        pending: [],
    }

    tasks
        .sort((prev, curr) =>
            sortByReverseOrder(
                prev.expectedDeliveryTime,
                curr.expectedDeliveryTime
            )
        )
        .forEach((task) => {
            const status = task.status
            if (status === Status.PENDING) {
                currentTasks.pending.push(task)
            } else if (status === Status.OPEN) {
                currentTasks.open.push(task)
            } else {
                // ignore
            }
        })

    return currentTasks
}

/**
 * Gets all past tasks which are associated with `uid`.
 * @throws Error if `uid` is `null`, `undefined` or `""`.
 */
export const getPastTasks: (uid: string) => Promise<Task[]> = async (
    uid
) => {
    try {
        ensureNonEmpty(uid)
    } catch (e) {
        throw new Error(`Unable to get tasks for user with empty uid.`)
    }
    const tasksRef = db
        .collection(COLLECTION_TASKS)
        .where("uid", "==", uid)
        .where("status", "in", [
            Status.OPEN,
            Status.CANCELLED,
            Status.DONE,
            Status.EXPIRED,
        ])

    const tasksQuerySnapshot = await tasksRef.get()
    const temp: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[] = [];
    tasksQuerySnapshot.forEach(taskSnapshot => temp.push(taskSnapshot));

    const tasks: Task[] = [];
    await Promise.all(temp.map(taskSnapShot => taskConverter.fromFirestore(taskSnapShot)))
        .then(values => {
            values.forEach(value => tasks.push(value))
        })
        .catch(e => console.error(`Encountered error while retrieving task: ${e.message}`));

    tasks
        .filter(task => {
            const status = task.status;
            return status === Status.CANCELLED || status === Status.DONE || status === Status.EXPIRED;
        })
        .sort((prev, curr) =>
            sortByReverseOrder(
                prev.expectedDeliveryTime,
                curr.expectedDeliveryTime
            )
        )

    return tasks
}

/**
 * Gets task by id.
 * @param id id of task to be retrieved.
 * @throws Error if `id` is not specified/empty.
 * @throws Error if no task with `id` can be found.
 */
export const getTaskById: (id: string) => Promise<Task> = async (
    id: string
) => {
    try {
        ensureNonEmpty(id)
    } catch (e) {
        throw new Error(
            "Unable to get task by id when id is not specified/empty"
        )
    }

    const taskRef = db.collection(COLLECTION_TASKS).doc(id)
    const task = await taskRef.get()
    if (!task.exists) {
        throw new Error(`Unable to find task with id ${id}`)
    }
    return taskConverter.fromFirestore(task)
}

/**
 * Adds a new task to the database. If a valid doer is present (i.e. both `uid` is given),
 * task's status will be `PENDING`. If no valid doer is present (i.e. both `uid` is not given),
 * task's status will be `OPEN`.
 * @throws Error if `id`, `shopLocation`, `shopLocation`, `expectedDeliveryTime`, `item`, `payerUid` or `status` are empty.
 * @throws Error if `fee` is not non-negative.
 */
export const addTask: (
    shopLocation: string,
    expectedDeliveryTime: number,
    item: string,
    payerUid: string,
    fee: number,
    uid?: any // doer's id
) => Promise<Task> = async function (
    shopLocation,
    expectedDeliveryTime,
    item,
    payerUid,
    fee,
    uid
) {
    try {
        ensureNonEmpty(shopLocation, expectedDeliveryTime, item, payerUid, fee)
        ensureNonNegative(fee)
    } catch (e) {
        throw new Error(`Unable to add task: ${e.message}`)
    }

    let status
    if (Task.isValidDoerPresent(uid)) {
        status = Status.PENDING
    } else {
        status = Status.OPEN
        uid = ""
    }

    try {
        const taskRef = await db
            .collection(COLLECTION_TASKS)
            .add(
                taskConverter.toFirestore(
                    shopLocation,
                    expectedDeliveryTime,
                    item,
                    payerUid,
                    fee,
                    Status[status],
                    uid
                )
            )
        return new Task(
            taskRef.id,
            shopLocation,
            expectedDeliveryTime,
            item,
            payerUid,
            fee,
            status,
            uid
        )
    } catch (e) {
        throw new Error(`Unable to add task: ${e.message}`)
    }
}

/**
 * Cancels the task which has the specified id.
 * Note: No checks are made to ensure that the task's status is not 'DONE'. If it is 'DONE', then cancelling it
 * results in a bug.
 * @param id id of the task that is to be closed.
 * @throws Error if no `id` is provided.
 */
export const cancelTask: (id: string) => Promise<void> = async (id) => {
    try {
        ensureNonEmpty(id)
    } catch (e) {
        throw new Error("Unable to cancel task without its id")
    }

    const taskRef = db.collection(COLLECTION_TASKS).doc(id)
    return taskRef.update({ status: Status[Status.CANCELLED] })
}

/** NOTE: the following methods should not be called from FE */

/**
 * Adds doer to task.
 * Note that no checks are performed to ensure that the task does not have an existing doer.
 * @throws Error if any argument is empty
 */
export const addDoerToTask: (id: string, doerId: string) => Promise<void> = (
    id,
    doerId
) => {
    try {
        ensureNonEmpty(doerId, id)
    } catch (e) {
        throw new Error("Unable to add doer to task when arguments are missing")
    }

    const taskRef = db.collection(COLLECTION_TASKS).doc(id)
    return taskRef.update({
        uid: doerId,
        status: Status[Status.PENDING],
    })
}

/**
 * Marks the specified task as done.
 * Note that no check is performed to ensure that this operation is valid.
 */
export const markTaskAsDone: (id: string) => Promise<void> = (id) => {
    try {
        ensureNonEmpty(id)
    } catch (e) {
        throw new Error("Unable to mark task as done when no id is provided")
    }

    const taskRef = db.collection(COLLECTION_TASKS).doc(id)
    return taskRef.update({ status: Status[Status.DONE] })
}
