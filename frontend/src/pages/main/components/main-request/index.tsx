import React, { FC, useEffect, useState, useCallback, useContext } from "react";
import { Card, Typography, Spin, List, Space, Button, Modal } from "antd";
import s from "../../main.module.css";
import { Req } from "../../../../types";

import { MessageOutlined, LikeOutlined, StarOutlined } from "@ant-design/icons";
import { getOpenRequest } from "../../../../api";
import UserCreateRequestComponent from "./user-request";
import { FirebaseContext } from "../../../../context/firebase-context";
import firebase from "firebase";
import ViewTask from "../../../../components/view-task";

const { Title, Paragraph } = Typography;

const MainRequest: FC<{}> = () => {
	const firebaseContext = useContext(FirebaseContext);
	const { firebaseApp } = firebaseContext;
	const db = firebase.firestore(firebaseApp as firebase.app.App);
	const [loading, setLoading] = useState<boolean>(true);
	const [requests, setRequests] = useState<Req[]>([]);

	const [modalReq, setModalReq] = useState<Req | null>(null);
	const [visible, setVisible] = useState<boolean>(false);

	const IconText = ({ icon, text }) => (
		<Space>
			{React.createElement(icon)}
			{text}
		</Space>
	);

	const fetchRequest = useCallback(async () => {
		try {
			setLoading(true);
			//const res = await getOpenRequest();
			const res = await db.collection("request").get();
			const list = [] as any;
			res.forEach((doc) => {
				if (doc.exists) {
					list.push(doc.data());
				} else {
					// doc.data() will be undefined in this case
				}
			});
			setRequests(list);
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRequest();
	}, []);
	console.log(requests);

	const handleClick = (_, item: Req) => {
		setModalReq(item);
		setVisible(true);
	};
	const handleCancel = () => {
		setModalReq(null);
		setVisible(false);
	};
	const handleOkay = () => {
		alert("this will fufil");
	};

	return (
		<div className={s.content}>
			<div className={s.userActions}>
				<div className={s.column}>
					<UserCreateRequestComponent fetchRequest={fetchRequest} />
				</div>
			</div>
			<div className={s.requestBoard}>
				<Card className={s.requestBackground}>
					<Typography>
						<Title>Available Requests</Title>
						<Paragraph>
							These are the current requests users have posted
						</Paragraph>
					</Typography>
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
								pagination={{
									onChange: (page) => {
										console.log(page);
									},
									pageSize: 4,
								}}
								split={false}
								dataSource={requests}
								renderItem={(item: Req, index: number) => (
									<List.Item
										key={item.title + index}
										actions={[
											<Button
												type="primary"
												onClick={(e) =>
													handleClick(e, item)
												}
											>
												View
											</Button>,
											<IconText
												icon={StarOutlined}
												text=""
												key="list-vertical-star-o"
											/>,
											<IconText
												icon={LikeOutlined}
												text=""
												key="list-vertical-like-o"
											/>,
										]}
									>
										<List.Item.Meta
											title={item.title}
											description={item.taskName}
										/>
									</List.Item>
								)}
							/>
						</>
					)}
				</Card>
			</div>
			<Modal
				maskClosable={false}
				title="View Request"
				visible={visible}
				onCancel={handleCancel}
				onOk={handleOkay}
				okText="fufil request?"
			>
				<Typography>
					<Title>{modalReq?.title}</Title>
					<Paragraph>{modalReq?.taskName}</Paragraph>
					<ViewTask task={modalReq?.task} />
				</Typography>
			</Modal>
		</div>
	);
};
export default MainRequest;
