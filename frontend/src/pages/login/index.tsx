import React, { FC } from 'react'
import { Card, Button } from 'antd';
import * as s from './login.module.css';

const Login: FC<{}> = () => {

    return (
        <Card className={s['loginCard']}>
            <h1>Group Buy</h1>
            
            <div  className={s['actionArea']}>
            <Button type='primary'>Google Login</Button>
            {
            // guest to login during testing 
            }
            <Button type='dashed'>Guest Login</Button>
            </div>
        </Card>);
}

export default Login;