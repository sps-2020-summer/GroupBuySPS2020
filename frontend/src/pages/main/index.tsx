import React, { FC, useState } from "react";
import { Layout, Menu, Spin } from "antd";
import { withRouter, useHistory } from "react-router-dom";
import { ClickParam } from "antd/lib/menu";
import { MailOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import s from "./main.module.css";
import MainRequest from "./components/main-request";
import MainOffer from "./components/main-offer";
const { Content } = Layout;

const Main: FC<{}> = () => {
	const history = useHistory();
	const [current, setCurrent] = useState<string>("request");
	const [user, loading] = useAuthState(firebase.auth());
	if (loading) return <Spin spinning={true}></Spin>;
	/** State */

	/** The pages to show on menu click */
	const childPages = { request: <MainRequest />, offers: <MainOffer uid={user?.uid} /> };

	/** Navigation */

	const navToDashboard = () => history.push("/dashboard");
	const handleClick = (e: ClickParam) =>
		e.key === "dashboard" ? navToDashboard() : setCurrent(e.key);

	return (
		<Content
			className={s.cardStyle}
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
