import Image from 'next/image';
import Link from 'next/link';
import logo from '../public/logo.png';
import Button from './Button';
import styles from '../styles/Nav.module.css';
import { AiOutlineMenu, AiOutlineClose, AiOutlineUser } from 'react-icons/ai';
import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { User } from 'firebase/auth';

const Nav = () => {
    const [shown, setShown] = useState<boolean>(false);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log(user);
        console.log(user.uid);
    }, []);

    return (
        <div className={styles.nav}>
            <div className={styles.navbar}>
                <Link href="/">
                    <a>
                        <div className={styles.logoContainer}>
                            <Image src={logo} height={100} width={100} />
                            <h1 className={styles.logoText}>Monta Vista CSF</h1>
                        </div>
                    </a>
                </Link>

                <div className={styles.subnav}>
                    <Link href="/about">
                        <a className={styles.navlink}>About</a>
                    </Link>
                    <Link href="/policies">
                        <a className={styles.navlink}>Policies</a>
                    </Link>
                    <Link href="/events">
                        <a className={styles.navlink}>Events</a>
                    </Link>
                    <Link href="/officers">
                        <a className={styles.navlink}>Officers</a>
                    </Link>
                    <Link href="/contact">
                        <a className={styles.navlink}>Contact</a>
                    </Link>
                    {!user.uid ? (
                        <>
                            <div className={styles.navButton}>
                                <Button
                                    variant="primary"
                                    onClick={() => router.push('/login')}
                                >
                                    Log In
                                </Button>
                            </div>
                            <div className={styles.navButton}>
                                <Button
                                    variant="primary-outline"
                                    onClick={() => router.push('/signup')}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className={styles.navlink}>
                            <Link href={`/profile/${user.uid}`}>
                                <a>
                                    <AiOutlineUser className={styles.icon} />
                                </a>
                            </Link>
                        </div>
                    )}
                </div>
                <div
                    className={styles.menubuttonCont}
                    onClick={() => setShown(!shown)}
                >
                    <Button className={styles.menubutton}>
                        {shown ? <AiOutlineClose /> : <AiOutlineMenu />}
                    </Button>
                </div>
            </div>
            <SideNav shown={shown} close={() => setShown(false)} />
        </div>
    );
};

interface SideNavProps {
    shown: boolean;
    user?: User;
    close: () => void;
}

const SideNav: FC<SideNavProps> = ({ shown, user, close }) => {
    const router = useRouter();
    return (
        <>
            {shown && (
                <div className={styles.sidenav} onClick={close}>
                    <Link href="/about">
                        <a className={styles.menulink + ' ' + styles.delay1}>
                            About
                        </a>
                    </Link>
                    <Link href="/policies">
                        <a className={styles.menulink + ' ' + styles.delay2}>
                            Policies
                        </a>
                    </Link>
                    <Link href="/events">
                        <a className={styles.menulink + ' ' + styles.delay3}>
                            Events
                        </a>
                    </Link>
                    <Link href="/officers">
                        <a className={styles.menulink + ' ' + styles.delay4}>
                            Officers
                        </a>
                    </Link>
                    <Link href="/contact">
                        <a className={styles.menulink + ' ' + styles.delay5}>
                            Contact
                        </a>
                    </Link>

                    {user?.uid ? (
                        <div className={styles.menulink}>
                            <Link href={`/profile/${user?.uid}`}>
                                <a>
                                    <AiOutlineUser className={styles.icon} />
                                </a>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Button
                                variant="primary"
                                className={
                                    styles.sidebutton + ' ' + styles.delay6
                                }
                                onClick={() => router.push('/login')}
                            >
                                Log In
                            </Button>
                            <Button
                                variant="primary-outline"
                                className={
                                    styles.sidebutton + ' ' + styles.delay7
                                }
                                onClick={() => router.push('/signup')}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Nav;
