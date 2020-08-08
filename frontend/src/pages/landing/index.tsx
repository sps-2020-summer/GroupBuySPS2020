import React, { FC } from "react"
import s from "./landing.module.css"
import { FaPeopleCarry } from "react-icons/fa"
import { Typography, PageHeader, Button } from "antd"
import { useHistory } from "react-router"

const { Paragraph, Title, Text } = Typography

const LandingPage: FC = () => {
    const history = useHistory()

    return (
        <div className={s.grid}>
            <header>
                <PageHeader
                    style={{ width: "100%" }}
                    title={"GroupBuy"}
                    subTitle={"An SPS project"}
                    extra={
                        <Button
                            className={s.loginStyle}
                            key="1"
                            type="primary"
                            onClick={() => history.push("/login")}
                        >
                            Login
                        </Button>
                    }
                ></PageHeader>
            </header>
            <div className={s.content}>
                <div className={s.firstSection}>
                    <Typography className={s.alignCenter}>
                        <Title level={2}>Stuck at Work/School/Home?</Title>
                    </Typography>

                    <div className={s.pitchBox}>
                        <div className={`${s.box} ${s.boxPitch}`}>
                            <Typography>
                                <Paragraph>
                                    <h3>Want a late night snack?</h3>
                                    <Text>
                                        {" "}
                                        Food delivery is just not worth it for
                                        1?{" "}
                                    </Text>

                                    <h3>
                                        Cannot spare the time to fight with the
                                        lunch crowd?
                                    </h3>

                                    <Text>
                                        Not worth to travel 20 minutes for your
                                        bubble tea fix?
                                    </Text>
                                </Paragraph>
                            </Typography>
                        </div>
                    </div>
                    <br />
                </div>

                <div className={s.introColumn}>
                    <Typography className={s.alignCenter}>
                        <Title level={2}>
                            Introducing <Text strong={true}>GroupBuy</Text>
                        </Title>
                        <Title level={3}>
                            Connect with others in your community and help each
                            other!
                        </Title>
                    </Typography>
                </div>

                <div className={s.infoColumn}>
                    <div className={`${s.box} ${s.boxReq}`}>
                        <Typography>
                            <Title>Request</Title>
                            <Paragraph>
                                Make a <Text strong={true}>Request</Text> for
                                your item
                            </Paragraph>
                            <Paragraph>Wait for your confirmation</Paragraph>
                            <Paragraph>
                                Get your <Text strong={true}>food</Text>!
                            </Paragraph>
                        </Typography>
                    </div>
                    <div className={`${s.box} ${s.boxTask}`}>
                        {" "}
                        <Typography>
                            <Title>Task</Title>
                            <Paragraph>Search for available requests</Paragraph>
                            <Paragraph>Select a task to fufil</Paragraph>
                            <Paragraph>
                                Complete a task to earn a fee!
                            </Paragraph>
                        </Typography>
                    </div>
                    <div className={`${s.box} ${s.boxOffer}`}>
                        {" "}
                        <Typography>
                            <Title>Offer</Title>
                            <Paragraph>Make a Request for food</Paragraph>
                        </Typography>
                    </div>
                </div>

                <div className={s.firstSection}>
                    <div className={s.pitchBox}>
                        <div className={`${s.box} ${s.boxPitch}`}>
                            <Typography>
                                <Paragraph>
                                    <h3>Ready to try it out?</h3>
                                    <Text>
                                        <Button
                                            className={s.loginStyle}
                                            key="1"
                                            type="primary"
                                            onClick={() =>
                                                history.push("/login")
                                            }
                                        >
                                            Click me
                                        </Button>
                                    </Text>
                                </Paragraph>
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
