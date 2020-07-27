import React, { FC } from "react";
import { Spin, Typography } from "antd";
import { Task } from "../../logic/tasklogic";

const { Paragraph, Text } = Typography;

type Prop = {
	task: Task | undefined;
};

const ViewTask: FC<Prop> = ({ task }) => {
	if (task == undefined) {
		return <></>;
	}

	return (
		<>
			<Paragraph>{task.expectedDeliveryTime}</Paragraph>
		</>
	);
};

export default ViewTask;
