import React, { FC, useState, useContext } from "react";
import {
	Button,
	Modal,
	Form,
	Input,
	DatePicker,
	Typography,
	InputNumber,
} from "antd";
import { FormInstance } from "antd/lib/form";

import firebase from "firebase";
import { FirebaseContext } from "../../context/firebase-context";
const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

type Props = {
	title: string;
	fetchRequest?: () => Promise<void>;
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
const CreateRequest: FC<Props> = ({
	title,
	fetchRequest,
	visible,
	setVisible,
}) => {
	const firebaseContext = useContext(FirebaseContext);
	const { firebaseApp } = firebaseContext;
	const db = firebase.firestore(firebaseApp as firebase.app.App);

	const formRef = React.createRef<FormInstance>();

	const handleOk = () => {
		console.log(formRef.current);
		formRef.current?.submit();
	};

	const onFinish = async (values) => {
		console.log("Success:", values);
		try {
			await db.collection("request").add({
				...values,
				duration: 0,
			});
			//fetchRequest();
			setVisible(false);
		} catch (err) {
			console.log(err);
		}
	};

	const rangeConfig = {
		rules: [
			{ type: "array", required: true, message: "Please select time!" },
		],
	};
	const handleCancel = () => setVisible(false);

	return (
		<>
			<Form ref={formRef} onFinish={onFinish}>
				<Modal
					maskClosable={false}
					title={title}
					visible={visible}
					okText="Submit request"
					onOk={handleOk}
					onCancel={handleCancel}
				>
					{" "}
					<Form.Item
						label="Title of Request"
						name="title"
						rules={[
							{
								required: true,
								message: "Please input your request",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label={"Task"}
						name="taskName"
						rules={[
							{
								required: true,
								message: "Please input your task",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label={"Item"}
						name="item"
						rules={[
							{
								required: true,
								message: "Please input your item",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label={"Shop location"}
						name="shopLocation"
						rules={[
							{
								required: true,
								message:
									"Please input the location of the shop",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item label="fee" name="fee" rules={[]}>
						<InputNumber />
					</Form.Item>
				</Modal>
			</Form>
		</>
	);
};

export default CreateRequest;
