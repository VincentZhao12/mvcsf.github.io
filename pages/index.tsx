import type { NextPage } from 'next';
import Head from 'next/head';
import Hero from '../components/Hero';
import InfoBlock from '../components/InfoBlock';
import Meta from '../components/Meta';
import styles from '../styles/Home.module.css';
import Volunteer from '../assets/volunteer.jpg';
import Honors from '../assets/honors.png';
import Button from '../components/Button';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
    const router = useRouter();
    return (
        <div>
            <Meta title="Home | Monta Vista CSF" />
            <main>
                <Hero />
                <h1 className={styles.why}>Why CSF?</h1>
                <InfoBlock
                    color="green"
                    heading="Get Involved in Your Community"
                    icon={Volunteer}
                    text="Joining CSF is a great chance to get involved in your community by participating in events and earning volunteering hours."
                />
                <InfoBlock
                    color="beige"
                    heading="Earn Special Honors"
                    icon={Honors}
                    text="Life Membership (Sealbearer) is achieved by qualifying for chapter membership for four or more semesters in the last three years of high school, and earns the CSF gold Seal on diplomas and transcripts. Each year, American colleges and universities award scholarships to CSF Life Members (Sealbearer). Members are also eligible for chapter advisor nomination of the prestigious Seymour Memorial Awards."
                    iconfirst
                />
            </main>
            <div className={styles.join}>
                <div>
                    <h1 className={styles.headers}>
                        Ready to get involved with the CSF?
                    </h1>
                    <h3 className={styles.headers}>
                        Join Monta Vista CSF Today
                    </h3>
                </div>

                <Button variant="primary" onClick={() => router.push('signup')}>
                    Join Today!
                </Button>
            </div>
        </div>
    );
};

export default Home;
