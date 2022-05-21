import {
    ContentBlock,
    convertFromRaw,
    convertToRaw,
    Editor,
    EditorState,
    getDefaultKeyBinding,
    Modifier,
    RawDraftContentState,
    RichUtils,
} from 'draft-js';
import { useState, useEffect, useRef, FC } from 'react';
import { MdFormatListBulleted, MdFormatListNumbered } from 'react-icons/md';
import styles from '../styles/RichTextInput.module.css';
import Button from './Button';

interface RichTextInputProps {
    defaultValue?: RawDraftContentState;
    onChange?: (rawValue: RawDraftContentState) => void;
}

const RichTextInput: FC<RichTextInputProps> = ({ defaultValue, onChange }) => {
    const [editorState, setEditorState] = useState<EditorState>(
        defaultValue
            ? EditorState.createWithContent(convertFromRaw(defaultValue))
            : EditorState.createEmpty(),
    );
    useEffect(() => {
        setEditorState(
            defaultValue
                ? EditorState.createWithContent(convertFromRaw(defaultValue))
                : EditorState.createEmpty(),
        );
    }, [defaultValue]);

    const editorRef = useRef<any>();

    const handleKeyCommand = (command: string, editorState: EditorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (command === 'tab') return 'handled';

        if (newState) {
            setEditorState(newState);
            return 'handled';
        }

        return 'not-handled';
    };

    const focusEditor = () => {
        editorRef.current.focus();
    };

    const decreaseBlockDepth = (block: ContentBlock) => {
        const blockKey = block.getKey();
        const depth = block.getDepth();
        const newBlock: any = block.set('depth', depth - 1);
        const contentState: any = editorState.getCurrentContent();
        const blockMap = contentState.getBlockMap();
        const newBlockMap = blockMap.set(blockKey, newBlock);
        return EditorState.push(
            editorState,
            contentState.merge({ blockMap: newBlockMap }),
            'adjust-depth',
        );
    };

    const insertStr = (str: string) => {
        const newEditorState = EditorState.push(
            editorState,
            Modifier.replaceText(
                editorState.getCurrentContent(),
                editorState.getSelection(),
                str,
            ),
            'insert-characters',
        );

        setEditorState(newEditorState);
    };

    const keyBindings = (e: any) => {
        if (e.key === 'Tab') {
            if (
                RichUtils.getCurrentBlockType(editorState) ===
                    'unordered-list-item' ||
                RichUtils.getCurrentBlockType(editorState) ===
                    'ordered-list-item'
            ) {
                setEditorState(RichUtils.onTab(e, editorState, 4));
                return 'tab';
            } else {
                insertStr('\t');

                return 'tab';
            }
        }

        return getDefaultKeyBinding(e);
    };

    return (
        <div className={styles.container}>
            <EditorToolbar
                changeEditorState={setEditorState}
                editorState={editorState}
                focusEditor={focus}
            />
            <Editor
                ref={editorRef}
                editorState={editorState}
                handleKeyCommand={handleKeyCommand}
                keyBindingFn={keyBindings}
                handleReturn={(e, state) => {
                    const block = editorState
                        .getCurrentContent()
                        .getBlockMap()
                        .get(editorState.getSelection().getStartKey());
                    if (
                        !block.getText() &&
                        (block.getType() === 'unordered-list-item' ||
                            block.getType() === 'ordered-list-item')
                    ) {
                        if (block.getDepth() > 0)
                            setEditorState(decreaseBlockDepth(block));
                        else
                            setEditorState(
                                RichUtils.toggleBlockType(
                                    editorState,
                                    'unstyled',
                                ),
                            );
                        return 'handled';
                    }
                    return 'not-handled';
                }}
                onChange={(state) => {
                    onChange &&
                        onChange(convertToRaw(state.getCurrentContent()));

                    setEditorState(state);
                }}
                placeholder={
                    RichUtils.getCurrentBlockType(editorState) === 'unstyled'
                        ? 'Start typing here'
                        : ''
                }
            />
        </div>
    );
};
interface ToolbarProps {
    editorState: EditorState;
    changeEditorState: (state: EditorState) => void;
    focusEditor: () => void;
}

const EditorToolbar: FC<ToolbarProps> = ({
    editorState,
    changeEditorState,
    focusEditor,
}) => {
    const changeBlockType = (type: string) => {
        changeEditorState(RichUtils.toggleBlockType(editorState, type));
    };

    const changeInlineStyle = (type: string) => {
        const newState = RichUtils.toggleInlineStyle(editorState, type);
        focusEditor();
        changeEditorState(newState);
    };

    const isSelectedInline = (type: string) => {
        editorState.getCurrentInlineStyle();
        return editorState.getCurrentInlineStyle().has(type);
    };

    const isSelectedBlock = (type: string) => {
        return RichUtils.getCurrentBlockType(editorState) === type;
    };

    return (
        <div className={styles.editorToolbar}>
            <Button
                className={`${styles.toolbarButton} ${
                    isSelectedInline('BOLD') ? styles.selected : ''
                }`}
                onMouseDown={(e) => {
                    e.preventDefault();
                    changeInlineStyle('BOLD');
                }}
            >
                <b>B</b>
            </Button>
            <Button
                className={`${styles.toolbarButton} ${
                    isSelectedInline('ITALIC') ? styles.selected : ''
                }`}
                onMouseDown={(e) => {
                    e.preventDefault();
                    changeInlineStyle('ITALIC');
                }}
            >
                <i>I</i>
            </Button>
            <Button
                className={`${styles.toolbarButton} ${
                    isSelectedInline('UNDERLINE') ? styles.selected : ''
                }`}
                onMouseDown={(e) => {
                    e.preventDefault();
                    changeInlineStyle('UNDERLINE');
                }}
            >
                <u>U</u>
            </Button>
            <Button
                className={`${styles.toolbarButton} ${
                    isSelectedBlock('unordered-list-item')
                        ? styles.selected
                        : ''
                }`}
                onMouseDown={(e) => {
                    e.preventDefault();
                    changeBlockType('unordered-list-item');
                }}
            >
                <MdFormatListBulleted />
            </Button>
            <Button
                className={`${styles.toolbarButton} ${
                    isSelectedBlock('ordered-list-item') ? styles.selected : ''
                }`}
                onMouseDown={(e) => {
                    e.preventDefault();
                    changeBlockType('ordered-list-item');
                }}
            >
                <MdFormatListNumbered />
            </Button>
            <Button
                className={`${styles.toolbarButton} ${
                    isSelectedBlock('code-block') ? styles.selected : ''
                }`}
                onMouseDown={(e) => {
                    e.preventDefault();
                    changeBlockType('code-block');
                }}
            >
                {'{}'}
            </Button>
        </div>
    );
};

export default RichTextInput;
