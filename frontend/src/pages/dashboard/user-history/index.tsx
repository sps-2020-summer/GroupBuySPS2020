import React, { FC, useState, useEffect } from "react";
import { DashboardCompProps } from "..";
import { Req, Task } from "../../../types";
import { Slide } from "react-awesome-reveal";
import { Spin } from "antd";

const UserHistory: FC<DashboardCompProps> = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [tasks, setTasks] = useState<Task[]>([
		{ name: "Task 1" },
		{ name: "Task 1" },
		{ name: "Task 1" },
		{ name: "Task 1" },
	]);
	const [requests, setRequests] = useState<Req[]>([
		{ name: "req 1" },
		{ name: "req 1" },
		{ name: "req 1" },
		{ name: "req 1" },
	]);

	useEffect(() => {
		const fetchUserHistory = async (userUid: string) => {
			try {
				setLoading(true);
			} catch (e) {
				console.log(e);
			} finally {
				setLoading(false);
			}
		};

		const timer = setTimeout(() => setLoading(false), 2000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			<Slide triggerOnce direction={"bottom"}>
				<h1>History</h1>
				<h3>
					These are the requests and offer you have created /
					completed{" "}
				</h3>
			</Slide>
			{loading ? <Spin /> : <></>}
			<br />
		</>
	);
};

export default UserHistory;
