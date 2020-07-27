import React, { FC, useState } from "react";
import { Card, message, Typography, Spin } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  GoogleOutlined,
} from "@ant-design/icons";

import s from "./s.module.css";
import { Task, cancelTask } from "../../../logic/tasklogic";
import { Status } from "../../../types";
import { CANCELLED } from "dns";

type Props = {
  task: Task;
  fetch?: () => Promise<void>;
};
const { Title, Text, Paragraph } = Typography;

const TaskItem: FC<Props> = ({ task, fetch }) => {
  const [loading, setLoading] = useState(false);
  if (!fetch) {
    return (
      <Card className={s.cardStyle}>
        <Card.Meta
          title={task.item}
          description={
            <Typography>
              <Title>{task.item}</Title>
              <Paragraph>
                <Text strong={true}>Shop Location: </Text>
                {task.shopLocation}
              </Paragraph>
              <Paragraph>
                <Text strong={true}>Payer </Text>
                {task.payerName}
              </Paragraph>
              <Paragraph>
                <Text strong={true}>Expected Delivery Time</Text>
                {task.expectedDeliveryTime}
              </Paragraph>
            </Typography>
          }
        />
      </Card>
    );
  }

  const handleCancel = async () => {
    try {
      setLoading(true);
      await cancelTask(task.id);
      await fetch();
      message.success("task cancelled!");
    } catch (err) {
      message.error(err);
    }
  };

  return (
    <Spin spinning={loading}>
      <Card
        className={s.cardStyle}
        actions={[<GoogleOutlined onClick={handleCancel} />]}
      >
        <Card.Meta
          title={task.item}
          description={
            <Typography>
              <Title>{task.item}</Title>
              {task.status === Status.CANCELLED ?<Text>THIS TASK IS CANCELLED</Text> : null}
              <Paragraph>
                <Text strong={true}>Shop Location: </Text>
                {task.shopLocation}
              </Paragraph>
              <Paragraph>
                <Text strong={true}>Payer </Text>
                {task.payerName}
              </Paragraph>
              <Paragraph>
                <Text strong={true}>Expected Delivery Time</Text>
                {task.expectedDeliveryTime}
              </Paragraph>
            </Typography>
          }
        />
      </Card>
    </Spin>
  );
};
export default TaskItem;
