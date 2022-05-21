import Link from 'next/link';
import router from 'next/router';
import React, { FC, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/admin.module.css';

interface adminProps {}

const admin: FC<adminProps> = () => {
    const { user } = useAuth();

    useEffect(() => {
        if (!user.admin) {
            router.push('/');
        }
    }, []);

    if (!user.admin) return <></>;
    return (
        <div className={styles.container}>
            <h1>Admin</h1>
            <Link href="/admin/users">User Dashboard</Link>
            <Link href="/admin/events">Events</Link>
        </div>
    );
};

export default admin;
