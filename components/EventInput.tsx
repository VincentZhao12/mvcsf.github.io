import { Editor, EditorState } from 'draft-js';
import React, { FC, useState } from 'react';
import styles from '../styles/events.module.css';
import TextInput from './TextInput';
import 'draft-js/dist/Draft.css';
import RichTextInput from './RichTextInput';
import Button from './Button';

interface EventInputProps {}

const EventInput: FC<EventInputProps> = () => {
    return (
        <div className={styles.container}>
            <TextInput
                name="title"
                title="title"
                placeholder="Title"
                className={styles.titleField}
            />
            <div className={styles.inputArea}>
                <div className={styles.inputArea1}>
                    <TextInput
                        name="location"
                        title="location"
                        placeholder="Location"
                        className={styles.textField}
                    />
                    <TextInput
                        name="date"
                        title="date"
                        placeholder="Date"
                        className={styles.textField}
                    />
                    <TextInput
                        name="startTime"
                        title="startTime"
                        placeholder="Start Time"
                        className={styles.textField}
                    />
                    <TextInput
                        name="endTime"
                        title="endTime"
                        placeholder="End Time"
                        className={styles.textField}
                    />
                    <input title="image" type={'file'} />
                </div>
                <RichTextInput />
            </div>
            <Button variant="primary" className={styles.titleField}>
                Save
            </Button>
        </div>
    );
};

export default EventInput;
