import React, { FC, useContext, useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
	DesktopOutlined,
	PieChartOutlined,
	FileOutlined,
	TeamOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router";
import { AuthContext } from "../../context/auth";
import UserHistory from "./user-history";
import UserTask from "./user-task";
import UserRequest from "./user-request";
import { ClickParam } from "antd/lib/menu";

const { Header, Footer, Sider, Content } = Layout;

type dashboardOptions = "tasks" | "history" | "requests";

const Dashboard: FC<{}> = () => {
	const history = useHistory();
	const value = useContext(AuthContext);
	const { firebase } = value;
	const navToHome = () => history.push("/");

	const [current, setCurrent] = useState<dashboardOptions>("tasks");

	/** The pages to show on menu click */
	const childPages = {
		tasks: <UserTask />,
		requests: <UserRequest />,
		history: <UserHistory />,
	};

	const handleClick = (e: dashboardOptions) => setCurrent(e);

	const handleSignOut = async () => {
		await firebase.auth().signOut();
		navToHome();
	};

	return (
		<>
			<Sider>
				<Menu
					theme="dark"
					defaultSelectedKeys={["1"]}
					mode="inline"
					style={{ marginTop: "30vh" }}
				>
					<Menu.Item
						key="1"
						onClick={() => handleClick("tasks")}
						icon={<PieChartOutlined />}
					>
						My Tasks
					</Menu.Item>
					<Menu.Item
						key="2"
						onClick={() => handleClick("requests")}
						icon={<DesktopOutlined />}
					>
						My Request
					</Menu.Item>
					<Menu.Item
						key="3"
						onClick={() => handleClick("history")}
						icon={<DesktopOutlined />}
					>
						History
					</Menu.Item>

					<Menu.Item onClick={navToHome}>Back to Home</Menu.Item>

					<Menu.Item
						style={{ marginTop: "auto" }}
						key="4"
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
