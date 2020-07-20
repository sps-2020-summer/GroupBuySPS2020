import React, { FC, useEffect, useState, useCallback, useContext } from "react";
import { Card, Typography, Spin, List, Space } from "antd";
import s from "../../main.module.css";
import { Req } from "../../../../types";

import { MessageOutlined, LikeOutlined, StarOutlined } from "@ant-design/icons";
import { getOpenRequest } from "../../../../api";
import UserCreateRequestComponent from "./user-request";
import { FirebaseContext } from "../../../../context/firebase-context";
import firebase from "firebase";

const { Title, Paragraph } = Typography;

const MainRequest: FC<{}> = () => {
  const firebaseContext = useContext(FirebaseContext);
  const { firebaseApp } = firebaseContext;
  const db = firebase.firestore(firebaseApp as firebase.app.App);
  const [loading, setLoading] = useState<boolean>(true);
  const [requests, setRequests] = useState<Req[]>([]);

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  const fetchRequest = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getOpenRequest();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequest();
  }, []);

  return (
    <div className={s.content}>
      <div className={s.userActions}>
        <div className={s.column}>
          <UserCreateRequestComponent fetchRequest={fetchRequest} />
        </div>
      </div>
      <div className={s.requestBoard}>
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
      </div>
    </div>
  );
};
export default MainRequest;
