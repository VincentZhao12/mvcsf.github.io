import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';
import EventInput from '../../components/EventInput';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/events.module.css';

interface eventsProps {}

const events: FC<eventsProps> = () => {
    const router = useRouter();

    const { user } = useAuth();

    useEffect(() => {
        if (!user.admin) {
            router.push('/');
        }
    }, []);
    return (
        <div className={styles.container}>
            <EventInput />
        </div>
    );
};

export const getServerSideProps = async () => {
    return {
        props: {},
    };
};

export default events;
