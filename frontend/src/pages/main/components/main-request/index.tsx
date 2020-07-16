import React, { FC, useEffect, useState } from "react";
import { Card, Typography, Spin, List, Space } from "antd";
import s from "../../main.module.css";
import UserRequest from "../../../dashboard/user-request";
import { Req } from "../../../../types";
import RequestItem from "../../../dashboard/user-request/request-item";
import { MessageOutlined, LikeOutlined, StarOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const MainRequest: FC<{}> = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [requests, setRequests] = useState<Req[]>([]);

	const IconText = ({ icon, text }) => (
		<Space>
			{React.createElement(icon)}
			{text}
		</Space>
	);

	useEffect(() => {
		const fetchRequest = async (userUid: string) => {
			try {
				setLoading(true);
			} catch (e) {
				console.log(e);
			} finally {
				setLoading(false);
			}
		};

		const timer = setTimeout(() => setLoading(false), 2000);
		return () => clearTimeout(timer);
	}, []);

	return (
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
								pageSize: 3,
							}}
							split={false}
							dataSource={requests}
							renderItem={(item, index: number) => (
								<List.Item
									key={item.name + index}
									actions={[
										<IconText
											icon={StarOutlined}
											text="156"
											key="list-vertical-star-o"
										/>,
										<IconText
											icon={LikeOutlined}
											text="156"
											key="list-vertical-like-o"
										/>,
										<IconText
											icon={MessageOutlined}
											text="2"
											key="list-vertical-message"
										/>,
									]}
									extra={
										<img
											width={272}
											alt="logo"
											src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
										/>
									}
								>
									<List.Item.Meta
										title={item.name}
										description={"this the description"}
									/>
								</List.Item>
							)}
						/>
					</>
				)}
		</Card>
	);
};
export default MainRequest;
