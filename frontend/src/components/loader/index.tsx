import React, { FC } from 'react';
import { Spin } from 'antd'

type Prop = {
    spin: boolean;
    topMargin?: string;
    bottomMargin?: string;
}

const Loader: FC<Prop> = ({ spin, topMargin, bottomMargin }) => {


    return <div style={{ display: 'flex', flexDirection: 'row', marginTop: topMargin, marginBottom: bottomMargin }}>
        <Spin style={{ marginLeft: 'auto', marginRight: 'auto' }} spinning={spin}></Spin>
    </div>
}


export default Loader;