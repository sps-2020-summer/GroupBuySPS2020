import React, { FC, useState, useEffect, useCallback} from "react";
import { DashboardCompProps } from "..";
import { List } from "antd";
import { Offer }from '../../../logic'
import { Slide } from "react-awesome-reveal";
import TaskItem from "./offer-item";
import Loader from "../../../components/loader";
import { getOffers } from "../../../logic/offerlogic";

const UserOffer: FC<DashboardCompProps> = ({ userUid }) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [offers, setoffers] = useState<Offer[]>([]);
	const fetchOffers = useCallback(async () => {
		try {
			setLoading(true);
			console.log(userUid);
			const res = await getOffers(userUid);
			console.log(res);
			setoffers(res);
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	},[]);

	useEffect(() => {   
		
		fetchOffers();
	}, []);

	return (
		<>
			<Slide triggerOnce direction={"bottom"}>
				<h1>My Offer</h1>
				<h3>These are the offers you have opened</h3>
			</Slide>
			<br />
			{loading ? (
				<Loader spin={loading} topMargin={"24px"} />
			) : (
					<>
						{offers.length === 0 ? (
							<>You currently have no offers!</>
						) : (
								<List
								grid={{
									gutter: 16,
									xs: 1,
									sm: 2,
									md: 4,
									lg: 4,
									xl: 4,
									xxl: 3,
								  }}
									dataSource={offers}
									renderItem={(item) => (
										<List.Item>
											<TaskItem offer={item} fetch={fetchOffers} />
										</List.Item>
									)}
								/>
							)}
					</>
				)}
		</>
	);
};

export default UserOffer;
