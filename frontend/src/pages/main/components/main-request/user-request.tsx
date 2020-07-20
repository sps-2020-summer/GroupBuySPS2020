import React, { FC, useState, useContext } from "react";
import s from "../../main.module.css";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Typography,
  InputNumber,
} from "antd";
import { FormInstance } from "antd/lib/form";
import TextArea from "antd/lib/input/TextArea";
import UserRequest from "../../../dashboard/user-request";
import MainRequest from "../main-request";
import { MoneyCollectOutlined } from "@ant-design/icons";
import { userInfo } from "os";
import firebase from "firebase";
import { FirebaseContext } from "../../../../context/firebase-context";
const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

type Props = {
  fetchRequest: () => Promise<void>;
};
const UserCreateRequestComponent: FC<Props> = ({ fetchRequest }) => {
  const firebaseContext = useContext(FirebaseContext);
  const { firebaseApp } = firebaseContext;
  const db = firebase.firestore(firebaseApp as firebase.app.App);

  const formRef = React.createRef<FormInstance>();
  const [visible, setVisible] = useState<boolean>(false);

  const handleOk = () => {
    console.log(formRef.current);
    formRef.current?.submit();
  };

  const showModal = () => setVisible(true);
  const handleCancel = () => setVisible(false);

  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      await db.collection("request").add({
        ...values,
        duration: 0,
      });
      fetchRequest();
      setVisible(false);
    } catch (err) {
      console.log(err);
    }
  };

  const rangeConfig = {
    rules: [{ type: "array", required: true, message: "Please select time!" }],
  };

  return (
    <>
      <Typography>
        <Title>Welcome</Title>
        <Paragraph>What does your heart desire?</Paragraph>
      </Typography>
      <Button
        type="primary"
        shape="round"
        onClick={showModal}
        className={s.userActionBtn}
        icon={<MoneyCollectOutlined />}
      >
        New Request
      </Button>
      <Typography>
        <Title>You</Title>
        <Paragraph>You currently have 0 requests open</Paragraph>
      </Typography>
      <Form ref={formRef} onFinish={onFinish}>
        <Modal
          maskClosable={false}
          title="New Request"
          visible={visible}
          okText="Submit request"
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {" "}
          <Form.Item
            label="Title of Request"
            name="title"
            rules={[
              {
                required: true,
                message: "Please input your request",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Task"}
            name="taskName"
            rules={[
              {
                required: true,
                message: "Please input your task",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Item"}
            name="item"
            rules={[
              {
                required: true,
                message: "Please input your item",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Shop location"}
            name="shopLocation"
            rules={[
              {
                required: true,
                message: "Please input the location of the shop",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="fee" name="fee" rules={[]}>
            <InputNumber />
          </Form.Item>
        </Modal>
      </Form>
    </>
  );
};

export default UserCreateRequestComponent;
