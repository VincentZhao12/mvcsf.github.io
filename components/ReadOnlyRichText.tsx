import {
    convertFromRaw,
    Editor,
    EditorState,
    RawDraftContentState,
} from 'draft-js';
import React, { FC } from 'react';

interface ReadOnlyRichTextProps {
    value?: RawDraftContentState;
}

const ReadOnlyRichText: FC<ReadOnlyRichTextProps> = ({ value }) => {
    return (
        <Editor
            editorState={
                value
                    ? EditorState.createWithContent(convertFromRaw(value))
                    : EditorState.createEmpty()
            }
            readOnly
            onChange={() => {}}
        />
    );
};

export default ReadOnlyRichText;
