import React, { FC, useContext, useState } from "react"
import s from "./login.module.css"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import { AuthContext } from "../../context/auth"
import { FaUser } from "react-icons/fa"
import { Spin } from "antd"
import { Button } from "antd"
import { useHistory } from "react-router"

const Login: FC<{}> = () => {
    const history = useHistory()
    const value = useContext(AuthContext)
    const { firebase } = value

    const [loading, setLoading] = useState<boolean>(false)

    const uiConfig = {
        signInFlow: "popup",
        signInSuccessUrl: "/",
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
    }

    const handleSignIn = async () => {
        setLoading(true)
        const res = await firebase.auth().signInAnonymously()
        console.log(res)
        history.push("/")
    }

    return (
        <div className={s.loginCard}>
            <FaUser style={{ fontSize: "10vh" }} />
            <h1 style={{ fontSize: "8vh" }}>Group Buy</h1>
            <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={firebase.auth()}
            />
            {loading ? (
                <Spin spinning={loading}></Spin>
            ) : (
                <Button
                    style={{ width: "220px" }}
                    type="primary"
                    onClick={handleSignIn}
                >
                    Guest sign in
                </Button>
            )}
        </div>
    )
}

export default Login
