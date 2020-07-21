/** Common types */
export type Task = {
	id: string;
	name: string;
	shopLocation: string;
	item: string;
	payerName: string;
	fee: number;
	doerName?: string;
	status: Status;
};

export const enum Status {
	OPEN = "open",
	PENDING = "pending",
	DONE = "done",
	cancelled = "cancelled",
}

export type Offer = {
	id: string;
	title: string;
	name: string;
	description: string;
	shopLocation: string;
	expectedDeliveryTime: string;
	status: Status;
};

export type Req = {
	id: string;
	title: string;
	taskName: string;
	taskId: string;
	name: string;
	task: Task;
};
