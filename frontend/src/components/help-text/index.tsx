import { Typography, Card } from "antd"
import React from "react"
import s from "./s.module.css"

const { Paragraph, Title, Text } = Typography

export const NoTaskText = () => (
    <Card className={s.cardStyleWarning}>
        <Typography>
            <Paragraph>
                <Text strong> Hmm... You have no current tasks.</Text> <br />
                But do you have some spare time to help others? Or do you simply
                want to make some quick bucks?
                <br />
                <Text strong>
                    If so, head to the "Marketplace" to accept requests, or to
                    create a new offer by clicking the "Offers" tab at
                    "Marketplace"!
                </Text>
            </Paragraph>
        </Typography>
    </Card>
)

export const TaskHelpText = () => (
    <Card className={s.cardStyle}>
        <Typography>
            <Title>Tasks</Title>

            <Paragraph>
                <Text strong>
                    This is a list of Tasks that you have undertaken.
                </Text>
                <br />
                <Text>
                    Each task specifies the item(s) you others have asked you to
                    buy,
                </Text>
                <br />
                <Text>
                    where the item(s) should be purchased from, when the item is
                    to be delivered,
                </Text>
                <br />
                <Text>
                    and how much you are paid for the purchase and delivery
                    costs.
                </Text>
            </Paragraph>
        </Typography>
    </Card>
)

export const NoOfferText = () => (
    <Card className={s.cardStyleWarning}>
        <Typography>
            <Paragraph>
                <Text strong>Hmm... You have no offers.</Text> <br />
                But are you going out to get something? Want to help others to
                make their purchases along the way?
                <br />
                <Text strong>
                    If so, start by creating an offer to help others!
                </Text>
            </Paragraph>
        </Typography>
    </Card>
)

export const OfferHelpText = () => (
    <Card className={s.cardStyle}>
        <Typography>
            <Title>Offers</Title>

            <Paragraph>
                <Text strong>
                    This is a list of offers you have made to help others.
                </Text>
                <br />
                <Text>
                    Each offer specifies which shop you will be visiting and
                    approximately when you will be able to deliver the items.
                </Text>
                <br />
                <Text>
                    Those who are interested would then make requests that are
                    compatible with your offer.
                </Text>
                <br />
                <Text>
                    After which, you may view their requests by navigating to
                    "My Tasks".
                </Text>
            </Paragraph>
        </Typography>
    </Card>
)

export const NoRequestText = ({ status }) => (
    <Card className={s.cardStyleWarning}>
        <Typography>
            <Paragraph>
                <Text strong>Hmm... You have no {status} requests. </Text>{" "}
                <br /> But do you need something but can't find the time or
                energy to get them?
                <br />
                <Text>Make a new request for others to get it for you!</Text>
            </Paragraph>
        </Typography>
    </Card>
)

export const RequestHelpText = () => (
    <Card className={s.cardStyle}>
        <Typography>
            <Title>Requests</Title>
            <Paragraph>
                <Text strong>This is a list of your requests.</Text>
                <br />
                <Text>
                    Each request specifies the item(s) you have asked others to
                    buy,
                </Text>
                <br />
                <Text>
                    where the item(s) should be purchased from, when you want
                    the items delivered,
                </Text>
                <br />
                <Text>
                    and how much you are willing to pay for the purchase and
                    delivery costs.
                </Text>
            </Paragraph>
        </Typography>
    </Card>
)

export const HistoryHelpText = () => (
    <Card className={s.cardStyle}>
        <Typography>
            <Title>History</Title>
            <Paragraph>
                <Text strong>This is your user history</Text>
                <br />
                <Text strong>
                    Tasks, Requests and Offers here are EXPIRED, DONE or
                    CANCELLED
                </Text>
            </Paragraph>
        </Typography>
    </Card>
)

export const NoHistoryRequestText = () => (
    <Card className={s.cardStyleWarning}>
        <Typography>
            <Paragraph>
                <Text strong>Hmm... You have no past requests. </Text>
            </Paragraph>
        </Typography>
    </Card>
)

export const NoHistoryOfferText = () => (
    <Card className={s.cardStyleWarning}>
        <Typography>
            <Paragraph>
                <Text strong>Hmm... You have no past Offers. </Text>
            </Paragraph>
        </Typography>
    </Card>
)

export const NoHistoryTaskText = () => (
    <Card className={s.cardStyleWarning}>
        <Typography>
            <Paragraph>
                <Text strong>Hmm... You have no past Tasks. </Text>
            </Paragraph>
        </Typography>
    </Card>
)
