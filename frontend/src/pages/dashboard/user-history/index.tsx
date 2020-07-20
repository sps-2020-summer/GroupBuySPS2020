import React, { FC, useState, useEffect } from "react";
import { DashboardCompProps } from "..";
import { Req, Task } from "../../../types";
import { Slide } from "react-awesome-reveal";
import { List, Card } from "antd";
import s from "./s.module.css";
import RequestItem from "../user-request/request-item";
import TaskItem from "../user-task/task-item";
import Loader from "../../../components/loader";
import { getUserTask, getUserRequest } from "../../../api";

const UserHistory: FC<DashboardCompProps> = ({ userUid }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [requests, setRequests] = useState<Req[]>([]);

  useEffect(() => {
    const fetchUserHistory = async (userUid: number) => {
      try {
        setLoading(true);
        const resTask = await getUserTask(userUid, "close");
        const resRequest = await getUserRequest(userUid, "close");
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory(Number(userUid));
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
                    title={item.name}
                    style={{ width: "100%" }}
                  >
                    <TaskItem name={item.name} />
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
                  <Card title={item.name} style={{ width: "100%" }}>
                    <RequestItem name={item.name} />
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
