import { Editor, EditorState, RawDraftContentState } from 'draft-js';
import React, { FC, useState } from 'react';
import styles from '../styles/events.module.css';
import TextInput from './TextInput';
import 'draft-js/dist/Draft.css';
import RichTextInput from './RichTextInput';
import Button from './Button';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import { useRouter } from 'next/router';

export interface EventType {
    title?: string;
    description?: RawDraftContentState;
    date?: string;
    location?: string;
    startTime?: string;
    endTime?: string;
    eventId?: string;
    imgUrl?: string;
}

interface EventInputProps {
    initialEvent?: EventType;
}

const EventInput: FC<EventInputProps> = ({ initialEvent }) => {
    const [title, setTitle] = useState<string>(initialEvent?.title ?? '');
    const [description, setDescription] = useState<
        RawDraftContentState | undefined
    >(initialEvent?.description);
    const [date, setDate] = useState<string>(initialEvent?.date ?? '');
    const [startTime, setStartTime] = useState<string>(
        initialEvent?.startTime ?? '',
    );
    const [endTime, setEndTime] = useState<string>(initialEvent?.endTime ?? '');
    const [location, setLocation] = useState<string>(
        initialEvent?.location ?? '',
    );
    const [image, setImage] = useState<File | string>();
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const handleSubmit = async () => {
        setLoading(true);

        let docId = initialEvent?.eventId || '';
        if (!initialEvent?.eventId) {
            const eventDoc = await addDoc(collection(db, 'events'), {});
            docId = initialEvent?.eventId ? initialEvent?.eventId : eventDoc.id;
        }

        const imageRef = ref(storage, `events/${docId}`);

        let imgUrl: string | undefined = '';

        if (image && typeof image != 'string') {
            try {
                await uploadBytes(imageRef, image);
                imgUrl = await getDownloadURL(imageRef);
            } catch (e) {
                console.log(e);
            }
        } else if (image) {
            imgUrl = image;
        }

        const eventDoc = doc(db, 'events', docId);

        await setDoc(eventDoc, {
            title,
            description,
            date: new Date(Date.parse(date)),
            startTime,
            endTime,
            location,
            imgUrl,
        });

        router.push('/admin/events');
    };

    return (
        <div className={styles.container}>
            <h1>Event Input</h1>
            <TextInput
                name="title"
                title="title"
                placeholder="Title"
                className={styles.titleField}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <div className={styles.inputArea}>
                <div className={styles.inputArea1}>
                    <TextInput
                        name="location"
                        title="location"
                        placeholder="Location"
                        className={styles.textField}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <TextInput
                        name="date"
                        title="date"
                        placeholder="Date"
                        className={styles.textField}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <TextInput
                        name="startTime"
                        title="startTime"
                        placeholder="Start Time"
                        className={styles.textField}
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                    <TextInput
                        name="endTime"
                        title="endTime"
                        placeholder="End Time"
                        className={styles.textField}
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                    <input
                        title="image"
                        type={'file'}
                        accept="image/png, image/jpeg"
                        onChange={(e) => setImage(e.target.files?.[0] as File)}
                    />
                    {image ? (
                        <Image
                            src={
                                typeof image == 'string'
                                    ? image
                                    : URL.createObjectURL(image)
                            }
                            width={100}
                            height={100}
                            alt="icon"
                        />
                    ) : (
                        <></>
                    )}
                </div>
                <RichTextInput
                    title="event description"
                    defaultValue={initialEvent?.description}
                    onChange={(value) => setDescription(value)}
                />
            </div>
            <Button
                variant="primary"
                className={styles.titleField}
                onClick={handleSubmit}
                loading={loading}
            >
                Save
            </Button>
        </div>
    );
};

export default EventInput;
