import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/admin.module.css';

interface adminProps {}

const admin: FC<adminProps> = () => {
    const { user } = useAuth();

    const router = useRouter();

    useEffect(() => {
        if (!user.admin) {
            router.push('/');
        }
    }, []);

    if (!user.admin) return <></>;
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Admin</h1>
        </div>
    );
};

export default admin;
