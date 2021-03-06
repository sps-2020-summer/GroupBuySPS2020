/** Common types */
export type Task = {
	id: string;
	name?: string;
	shopLocation: string;
	item: string;
	payerName: string;
	fee: number;
	doerName?: string;
	status: Status;
};

export enum Status {
	OPEN = "OPEN",
	PENDING = "PENDING",
	DONE = "DONE",
	CANCELLED = "CANCELLED",
	EXPIRED = "EXPIRED"
}

export type Offer = {
	uid: string;
	id: string;
	title?: string;
	name?: string;
	description?: string;
	shopLocation: string;
	expectedDeliveryTime: string;
	status: Status;
};

export type Request = {
	id: string;
	title?: string;
	taskName?: string;
	taskId?: string;
	name?: string;
	task: Task;
};
