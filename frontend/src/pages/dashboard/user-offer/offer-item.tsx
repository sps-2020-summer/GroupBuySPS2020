import React, { FC, useState } from "react";
import { Card, message, Typography, Spin } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  GoogleOutlined,
} from "@ant-design/icons";

import s from "./s.module.css";
import { Offer, cancelOffer } from "../../../logic";

const { Title, Text, Paragraph } = Typography;

type Props = {
  offer: Offer;
  fetch?: () => Promise<void>;
};

const OfferItem: FC<Props> = ({ offer, fetch }) => {
	const [loading, setLoading] = useState(false);
  if (!fetch || offer.status === "DONE") {
    return (
      <Card className={s.cardStyle}>
        <Card.Meta
          title={offer.title}
          description={
            <Typography>
              <Title>{offer.title}</Title>
             <Text>THIS offer IS DONE</Text> 
              <Paragraph>
                <Text strong={true}>Shop Location: </Text>
                {offer.shopLocation}
              </Paragraph>
              <Paragraph>
                <Text strong={true}>Doer Name </Text>
                {offer.doerName}
              </Paragraph>
              <Paragraph>
                <Text strong={true}>Expected Delivery Time</Text>
                {offer.expectedDeliveryTime}
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
      await cancelOffer(offer.id);
      await fetch();
      message.success("offer cancelled!");
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
        title={offer.title}
        description={
          <Typography>
            <Title>{offer.title}</Title>
           
            <Paragraph>
              <Text strong={true}>Shop Location: </Text>
              {offer.shopLocation}
            </Paragraph>
			<Paragraph>
              <Text strong={true}>Status: </Text>
              {offer.status}
            </Paragraph>
            <Paragraph>
              <Text strong={true}>Doer Name </Text>
              {offer.doerName}
            </Paragraph>
            <Paragraph>
              <Text strong={true}>Expected Delivery Time</Text>
              {offer.expectedDeliveryTime}
            </Paragraph>
          </Typography>
        }
      />
    </Card>
	</Spin>
  );
};
export default OfferItem;
