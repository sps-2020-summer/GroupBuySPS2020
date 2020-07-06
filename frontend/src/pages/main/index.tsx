import React, { FC, useState } from "react";
import { Layout, Tabs, Button, Menu } from "antd";
import { withRouter, useHistory } from "react-router-dom";
import { ClickParam } from "antd/lib/menu";
import {
	MailOutlined,
	AppstoreOutlined,
	SettingOutlined,
} from "@ant-design/icons";

import Request from "./components/requests";

const { TabPane } = Tabs;

const { Header, Footer, Sider, Content } = Layout;

const Main: FC<{}> = () => {
	/** State */
	const [current, setCurrent] = useState<string>("request");

	/** The pages to show on menu click */
	const childPages = { request: <Request />, offers: <>I am offer</> };

	/** Navigation */
	const history = useHistory();
	const navToDashboard = () => history.push("/dashboard");
	const handleClick = (e: ClickParam) =>
		e.key === "dashboard" ? navToDashboard() : setCurrent(e.key);

	return (
		<Content
			style={{
				padding: "0 50px",
				margin: "48px",
				backgroundColor: "white",
			}}
		>
			<Menu
				onClick={handleClick}
				selectedKeys={[current]}
				mode="horizontal"
			>
				<Menu.Item key="request" icon={<MailOutlined />}>
					Requests
				</Menu.Item>
				<Menu.Item key="offers" icon={<AppstoreOutlined />}>
					Offers
				</Menu.Item>
				<Menu.Item key="dashboard">Dashboard</Menu.Item>
			</Menu>
			{childPages[current]}
		</Content>
	);
};

export default withRouter(Main);
