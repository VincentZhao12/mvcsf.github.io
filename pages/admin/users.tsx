import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import Button from '../../components/Button';
import { db } from '../../config/firebase';
import { useAuth, User } from '../../context/AuthContext';
import styles from '../../styles/users.module.css';

interface usersProps {
    userData: User[];
}

const Users: FC<usersProps> = ({ userData }) => {
    const [activations, setActivations] = useState<boolean[]>(
        userData.map((user) => user.activated),
    );
    const activateUser = async (uid: string, value: boolean, index: number) => {
        const userDoc = doc(db, 'users', uid);
        let newActivations = [...activations];
        newActivations[index] = value;
        setActivations(newActivations);
        await updateDoc(userDoc, { activated: value });
    };
    const router = useRouter();

    const { user } = useAuth();

    useEffect(() => {
        if (!user.admin) {
            router.push('/');
        }
    }, []);

    if (!user.admin) return <></>;

    return (
        <div className={styles.container}>
            <h1>User Dashboard</h1>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>

                            <th>Graduation Year</th>
                            <th>Student ID</th>
                            <th>email</th>
                            <th>Phone Number</th>
                            <th>Activated</th>
                            <th>Transcript</th>
                            <th>Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map((user, index) => {
                            return (
                                <tr key={user.uid}>
                                    <td>{user.name}</td>
                                    <td>{user.graduationYear}</td>
                                    <td>{user.studentId}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>

                                    <td className={styles.textCenter}>
                                        <input
                                            title={'activation' + user.uid}
                                            type="checkbox"
                                            checked={activations[index]}
                                            onChange={(e) => {
                                                activateUser(
                                                    user.uid,
                                                    e.target.checked,
                                                    index,
                                                );
                                            }}
                                        />
                                    </td>
                                    <td>
                                        {user.transcript ? (
                                            <a
                                                className={styles.link}
                                                href={user.transcript}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                            >
                                                OPEN
                                            </a>
                                        ) : (
                                            'None'
                                        )}
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() =>
                                                router.push(
                                                    `/profile/${user.uid}`,
                                                )
                                            }
                                        >
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;

export const getServerSideProps = async () => {
    const usersCollection = collection(db, 'users');
    const users = await getDocs(usersCollection);
    const userData = users.docs.map((user) => user.data());
    return {
        props: {
            userData,
        },
    };
};
