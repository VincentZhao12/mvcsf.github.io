import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import LoginGraphic from '../assets/signupgraphic.svg';
import Alert from '../components/Alert';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/login.module.css';

interface loginProps {}

const authErrors = {
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Please enter a stronger password.',
    'auth/email-already-in-use': 'That email is already in use.',
    'auth/user-not-found': 'That email was not found.',
    'auth/wrong-password': 'That password is incorrect.',
};

const Login: FC<loginProps> = () => {
    const { login, user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        if (user.uid) router.push('/');
    }, [user, user.studentId, router]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        const email = (
            e.currentTarget.elements.namedItem('email') as HTMLInputElement
        ).value;
        const password = (
            e.currentTarget.elements.namedItem('password') as HTMLInputElement
        ).value;

        login(email, password)
            .catch((error: any) => {
                type key = keyof typeof authErrors;
                const errorCode: any = error.code;
                if (Object.keys(authErrors).includes(errorCode))
                    setError(authErrors[errorCode as key]);
                setLoading(false);
            })
            .then((user: any) => {
                setLoading(false);
                if (user && user.user && user.user.uid) router.push('/');
            });
    };

    return (
        <div className={styles.container}>
            <div className={styles.inputArea}>
                {error && (
                    <Alert
                        title="Error Logging In"
                        message={error}
                        type="error"
                    />
                )}
                <h1 className={styles.title}>Log In</h1>
                <form onSubmit={handleSubmit}>
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
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={loading}
                    >
                        Log In
                    </Button>
                </form>
                <p className={styles.bottomText}>
                    If you don&apos;t have an account,{' '}
                    <Link href={'/signup'}>
                        <a className={styles.link}>sign up</a>
                    </Link>
                </p>
            </div>
            <div className={styles.loginGraphic}>
                <Image src={LoginGraphic} alt="graphic" />
                <p className={styles.attribution}>
                    <a href="https://www.freepik.com/vectors/volunteer">
                        Volunteer vector created by pch.vector - www.freepik.com
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
