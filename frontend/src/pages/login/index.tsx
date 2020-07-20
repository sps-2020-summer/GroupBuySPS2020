import React, { FC, useContext } from "react";
import s from "./login.module.css";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { AuthContext } from "../../context/auth";
import { FaUser } from "react-icons/fa";

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
