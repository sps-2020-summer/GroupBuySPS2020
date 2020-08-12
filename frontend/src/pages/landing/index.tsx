import React, { FC } from "react"
import s from "./landing.module.css"
import {
    FaPeopleCarry,
    FaGithub,
    FaLinkedin,
    FaTasks,
    FaHandsHelping,
    FaHireAHelper,
    FaUserFriends,
    FaPortrait,
} from "react-icons/fa"
import { Typography, PageHeader, Button, Divider } from "antd"
import { FaUser } from "react-icons/fa"
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
                    <Typography className={`${s.alignCenter} ${s.headerText}`}>
                        <FaPeopleCarry style={{ fontSize: "10vh" }} />
                        <Title level={2}>Stuck at Work / School / Home?</Title>
                    </Typography>

                    <div className={s.pitchBox}>
                        <div className={`${s.alignCenter} ${s.headerText}`}>
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
                </div>

                <div className={s.introColumn}>
                    <Divider />
                    <Typography className={s.alignCenter}>
                        <Title level={2}>
                            Introducing <Text strong={true}>GroupBuy</Text>
                            <br />
                            <Text type="secondary">
                                {" "}
                                Connect with others in your community and help
                                each other!
                            </Text>
                        </Title>
                    </Typography>
                </div>

                <div className={s.infoColumn}>
                    <div className={`${s.box} ${s.boxReq}`}>
                        <Typography>
                            <div style={{ display: "flex" }}>
                                <Title> Request</Title>
                                <FaUserFriends
                                    style={{
                                        marginLeft: "auto",
                                        fontSize: "5vh",
                                    }}
                                />
                            </div>

                            <Paragraph>
                                Make a <Text strong={true}>Request</Text> for
                                something you desire!
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
                            <div style={{ display: "flex" }}>
                                <Title>Task</Title>
                                <FaTasks
                                    style={{
                                        marginLeft: "auto",
                                        fontSize: "5vh",
                                    }}
                                />
                            </div>

                            <Paragraph>Want something to do? </Paragraph>
                            <Paragraph>
                                Search for available tasks to fufil!
                            </Paragraph>
                            <Paragraph>
                                Complete a task to earn a fee!
                            </Paragraph>
                        </Typography>
                    </div>
                    <div className={`${s.box} ${s.boxOffer}`}>
                        {" "}
                        <Typography>
                            <div style={{ display: "flex" }}>
                                <Title> Offer</Title>
                                <FaHandsHelping
                                    style={{
                                        marginLeft: "auto",
                                        fontSize: "5vh",
                                    }}
                                />
                            </div>

                            <Paragraph>Going somewhere?</Paragraph>
                            <Paragraph>
                                Open an offer and fufil requests!
                            </Paragraph>

                            <Paragraph>Be rewarded with a fee!</Paragraph>
                        </Typography>
                    </div>
                </div>

                <div className={s.firstSection}>
                    <div className={s.pitchBox}>
                        <Divider />
                        <Typography className={s.alignCenter}>
                            <Paragraph>
                                <h3>Ready to try it out?</h3>
                                <Text>
                                    <Button
                                        className={s.loginStyle}
                                        key="1"
                                        type="primary"
                                        onClick={() => history.push("/login")}
                                    >
                                        Click me
                                    </Button>
                                </Text>
                            </Paragraph>
                        </Typography>
                        <Divider />
                        <Typography className={s.alignCenter}>
                            <Paragraph>
                                <h3>Brought to you by</h3>
                            </Paragraph>
                        </Typography>
                    </div>
                </div>
                <div className={s.infoColumnDev}>
                    <div className={s.box}>
                        <Typography>
                            <Title>Katherine Kee</Title>
                            <FaGithub onClick={() => window.location.assign('https://github.com/leafgecko')} style={{ fontSize: "5vh" }} />
                            <FaLinkedin onClick={() => window.location.assign('https://www.linkedin.com/in/katherine-kee-wan-ting/')} style={{ fontSize: "5vh" }} />
                        </Typography>
                    </div>
                    <div className={s.box}>
                        <Typography>
                            <Title>Poh Lin Wei</Title>
                            <FaGithub onClick={() => window.location.assign('https://github.com/pohlinwei')} style={{ fontSize: "5vh" }} />
                            <FaPortrait onClick={() => window.location.assign('https://pohlinwei.github.io/')} style={{ fontSize: "5vh" }} />
                        </Typography>
                    </div>
                    <div className={s.box}>
                        <Typography>
                            <Title>Eugene Teu</Title>
                            <FaGithub onClick={() => window.location.assign('https://github.com/EugeneTeu')} style={{ fontSize: "5vh" }} />
                            <FaLinkedin onClick={() => window.location.assign('https://www.linkedin.com/in/eugeneteu/')} style={{ fontSize: "5vh" }} />
                        </Typography>
                    </div>
                </div>
                <div className={s.introColumn}>
                    <Divider />
                    <Text>All rights reserved</Text>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
