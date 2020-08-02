import React from 'react'
import './App.css'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { Spin } from 'antd'
import { Layout } from 'antd'
import firebase from 'firebase'

import { useAuthState } from 'react-firebase-hooks/auth'
import Loader from './components/loader'

const Main = React.lazy(() => import('./pages/dashboard/market-place'))
const Login = React.lazy(() => import('./pages/login'))
const Dashboard = React.lazy(() => import('./pages/dashboard'))

const App = () => {
    const [user, loading] = useAuthState(firebase.auth())

    if (loading)
        return (
            <div
                style={{
                    height: '10em',
                    position: 'relative',
                }}
            >
                <Loader spin={true} topMargin={'30vh'} bottomMargin={'30vh'} />
            </div>
        )

    // A wrapper for <Route> that redirects to the login
    // screen if you're not yet authenticated.
    const PrivateRoute = ({ Comp, ...rest }) => {
        const redirect = user === null
        return (
            <Route
                exact
                {...rest}
                render={({ location }) =>
                    redirect ? (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: location },
                            }}
                        />
                    ) : (
                        <Comp />
                    )
                }
            />
        )
    }

    return (
        <Layout className="background">
            <BrowserRouter>
                <React.Suspense
                    fallback={
                        <React.Fragment>
                            <Loader
                                spin={loading}
                                topMargin={'30vh'}
                                bottomMargin={'30vh'}
                            />
                        </React.Fragment>
                    }
                >
                    <Switch>
                        <PrivateRoute
                            exact
                            path="/"
                            Comp={Dashboard}
                        ></PrivateRoute>
                        <Route exact path="/login" component={Login} />
                    </Switch>
                </React.Suspense>
            </BrowserRouter>
        </Layout>
    )
}

export default App
