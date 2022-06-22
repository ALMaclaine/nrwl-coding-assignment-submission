import styles from './emoji.module.css';
import {MouseEventHandler} from "react";

export interface EmojiProps {
    emoji: string,
    ariaLabel: string,
    onClick?: MouseEventHandler<HTMLSpanElement>,
}

export function Emoji(props: EmojiProps) {
    const {emoji, onClick = () => ({}), ariaLabel} = props;
    return <span className={styles['no-select']} role='img' aria-label={ariaLabel} onClick={onClick}>
        {emoji}
    </span>;
}

export default Emoji;
