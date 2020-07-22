import React, { FC, useState, useEffect, useContext } from "react";
import { DashboardCompProps } from "..";
import { List } from "antd";
import { Task } from "../../../types";
import { Slide } from "react-awesome-reveal";
import TaskItem from "./task-item";
import Loader from "../../../components/loader";

import { getOffers } from "../../../logic/offerlogic";
import { FirebaseContext } from "../../../context/firebase-context";
import firebase from "firebase";

const UserTask: FC<DashboardCompProps> = ({ userUid }) => {
	const firebaseContext = useContext(FirebaseContext);
	const { firebaseApp } = firebaseContext;
	const db = firebase.firestore(firebaseApp as firebase.app.App);
	const [loading, setLoading] = useState<boolean>(true);
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		const fetchTask = async (userUid: string) => {
			try {
				setLoading(true);
				console.log(userUid);
				const res = await getOffers(userUid, db);
				console.log(res);
			} catch (e) {
				console.log(e);
			} finally {
				setLoading(false);
			}
		};
		fetchTask(userUid);
	}, [userUid]);

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
