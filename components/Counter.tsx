import React, { FC, useState } from 'react';
import Button from './Button';
import styles from '../styles/Counter.module.css';

interface CounterProps {
    onChange: (newVal: number) => void;
    defaultValue: number;
    min?: number;
    max?: number;
}

const Counter: FC<CounterProps> = ({ onChange, defaultValue, min, max }) => {
    const [value, setValue] = useState<number>(defaultValue);

    const change = (val: number) => {
        if (min !== undefined && max !== undefined && (val > max || val < min))
            return;

        setValue(val);
        onChange(val);
    };

    return (
        <div className={styles.container}>
            <Button onClick={() => change(value - 1)}>-</Button>
            {value}
            <Button onClick={() => change(value + 1)}>+</Button>
        </div>
    );
};

export default Counter;
