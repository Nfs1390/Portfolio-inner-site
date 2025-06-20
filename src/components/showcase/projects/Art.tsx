// NOTE: This file is still named "ArtProjects" for convenience,
// but has been repurposed to represent my upcoming *Book* project.
// It's a work in progress — no spoilers yet, but إن شاء الله I actually write it :)

import React from 'react';

import girlRun from '../../../assets/pictures/projects/art/girl-run.gif';
import gsts from '../../../assets/pictures/projects/art/gsts.png';

export interface ArtProjectsProps {}

const ArtProjects: React.FC<ArtProjectsProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1>Book</h1>
            <h3>In Progress</h3>
            <br />
            <div className="text-block">
                <p>
                    This section is currently dedicated to a passion project
                    I’ve kept in my heart for some time — a story I’ve been
                    developing, thinking about, and dreaming of writing.
                </p>
                <br />
                <p>
                    I’m still in the early stages of organizing my ideas and world-building
                    (without lying to myself إن شاء الله I actually do it), so I won’t be sharing
                    any details just yet.
                </p>
                <br />
                <p>
                    More to come... when inspiration strikes!
                </p>
            </div>
        </div>
    );
};

export default ArtProjects;
