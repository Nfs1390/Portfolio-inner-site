import React, { useState, useCallback } from 'react';
import Window from '../os/Window';
import AITerminal from './AITerminal';

export interface AITerminalAppProps extends WindowAppProps {}

interface AITerminalAppState {
    width: number;
    height: number;
}

const AITerminalApp: React.FC<AITerminalAppProps> = (props) => {
    const [{ width, height }, setDimensions] = useState<AITerminalAppState>({
        width: 650,
        height: 500
    });

    const handleTerminalExit = () => {
        // Close the window when user types 'exit'
        if (props.onClose) {
            props.onClose();
        }
    };

    // Memoize the callbacks to prevent infinite render loop
    const handleWidthChange = useCallback((newWidth: number) => {
        setDimensions(prev => ({ ...prev, width: newWidth }));
    }, []);

    const handleHeightChange = useCallback((newHeight: number) => {
        setDimensions(prev => ({ ...prev, height: newHeight }));
    }, []);

    return (
        <Window
            top={50}
            left={50}
            width={width}
            height={height}
            windowTitle="Command Prompt"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            onWidthChange={handleWidthChange}
            onHeightChange={handleHeightChange}
        >
            <div style={styles.container}>
                <AITerminal
                    width={width - 20}
                    height={height - 80}
                    onExit={handleTerminalExit}
                />
            </div>
        </Window>
    );
};

const styles = {
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        padding: '10px',
        boxSizing: 'border-box' as const
    }
};

export default AITerminalApp;

