import React, { FC, useState } from "react";
import { Layout, Tabs, Button, Menu, Spin } from "antd";
import { withRouter, useHistory } from "react-router-dom";
import { ClickParam } from "antd/lib/menu";
import {
	MailOutlined,
	AppstoreOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import Request from "./components/requests";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";

const { TabPane } = Tabs;

const { Header, Footer, Sider, Content } = Layout;

const Main: FC<{}> = () => {
	const history = useHistory();
	const [current, setCurrent] = useState<string>("request");
	const [user, loading, error] = useAuthState(firebase.auth());
	if (loading) return <Spin spinning={true}></Spin>;
	console.log(user);
	/** State */

	/** The pages to show on menu click */
	const childPages = { request: <Request />, offers: <>I am offer</> };

	/** Navigation */

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
