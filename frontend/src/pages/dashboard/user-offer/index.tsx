import React, { FC, useState, useEffect, useContext } from "react";
import { DashboardCompProps } from "..";
import { List } from "antd";
import { Task, Offer } from "../../../types";
import { Slide } from "react-awesome-reveal";
import TaskItem from "./offer-item";
import Loader from "../../../components/loader";

import { FirebaseContext } from "../../../context/firebase-context";
import firebase from "firebase";
import { getOffers } from "../../../logic/offerlogic";

const UserOffer: FC<DashboardCompProps> = ({ userUid }) => {
	const firebaseContext = useContext(FirebaseContext);
	const { firebaseApp } = firebaseContext;
	const db = firebase.firestore(firebaseApp as firebase.app.App);
	const [loading, setLoading] = useState<boolean>(true);
	const [offers, setoffers] = useState<Offer[]>([]);

	useEffect(() => {
		const fetchOffers = async (userUid: string) => {
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
		};
		fetchOffers(userUid);
	}, [userUid]);

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

									dataSource={offers}
									renderItem={(item) => (
										<List.Item>
											<TaskItem name={item?.name ?? ""} />
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
