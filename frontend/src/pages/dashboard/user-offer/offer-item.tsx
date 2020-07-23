import React, { FC } from "react";
import { Card, message } from "antd";
import {
	EditOutlined,
	EllipsisOutlined,
	SettingOutlined,
} from "@ant-design/icons";

import s from "./s.module.css";

type Props = {
	name: String;
};

const OfferItem: FC<Props> = ({ name }) => {
	const info = () => {
		message.info("This is a normal message");
	};

	return (
		<Card
			className={s.cardStyle}
			actions={[
				<SettingOutlined key="setting" onClick={info} />,
				<EditOutlined key="edit" />,
				<EllipsisOutlined key="ellipsis" />,
			]}
		>
			<Card.Meta
				title={name}
				description="This is an offer"
			/>
		</Card>
	);
};
export default OfferItem;
