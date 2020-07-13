import React, { FC } from "react";
import { Card } from "antd";
import {
	EditOutlined,
	EllipsisOutlined,
	SettingOutlined,
} from "@ant-design/icons";

import s from "./s.module.css";

type Props = {
	name: String;
};

const RequestItem: FC<Props> = ({ name }) => {
	return (
		<Card
			className={s.cardStyle}
			actions={[
				<SettingOutlined key="setting" />,
				<EditOutlined key="edit" />,
				<EllipsisOutlined key="ellipsis" />,
			]}
		>
			<Card.Meta
				title={name}
				description="This is the request description"
			/>
		</Card>
	);
};
export default RequestItem;
