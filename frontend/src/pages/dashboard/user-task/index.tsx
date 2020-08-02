import React, { FC, useState, useEffect, useCallback } from 'react';
import { DashboardCompProps } from '..';
import { List } from 'antd';
import { Task, getCurrentTasks } from '../../../logic/tasklogic';
import { Slide } from 'react-awesome-reveal';
import TaskItem from './task-item';
import Loader from '../../../components/loader';
import { NoTaskText, TaskHelpText } from '../../../components/help-text';
import s from './s.module.css';

const UserTask: FC<DashboardCompProps> = ({ userUid }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
    const fetchTask = useCallback(async () => {
        try {
            setLoading(true);
            const { pending } = await getCurrentTasks(userUid);
            setPendingTasks(pending);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTask();
    }, []);

    return (
        <>
            <Slide triggerOnce direction={'bottom'}>
                <TaskHelpText />
            </Slide>
            <br />
            <div className={s.list}>
                {loading ? (
                    <Loader spin={loading} topMargin={'24px'} />
                ) : (
                    <>
                        {pendingTasks.length === 0 ? (
                            <NoTaskText />
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
                                dataSource={pendingTasks}
                                renderItem={(item) => (
                                    <List.Item>
                                        <TaskItem
                                            fetch={fetchTask}
                                            task={item}
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

export default UserTask;
