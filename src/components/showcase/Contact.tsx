import React, { useEffect, useState } from 'react';
import colors from '../../constants/colors';
import inIcon from '../../assets/pictures/contact-in.png';
import ResumeDownload from './ResumeDownload';
import emailjs from '@emailjs/browser';

import type { CSSProperties } from 'react'; // For type casting

export interface ContactProps {}

// Function to validate email
const validateEmail = (email: string) => {
    const re =
        // eslint-disable-next-line
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

interface SocialBoxProps {
    icon: string;
    link: string;
}

const SocialBox: React.FC<SocialBoxProps> = ({ link, icon }) => {
    return (
        <a rel="noreferrer" target="_blank" href={link}>
            <div className="big-button-container" style={styles.social}>
                <img src={icon} alt="" style={styles.socialImage} />
            </div>
        </a>
    );
};

const Contact: React.FC<ContactProps> = (props) => {
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');

    // State to track if a field has been touched (user interacted with it)
    const [nameTouched, setNameTouched] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [subjectTouched, setSubjectTouched] = useState(false);
    const [messageTouched, setMessageTouched] = useState(false);

    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formMessage, setFormMessage] = useState('');
    const [formMessageColor, setFormMessageColor] = useState('');

    // Derived validation states for individual fields
    const isNameValid = name.trim().length > 0;
    const isEmailValid = validateEmail(email);
    const isSubjectValid = subject.trim().length > 0;
    const isMessageValid = message.trim().length > 0;

    useEffect(() => {
        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [isNameValid, isEmailValid, isSubjectValid, isMessageValid]);

    async function submitForm() {
        // Mark all fields as touched on submit attempt, to show all errors
        setNameTouched(true);
        setEmailTouched(true);
        setSubjectTouched(true);
        setMessageTouched(true);

        if (!isFormValid) {
            setFormMessage('Please fill in all required fields correctly.');
            setFormMessageColor('red');
            return;
        }
        if (isLoading) {
            return;
        }
        try {
            setIsLoading(true);

            const templateParams = {
                name,
                email,
                company,
                message,
                subject,
            };

            await emailjs.send(
                'service_focthmw',
                'template_hpww03m',
                templateParams,
                'Ek9BUq_Fo380thzWJ'
            );

            setFormMessage(`Message successfully sent. Thank you ${name}!`);
            setCompany('');
            setEmail('');
            setName('');
            setMessage('');
            setSubject('');
            setFormMessageColor(colors.blue);
            setIsLoading(false);
            // Reset touched states after successful submission
            setNameTouched(false);
            setEmailTouched(false);
            setSubjectTouched(false);
            setMessageTouched(false);
        } catch (error) {
            setFormMessage(
                'There was an error sending your message. Please try again.'
            );
            setFormMessageColor(colors.red);
            setIsLoading(false);
            console.error(error);
        }
    }

    useEffect(() => {
        if (formMessage.length > 0) {
            const timer = setTimeout(() => {
                setFormMessage('');
                setFormMessageColor('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [formMessage]);

    // Function to get dynamic style for input borders
    const getInputStyle = (isValid: boolean, touched: boolean) => {
        return {
            ...styles.formItem,
            ...(touched && !isValid && { borderColor: 'red', borderWidth: 2, borderStyle: 'solid' }),
        };
    };

    return (
        <div className="site-page-content">
            <div style={styles.header}>
                <h1>Contact</h1>
                <div style={styles.socials}>
                    <SocialBox
                        icon={inIcon}
                        link={'https://www.linkedin.com/in/nasseralsunaid/'}
                    />
                </div>
            </div>
            <div className="text-block">
                <p>
                    I'm currently finishing my COOP at Riyad Bank, with my last day
                    being July 10th.
                    <br />
                    I'm now exploring full-time opportunities and graduate development
                    programs (GDPs), particularly in{' '}
                    <b>Business Analysis</b>, <b>Strategy</b>, <b>Project Management</b>,{' '}
                    <b> Consulting</b>, and <b>Tech</b>.
                    <br />
                    If you’re working on something exciting or know of relevant
                    opportunities, feel free to reach out — I’d love to connect.
                </p>
                <br />
                <p>
                    <b>Email: </b>
                    <a href="mailto:nfalsunaid@gmail.com">nfalsunaid@gmail.com</a>
                </p>

                <div style={styles.form}>
                    <label>
                        <p>
                            {/* Always show asterisk for required fields */}
                            <span style={styles.star}>*</span>
                            <b>Your name:</b>
                        </p>
                    </label>
                    <input
                        style={getInputStyle(isNameValid, nameTouched)}
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setNameTouched(true)} // Mark as touched on blur
                    />
                    <label>
                        <p>
                            {/* Always show asterisk for required fields */}
                            <span style={styles.star}>*</span>
                            <b>Email:</b>
                        </p>
                    </label>
                    <input
                        style={getInputStyle(isEmailValid, emailTouched)}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setEmailTouched(true)} // Mark as touched on blur
                    />
                    <label>
                        <p>
                            <b>Company (optional):</b>
                        </p>
                    </label>
                    <input
                        style={styles.formItem} // No validation styling for optional field
                        type="text"
                        name="company"
                        placeholder="Company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                    />
                    <label>
                        <p>
                            {/* Always show asterisk for required fields */}
                            <span style={styles.star}>*</span>
                            <b>Subject:</b>
                        </p>
                    </label>
                    <input
                        style={getInputStyle(isSubjectValid, subjectTouched)}
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        onBlur={() => setSubjectTouched(true)} // Mark as touched on blur
                    />
                    <label>
                        <p>
                            {/* Always show asterisk for required fields */}
                            <span style={styles.star}>*</span>
                            <b>Message:</b>
                        </p>
                    </label>
                    <textarea
                        name="message"
                        placeholder="Message"
                        style={getInputStyle(isMessageValid, messageTouched)}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onBlur={() => setMessageTouched(true)} // Mark as touched on blur
                    />
                    <div style={styles.buttons}>
                        <button
                            className="site-button"
                            style={styles.button}
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            onMouseDown={submitForm}
                        >
                            {!isLoading ? (
                                'Send Message'
                            ) : (
                                <p className="loading">Sending</p>
                            )}
                        </button>
                        <div style={styles.formInfo}>
                            <p
                                style={Object.assign({}, { color: formMessageColor })}
                            >
                                <b>
                                    <sub>
                                        {formMessage
                                            ? `${formMessage}`
                                            : ' All messages get forwarded straight to my personal email'}
                                    </sub>
                                </b>
                            </p>
                            <p>
                                <sub>
                                    {/* Asterisk always shown, so this is just a legend */}
                                    <span>
                                        <b style={styles.star}>*</b> = required
                                    </span>
                                </sub>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ResumeDownload altText="Need a copy of my Resume?" />
        </div>
    );
};

// Assuming StyleSheetCSS is equivalent to React.CSSProperties or similar
const styles: Record<string, CSSProperties> = {
    form: {
        flexDirection: 'column',
        marginTop: 32,
    },
    formItem: {
        marginTop: 4,
        marginBottom: 16,
        // Default border to blend with your existing styles
        border: '1px solid #ccc', // Assuming a default border color
        borderRadius: 4, // Assuming some border radius
        padding: 8, // Add some padding
        boxSizing: 'border-box', // Ensure padding doesn't increase total width/height
        // Transition for smooth border change
        transition: 'border-color 0.3s ease-in-out',
    },
    socialImage: {
        width: 36,
        height: 36,
    },
    buttons: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    formInfo: {
        textAlign: 'right',
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingLeft: 24,
    },
    star: {
        paddingRight: 4,
        color: 'red',
    },
    button: {
        minWidth: 184,
        height: 32,
    },
    header: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    socials: {
        marginBottom: 16,
        justifyContent: 'flex-end',
    },
    social: {
        width: 4,
        height: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
};

export default Contact;