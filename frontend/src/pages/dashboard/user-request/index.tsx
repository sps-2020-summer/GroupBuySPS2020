import React, { FC, useState, useEffect } from "react";
import { DashboardCompProps } from "..";
import { Req } from "../../../types";
import { Slide } from "react-awesome-reveal";
import { Spin, Card, List } from "antd";
import RequestItem from "./request-item";

const UserRequest: FC<DashboardCompProps> = ({ userUid }) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [requests, setRequests] = useState<Req[]>([
		{ name: "req 1" },
		{ name: "req 1" },
		{ name: "req 1" },
		{ name: "req 1" },
	]);

	useEffect(() => {
		const fetchRequest = async (userUid: string) => {
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
				<h1>My Requests</h1>
				<h3>These are the current request you have opened </h3>
			</Slide>
			<br />
			{loading ? (
				<Spin></Spin>
			) : (
				<>
					{requests.length === 0 ? (
						<>You currently have no requests opened!</>
					) : (
						<></>
					)}
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
						dataSource={requests}
						renderItem={(item) => (
							<List.Item>
								<Card title={item.name}>
									<RequestItem name={item.name} />
								</Card>
							</List.Item>
						)}
					/>
				</>
			)}
		</>
	);
};

export default UserRequest;
