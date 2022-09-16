import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/admin.module.css';

interface adminProps {}

const Admin: FC<adminProps> = () => {
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
            <div className={styles.features}>
                <Card>
                    <h3>Users Dashboard</h3>
                    <p>
                        Use this dashboard to view all the members and make any
                        edits that you need to them. Also use this dashboard to
                        activate and deactivate users.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/admin/users')}
                    >
                        View Dashboard <AiOutlineArrowRight />
                    </Button>
                </Card>
                <Card>
                    <h3>Events Dashboard</h3>
                    <p>
                        Use this dashboard to view, create, edit, and delete
                        events. Also use this dashboard to activate and
                        deactivate users.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/admin/events')}
                    >
                        View Dashboard <AiOutlineArrowRight />
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default Admin;
