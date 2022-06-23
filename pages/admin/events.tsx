import { convertToRaw, EditorState } from 'draft-js';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    Timestamp,
} from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import Button from '../../components/Button';
import Card from '../../components/Card';
import EventInput, { EventType } from '../../components/EventInput';
import ReadOnlyRichText from '../../components/ReadOnlyRichText';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/events.module.css';

interface eventsProps {
    events: EventType[];
}

const events: FC<eventsProps> = ({ events }) => {
    const router = useRouter();

    const { user } = useAuth();

    useEffect(() => {
        if (!user.admin) {
            router.push('/');
        }
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.titleBar}>
                <h1>Events Dashboard</h1>
                <Button
                    variant="primary"
                    onClick={() => router.push('/admin/events/createEvent')}
                >
                    Add Event
                </Button>
            </div>
            <div className={styles.eventsGrid}>
                {events.map((event, index) => (
                    <EventCard
                        event={event}
                        key={event.eventId ?? index + ''}
                    />
                ))}
            </div>
        </div>
    );
};

const EventCard = ({ event }: { event: EventType }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const handleDelete = async () => {
        const docRef = doc(collection(db, 'events'), event.eventId);

        setLoading(true);

        await deleteDoc(docRef);

        router.reload();
    };

    return (
        <Card>
            <div className={styles.buttonGroup}>
                <Button
                    variant="tertiary"
                    loading={loading}
                    onClick={() =>
                        router.push(
                            '/admin/events/' + (event.eventId ?? 'create'),
                        )
                    }
                >
                    <AiOutlineEdit aria-label="edit" />
                </Button>

                <Button
                    variant="secondary"
                    loading={loading}
                    onClick={handleDelete}
                >
                    <AiOutlineDelete aria-label="delete" />
                </Button>
            </div>
            {event.imgUrl && (
                <div className={styles.eventImage}>
                    <Image
                        src={event.imgUrl}
                        width={2400}
                        height={2400}
                        layout="responsive"
                        priority
                    />
                </div>
            )}
            <h2 className={styles.eventTitle}>{event.title}</h2>
            <p>
                Date: {event.date}{' '}
                {event.startTime && event.endTime
                    ? `${event.startTime} - ${event.endTime}`
                    : ''}
            </p>
            <div className={styles.eventDesc}>
                <ReadOnlyRichText value={event.description} />
            </div>
        </Card>
    );
};

export const getServerSideProps = async () => {
    const eventsCollection = query(collection(db, 'events'), orderBy('date'));

    const events = (await getDocs(eventsCollection)).docs.map((doc) => {
        const dateObj = (doc.data().date as Timestamp).toDate();

        const dateStr = dateObj.toLocaleDateString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

        return {
            ...doc.data(),
            date: dateStr,
            eventId: doc.id,
        };
    });

    return {
        props: {
            events,
        },
    };
};

export default events;
