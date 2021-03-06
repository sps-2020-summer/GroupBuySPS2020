import React, { FC, useState, useContext, useEffect, useCallback } from "react"
import s from "../../main.module.css"
import {
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    Typography,
    InputNumber,
    message,
} from "antd"
import { FormInstance } from "antd/lib/form"
import { MoneyCollectOutlined } from "@ant-design/icons"

import { addRequest } from "../../../../../logic/requestlogic"
import { Request } from "../../../../../logic/requestlogic"
import { getCurrentRequests } from "../../../../../logic"
const { Title, Paragraph } = Typography

type Props = {
    uid: string | undefined
    fetchRequest: () => Promise<void>
    email: string | undefined | null
}
const UserCreateRequestComponent: FC<Props> = ({
    fetchRequest,
    uid,
    email,
}) => {

    const [loading, setLoading] = useState<boolean>(false)

    const formRef = React.createRef<FormInstance>()
    const [visible, setVisible] = useState<boolean>(false)
    const [requests, setRequests] = useState<Request[]>([])

    const handleOk = () => {
        console.log(formRef.current)
        formRef.current?.submit()
    }
    const fetchRequests = useCallback(async () => {
        if (uid === undefined) return
        try {
            setLoading(true)
            const { open } = await getCurrentRequests(uid)
            setRequests(open)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchRequests()
    }, [])

    const showModal = () => setVisible(true)
    const handleCancel = () => setVisible(false)
    // add only payerName , shopLocation, expectedDeliveryTime , item, fee

    const onFinish = async (values) => {
        console.log("Success:", values)
        try {
            setLoading(true)
            let emailName = ""
            if (email !== null && email !== undefined) {
                emailName = email
            }
            await addRequest(
                uid ?? "-",
                values.shopLocation,
                values.deliveryLocation,
                values.expectedDeliveryTime.unix(),
                values.item,
                values.fee
            )
            message.success("Request added successfully")
            await fetchRequest()
            await fetchRequests()
            setVisible(false)
            setLoading(false)

        } catch (err) {
            console.log(err)
        }
    }

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
                <Title>{email}</Title>
                <Paragraph>
                    You currently have {requests.length} requests open
                </Paragraph>
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
                        label={"Shop location"}
                        name="shopLocation"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please input the location of the shop",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={"Delivery location"}
                        name="deliveryLocation"
                        rules={[
                            {
                                required: true,
                                message: "Please input the delivery location",
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
                    <Form.Item
                        label="fee"
                        name="fee"
                        rules={[
                            {
                                required: true,
                                message: "Fee is required",
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Modal>
            </Form>
        </>
    )
}

export default UserCreateRequestComponent
