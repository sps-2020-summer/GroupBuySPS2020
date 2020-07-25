import React, { FC, useState, useEffect } from "react";
import { DashboardCompProps } from "..";
import { Request } from "../../../types";
import { Slide } from "react-awesome-reveal";
import { List } from "antd";
import RequestItem from "./request-item";
import Loader from "../../../components/loader";

import { getRequests } from "../../../logic/requestlogic";
const UserRequest: FC<DashboardCompProps> = ({ userUid }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequest = async (userUid: string) => {
      try {
        setLoading(true);
        const res = await getRequests(userUid);
        setRequests(res);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest(userUid);
  }, [userUid]);

  return (
    <>
      <Slide triggerOnce direction={"bottom"}>
        <h1>My Requests</h1>
        <h3>These are the current request you have opened </h3>
      </Slide>
      <br />
      {loading ? (
        <Loader spin={loading} topMargin={"24px"} />
      ) : (
          <>
            {requests.length === 0 ? (
              <>You currently have no requests opened!</>
            ) : (
                <></>
              )}
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
              dataSource={requests}
              renderItem={(item) => (
                <List.Item>
                  <RequestItem name={item.name ?? '-'} />
                </List.Item>
              )}
            />
          </>
        )}
    </>
  );
};

export default UserRequest;
