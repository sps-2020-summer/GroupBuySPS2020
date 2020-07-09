import React, { FC, useContext } from "react";
import { Card, Button } from "antd";
import s from "./login.module.css";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
import { AuthContext } from "../../context/auth";
import { FaUser } from "react-icons/fa";

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
		<div className={s.loginCard}>
			<FaUser style={{ fontSize: "10vh" }} />
			<h1 style={{ fontSize: "8vh" }}>Group Buy</h1>

			<StyledFirebaseAuth
				uiConfig={uiConfig}
				firebaseAuth={firebase.auth()}
			/>
		</div>
	);
};

export default Login;
