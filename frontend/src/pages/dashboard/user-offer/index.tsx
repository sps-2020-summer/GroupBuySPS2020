import React, { FC, useState, useEffect, useCallback } from 'react';
import { DashboardCompProps } from '..';
import { List, Typography, Card } from 'antd';
import { Offer } from '../../../logic';
import { Slide } from 'react-awesome-reveal';
import TaskItem from './offer-item';
import Loader from '../../../components/loader';
import { getCurrentOffers } from '../../../logic';
import { OfferHelpText, NoOfferText } from '../../../components/help-text';
import s from './s.module.css';

const { Paragraph } = Typography;

const UserOffer: FC<DashboardCompProps> = ({ userUid }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [offers, setoffers] = useState<Offer[]>([]);
    const fetchOffers = useCallback(async () => {
        try {
            setLoading(true);
            const { open } = await getCurrentOffers(userUid);
            setoffers(open);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOffers();
    }, []);

    return (
        <>
            <Slide triggerOnce direction={'bottom'}>
                <OfferHelpText />
            </Slide>
            <br />
            <div className={s.list}>
                {loading ? (
                    <Loader spin={loading} topMargin={'24px'} />
                ) : (
                    <>
                        {offers.length === 0 ? (
                            <NoOfferText />
                        ) : (
                            <List
                                grid={{
                                    gutter: 16,
                                    xs: 1,
                                    sm: 2,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    xxl: 3,
                                }}
                                dataSource={offers}
                                renderItem={(item) => (
                                    <List.Item>
                                        <TaskItem
                                            offer={item}
                                            fetch={fetchOffers}
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

export default UserOffer;
