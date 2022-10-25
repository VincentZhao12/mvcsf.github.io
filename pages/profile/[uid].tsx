import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { useAuth, User } from '../../context/AuthContext';
import styles from '../../styles/profile.module.css';
import { FcReadingEbook } from 'react-icons/fc';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
} from 'firebase/firestore';
import { db, storage } from '../../config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

interface profileProps {
    userInfo: User;
}

const Profile: FC<profileProps> = ({ userInfo }) => {
    const router = useRouter();
    const { uid } = router.query;
    const { user, logout } = useAuth();
    const [transcript, setTranscript] = useState<File | string>();
    const [uploading, setUploading] = useState<boolean>(false);

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
            <div className={styles.hours}>
                <h3>Hours</h3>
                <p>{user.hours ?? 0}</p>
            </div>
            {user.uid == uid && (
                <div className={styles.upload}>
                    <h3 className={styles.sectionHeader}>Upload Transcript</h3>

                    <input
                        title="transcript"
                        type={'file'}
                        accept="application/pdf"
                        onChange={(e) =>
                            setTranscript(e.target.files?.[0] as File)
                        }
                    />
                    <Button
                        onClick={async () => {
                            setUploading(true);

                            let docId = uid;

                            const transcriptRef = ref(
                                storage,
                                `transcripts/${docId}`,
                            );

                            let transcriptUrl: string | undefined = '';

                            if (transcript && typeof transcript != 'string') {
                                try {
                                    await uploadBytes(
                                        transcriptRef,
                                        transcript,
                                    );
                                    transcriptUrl = await getDownloadURL(
                                        transcriptRef,
                                    );
                                } catch (e) {
                                    console.log(e);
                                }
                            } else if (transcript) {
                                transcriptUrl = transcript;
                            }

                            const userDoc = doc(db, 'users', uid);

                            updateDoc(userDoc, {
                                transcript: transcriptUrl,
                            });

                            setUploading(false);
                        }}
                        loading={uploading}
                    >
                        Upload
                    </Button>
                </div>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
                {(user.admin || user.uid === userInfo.uid) && (
                    <h3 className={styles.sectionHeader}>Edit Profile</h3>
                )}
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

export const getServerSideProps = async (context: any) => {
    const userInfoRef = doc(db, 'users', context.params.uid);
    const userInfoDoc = await getDoc(userInfoRef);
    const userInfo = userInfoDoc.data();
    return {
        props: {
            userInfo,
        },
    };
};

export default Profile;
