import React , {FC } from 'react'
import { Card, Button } from 'antd';
import * as s from './login.module.css';

const Login : FC<{}> = () => {

    return <Card className={s['loginCard']}>
        <h1>Group Buy</h1>
        <Button type='primary'>Google Login</Button>
        

       
    </Card>
}

export default Login;