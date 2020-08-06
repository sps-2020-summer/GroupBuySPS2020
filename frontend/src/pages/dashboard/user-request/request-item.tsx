import React, { FC, useState } from "react"
import { Card, Typography, message, Button } from "antd"
import { CheckOutlined, CloseCircleFilled } from "@ant-design/icons"

import s from "./s.module.css"
import { Request, markRequestAsDone, cancelRequest } from "../../../logic"
import { convertToDate } from "../../../logic/utilities"
import { Status } from "../../../types"
const { Title, Text, Paragraph } = Typography

type Props = {
    request: Request
    fetch?: () => Promise<void>
}

const RequestItem: FC<Props> = ({ request, fetch }) => {
    const [loading, setLoading] = useState(false)
    if (!fetch || request.task.status === Status.DONE) {
        return (
            <Card className={s.cardStyle}>
                <Card.Meta
                    description={
                        <Typography>
                            <Title>{request.task.item}</Title>
                            <Paragraph>
                                <Text strong={true}>Shop Location: </Text>
                                {request.task.shopLocation}
                            </Paragraph>
                            <Paragraph>
                                <Text strong={true}>Delivery Location: </Text>
                                {request.task.deliveryLocation}
                            </Paragraph>
                            <Paragraph>
                                <Text strong={true}>
                                    Expected Delivery Time:
                                </Text>
                                {` ${convertToDate(
                                    request.task.expectedDeliveryTime
                                )}`}
                            </Paragraph>
                            <Paragraph>
                                <Text strong={true}>Fee: </Text>
                                {request.task.fee}
                            </Paragraph>
                            <Paragraph>
                                <Text strong={true}>Doer: </Text>
                                {request.task.uid}
                            </Paragraph>
                            <Paragraph>
                                <Text strong={true}>Status: </Text>
                                {request.task.status}
                            </Paragraph>
                        </Typography>
                    }
                />
            </Card>
        )
    }
    const handleDone = async () => {
        try {
            setLoading(true)
            await markRequestAsDone(request.id)
            await fetch()
            message.success("request marked as completed!")
        } catch (err) {
            message.error(err)
        }
    }

    const handleCancel = async () => {
        try {
            setLoading(true)
            await cancelRequest(request.id)
            await fetch()
            message.success("request cancelled!")
        } catch (err) {
            message.error(err)
        }
    }

    return (
        <Card
            className={s.cardStyle}
            actions={[
                <Button disabled={request.task.uid === ""} onClick={handleDone}>
                    Complete <CheckOutlined />{" "}
                </Button>,
                <Button onClick={handleDone}>
                    Cancel <CloseCircleFilled />{" "}
                </Button>,
            ]}
        >
            <Card.Meta
                description={
                    <Typography>
                        <Title>{request.task.item}</Title>
                        <Paragraph>
                            <Text strong={true}>Shop Location: </Text>
                            {request.task.shopLocation}
                        </Paragraph>
                        <Paragraph>
                            <Text strong={true}>Delivery Location: </Text>
                            {request.task.deliveryLocation}
                        </Paragraph>
                        <Paragraph>
                            <Text strong={true}>Expected Delivery Time: </Text>
                            {` ${convertToDate(
                                request.task.expectedDeliveryTime
                            )}`}
                        </Paragraph>
                        <Paragraph>
                            <Text strong={true}>Fee: </Text>
                            {request.task.fee}
                        </Paragraph>
                        <Paragraph>
                            <Text strong={true}>Doer: </Text>
                            {request.task.uid}
                        </Paragraph>
                        <Paragraph>
                            <Text strong={true}>Status: </Text>
                            {request.task.status}
                        </Paragraph>
                    </Typography>
                }
            />
        </Card>
    )
}
export default RequestItem
