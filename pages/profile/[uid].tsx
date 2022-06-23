import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { useAuth, User } from '../../context/AuthContext';
import styles from '../../styles/profile.module.css';
import { FcReadingEbook } from 'react-icons/fc';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface profileProps {
    userInfo: User;
}

const profile: FC<profileProps> = ({ userInfo }) => {
    const router = useRouter();
    const { uid } = router.query;
    const { user, logout } = useAuth();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const name = (
            e.currentTarget.elements.namedItem('name') as HTMLInputElement
        ).value;
        const phoneNumber = (
            e.currentTarget.elements.namedItem(
                'phoneNumber',
            ) as HTMLInputElement
        ).value;
        const studentId = (
            e.currentTarget.elements.namedItem('studentId') as HTMLInputElement
        ).value;
        const graduationYear = (
            e.currentTarget.elements.namedItem(
                'graduationYear',
            ) as HTMLInputElement
        ).value;
        const activated = (
            e.currentTarget.elements.namedItem('activated') as HTMLInputElement
        ).value;

        const userDoc = doc(db, 'users', uid + '');

        updateDoc(userDoc, {
            name,
            phoneNumber,
            studentId,
            graduationYear,
            activated,
        });
    };

    return (
        <div className={styles.container}>
            <h1>{userInfo.name}</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputField}>
                    Activated{' '}
                    <input
                        type="checkbox"
                        title="Activated"
                        name="activated"
                        disabled={!user.admin}
                        defaultChecked={userInfo.activated}
                    />
                </div>

                <TextInput
                    name="name"
                    title="name"
                    placeholder="Name"
                    defaultValue={userInfo.name}
                    disabled={!user.admin && user.uid !== userInfo.uid}
                    className={styles.inputField}
                />
                <TextInput
                    name="graduationYear"
                    title="graduationYear"
                    placeholder="Graduation Year"
                    defaultValue={userInfo.graduationYear + ''}
                    disabled={!user.admin && user.uid !== userInfo.uid}
                    type="number"
                    className={styles.inputField}
                />
                <TextInput
                    name="phoneNumber"
                    title="phoneNumber"
                    placeholder="Phone Number"
                    defaultValue={userInfo.phoneNumber}
                    disabled={!user.admin && user.uid !== userInfo.uid}
                    type="tel"
                    className={styles.inputField}
                />
                <TextInput
                    name="studentId"
                    title="studentId"
                    placeholder="Student ID"
                    defaultValue={userInfo.studentId + ''}
                    disabled={!user.admin && user.uid !== userInfo.uid}
                    type="number"
                    className={styles.inputField}
                />
                {(user.admin || user.uid === userInfo.uid) && (
                    <Button
                        variant="primary"
                        className={styles.inputField}
                        type={'submit'}
                    >
                        Save Changes
                    </Button>
                )}
            </form>
            {user.uid === userInfo.uid && (
                <Button
                    variant="secondary"
                    onClick={logout}
                    className={styles.logout}
                >
                    Log Out
                </Button>
            )}
        </div>
    );
};

export const getServerSideProps = async (context:any) => {
    const userInfoRef = doc(db, 'users', context.params.uid);
    const userInfoDoc = await getDoc(userInfoRef);
    const userInfo = userInfoDoc.data();
    return {
        props: {
            userInfo,
        },
    };
};

export default profile;
