import { db } from '../index'
import { ensureNonEmpty, sortByReverseOrder } from './utilities'
import {
    Task,
    getTaskById,
    addTask,
    addDoerToTask,
    markTaskAsDone,
    cancelTask,
} from './tasklogic'
import { Status } from '../types'

const COLLECTION_REQUESTS = 'requests'

export class Request {
    uid: string
    id: string
    task: Task

    /** @throws Error if `uid`, `id` or `task` is empty. */
    constructor(uid: string, id: string, task: Task) {
        try {
            ensureNonEmpty(uid, id, task)
        } catch (e) {
            throw new Error(`Unable to create request: ${e.message}`)
        }
        this.uid = uid
        this.id = id
        this.task = task
    }
}

const requestConverter = Object.freeze({
    /**
     * Assumes that `task` is valid (i.e. exists in db).
     * @throws Error if `uid` or `task` is invalid/empty.
     */
    toFirestore: (uid: string, task: Task) => {
        try {
            ensureNonEmpty(uid, task)
        } catch (e) {
            throw new Error(
                'Unable to convert request to firestore because uid/task is empty'
            )
        }

        return {
            uid: uid,
            taskId: task.id,
        }
    },
    fromFirestore: async (
        requestSnapshot: firebase.firestore.DocumentSnapshot
    ) => {
        const data = requestSnapshot.data()
        if (data === undefined) {
            throw new Error('Unable to find snapshot for request.')
        }

        const task = await getTaskById(data.taskId)
        return new Request(data.uid, requestSnapshot.id, task)
    },
})

/**
 * Gets open requests.
 */
export const getOpenRequests: () => Promise<Request[]> = async () => {
    const requestRef = await db.collection(COLLECTION_REQUESTS).get()
    const temp: firebase.firestore.QueryDocumentSnapshot<
        firebase.firestore.DocumentData
    >[] = []
    requestRef.forEach((requestSnapshot) => {
        temp.push(requestSnapshot)
    })

    const requests: Request[] = []
    await Promise.all(
        temp.map(async (requestSnapshot) => {
            try {
                const request = await requestConverter.fromFirestore(
                    requestSnapshot
                )
                requests.push(request)
            } catch (e) {
                return console.error(
                    `Encountered error while retrieving open requests: ${e.message}`
                )
            }
        })
    )
    return requests
        .filter(value => value.task.status === 'OPEN')
        .sort((prev, curr) =>
            sortByReverseOrder(
                prev.task.expectedDeliveryTime,
                curr.task.expectedDeliveryTime
            )
        )
}

type CurrentRequests = {
    open: Request[]
    pending: Request[]
}
/**
 * Gets all current requests that are associated with `uid`.
 * The requests are categorised by `OPEN` and `PENDING`.
 * @throws Error if `uid` is empty.
 */
export const getCurrentRequests: (
    uid: string
) => Promise<CurrentRequests> = async (uid: string) => {
    try {
        ensureNonEmpty(uid)
    } catch (e) {
        throw new Error('Unable to get requests when uid is empty')
    }

    const requestRef = db
        .collection(COLLECTION_REQUESTS)
        .where('uid', '==', uid)
        
    const requestQuerySnapshot = await requestRef.get()

    const requests: firebase.firestore.QueryDocumentSnapshot<
        firebase.firestore.DocumentData
    >[] = []
    requestQuerySnapshot.forEach((requestSnapshot) => {
        requests.push(requestSnapshot)
    })

    const results: Request[] = []
    await Promise.all(
        requests.map(async (requestSnapshot) => {
            try {
                const request = await requestConverter.fromFirestore(
                    requestSnapshot
                )
                results.push(request)
            } catch (e) {
                return console.error(
                    `Encountered error while retrieving request: ${e.message}`
                )
            }
        })
    )

    const categorisedResults: CurrentRequests = {
        open: [],
        pending: [],
    }

    results
        .sort((prev, curr) =>
            sortByReverseOrder(
                prev.task.expectedDeliveryTime,
                curr.task.expectedDeliveryTime
            )
        )
        .forEach((request) => {
            const status: Status = request.task.status

            if (status === Status.OPEN) {
                categorisedResults.open.push(request)
            } else if (status === Status.PENDING) {
                categorisedResults.pending.push(request)
            } else {
                // ignore
            }
        })
    console.log(categorisedResults)
    return categorisedResults
}

/**
 * Gets all past requests that are associated with `uid`.
 * @throws Error if `uid` is empty.
 */
export const getPastRequests: (
    // shouldn't be called from FE
    uid: string
) => Promise<Request[]> = async (uid: string) => {
    try {
        ensureNonEmpty(uid)
    } catch (e) {
        throw new Error('Unable to get requests when uid is empty')
    }

    const requestRef = db
        .collection(COLLECTION_REQUESTS)
        .where('uid', '==', uid);
    const requestQuerySnapshot = await requestRef.get()

    const requests: firebase.firestore.QueryDocumentSnapshot<
        firebase.firestore.DocumentData
    >[] = []
    requestQuerySnapshot.forEach((requestSnapshot) => {
        requests.push(requestSnapshot)
    })

    const results: Request[] = []
    await Promise.all(
        requests.map(async (requestSnapshot) => {
            try {
                const request = await requestConverter.fromFirestore(
                    requestSnapshot
                )
                results.push(request)
            } catch (e) {
                return console.error(
                    `Encountered error while retrieving request: ${e.message}`
                )
            }
        })
    )

    results.filter(request => {
            const status: Status = request.task.status;
            return status === Status.CANCELLED || status === Status.DONE || status === Status.EXPIRED;
        })
        .sort((prev, curr) =>
            sortByReverseOrder(
                prev.task.expectedDeliveryTime,
                curr.task.expectedDeliveryTime
        ));

    return results;
}

/**
 * Help function which adds a request to the database.
 * @throws Error if `uid` is empty.
 * @throws Error if given arguments cannot be used to create a valid request.
 */
export const addRequestHelper: (
    // NOTE: this should not be imported by FE
    uid: string,
    shopLocation: string,
    expectedDeliveryTime: number,
    item: string,
    fee: number,
    doerUid?: string
) => Promise<Request> = async function (
    uid,
    shopLocation,
    expectedDeliveryTime,
    item,
    fee,
    doerUid
) {
    try {
        ensureNonEmpty(uid)
    } catch (e) {
        throw new Error('Unable to add request when user id is not specified')
    }

    try {
        const task = await addTask(
            shopLocation,
            expectedDeliveryTime,
            item,
            uid,
            fee,
            doerUid
        )

        const requestRef = await db
            .collection(COLLECTION_REQUESTS)
            .add(requestConverter.toFirestore(uid, task))

        return new Request(uid, requestRef.id, task)
    } catch (e) {
        throw new Error(`Unable to add request: ${e.message}`)
    }
}

/**
 * Adds a regular request to database.
 * @throws Error if any argument is empty.
 */
export const addRequest: (
    uid: string,
    shopLocation: string,
    expectedDeliveryTime: number,
    item: string,
    fee: number
) => Promise<Request> = async (
    uid,
    shopLocation,
    expectedDeliveryTime,
    item,
    fee
) => addRequestHelper(uid, shopLocation, expectedDeliveryTime, item, fee)

/**
 * Indicates that doer with the specified user id will fulfil the request with the given id.
 * @param id id of the request that is to be fulfilled
 * @param uid user id of doer
 * @throws Error if any of the arguments is empty
 * @throws Error if the request with `id` cannot be found
 */
export const fulfilRequest: (id: string, uid: string) => Promise<void> = async (
    id,
    uid
) => {
    try {
        ensureNonEmpty(id, uid)
    } catch (e) {
        throw new Error(`Unable to fulfil request: ${e.message}`)
    }

    const requestRef = db.collection(COLLECTION_REQUESTS).doc(id)
    const requestSnapshot = await requestRef.get()
    const taskId = requestSnapshot.get('taskId')

    if (taskId === undefined) {
        throw new Error(
            'Unable to find specified request, or request has missing task'
        )
    }

    addDoerToTask(taskId, uid)
}

/**
 * Marks request with id `id` as complete.
 * Note no checks are performed to ensure that the request is not `DONE` or `CANCELLED` before the operation.
 * @throws Error if `id` is empty.
 */
export const markRequestAsDone: (id: string) => Promise<void> = async (id) => {
    try {
        ensureNonEmpty(id)
    } catch (e) {
        throw new Error(
            'Unable to mark request as done when its id is not provided'
        )
    }

    const requestRef = db.collection(COLLECTION_REQUESTS).doc(id)
    const requestSnapshot = await requestRef.get()
    const taskId = requestSnapshot.get('taskId')

    if (taskId === undefined) {
        throw new Error(
            'Unable to find specified request, or request has missing task'
        )
    }

    markTaskAsDone(taskId)
}

/**
 * Cancels request with id `id`.
 * Note no checks are performed to ensure that the request is not `DONE`.
 */
export const cancelRequest: (id: string) => Promise<void> = async (id) => {
    try {
        ensureNonEmpty(id)
    } catch (e) {
        throw new Error('Unable to cancel request when its id is not provided')
    }

    const requestRef = db.collection(COLLECTION_REQUESTS).doc(id)
    const requestSnapshot = await requestRef.get()
    const taskId = requestSnapshot.get('taskId')

    if (taskId === undefined) {
        throw new Error(
            'Unable to find specified request, or request has missing task'
        )
    }

    cancelTask(id)
}
