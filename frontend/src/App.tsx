
import React, { useState } from 'react';
import "./App.css";
import { BrowserRouter, Router, Route, Redirect, Switch } from 'react-router-dom';
import { AuthContext, useAuth } from './context/auth';
import { UserContext, ProfileObject } from './context/user';
import { Spin } from 'antd';


const Main = React.lazy(() => import('./pages/main'));
const Login = React.lazy(() => import('./pages/login'));

function App() {

  const existingProfile = JSON.parse(localStorage.getItem('profileObj') || '{}');
  const [profileObj, setProfileObject] = useState(existingProfile);
  const existingTokens: string = JSON.parse(localStorage.getItem('tokens') || '{}');
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setProfile = (data: ProfileObject) => {
      localStorage.setItem('profileObj', JSON.stringify(data));
      setProfileObject(data);
  };
  const setTokens = (data: string) => {
      localStorage.setItem('tokens', JSON.stringify(data));
      setAuthTokens(data);
  };

  const removeUserProfile = () => {
      localStorage.setItem('profileObj', JSON.stringify('{}'));
      setProfileObject({});
  };

  const removeTokens = () => {
      localStorage.setItem('tokens', JSON.stringify('{}'));
      setAuthTokens('{}');
  };

  const login = (history: any, token: string, profile: ProfileObject) => {
      setTokens(token);
      setProfile(profile);
      history.push('/');
  };

  const logout = (history: any) => {
      removeUserProfile();
      removeTokens();
      history.push('/login');
  };

  // A wrapper for <Route> that redirects to the login
  // screen if you're not yet authenticated.
  function PrivateRoute({ Comp, ...rest }) {
      const isAuthenticated = useAuth();
      console.log(isAuthenticated.authTokens === '{}');
      const redirect = isAuthenticated.authTokens === '{}' || isAuthenticated.authTokens === '' ? true: false;
    
      return (
          <Route
              exact
              {...rest}
              render={({ location }) =>
                  redirect ? (
                      <Comp />
                  ) : (
                      <Redirect
                          to={{
                              pathname: '/login',
                              state: { from: location },
                          }}
                      />
                  )
              }
          />
      );
  }


  return ( <div className="App">
      <header className="App-header">
        <BrowserRouter>
        <AuthContext.Provider
                value={{
                    authTokens,
                    login: login,
                    logout: logout,
                }}
            >
                  <UserContext.Provider
                    value={{
                        profileObj: profileObj,
                    }}
                >
            
                        <React.Suspense
                            fallback={
                                <React.Fragment>
                                    <Spin />
                                </React.Fragment>
                            }
                        >
                            <Switch>
                                <PrivateRoute exact path="/" Comp={Main}></PrivateRoute>
                                <Route exact path="/login" component={Login} />
                            </Switch>
                        </React.Suspense>
            
                    </UserContext.Provider>
              </AuthContext.Provider>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
