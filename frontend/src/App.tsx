import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { AuthContext, useAuth } from "./context/auth";
import { UserContext, ProfileObject } from "./context/user";
import { Spin } from "antd";
import { Layout } from "antd";
import firebase from "firebase";

import { useAuthState } from "react-firebase-hooks/auth";

const Main = React.lazy(() => import("./pages/main"));
const Login = React.lazy(() => import("./pages/login"));
const Dashboard = React.lazy(() => import("./pages/dashboard"));

const App = () => {
	const [user, loading, error] = useAuthState(firebase.auth());

	if (loading) return <Spin></Spin>;

	// A wrapper for <Route> that redirects to the login
	// screen if you're not yet authenticated.
	const PrivateRoute = ({ Comp, ...rest }) => {
		const redirect = user === null;
		return (
			<Route
				exact
				{...rest}
				render={({ location }) =>
					redirect ? (
						<Redirect
							to={{
								pathname: "/login",
								state: { from: location },
							}}
						/>
					) : (
						<Comp />
					)
				}
			/>
		);
	};

	return (
		<Layout className="background">
			<BrowserRouter>
				<React.Suspense
					fallback={
						<React.Fragment>
							<Spin />
						</React.Fragment>
					}
				>
					<Switch>
						<PrivateRoute exact path="/" Comp={Main}></PrivateRoute>
						<PrivateRoute
							exact
							path="/dashboard"
							Comp={Dashboard}
						></PrivateRoute>
						<Route exact path="/login" component={Login} />
					</Switch>
				</React.Suspense>
			</BrowserRouter>
		</Layout>
	);
};

export default App;
