import React, { FC, useState, useContext, useEffect, useCallback } from "react";
import s from "../../main.module.css";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Typography,
  message,
  TimePicker,
} from "antd";
import { FormInstance } from "antd/lib/form";
import TextArea from "antd/lib/input/TextArea";

import { MoneyCollectOutlined } from "@ant-design/icons";
import { userInfo } from "os";
import MainOffer from ".";
import firebase from "firebase";
import { FirebaseContext } from "../../../../../context/firebase-context";
import { addOffer } from "../../../../../logic/offerlogic";
import { Status } from "../../../../../types";
import moment from "moment";
import { Offer, getOpenOffers } from "../../../../../logic/offerlogic";
import { getCurrentOffers } from "../../../../../logic"
const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

type Props = {
  uid: string | undefined;
  fetchOffer: () => Promise<void>;
  email : string | undefined | null;
};

const UserCreateOfferComponent: FC<Props> = ({ fetchOffer, uid, email }) => {
  const firebaseContext = useContext(FirebaseContext);
  const { firebaseApp } = firebaseContext;
  const db = firebase.firestore(firebaseApp as firebase.app.App);

  const formRef = React.createRef<FormInstance>();

  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true)
  const [offers, setOffers] = useState<Offer[]>([]);

  const fetchOffers = useCallback(async () => {
    if (uid === undefined) return;
    try {
        setLoading(true)
        const { open } = await getCurrentOffers(uid)
        setOffers(open)
    } catch (e) {
        console.log(e)
    } finally {
        setLoading(false)
    }
  }, [])
  useEffect(() => {
    fetchOffers()
  }, [])

  const handleOk = () => {
    console.log(formRef.current);
    formRef.current?.submit();
  };

  const showModal = () => setVisible(true);
  const handleCancel = () => setVisible(false);



  const onFinish = async (values) => {
    console.log("Success:", values);
    const { title, description, shopLocation, expectedDeliveryTime } = values;
    try {
      let emailName = '';
			if (email !== null && email !== undefined) {
				emailName = email;
			}
      await addOffer(uid ?? '-', title, description, shopLocation, expectedDeliveryTime.unix());
      fetchOffer();
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
        <Paragraph>Will you be a nice person today?</Paragraph>
      </Typography>
      <Button
        type="primary"
        shape="round"
        onClick={showModal}
        className={s.userActionBtn}
        icon={<MoneyCollectOutlined />}
      >
        New Offer
      </Button>
      <Typography>
        <Title>{email}</Title>
        <Paragraph>You currently have {offers.length} offers open</Paragraph>
      </Typography>
      <Form ref={formRef} onFinish={onFinish}>
        <Modal
          maskClosable={false}
          title="New Offer"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {" "}
          <Form.Item
            label="Title of Offer"
            name="title"
            rules={[
              {
                required: true,
                message: "Please input your offer",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input a description",
              },
            ]}
          >
            <TextArea />
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
        </Modal>
      </Form>
    </>
  );
};

export default UserCreateOfferComponent;
