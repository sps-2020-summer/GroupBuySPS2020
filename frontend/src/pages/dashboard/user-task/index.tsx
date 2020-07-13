import React, { FC, useState, useEffect } from "react";
import { DashboardCompProps } from "..";
import { List, Card, Spin } from "antd";
import { Task } from "../../../types";
import { Slide } from "react-awesome-reveal";
import TaskItem from "./task-item";

const UserTask: FC<DashboardCompProps> = ({ userUid }) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [tasks, setTasks] = useState<Task[]>([
		{ name: "Task 1" },
		{ name: "Task 1" },
		{ name: "Task 1" },
		{ name: "Task 1" },
	]);

	useEffect(() => {
		const fetchTask = async (userUid: string) => {
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
				<h1>My Task</h1>
				<h3>These are the tasks you are currently doing </h3>
			</Slide>
			<br />
			{loading ? (
				<Spin></Spin>
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
									<TaskItem name={item.name} />
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
