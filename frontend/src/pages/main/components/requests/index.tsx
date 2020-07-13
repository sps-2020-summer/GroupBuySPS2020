import React, { FC, useState } from "react";
import s from "./request.module.css";
import { Button, Modal, Form, Input, DatePicker } from "antd";
import { FormInstance } from "antd/lib/form";
import TextArea from "antd/lib/input/TextArea";
import UserRequest from "../../../dashboard/user-request";

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
			<Button
				type="primary"
				shape="round"
				onClick={showModal}
				className={s.userActionBtn}
			>
				Create Request
			</Button>
			<Form onFinish={onFinish}>
				<Modal
					title="New Request"
					visible={visible}
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
								message: "Please input your task",
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
						label="Duration"
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

const Request: FC<{}> = () => {
	return (
		<div className={s.content}>
			<div className={s.userActions}>
				<div className={s.column}>
					<UserCreateRequestComponent />
					<Button
						type="primary"
						shape="round"
						className={s.userActionBtn}
					>
						Edit Requests
					</Button>
				</div>
			</div>

			<div className={s.requestBoard}>
				{" "}
				Requests will be displayed here
				<UserRequest userUid={"0"} />
			</div>
		</div>
	);
};

export default Request;
