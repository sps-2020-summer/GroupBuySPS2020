import React, { FC, useState, useContext } from "react";
import s from "../../main.module.css";
import { Button, Modal, Form, Input, DatePicker, Typography, message } from "antd";
import { FormInstance } from "antd/lib/form";
import TextArea from "antd/lib/input/TextArea";

import { MoneyCollectOutlined } from "@ant-design/icons";
import { userInfo } from "os";
import MainOffer from "../main-offer";
import firebase from 'firebase';
import { FirebaseContext } from "../../../../context/firebase-context";
const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

const UserCreateOfferComponent: FC = () => {
	const firebaseContext = useContext(FirebaseContext);
	const { firebaseApp } = firebaseContext;
	const db = firebase.firestore(firebaseApp as firebase.app.App);


	const formRef = React.createRef<FormInstance>();

	const [visible, setVisible] = useState<boolean>(false);

	const handleOk = () => {
		console.log(formRef.current);
		formRef.current?.submit();

	};

	const showModal = () => setVisible(true);
	const handleCancel = () => setVisible(false);

	const onFinish = async (values) => {
		console.log("Success:", values);
		try {
			await db.collection('offer').add({
				...values,
				duration: 0,
			})

		} catch (err) {
			console.log(err)
		}

	};

	const rangeConfig = {
		rules: [
			{ type: "array", required: true, message: "Please select time!" },
		],
	};

	return (
		<>
			<Typography>
				<Title>Welcome</Title>
				<Paragraph>Will you be a nice person today?</Paragraph>
			</Typography>
			<Button
				type="primary"
				shape="round"
				onClick={showModal}
				className={s.userActionBtn}
				icon={<MoneyCollectOutlined />}
			>
				New Offer
			</Button>
			<Typography>
				<Title>You</Title>
				<Paragraph>You currently have 0 offers open</Paragraph>
			</Typography>
			<Form ref={formRef} onFinish={onFinish} >
				<Modal
					title="New Offer"
					visible={visible}
					onOk={handleOk}
					onCancel={handleCancel}
				>
					{" "}
					<Form.Item
						label="Title of Offer"
						name="title"
						rules={[
							{
								required: true,
								message: "Please input your offer",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Description"
						name="description"
						rules={[
							{
								required: true,
								message: "Please input a description",
							},
						]}
					>
						<TextArea />
					</Form.Item>
					<Form.Item
						label={'Shop location'}
						name="shopLocation"
						rules={[
							{
								required: true,
								message: "Please input the location of the shop",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Expected Delivery Time"
						name="duration"
						rules={[
							{
								required: true,
								message: "Please input a duration",
							},
						]}
					>
						<RangePicker
							{...rangeConfig}
							showTime
							format="YYYY-MM-DD HH:mm:ss"
						/>
					</Form.Item>
				</Modal>
			</Form>
		</>
	);
};

const Offer: FC<{}> = () => {
	return (
		<div className={s.content}>
			<div className={s.userActions}>
				<div className={s.column}>
					<UserCreateOfferComponent />
				</div>
			</div>

			<div className={s.requestBoard}>
				<MainOffer />
			</div>
		</div>
	);
};

export default Offer;
