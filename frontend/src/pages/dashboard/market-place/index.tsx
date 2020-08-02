import React, { FC, useState } from "react";
import { Layout, Menu, Spin } from "antd";

import { ClickParam } from "antd/lib/menu";
import { MailOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import s from "./main.module.css";
import MainRequest from "./components/main-request";
import MainOffer from "./components/main-offer";
const { Content } = Layout;

const Main: FC<{}> = () => {
	 
	const [current, setCurrent] = useState<string>("request");
	const [user, loading] = useAuthState(firebase.auth());
	if (loading) return <Spin spinning={true}></Spin>;
	/** State */

	const email = user?.email ?? user?.displayName ?? "Guest User"
	/** The pages to show on menu click */
	const childPages = { request: <MainRequest email={email} uid={user?.uid} />, offers: <MainOffer email={email}  uid={user?.uid} /> };


	const handleClick = (e: ClickParam) => setCurrent(e.key);
	return (
		<Content
			className={s.cardStyle}
			style={{
				padding: "0 50px",
				margin: "0px",
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
			</Menu>
			{childPages[current]}
		</Content>
	);
};

export default Main;
