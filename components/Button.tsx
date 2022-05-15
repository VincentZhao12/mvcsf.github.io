import React, { FC } from 'react';
import styles from '../styles/Button.module.css';

interface ButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?:
        | 'primary'
        | 'secondary'
        | 'tertiary'
        | 'primary-outline'
        | 'secondary-outline'
        | 'tertiary-outline';
    className?: string;
    fullWidth?: boolean;
    id?: string;
}

const Button: FC<ButtonProps> = ({
    children,
    onClick,
    disabled,
    variant,
    className,
    fullWidth,
    id,
}) => {
    return (
        <button
            onClick={() => {
                onClick && onClick();
            }}
            disabled={disabled}
            className={`${styles.button} ${variant ? styles[variant] : ''} ${
                fullWidth ? styles.fullWidth : ' '
            } ${className}`}
            id={id}
        >
            <span>{children}</span>
        </button>
    );
};

export default Button;
