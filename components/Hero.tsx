import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import HeroImage from '../assets/Hero.png';
import styles from '../styles/Hero.module.css';
import Button from './Button';

interface HeroProps {}

const Hero: FC<HeroProps> = () => {
    const router = useRouter();
    return (
        <div className={styles.hero}>
            <div className={styles.heroArea}>
                <div className={styles.heroTextArea}>
                    <h1 className={styles.heading}>
                        {' '}
                        Get a scholarship with{' '}
                        <span className={styles.logo}>CSF</span>
                    </h1>
                    <p>
                        The California Scholarship Federation, Inc. is a
                        nonprofit organization whose mission is to recognize and
                        encourage academic achievement and community service
                        among middle and high school students in California.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/signup')}
                    >
                        Join Today!
                    </Button>
                </div>
            </div>

            <div className={styles.heroImage}>
                <div className={styles.imageContainer}>
                    <Image
                        src={HeroImage}
                        layout="responsive"
                        className={styles.image}
                        alt="hero"
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero;
