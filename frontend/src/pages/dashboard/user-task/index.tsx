import React, { FC, useState, useEffect, useCallback } from "react";
import { DashboardCompProps } from "..";
import { List } from "antd";
import { Task } from  "../../../logic/tasklogic";
import { Slide } from "react-awesome-reveal";
import TaskItem from "./task-item";
import Loader from "../../../components/loader";

import { FirebaseContext } from "../../../context/firebase-context";
import firebase from "firebase";
import { getOffers } from "../../../logic/offerlogic";
import { getTasks } from "../../../logic/tasklogic";

const UserTask: FC<DashboardCompProps> = ({ userUid }) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [tasks, setTasks] = useState<Task[]>([]);
	const fetchTask = useCallback(async () => {
		try {
			setLoading(true);
			const res = await getTasks(userUid);
			console.log(res);
			setTasks(res);
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchTask();
	}, []);

	return (
		<>
			<Slide triggerOnce direction={"bottom"}>
				<h1>My Task</h1>
				<h3>These are the tasks you are currently doing </h3>
			</Slide>
			<br />
			{loading ? (
				<Loader spin={loading} topMargin={"24px"} />
			) : (
					<>
						{tasks.length === 0 ? (
							<>You currently have no tasks!</>
						) : (
								<List
									grid={{
										gutter: 16,
										xs: 1,
										sm: 2,
										md: 4,
										lg: 4,
										xl: 4,
										xxl: 3,
									}}
									dataSource={tasks}
									renderItem={(item) => (
										<List.Item>
											<TaskItem fetch={fetchTask} task={item} />
										</List.Item>
									)}
								/>
							)}
					</>
				)}
		</>
	);
};

export default UserTask;
