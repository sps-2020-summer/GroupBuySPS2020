import React, { FC, useEffect, useState, useCallback, useContext } from "react";
import { Card, Typography, Spin, List, Space, Button, Modal } from "antd";
import s from "../../main.module.css";
import UserRequest from "../../../dashboard/user-request";
import { Req, Offer } from "../../../../types";
import RequestItem from "../../../dashboard/user-request/request-item";
import { MessageOutlined, LikeOutlined, StarOutlined } from "@ant-design/icons";
import { getOpenOffers } from "../../../../api";
import UserCreateOfferComponent from "./user-offer";
import { FirebaseContext } from "../../../../context/firebase-context";
import firebase from "firebase";
import ViewTask from "../../../../components/view-task";
import CreateRequest from "../../../../components/create-request";

const { Title, Paragraph, Text } = Typography;

type Props = {
	uid: string | undefined
}

const MainOffer: FC<Props> = ({ uid }) => {
	const firebaseContext = useContext(FirebaseContext);
	const { firebaseApp } = firebaseContext;
	const db = firebase.firestore(firebaseApp as firebase.app.App);
	const [loading, setLoading] = useState<boolean>(true);
	const [offers, setOffers] = useState<Offer[]>([]);

	const [modalOffer, setModalOffer] = useState<Offer | null>(null);
	const [visible, setVisible] = useState<boolean>(false);
	const [requestVisible, setReqVisible] = useState<boolean>(false);

	const IconText = ({ icon, text }) => (
		<Space>
			{React.createElement(icon)}
			{text}
		</Space>
	);
	const fetchOffer = useCallback(async () => {
		try {
			setLoading(true);
			//const res = await getOpenOffers();
			const res = await db.collection("offer").get();
			const list = [] as any;
			res.forEach((doc) => {
				if (doc.exists) {
					list.push(doc.data());
				} else {
					// doc.data() will be undefined in this case
				}
			});
			setOffers(list);
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchOffer();
	}, []);

	const handleClick = (_, item: Offer) => {
		setModalOffer(item);
		setVisible(true);
	};
	const handleCancel = () => {
		setModalOffer(null);
		setVisible(false);
	};
	const handleOkay = () => {
		setReqVisible(true);
	};

	return (
		<div className={s.content}>
			<div className={s.userActions}>
				<div className={s.column}>
					<UserCreateOfferComponent uid={uid} fetchOffer={fetchOffer} />
				</div>
			</div>
			<div className={s.requestBoard}>
				<Card className={s.requestBackground}>
					<Typography>
						<Title>Available Offers</Title>
						<Paragraph>
							These are the current offers users have posted
						</Paragraph>
					</Typography>
					{loading ? (
						<Spin></Spin>
					) : (
							<>
								{offers.length === 0 ? (
									<>You currently have no offers opened!</>
								) : (
										<></>
									)}
								<List
									pagination={{
										onChange: (page) => {
											console.log(page);
										},
										pageSize: 3,
									}}
									split={false}
									dataSource={offers}
									renderItem={(item, index: number) => (
										<List.Item
											key={item.title ?? '' + index}
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
												description={item.description}
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
				title="View Offer"
				visible={visible}
				onCancel={handleCancel}
				onOk={handleOkay}
				okText="Open Request?"
			>
				<Typography>
					<Title>{modalOffer?.title}</Title>
					<Paragraph>
						<Text strong={true}>Description: </Text>
						{modalOffer?.description}{" "}
					</Paragraph>
					<Paragraph>
						<Text strong={true}>Shop location: </Text>
						{modalOffer?.shopLocation}
					</Paragraph>
					<Paragraph>
						<Text strong={true}>Delivery time: </Text>
						{modalOffer?.expectedDeliveryTime}
					</Paragraph>
				</Typography>
			</Modal>
			<CreateRequest
				title={"Request to offer"}
				visible={requestVisible}
				setVisible={setReqVisible}
			/>
		</div>
	);
};
export default MainOffer;
