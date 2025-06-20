import React from 'react';
import me from '../../assets/pictures/workingAtComputer.jpg';
import meNow from '../../assets/pictures/currentme.jpg';
import { Link } from 'react-router-dom';
import ResumeDownload from './ResumeDownload';

export interface AboutProps { }

const About: React.FC<AboutProps> = (props) => {
    return (
        // add on resize listener
        <div className="site-page-content">
            {/* <img src={me} style={styles.topImage} alt="" /> */}
            <h1 style={{ marginLeft: -16 }}>Welcome</h1>
            <h3>I'm Nasser Alsunaid</h3>
            <br />
            <div className="text-block">
                <p>
                    I'm a co-op trainee currently working at Riyad Bank! In July
                    of 2025 I officially graduate from Prince Sultan University
                    with a BS in Computer Science.
                </p>
                <br />
                <p>
                    Thank you for taking the time to check out my portfolio. I
                    really hope you enjoy exploring it as much as I did. If you have any questions or comments, feel
                    free to contact me using{' '}
                    <Link to="/contact">this form</Link> or shoot me an email at{' '}
                    <a href="mailto:nfalsunaid@gmail.com">
                        nfalsunaid@gmail.com
                    </a>
                </p>
            </div>
            <ResumeDownload />
            <div className="text-block">
                <h3>About Me</h3>
                <br />
                <p>
                    From a young age, I’ve been drawn to strategy—whether it was
                    trying to outsmart games like <b>chess</b>or figuring out how to make money as a kid.
                    I’ve always liked dissecting how things work, not just technically
                    but conceptually too. That mindset naturally pulled me toward tech
                    and problem-solving.
                    <br />
                    <br />
                    I actually started university as an Information Systems major because
                    it blended business and tech—two areas I’m deeply interested in. But let’s
                    just say... my memory didn’t get the memo. I eventually switched to Computer
                    Science when I realized I preferred courses that focused on understanding
                    concepts over memorizing facts. CS challenged me in a way that clicked
                    and I’ve been exploring the intersection of tech, strategy, and innovation ever since.
                </p>
                <br />
                <div className="captioned-image">
                    <img src={me} style={styles.image} alt="" />
                    <p>
                        <sub>
                            <b>Figure 1:</b> Baby Nasser :)
                        </sub>
                    </p>
                </div>

                <p>
                    After high school, I had no idea what I wanted to do. I knew I didn’t want a
                    memorization-heavy major (my memory and I don’t exactly get along), so I
                    looked for something that blended business and tech—Information Systems seemed
                    like the perfect fit. But after two years, I realized I liked every Computer
                    Science course I took and hated the only IS course I had. So, I made the switch,
                    and honestly, haven’t looked back.
                </p>
                <br />
                <p>
                    During my time at Prince Sultan University, I got to work on some great
                    projects—most notably my senior project, where my team (Abdulmalik Alghailan,
                    Meshari Alhumali, and Saud Alrabiah) and I built a glove that translates sign
                    language into speech. We were supervised by Dr. Wadii Boulila, and it was
                    easily one of the highlights of my academic journey.
                </p>
                <br />
                <p>
                    I’m currently working on something new that I hope will make a meaningful
                    impact. It's still in its early stages, but I’ll just say this—it’s something
                    that blends my love for culture, aesthetics, and technology. I’m designing
                    both the business and the website myself, and while I won’t give away too
                    much yet, let’s just say if you're into fashion and discovering things from
                    all over the world... you’ll probably want to stick around.
                </p>
                <br />
                <br />
                <div style={{}}>
                    <div
                        style={{
                            flex: 1,
                            textAlign: 'justify',
                            alignSelf: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <h3>My Hobbies</h3>
                        <br />
                        <p>
                            Let’s start with video games. I haven’t picked up a controller in a while,
                            but I still talk like I’m deep in the scene. These days, I’m more into
                            strategy games—chess especially. I play regularly, and while I wouldn’t
                            call myself a grandmaster (or even close), I enjoy the challenge and the
                            way it pushes me to think a few steps ahead. That love for logic, planning,
                            and world-building never really left me—it just evolved.
                        </p>
                        <br />
                        <p>
                            Fashion is something I’ve always been drawn to. I like staying up to date with
                            new trends, exploring how brands from different cultures express identity,
                            and just observing how style evolves over time. I'm not trying to become a
                            fashion critic (yet), but it’s something I enjoy learning about, and it’s
                            definitely influencing the direction of my current project.
                        </p>
                        <p>
                            As for TV shows, that’s where I get really into it. Fantasy, action,
                            supernatural elements—those are my sweet spots. I love complex worlds, magical
                            systems, elves, and anything that lets my imagination run wild. Shows like
                            that have influenced me so much, I’m even considering writing a book just for
                            fun. Nothing serious—just me seeing if I can take all the stories, patterns,
                            and character arcs I’ve absorbed over the years and turn them into something
                            of my own.
                        </p>
                        <br />
                        <p>
                            I’m super grateful for my family and friends who’ve always supported me—
                            whether it’s helping me stay grounded or just letting me rant about the latest
                            episode of whatever I’m obsessed with. If you've made it this far, thanks for
                            reading and getting to know me a bit better!
                        </p>
                    </div>
                    <div style={styles.verticalImage}>
                        <img src={meNow} style={styles.image} alt="" />
                        <p>
                            <sub>
                                <b>Figure 2:</b> Me, April 2025
                            </sub>
                        </p>
                    </div>
                </div>
                <br />
                <br />
                <p>
                    Thanks for reading about me! If you ever want to chat about fashion, games, TV, or anything in between, you
                    can reach out through the <Link to="/contact">contact page</Link> or hit me up
                    on{' '}
                    <a href="https://www.linkedin.com/in/nasseralsunaid" target="_blank" rel="noreferrer">
                        LinkedIn
                    </a>
                    .
                </p>
                <br />
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    contentHeader: {
        marginBottom: 16,
        fontSize: 48,
    },
    image: {
        height: 'auto',
        width: '100%',
    },
    topImage: {
        height: 'auto',
        width: '100%',
        marginBottom: 32,
    },
    verticalImage: {
        alignSelf: 'center',
        // width: '80%',
        marginLeft: 32,
        flex: 0.8,

        alignItems: 'center',
        // marginBottom: 32,
        textAlign: 'center',
        flexDirection: 'column',
    },
};

export default About;
