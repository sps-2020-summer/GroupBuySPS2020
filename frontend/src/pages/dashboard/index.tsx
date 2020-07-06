import React, { FC } from "react";
import { Layout, Menu } from "antd";
import {
	DesktopOutlined,
	PieChartOutlined,
	FileOutlined,
	TeamOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router";

const { Header, Footer, Sider, Content } = Layout;

const Dashboard: FC<{}> = () => {
	const history = useHistory();
	const navToHome = () => history.push("/");

	return (
		<>
			<Sider>
				<Menu
					theme="dark"
					defaultSelectedKeys={["1"]}
					mode="inline"
					style={{ marginTop: "30vh" }}
				>
					<Menu.Item key="1" icon={<PieChartOutlined />}>
						My Tasks
					</Menu.Item>
					<Menu.Item key="2" icon={<DesktopOutlined />}>
						My Request
					</Menu.Item>
					<Menu.Item key="3" icon={<DesktopOutlined />}>
						History
					</Menu.Item>
					<Menu.Item onClick={navToHome}>Back to Home</Menu.Item>
				</Menu>
			</Sider>
			<Content
				style={{
					padding: "0 50px",
					margin: "48px 48px 48px 0px",
					backgroundColor: "white",
				}}
			>
				<>This is my personal dashboard</>
			</Content>
		</>
	);
};

export default Dashboard;
