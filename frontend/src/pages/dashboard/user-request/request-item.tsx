import React, { FC, useState } from "react";
import { Card, Typography, message } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  GoogleCircleFilled,
} from "@ant-design/icons";

import s from "./s.module.css";
import { Request, markRequestAsDone } from "../../../logic";
const { Title, Text, Paragraph } = Typography;

type Props = {
  request: Request;
  fetch?: () => Promise<void>;
};

const RequestItem: FC<Props> = ({ request, fetch }) => {
  const [loading, setLoading] = useState(false);
  if (!fetch || request.task.status === "DONE" ) {
    return (
      <Card className={s.cardStyle}>
        <Card.Meta
          title={request.id}
          description={
            <Typography>
              <Title>{request.task.item}</Title>
              {request.task.status === "DONE" ? (
                <Text>THIS request IS DONE</Text>
              ) : null}
              <Paragraph>
                <Text strong={true}>Shop Location: </Text>
                {request.task.shopLocation}
              </Paragraph>
              <Paragraph>
                <Text strong={true}>Doer Name </Text>
                {request.task.doerName}
              </Paragraph>
              <Paragraph>
                <Text strong={true}>Expected Delivery Time</Text>
                {request.task.expectedDeliveryTime}
              </Paragraph>
            </Typography>
          }
        />
      </Card>
    );
  }
  const handleDone = async () => {
    try {
      setLoading(true);
      await markRequestAsDone(request.id);
      await fetch();
      message.success("request cancelled!");
    } catch (err) {
      message.error(err);
    }
  };

  return (
    <Card
      className={s.cardStyle}
      actions={[<GoogleCircleFilled onClick={handleDone} />]}
    >
      <Card.Meta
        title={request.id}
        description={
          <Typography>
            <Title>{request.task.item}</Title>
            {request.task.status === "CANCELLED" ? (
              <Text>THIS request IS Cancelled</Text>
            ) : null}
            <Paragraph>
              <Text strong={true}>Shop Location: </Text>
              {request.task.shopLocation}
            </Paragraph>
            <Paragraph>
              <Text strong={true}>Doer Name </Text>
              {request.task.doerName}
            </Paragraph>
            <Paragraph>
              <Text strong={true}>Expected Delivery Time</Text>
              {request.task.expectedDeliveryTime}
            </Paragraph>
          </Typography>
        }
      />
    </Card>
  );
};
export default RequestItem;
