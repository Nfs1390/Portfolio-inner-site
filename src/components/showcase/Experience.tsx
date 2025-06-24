import React from 'react';
import ResumeDownload from './ResumeDownload';
import CAPM from '../../assets/pictures/CAPM.png';

export interface ExperienceProps { }

const Experience: React.FC<ExperienceProps> = (props) => {
    return (
        <div className="site-page-content">
            <ResumeDownload />
            {/* Riyad Bank Experience */}
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Riyad Bank</h1>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://www.riyadbank.com/"
                            style={styles.organizationLink} // Apply inline style directly for link
                        >
                            <h4>www.riyadbank.com</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Business Technology Division Co-op Trainee</h3>
                        <b>
                            <p>Co-op: Dec 2024 – July 2025</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    Worked across multiple IT departments including Infrastructure, Automation, DR, Availability, and more.
                </p>
                <br />
                <ul>
                    <li>
                        <p>
                            Designed a Power BI dashboard that provided managers with real-time visibility into project progress and operational metrics, reducing miscommunication and improving task tracking across 4 teams.
                        </p>
                    </li>
                    <li>
                        <p>
                            Gained hands-on experience in Red Hat system administration, Ansible automation, and disaster recovery workflows using Continuity Patrol.
                        </p>
                    </li>
                    <li>
                        <p>
                            Supported cross-functional teams in managing project timelines, deliverables, and documentation.
                        </p>
                    </li>
                </ul>
            </div>

            {/* Key Project: Critical Application Availability Initiative */}
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h2><b>Key Project:</b></h2>
                        <h4>Critical Application Availability Initiative</h4>
                    </div>
                    {/* No date for Key Project in this format, removed the bold p tag */}
                </div>
            </div>
            <div className="text-block">
                <ul>
                    <li>
                        <p>
                            Assigned to ensure the continuous performance and availability of 100+ critical core banking applications through proactive system monitoring and support.
                        </p>
                    </li>
                    <li>
                        <p>
                            Defined key performance metrics by translating business requirements into actionable reporting criteria.
                        </p>
                    </li>
                    <li>
                        <p>
                            Automated the monthly availability reporting process, eliminating manual data collection and documentation - Saving ~4 hours per report and increasing accuracy by removing human error for IT and business units.
                        </p>
                    </li>
                    <li>
                        <p>
                            Designed and developed an interactive Power BI dashboard showcasing historical trends and performance metrics for higher management decision-making.
                        </p>
                    </li>
                </ul>
            </div>

            {/* Prince Sultan University - Senior Project */}
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Prince Sultan University</h1>
                        <h4>Academic Projects</h4>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Senior Project: Smart Glove for Arabic Sign Language Translation (Motion to speech)</h3>
                        <b>
                            <p>Nov 2024</p> {/* Using Nov 2024 from resume */}
                        </b>
                    </div>
                    <p>Group Leader</p> {/* Added Group Leader as a separate line */}
                </div>
            </div>
            <div className="text-block">
                <ul>
                    <li>
                        <p>
                            Led the full development lifecycle of a smart glove translating Arabic Sign Language into speech, showcased to faculty and peers.
                        </p>
                    </li>
                    <li>
                        <p>
                            Integrated hardware/software components (Raspberry Pi, Gyroscope, Flex Sensors, Accelerometer, and Python) and built a custom dataset for machine learning-based gesture recognition.
                        </p>
                    </li>
                    <li>
                        <p>
                            Managed project timelines and resources, delivering a functional motion-to-speech prototype.
                        </p>
                    </li>
                </ul>
            </div>

            {/* Certifications */}
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Certifications</h1>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Certified Associate in Project Management (CAPM)</h3>
                        <b>
                            <p>Project Management Institute (PMI) | July 2024</p>
                        </b>
                    </div>
                    <br />
                    <img src={CAPM} style={styles.image} alt="CAPM Certificate" />
                </div>
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
        marginBottom: '20px', // Added some margin to separate sections
    },
    headerRow: {
        display: 'flex', // Added display flex for alignment
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap', // Allow wrapping on smaller screens
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    image: {
        maxWidth: '100%', // Ensure image is responsive
        height: 'auto',
        marginTop: '10px', // Add some space above the image
        display: 'block', // Ensure it behaves like a block element
        marginLeft: 'auto', // Center image
        marginRight: 'auto', // Center image
    },
    organizationLink: { // New style for the link, fixing the error
        color: '#007bff', // Example blue color
        textDecoration: 'none',
        marginLeft: '10px',
    }
};

export default Experience;
