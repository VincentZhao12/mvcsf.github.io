import {
    query,
    collection,
    orderBy,
    getDocs,
    Timestamp,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import React, { FC, useEffect, useState } from 'react';
import { db } from '../config/firebase';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import Button from '../components/Button';
import Card from '../components/Card';
import { EventType } from '../components/EventInput';
import ReadOnlyRichText from '../components/ReadOnlyRichText';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/events.module.css';

interface eventsProps {
    events: EventType[];
}

const Events: FC<eventsProps> = ({ events }) => {
    const router = useRouter();

    const { user } = useAuth();

    return (
        <div className={styles.container}>
            <div className={styles.titleBar}>
                <h1>Events</h1>
            </div>
            <div className={styles.eventsGrid}>
                {events.map((event, index) =>
                    Date.parse(event.date || '') > Date.now() ? (
                        <EventCard
                            event={event}
                            key={event.eventId ?? index + ''}
                        />
                    ) : (
                        <></>
                    ),
                )}
            </div>

            <div className={styles.titleBar}>
                <h1>Past Events</h1>
            </div>
            <div className={styles.eventsGrid}>
                {events.map((event, index) =>
                    Date.parse(event.date || '') < Date.now() ? (
                        <EventCard
                            event={event}
                            key={event.eventId ?? index + ''}
                        />
                    ) : (
                        <></>
                    ),
                )}
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
        <Card className={styles.eventCard}>
            {event.imgUrl && (
                <div className={styles.eventImage}>
                    <Image
                        alt="graphic"
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

export default Events;
