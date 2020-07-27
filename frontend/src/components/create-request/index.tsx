import React, { FC, useState, useContext } from "react";
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

import firebase from "firebase";
import { FirebaseContext } from "../../context/firebase-context";
import { addRequestToOffer, Offer } from "../../logic/offerlogic";
const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

type Props = {
	uid: string | undefined
	title: string;
	fetch: () => Promise<void>;
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	offer: Offer | null;
};
const CreateRequest: FC<Props> = ({
	uid,
	title,
	fetch,
	visible,
	setVisible,
	offer
}) => {


	const [loading, setLoading] = useState<boolean>(false);

	const formRef = React.createRef<FormInstance>();

	const handleOk = () => {
		console.log(formRef.current);
		formRef.current?.submit();
	};
	
	const onFinish = async (values) => {
		console.log("Success:", values);
		try {
		  setLoading(true);
			if (offer === null) {
				throw new Error('offer is nul');
			}
		  await addRequestToOffer(offer.id, offer.doerName  ,uid ?? '-', values.payerName, values.item, values.fee);
		  message.success('Request added successfully');
		  await fetch();
		  setLoading(false);
		  setVisible(false);
		} catch (err) {
		  console.log(err);
		}
	  };

	const rangeConfig = {
		rules: [
			{ type: "array", required: true, message: "Please select time!" },
		],
	};
	const handleCancel = () => setVisible(false);

	return (
		<>
			<Form ref={formRef} onFinish={onFinish}>
        <Modal
          maskClosable={false}
          title={title}
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

export default CreateRequest;
