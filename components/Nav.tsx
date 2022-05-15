import Image from 'next/image';
import Link from 'next/link';
import logo from '../public/logo.png';
import Button from './Button';
import styles from '../styles/Nav.module.css';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FC, useState } from 'react';
import { useRouter } from 'next/router';

const Nav = () => {
    const [shown, setShown] = useState<boolean>(false);
    const router = useRouter();

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
                    <div>
                        <Button
                            variant="primary"
                            onClick={() => router.push('/login')}
                        >
                            Log In
                        </Button>
                    </div>
                    <div>
                        <Button
                            variant="primary-outline"
                            onClick={() => router.push('/signup')}
                        >
                            Sign Up
                        </Button>
                    </div>
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
            <SideNav shown={shown} />
        </div>
    );
};

interface SideNavProps {
    shown: boolean;
}

const SideNav: FC<SideNavProps> = ({ shown }) => {
    return (
        <>
            {shown && (
                <div className={styles.sidenav}>
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
                    <Button
                        variant="primary"
                        className={styles.sidebutton + ' ' + styles.delay6}
                    >
                        Log In
                    </Button>
                    <Button
                        variant="primary-outline"
                        className={styles.sidebutton + ' ' + styles.delay7}
                    >
                        Sign Up
                    </Button>
                </div>
            )}
        </>
    );
};

export default Nav;
