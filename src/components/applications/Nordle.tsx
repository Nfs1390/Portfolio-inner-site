import React from 'react';
import Window from '../os/Window';
import Wordle from '../wordle/Wordle';

export interface NordleAppProps extends WindowAppProps { }

const NordleApp: React.FC<NordleAppProps> = (props) => {
    return (
        <Window
            top={20}
            left={300}
            width={600}
            height={860}
            windowBarIcon="windowGameIcon"
            windowTitle="nordle"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={'© Copyright 2025 Nasser Alsunaid'}
        >
            <div className="site-page">
                <Wordle />
            </div>
        </Window>
    );
};

export default NordleApp;
