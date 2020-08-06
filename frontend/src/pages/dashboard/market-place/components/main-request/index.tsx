import React, { FC, useEffect, useState, useCallback, useContext } from "react"
import {
    Card,
    Typography,
    Spin,
    List,
    Space,
    Button,
    Modal,
    message,
} from "antd"
import s from "../../main.module.css"

import { Request } from "../../../../../logic/requestlogic"
import { MessageOutlined, LikeOutlined, StarOutlined } from "@ant-design/icons"
import UserCreateRequestComponent from "./user-request"
import { FirebaseContext } from "../../../../../context/firebase-context"
import firebase from "firebase"
import ViewTask from "../../../../../components/view-task"
import {
    fulfilRequest,
    getOpenRequests,
} from "../../../../../logic/requestlogic"
import moment from "moment"

const { Title, Paragraph, Text } = Typography
type Props = {
    uid: string | undefined
    email: string | undefined | null
}
const MainRequest: FC<Props> = ({ uid, email }) => {
    const firebaseContext = useContext(FirebaseContext)
    const { firebaseApp } = firebaseContext
    const db = firebase.firestore(firebaseApp as firebase.app.App)
    const [loading, setLoading] = useState<boolean>(true)
    const [requests, setRequests] = useState<Request[]>([])

    const [modalReq, setModalReq] = useState<Request | null>(null)
    const [visible, setVisible] = useState<boolean>(false)

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    )

    const fetchRequest = useCallback(async () => {
        try {
            setLoading(true)
            const res = await getOpenRequests()
            setRequests(res)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchRequest()
    }, [])
    console.log(requests)

    const handleClick = (_, item: Request) => {
        setModalReq(item)
        setVisible(true)
    }
    const handleCancel = () => {
        setModalReq(null)
        setVisible(false)
    }

    const handleOkay = async () => {
        try {
            setLoading(true)

            if (!modalReq || !uid) {
                throw new Error("modalReq undefined")
            }

            await fulfilRequest(modalReq?.id, uid)
            fetchRequest()
            setVisible(false)
            setLoading(false)

            message.success("Request added to dashboard")
        } catch (err) {
            message.error(err)
        }
    }

    console.log(requests)

    return (
        <div className={s.content}>
            <div className={s.userActions}>
                <div className={s.column}>
                    <UserCreateRequestComponent
                        uid={uid}
                        email={email}
                        fetchRequest={fetchRequest}
                    />
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
                                        console.log(page)
                                    },
                                    pageSize: 4,
                                }}
                                split={false}
                                dataSource={requests}
                                renderItem={(item: Request, index: number) => (
                                    <List.Item
                                        key={item.task.item ?? "-" + index}
                                        actions={[
                                            <Button
                                                type="primary"
                                                onClick={(e) =>
                                                    handleClick(e, item)
                                                }
                                            >
                                                View
                                            </Button>,
                                            <IconText
                                                icon={StarOutlined}
                                                text=""
                                                key="list-vertical-star-o"
                                            />,
                                            <IconText
                                                icon={LikeOutlined}
                                                text=""
                                                key="list-vertical-like-o"
                                            />,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={item.task.item}
                                            description={item.task.shopLocation}
                                        />
                                    </List.Item>
                                )}
                            />
                        </>
                    )}
                </Card>
            </div>
            <Modal
                maskClosable={false}
                title="View Request"
                visible={visible}
                onCancel={handleCancel}
                onOk={handleOkay}
                okText="fufil request?"
            >
                <Typography>
                    <Title> Shop location: {modalReq?.task.shopLocation}</Title>
                    <Paragraph>
                        <Text strong={true}>Expected Delivery Time: </Text>
                        {modalReq &&
                            moment
                                .unix(modalReq?.task.expectedDeliveryTime)
                                .format("dddd, MMMM Do YYYY, h:mm:ss a")}
                    </Paragraph>
                    <Paragraph>
                        <Text strong={true}>Delivery Location: </Text>
                        {modalReq?.task.deliveryLocation}
                    </Paragraph>
                    <Paragraph>
                        <Text strong={true}>Item: </Text>
                        {modalReq?.task.item}
                    </Paragraph>
                    <Paragraph>
                        <Text strong={true}>Fees: </Text>
                        {modalReq?.task.fee}
                    </Paragraph>
                </Typography>
            </Modal>
        </div>
    )
}
export default MainRequest
