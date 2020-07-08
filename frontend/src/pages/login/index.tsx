import React, { FC, useContext } from "react";
import { Card, Button } from "antd";
import s from "./login.module.css";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
import { AuthContext } from "../../context/auth";

// Configure FirebaseUI.

const Login: FC<{}> = () => {
	const value = useContext(AuthContext);
	const { firebase } = value;

	const uiConfig = {
		signInFlow: "popup",
		signInSuccessUrl: "/dashboard",
		signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
	};

	return (
		<Card className={s.loginCard}>
			<h1>Group Buy</h1>
			<div className={s.actionArea}>
				<StyledFirebaseAuth
					uiConfig={uiConfig}
					firebaseAuth={firebase.auth()}
				/>
				<Button type="primary">Google Login</Button>
				{
					// guest to login during testing
				}
				<Button type="dashed">Guest Login</Button>
			</div>
		</Card>
	);
};

export default Login;
