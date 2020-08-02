import React, { FC, useState, useEffect, useCallback } from 'react';
import { DashboardCompProps } from '..';
import { Request } from '../../../logic';
import { Slide } from 'react-awesome-reveal';
import { List } from 'antd';
import RequestItem from './request-item';
import Loader from '../../../components/loader';

import { getCurrentRequests } from '../../../logic/requestlogic';
import { RequestHelpText, NoRequestText } from '../../../components/help-text';
import s from './s.module.css';

const UserRequest: FC<DashboardCompProps> = ({ userUid }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
    const [openRequests, setOpenRequests] = useState<Request[]>([]);

    const fetchRequest = useCallback(async () => {
        try {
            setLoading(true);
            const { open, pending } = await getCurrentRequests(userUid);

            setOpenRequests(open);
            setPendingRequests(pending);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequest();
    }, [userUid]);

    console.log(openRequests.length);
    console.log(pendingRequests.length);

    return (
        <>
            <Slide triggerOnce direction={'bottom'}>
                <RequestHelpText />
            </Slide>
            <br />
            <div className={s.list}>
                {loading ? (
                    <Loader spin={loading} topMargin={'24px'} />
                ) : (
                    <>
                        <h1>Pending Requests</h1>
                        {pendingRequests.length == 0 ? (
                            <NoRequestText status="pending" />
                        ) : (
                            <List
                                key={'pending request'}
                                grid={{
                                    gutter: 16,
                                    xs: 1,
                                    sm: 2,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    xxl: 3,
                                }}
                                dataSource={pendingRequests}
                                renderItem={(item) => (
                                    <List.Item>
                                        <RequestItem
                                            fetch={fetchRequest}
                                            request={item}
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                        <h1>Open Requests</h1>
                        {openRequests.length === 0 ? (
                            <NoRequestText status="open" />
                        ) : (
                            <List
                                key={'open request'}
                                grid={{
                                    gutter: 16,
                                    xs: 1,
                                    sm: 2,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    xxl: 3,
                                }}
                                dataSource={openRequests}
                                renderItem={(item) => (
                                    <List.Item>
                                        <RequestItem
                                            fetch={fetchRequest}
                                            request={item}
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default UserRequest;
