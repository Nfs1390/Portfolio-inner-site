// NOTE: This page was originally "Music & Sound" but has been adapted to showcase Personal Projects.
// These include personal ideas and initiatives I’ve explored outside of academic or work contexts.

import React from 'react';
// Replace these with your actual Figma screenshot paths
import workshopScreenshot from '../../../assets/pictures/projects/audio/workshop.PNG';
import loginScreenshot from '../../../assets/pictures/projects/audio/login.jpg';
export interface MusicProjectsProps {}

const MusicProjects: React.FC<MusicProjectsProps> = () => {
    return (
        <div className="site-page-content">
            <h1>Personal</h1>
            <h3>Projects</h3>
            <br />
            <div className="text-block">
                <p>
                    Outside of university and internships, I often find myself drawn to ideas that live somewhere between creativity and practicality. Some are spontaneous, others more thought out — and all of them help me grow.
                </p>
                <br />
                <p>
                    One of the projects I’ve been working on is inspired by fashion, local culture, and the idea of bringing visibility to independent creators. Still a work in progress, but I’m learning a lot and enjoying the process.
                </p>
                <br />
                <p>
                    I don’t see personal projects as things that must be perfect or finished — they’re just my way of thinking out loud, building something, and maybe (inshallah) following through instead of just lying to myself.
                </p>
            </div>

            <div className="text-block">
                <h2>Sneak Peek</h2>
                <br />
                <div className="captioned-image">
                    <img src={workshopScreenshot} alt="Workshop Screen" style={{ maxWidth: '100%', height: 'auto' }} />
                    <p>
                        <sub>
                            <b>Figure 1:</b> Workshop page — one of the core features in progress.
                        </sub>
                    </p>
                </div>
                <br />
                <div className="captioned-image">
                    <img src={loginScreenshot} alt="Login Screen" style={{ maxWidth: '100%', height: 'auto' }} />
                    <p>
                        <sub>
                            <b>Figure 2:</b> Login page — designed to keep things simple and clean.
                        </sub>
                    </p>
                </div>
            </div>

            <div className="text-block">
                <h2>What's Next?</h2>
                <br />
                <p>
                    I have a few other ideas floating around — some creative, some technical — and I’m always open to building something new, especially if it combines both. Expect this section to grow over time.
                </p>
            </div>
        </div>
    );
};

export default MusicProjects;
