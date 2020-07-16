import React, { FC, useState } from "react";
import s from "../../main.module.css";
import { Button, Modal, Form, Input, DatePicker, Typography, InputNumber } from "antd";
import { FormInstance } from "antd/lib/form";
import TextArea from "antd/lib/input/TextArea";
import UserRequest from "../../../dashboard/user-request";
import MainRequest from "../main-request";
import { MoneyCollectOutlined } from "@ant-design/icons";
import { userInfo } from "os";

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

const UserCreateRequestComponent: FC<{}> = () => {
	const formRef = React.createRef<FormInstance>();
	const [visible, setVisible] = useState<boolean>(false);

	const handleOk = () => {
		formRef.current?.submit();
	};

	const showModal = () => setVisible(true);
	const handleCancel = () => setVisible(false);

	const onFinish = (values) => {
		console.log("Success:", values);
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
				<Paragraph>What does your heart desire?</Paragraph>
			</Typography>
			<Button
				type="primary"
				shape="round"
				onClick={showModal}
				className={s.userActionBtn}
				icon={<MoneyCollectOutlined />}
			>
				New Request
			</Button>
			<Typography>
				<Title>You</Title>
				<Paragraph>You currently have 0 requests open</Paragraph>
			</Typography>
			<Form onFinish={onFinish}>
				<Modal

					maskClosable={false}
					title="New Request"
					visible={visible}
					okText='Submit request'
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
						label={'Task'}
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
						label={'Item'}
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
					<Form.Item label="fee" name="fee" rules={[]}>
						<InputNumber />
					</Form.Item>


				</Modal>
			</Form>
		</>
	);
};

const Request: FC<{}> = () => {
	return (
		<div className={s.content}>
			<div className={s.userActions}>
				<div className={s.column}>
					<UserCreateRequestComponent />
				</div>
			</div>

			<div className={s.requestBoard}>
				<MainRequest />
			</div>
		</div>
	);
};

export default Request;
