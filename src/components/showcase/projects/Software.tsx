// This file was originally for Software Projects, but has now been adapted to represent Academic Projects.
// It currently showcases Nasser Alsunaid’s senior project and academic work, including Power BI dashboards.

import React from 'react';
import ResumeDownload from '../ResumeDownload';

// Replace these paths with the actual paths to your images
import gloveImage from '../../../assets/pictures/projects/software/glove.png';
import teamImage from '../../../assets/pictures/projects/software/team.jpeg';

export interface SoftwareProjectsProps {}

const SoftwareProjects: React.FC<SoftwareProjectsProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1>Academic</h1>
            <h3>Projects</h3>
            <br />
            <p>
                Here are some of the academic projects I've worked on during my time as a Computer Science student.
                These projects challenged me technically and allowed me to work both independently and as part of a team.
            </p>
            <br />
            <ResumeDownload />
            <br />

            <div className="text-block">
                <h2>Smart Glove – Sign Language Translation</h2>
                <br />
                <p>
                    For my senior project at Prince Sultan University, my team and I developed a smart glove capable of translating
                    sign language gestures into spoken words using sensors and machine learning. The glove was equipped with
                    flex sensors, a gyroscope, and an accelerometer to capture hand movements and gestures. These were then
                    processed on a Raspberry Pi to convert the signs into text and speech in real time.
                </p>
                <br />
                <div className="captioned-image">
                    <img src={gloveImage} alt="Smart Glove" />
                    <p>
                        <sub>
                            <b>Figure 1:</b> The smart glove prototype built for the senior project.
                        </sub>
                    </p>
                </div>
                <br />
                <p>
                    This project pushed me to explore both hardware and software integration, and gave me valuable experience
                    in teamwork, embedded systems, and real-world application of machine learning. I'm proud of what we accomplished.
                </p>
                <br />
                <div className="captioned-image">
                    <img src={teamImage} alt="Senior Project Team" />
                    <p>
                        <sub>
                            <b>Figure 2:</b> Our senior project team at Prince Sultan University.
                        </sub>
                    </p>
                </div>
            </div>

            <div className="text-block">
                <h2>Power BI Dashboards – Riyad Bank</h2>
                <br />
                <p>
                    During my cooperative training at Riyad Bank, I worked on creating business dashboards using Power BI.
                    I built a task management dashboard to help team leaders monitor work progress and another dashboard
                    that displayed the availability and uptime status of critical banking applications.
                </p>
                <br />
                <p>
                    These dashboards were built from scratch using Excel sheets and internal data, and helped me develop
                    both technical skills in Power BI and a deeper understanding of how data visualization supports
                    operational decision-making in real organizations.
                </p>
            </div>

            <ResumeDownload />
        </div>
    );
};

const styles: StyleSheetCSS = {
    caption: {
        width: '80%',
    },
};

export default SoftwareProjects;
