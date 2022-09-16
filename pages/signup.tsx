import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, SetStateAction, useEffect, useState } from 'react';
import SignupGraphic from '../assets/signupgraphic.svg';
import Alert from '../components/Alert';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/signup.module.css';

interface signupProps {}

const authErrors = {
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Please enter a stronger password.',
    'auth/email-already-in-use': 'That email is already in use.',
    'auth/user-not-found': 'That email was not found.',
    'auth/wrong-password': 'That password is incorrect.',
};

const Signup: FC<signupProps> = () => {
    const { signup, user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        if (user.uid) router.push('/');
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        const email = (
            e.currentTarget.elements.namedItem('email') as HTMLInputElement
        ).value;
        const password = (
            e.currentTarget.elements.namedItem('password') as HTMLInputElement
        ).value;
        const name = (
            e.currentTarget.elements.namedItem('Name') as HTMLInputElement
        ).value;
        const phoneNumber = (
            e.currentTarget.elements.namedItem(
                'phoneNumber',
            ) as HTMLInputElement
        ).value;
        const studentId = (
            e.currentTarget.elements.namedItem('studentId') as HTMLInputElement
        ).value;
        const graduationYear = (
            e.currentTarget.elements.namedItem(
                'graduationYear',
            ) as HTMLInputElement
        ).value;
        const confPassword = (
            e.currentTarget.elements.namedItem(
                'confPassword',
            ) as HTMLInputElement
        ).value;

        if (password !== confPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        signup(
            email,
            password,
            name,
            phoneNumber,
            studentId,
            graduationYear,
            (error) => {
                type key = keyof typeof authErrors;
                const errorCode: any = error.code;
                if (Object.keys(authErrors).includes(errorCode))
                    setError(authErrors[errorCode as key]);
                setLoading(false);
            },
        ).then((success: any) => {
            setLoading(false);
            if (success) router.push('/');
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.signupGraphic}>
                <Image src={SignupGraphic} alt="graphic" />
            </div>
            <div className={styles.inputArea}>
                {error && (
                    <Alert
                        title="Error Creating Account"
                        message={error}
                        type="error"
                    />
                )}
                <h1 className={styles.title}>Sign up</h1>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        className={styles.textInput}
                        title="Name"
                        name="Name"
                        placeholder="Full Name"
                        required
                    />
                    <TextInput
                        className={styles.textInput}
                        title="Student ID"
                        name="studentId"
                        type="number"
                        placeholder="Student ID"
                        required
                    />
                    <TextInput
                        className={styles.textInput}
                        title="Graduation Year"
                        name="graduationYear"
                        type="text"
                        placeholder="Graduation Year"
                        required
                    />
                    <TextInput
                        className={styles.textInput}
                        title="Phone Number"
                        name="phoneNumber"
                        type="tel"
                        placeholder="Phone Number"
                        required
                    />
                    <TextInput
                        className={styles.textInput}
                        title="Email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                    />
                    <TextInput
                        className={styles.textInput}
                        title="Password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                    />
                    <TextInput
                        className={styles.textInput}
                        title="Confirm Password"
                        name="confPassword"
                        type="password"
                        placeholder="Password Confirmation"
                        required
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={loading}
                    >
                        Sign Up
                    </Button>
                </form>
                <p className={styles.bottomText}>
                    If you already have an account,{' '}
                    <Link href={'/login'}>
                        <a className={styles.link}>log in</a>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
