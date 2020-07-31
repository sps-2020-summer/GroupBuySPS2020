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
  message,
} from "antd";
import { FormInstance } from "antd/lib/form";
import { MoneyCollectOutlined } from "@ant-design/icons";
import firebase from "firebase";
import { FirebaseContext } from "../../../../../context/firebase-context";
import { addRequest } from "../../../../../logic/requestlogic";
const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

type Props = {
  uid: string | undefined;
  fetchRequest: () => Promise<void>;
};
const UserCreateRequestComponent: FC<Props> = ({ fetchRequest, uid }) => {
  const firebaseContext = useContext(FirebaseContext);
  const { firebaseApp } = firebaseContext;
  const db = firebase.firestore(firebaseApp as firebase.app.App);
  const [loading, setLoading] = useState<boolean>(false);

  const formRef = React.createRef<FormInstance>();
  const [visible, setVisible] = useState<boolean>(false);

  const handleOk = () => {
    console.log(formRef.current);
    formRef.current?.submit();
  };

  const showModal = () => setVisible(true);
  const handleCancel = () => setVisible(false);
  // add only payerName , shopLocation, expectedDeliveryTime , item, fee

  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      setLoading(true);
      await addRequest(uid ?? '-', values.payerName, values.shopLocation, values.expectedDeliveryTime.unix(), values.item, values.fee);
      message.success('Request added successfully');
      fetchRequest();
      setLoading(false);
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
          confirmLoading={loading}
        >
      
          <Form.Item
            label="Payer Name"
            name="payerName"
            rules={[
              {
                required: true,
                message: "Please input your name",
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
          <Form.Item
            label="Expected Delivery Time"
            name="expectedDeliveryTime"
            rules={[
              {
                required: true,
                message: "Please input a date and time",
              },
            ]}
          >
            <DatePicker showTime={true} />
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
          <Form.Item label="fee" name="fee" rules={[]}>
            <InputNumber />
          </Form.Item>
        </Modal>
      </Form>
    </>
  );
};

export default UserCreateRequestComponent;
