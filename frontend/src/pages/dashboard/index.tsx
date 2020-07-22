import React, { FC, useContext, useState } from "react";
import { Layout, Menu, Avatar } from "antd";
import {
	DesktopOutlined,
	PieChartOutlined,
	LogoutOutlined,
	ShoppingCartOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router";
import { AuthContext } from "../../context/auth";
import UserHistory from "./user-history";
import UserTask from "./user-task";
import UserRequest from "./user-request";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "../../components/loader";

const { Sider, Content } = Layout;

type dashboardOptions = "tasks" | "history" | "requests";

export type DashboardCompProps = {
	userUid: string;
};

const Dashboard: FC<{}> = () => {
	const history = useHistory();
	const value = useContext(AuthContext);
	const { firebase } = value;
	const navToHome = () => history.push("/");
	const [user] = useAuthState(firebase.auth());

	const [current, setCurrent] = useState<dashboardOptions>("tasks");
	console.log(user);
	const userUid = user?.uid;
	if (userUid === undefined) {
		return <Loader spin={true} />;
	}
	/** The pages to show on menu click */
	const childPages = {
		tasks: <UserTask userUid={userUid} />,
		requests: <UserRequest userUid={userUid} />,
		history: <UserHistory userUid={userUid} />,
	};

	const handleClick = (e: dashboardOptions) => setCurrent(e);

	const handleSignOut = async () => {
		await firebase.auth().signOut();
		navToHome();
	};

	/*
  if (user?.photoURL === null) {
    return <>user is null</>;
  }*/

	return (
		<>
			<Sider width={"25vw"}>
				<div
					style={{
						paddingLeft: "24px",
						marginTop: "8px",
						marginBottom: "8px",
						color: "white",
					}}
				>
					<Avatar src={user?.photoURL ?? "Hello Guest user"}></Avatar>
					<br />
					<p>{user?.email ?? "Guest User"}</p>
				</div>
				<Menu
					theme={"dark"}
					defaultSelectedKeys={["tasks"]}
					mode="inline"
				>
					<Menu.Item
						key="tasks"
						onClick={() => handleClick("tasks")}
						icon={<PieChartOutlined />}
					>
						My Tasks
					</Menu.Item>
					<Menu.Item
						key="requests"
						onClick={() => handleClick("requests")}
						icon={<DesktopOutlined />}
					>
						My Request
					</Menu.Item>
					<Menu.Item
						key="history"
						onClick={() => handleClick("history")}
						icon={<DesktopOutlined />}
					>
						History
					</Menu.Item>

					<Menu.Item
						key={"marketplace"}
						icon={<ShoppingCartOutlined />}
						onClick={navToHome}
					>
						Marketplace
					</Menu.Item>

					<Menu.Item
						icon={<LogoutOutlined />}
						key="signOut"
						onClick={handleSignOut}
					>
						Sign Out
					</Menu.Item>
				</Menu>
			</Sider>
			<Content
				style={{
					padding: "0 50px",
					margin: "48px 48px 48px 0px",
				}}
			>
				{childPages[current]}
			</Content>
		</>
	);
};

export default Dashboard;
