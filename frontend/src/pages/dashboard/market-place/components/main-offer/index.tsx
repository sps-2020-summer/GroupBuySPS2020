import React, { FC, useEffect, useState, useCallback, useContext } from "react"
import { Card, Typography, Spin, List, Space, Button, Modal } from "antd"
import s from "../../main.module.css"
import { Offer, getOpenOffers } from "../../../../../logic/offerlogic"
import { LikeOutlined, StarOutlined } from "@ant-design/icons"
import UserCreateOfferComponent from "./user-offer"
import CreateRequest from "../../../../../components/create-request"
import moment from "moment"

const { Title, Paragraph, Text } = Typography

type Props = {
    uid: string | undefined
    email: string | undefined | null
}

const MainOffer: FC<Props> = ({ uid, email }) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [offers, setOffers] = useState<Offer[]>([])

    const [modalOffer, setModalOffer] = useState<Offer | null>(null)
    const [visible, setVisible] = useState<boolean>(false)
    const [requestVisible, setReqVisible] = useState<boolean>(false)

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    )
    const fetchOffer = useCallback(async () => {
        try {
            setLoading(true)
            const res = await getOpenOffers()
            setOffers(res)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchOffer()
    }, [])

    const handleClick = (_, item: Offer) => {
        setModalOffer(item)
        setVisible(true)
    }
    const handleCancel = () => {
        setModalOffer(null)
        setVisible(false)
    }
    const handleOkay = () => {
        setReqVisible(true)
    }

    return (
        <div className={s.content}>
            <div className={s.userActions}>
                <div className={s.column}>
                    <UserCreateOfferComponent
                        email={email}
                        uid={uid}
                        fetchOffer={fetchOffer}
                    />
                </div>
            </div>
            <div className={s.requestBoard}>
                <Card className={s.requestBackground}>
                    <Typography>
                        <Title>Available Offers</Title>
                        <Paragraph>
                            These are the current offers users have posted
                        </Paragraph>
                    </Typography>
                    {loading ? (
                        <Spin></Spin>
                    ) : (
                        <>
                            {offers.length === 0 ? (
                                <>You currently have no offers opened!</>
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
                                dataSource={offers}
                                renderItem={(item, index: number) => (
                                    <List.Item
                                        key={item.title ?? "" + index}
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
                                            title={item.title}
                                            description={item.description}
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
                title="View Offer"
                visible={visible}
                onCancel={handleCancel}
                onOk={handleOkay}
                okText="Open Request?"
            >
                <Typography>
                    <Title>{modalOffer?.title}</Title>
                    <Paragraph>
                        <Text strong={true}>Shop location: </Text>
                        {modalOffer?.shopLocation}
                    </Paragraph>
                    <Paragraph>
                        <Text strong={true}>Status: </Text>
                        {modalOffer?.status}
                    </Paragraph>
                    <Paragraph>
                        <Text strong={true}>Delivery location: </Text>
                        {modalOffer?.deliveryLocation}
                    </Paragraph>
                    <Paragraph>
                        <Text strong={true}>Delivery time: </Text>
                        {modalOffer &&
                            moment
                                .unix(modalOffer?.expectedDeliveryTime)
                                .format("dddd, MMMM Do YYYY, h:mm:ss a")}
                    </Paragraph>
                </Typography>
            </Modal>
            <CreateRequest
                offer={modalOffer}
                uid={uid}
                fetch={fetchOffer}
                title={"Request to this offer"}
                visible={requestVisible}
                setVisible={setReqVisible}
            />
        </div>
    )
}
export default MainOffer
