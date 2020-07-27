import React, { FC, useState, useEffect } from "react";
import { DashboardCompProps } from "..";
import {Request, Task, Offer} from '../../../logic';

import { Slide } from "react-awesome-reveal";
import { List, Card } from "antd";
import s from "./s.module.css";
import RequestItem from "../user-request/request-item";
import TaskItem from "../user-task/task-item";
import Loader from "../../../components/loader";
import { getUserTask, getUserRequest } from "../../../api";
import { getTasks } from "../../../logic/tasklogic";
import { getRequests } from "../../../logic/requestlogic";
import { getOffers } from "../../../logic/offerlogic";

const UserHistory: FC<DashboardCompProps> = ({ userUid }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchUserHistory = async (userUid: string) => {
      try {
        setLoading(true);
        const resOffer = await getOffers(userUid);
        const resTask = await getTasks(userUid);
        const resRequest = await getRequests(userUid);
        setTasks(resTask);
        setRequests(resRequest)
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory(userUid);
  }, []);

  return (
    <>
      <Slide triggerOnce direction={"bottom"}>
        <h1>History</h1>
        <h2>These are the requests and offer you have created / completed </h2>
      </Slide>
      {loading ? (
        <Loader spin={loading} topMargin={"24px"} />
      ) : (
          <div className={s.content}>
            <div className={s.prevTasks}>
              <h2>Completed Tasks</h2>
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
            </div>
            <div className={s.prevRequest}>
              <h2>Past Requests</h2>
              <List
                split={false}
                dataSource={requests}
                renderItem={(item) => (
                  <List.Item>
                    <Card title={item.task.payerName} style={{ width: "100%" }}>
                      <RequestItem name={item.task.item ?? '-'} />
                    </Card>
                  </List.Item>
                )}
              />
            </div>
            <div className={s.prevOffer}>
              <h2>Past Offers</h2>
              <List
                split={false}
                dataSource={offers}
                renderItem={(item) => (
                  <List.Item>
                    <Card title={item.title} style={{ width: "100%" }}>
                      <RequestItem name={item.description ?? '-'} />
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          </div>
        )}
      <br />
    </>
  );
};

export default UserHistory;
