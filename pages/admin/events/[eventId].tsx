import { collection, doc, getDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';
import EventInput, { EventType } from '../../../components/EventInput';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../context/AuthContext';

interface editEventProps {
    event: EventType;
}

const editEvent: FC<editEventProps> = ({ event }) => {
    const router = useRouter();

    const { user } = useAuth();

    useEffect(() => {
        if (!user.admin) {
            router.push('/');
        }
    }, []);

    return (
        <>
            <EventInput initialEvent={event} />
        </>
    );
};

export const getServerSideProps = async (context: any) => {
    const eventId = context.params.eventId as string;

    if (eventId === 'createEvent')
        return {
            props: {
                event: {},
            },
        };

    const eventDoc = await getDoc(doc(collection(db, 'events'), eventId));
    const docData = eventDoc.data();

    const dateObj = (docData?.date as Timestamp).toDate();

    const dateStr = dateObj.toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return {
        props: {
            event: {
                ...docData,
                eventId: eventDoc.id,
                date: dateStr,
            },
        },
    };
};

export default editEvent;
