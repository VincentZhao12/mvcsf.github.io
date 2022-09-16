import Link from 'next/link';
import React, { FC } from 'react';
import {
    AiFillInstagram,
    AiOutlineFacebook,
    AiOutlineInstagram,
    AiOutlineLinkedin,
    AiOutlineMail,
} from 'react-icons/ai';
import styles from '../styles/Footer.module.css';
import Button from './Button';

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
    return (
        <div className={styles.container}>
            <div className={styles.linkgroup}>
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/policies">Policies</Link>
                <Link href="/events">Events</Link>
                <Link href="/officers">Officers</Link>
                <Link href="/Contact">Contact</Link>
            </div>
            <div>
                <h1 className={styles.logo}>MV CSF</h1>
            </div>
            <div className={styles.socials}>
                <a
                    href="https://www.instagram.com/mvcsf/?hl=en"
                    target="_blank"
                    rel="noreferrer noopener"
                    title="Instagram"
                >
                    <AiOutlineInstagram color="white" />
                </a>
                <a
                    href="https://www.facebook.com/groups/montavistacsf"
                    target="_blank"
                    rel="noreferrer noopener"
                    title="Facebook"
                >
                    <AiOutlineFacebook color="white" />
                </a>

                <a
                    href="mailto:montavistacsf@gmail.com"
                    target="_blank"
                    rel="noreferrer noopener"
                    title="LinkedIn"
                >
                    <AiOutlineMail color="white" />
                </a>
            </div>
        </div>
    );
};

export default Footer;
