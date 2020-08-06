import React, { FC, useState, useEffect } from "react"
import { DashboardCompProps } from ".."
import { Request, Task, Offer, getHistory } from "../../../logic"

import { Slide } from "react-awesome-reveal"
import { List, Card } from "antd"
import s from "./s.module.css"
import RequestItem from "../user-request/request-item"
import TaskItem from "../user-task/task-item"
import Loader from "../../../components/loader"
//import { getTasks } from "../../../logic/tasklogic";
//import { getRequests } from "../../../logic/requestlogic";
//import { getOffers } from "../../../logic/offerlogic";
import OfferItem from "../user-offer/offer-item"
import { Status } from "../../../types"
import {
    HistoryHelpText,
    NoHistoryTaskText,
    NoHistoryRequestText,
    NoHistoryOfferText,
} from "../../../components/help-text"

const UserHistory: FC<DashboardCompProps> = ({ userUid }) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [offers, setOffers] = useState<Offer[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [requests, setRequests] = useState<Request[]>([])

    useEffect(() => {
        const fetchUserHistory = async (userUid: string) => {
            try {
                setLoading(true)
                const { tasks, requests, offers } = await getHistory(userUid)
                console.log(requests)
                setOffers(offers)
                setTasks(tasks)
                setRequests(requests)
            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }

        fetchUserHistory(userUid)
    }, [])

    return (
        <>
            <Slide triggerOnce direction={"bottom"}>
                <HistoryHelpText />
            </Slide>
            {loading ? (
                <Loader spin={loading} topMargin={"24px"} />
            ) : (
                <div className={s.content}>
                    <div className={s.prevTasks}>
                        <h2>Tasks</h2>
                        {tasks.length === 0 ? (
                            <NoHistoryTaskText />
                        ) : (
                            <List
                                split={false}
                                dataSource={tasks}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Card
                                            className={s.cardStyle}
                                            title={item.item}
                                            style={{ width: "100%" }}
                                        >
                                            <TaskItem task={item} />
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        )}
                    </div>
                    <div className={s.prevRequest}>
                        <h2>Requests</h2>
                        {requests.length === 0 ? (
                            <NoHistoryRequestText />
                        ) : (
                            <List
                                split={false}
                                dataSource={requests}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Card style={{ width: "100%" }}>
                                            <RequestItem request={item} />
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        )}
                    </div>
                    <div className={s.prevOffer}>
                        <h2> Offers</h2>
                        {offers.length === 0 ? (
                            <NoHistoryOfferText />
                        ) : (
                            <List
                                split={false}
                                dataSource={offers}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Card
                                            title={item.title}
                                            style={{ width: "100%" }}
                                        >
                                            <OfferItem offer={item} />
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        )}
                    </div>
                </div>
            )}
            <br />
        </>
    )
}

export default UserHistory
