import React from 'react';
import ResumeDownload from './ResumeDownload';

export interface ExperienceProps {}

const Experience: React.FC<ExperienceProps> = (props) => {
    return (
        <div className="site-page-content">
            <ResumeDownload />
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Riyad Bank</h1>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://www.riyadbank.com/"
                        >
                            <h4>www.riyadbank.com</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Business Technology Division – Intern</h3>
                        <b>
                            <p>Co-op: Feb 2025 – June 2025</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    As part of my Co-op program at Riyad Bank, I worked in the Business Technology Division, contributing to digital transformation efforts with a focus on automation and data visualization.
                </p>
                <br />
                <ul>
                    <li>
                        <p>
                            Automated system reports and streamlined data management using Power BI, resulting in clearer communication of IT operations and KPIs.
                        </p>
                    </li>
                    <li>
                        <p>
                            Collaborated with IT teams to enhance dashboards for executive review, improving accessibility and decision-making.
                        </p>
                    </li>
                    <li>
                        <p>
                            Supported disaster recovery automation workflows using Continuity Patrol and participated in testing for infrastructure resilience.
                        </p>
                    </li>
                    <li>
                        <p>
                            Assisted with Red Hat server configuration and deployment during system maintenance cycles.
                        </p>
                    </li>
                </ul>
            </div>

            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Prince Sultan University</h1>
                        <h4>Academic Projects</h4>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Senior Project</h3>
                        <b>
                            <p>Fall 2024 – Spring 2025</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    As part of my final year at Prince Sultan University, I worked with a team of 3 on a smart glove that translates sign language into speech. This project combined embedded systems, sensor calibration, and machine learning.
                </p>
                <br />
                <ul>
                    <li>
                        <p>
                            Designed and built a smart glove using 5 flex sensors, a gyroscope, and an accelerometer connected to a Raspberry Pi.
                        </p>
                    </li>
                    <li>
                        <p>
                            Collected and labeled gesture data to train a machine learning model capable of interpreting Arabic sign language gestures.
                        </p>
                    </li>
                    <li>
                        <p>
                            Developed a Python-based pipeline to translate recognized gestures into spoken words using text-to-speech.
                        </p>
                    </li>
                    <li>
                        <p>
                            Presented the project at the university’s senior showcase event, receiving positive feedback from faculty and peers.
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    header: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
    },
    headerContainer: {
        alignItems: 'flex-end',
        width: '100%',
        justifyContent: 'center',
    },
    headerRow: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export default Experience;
