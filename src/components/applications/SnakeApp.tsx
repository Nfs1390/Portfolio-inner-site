// src/components/applications/SnakeApp.tsx

import React, { useState, useCallback } from 'react';
import Window from '../os/Window'; // Assuming correct path to your Window component
import CustomSnakeGame from './CustomSnakeGame'; // Import the revised CustomSnakeGame

// Type Definitions (Duplicated for clarity here, but ideally from a common types file)
type Difficulty = 'easy' | 'medium' | 'hard';

// Assuming WindowAppProps is defined somewhere, e.g., in '../os/Window' or a global types file
interface WindowAppProps {
    onClose: () => void;
    onInteract: () => void;
    appId: string; // Add any other props WindowAppProps might have
    // ... potentially other props like initialX, initialY for window position
}

export interface SnakeAppProps extends WindowAppProps {}

const SnakeApp: React.FC<SnakeAppProps> = (props) => {
    // State to control the overall application flow: start, playing, game over
    const [appPhase, setAppPhase] = useState<'start' | 'playing' | 'gameOver'>('start');
    // State to hold the user's selected difficulty
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
    // State to display the final score on the game over screen
    const [finalScore, setFinalScore] = useState<number>(0);

    // Fixed dimensions for the Window component
    const fixedWindowWidth = 380;
    const fixedWindowHeight = 520;

    // Callback for when the game ends (from CustomSnakeGame)
    const handleGameOver = useCallback((score: number) => {
        setFinalScore(score);
        setAppPhase('gameOver'); // Transition to game over phase
        console.log(`Game Over! Final score: ${score}`);
    }, []);

    // Function to start the game
    const startGame = useCallback(() => {
        setAppPhase('playing'); // Transition to playing phase
    }, []);

    // Function to reset the game, going back to the start screen
    const playAgain = useCallback(() => {
        setAppPhase('start'); // Go back to start screen
        setFinalScore(0); // Reset final score
    }, []);

    // These callbacks are still needed by the Window component's props,
    // even if we are not actively using the width/height changes for this app.
    // They will just be no-ops.
    const handleWidthChange = useCallback((newWidth: number) => {
        // No action needed as window is effectively fixed for this app's content
    }, []);

    const handleHeightChange = useCallback((newHeight: number) => {
        // No action needed as window is effectively fixed for this app's content
    }, []);


    return (
        <Window
            top={10}
            left={10}
            width={fixedWindowWidth}   // Use fixed width
            height={fixedWindowHeight} // Use fixed height
            windowTitle="Snake Game"
            windowBarColor="#1a1a1a"
            bottomLeftText={appPhase === 'playing' ? 'Playing Snake' : 'Classic Snake Game'}
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onInteract}
            // Removed 'resizable={false}' because your Window component does not support it
            // As per your instruction, we are not modifying Window.tsx
            onWidthChange={handleWidthChange}
            onHeightChange={handleHeightChange}
        >
            <div style={appStyles.outerContainer}>
                {/* --- Start Screen --- */}
                {appPhase === 'start' && (
                    <div style={appStyles.screenContent}>
                        <h2 style={appStyles.title}>🐍 Snake Game 🐍</h2>
                        <p style={appStyles.instructions}>
                            Use <b>Arrow Keys</b> or <b>WASD</b> to control your snake.<br/>
                            Eat the red food to grow and score points.<br/>
                            Don't hit the walls or yourself!
                        </p>

                        <div style={appStyles.difficultySelection}>
                            <p>Choose Difficulty:</p>
                            <div style={appStyles.difficultyButtons}>
                                <button
                                    style={{ ...appStyles.difficultyButton, ...(selectedDifficulty === 'easy' && appStyles.difficultyButtonActive) }}
                                    onClick={() => setSelectedDifficulty('easy')}
                                >
                                    Easy
                                </button>
                                <button
                                    style={{ ...appStyles.difficultyButton, ...(selectedDifficulty === 'medium' && appStyles.difficultyButtonActive) }}
                                    onClick={() => setSelectedDifficulty('medium')}
                                >
                                    Medium
                                </button>
                                <button
                                    style={{ ...appStyles.difficultyButton, ...(selectedDifficulty === 'hard' && appStyles.difficultyButtonActive) }}
                                    onClick={() => setSelectedDifficulty('hard')}
                                >
                                    Hard
                                </button>
                            </div>
                        </div>

                        <button style={appStyles.actionButton} onClick={startGame}>
                            Start Game
                        </button>
                    </div>
                )}

                {/* --- Playing Game --- */}
                {appPhase === 'playing' && (
                    <>
                        <CustomSnakeGame
                            width={300}
                            height={300}
                            cellSize={15}
                            snakeColor="#00ff00"
                            foodColor="#ff0000"
                            backgroundColor="#000000"
                            difficulty={selectedDifficulty}
                            onGameOver={handleGameOver}
                            isGameActive={true}
                        />
                        <div style={appStyles.gameTips}>
                            <p style={appStyles.smallInstructions}>
                                Use Arrow Keys or WASD to control the snake
                            </p>
                        </div>
                    </>
                )}

                {/* --- Game Over Screen --- */}
                {appPhase === 'gameOver' && (
                    <div style={appStyles.screenContent}>
                        <h2 style={appStyles.gameOverText}>Game Over!</h2>
                        <p style={appStyles.finalScore}>Final Score: {finalScore}</p>
                        <button style={appStyles.actionButton} onClick={playAgain}>
                            Play Again
                        </button>
                    </div>
                )}
            </div>
        </Window>
    );
};

// Styles for SnakeApp and its different screens
const appStyles = {
    outerContainer: { // This styles the content area inside the Window
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        // Removed padding here, as it was causing the "half white" issue when Window's content area has its own background
        backgroundColor: '#2a2a2a', // Background for the app's content
        width: '100%', // Ensure it takes full width of parent (Window content area)
        height: '100%', // Ensure it takes full height of parent (Window content area)
        overflow: 'hidden', // Prevent scrollbars
        justifyContent: 'center', // Center content vertically
        boxSizing: 'border-box' as 'border-box', // Ensure border/padding are included in total dimensions
    },
    screenContent: { // Generic style for start/gameover screens to ensure centering and full fill
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center' as const,
        width: '100%', // Takes full width of outerContainer
        height: '100%', // Takes full height of outerContainer
        padding: '20px', // Add padding inside the screen content
        boxSizing: 'border-box' as 'border-box',
        backgroundColor: '#2a2a2a', // Ensure consistent dark background for these screens
    },
    title: {
        color: '#00ff00',
        fontFamily: 'monospace',
        fontSize: '24px',
        marginBottom: '20px',
        textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
        textAlign: 'center' as const,
    },
    instructions: {
        fontSize: '14px',
        lineHeight: '1.4',
        marginBottom: '20px',
        color: '#cccccc',
        maxWidth: '300px',
        textAlign: 'center' as const,
    },
    smallInstructions: { // For in-game instructions
        color: '#888888',
        fontSize: '12px',
        fontStyle: 'italic',
        marginTop: '10px',
        textAlign: 'center' as const,
    },
    difficultySelection: {
        marginBottom: '25px',
        fontSize: '16px',
        color: '#ffffff',
        textAlign: 'center' as const,
    },
    difficultyButtons: {
        display: 'flex',
        gap: '10px',
        marginTop: '10px',
        justifyContent: 'center',
    },
    difficultyButton: {
        backgroundColor: '#333333',
        color: '#ffffff',
        border: '1px solid #555555',
        padding: '8px 15px',
        fontSize: '14px',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease',
        '&:hover': {
            backgroundColor: '#555555'
        }
    },
    difficultyButtonActive: {
        backgroundColor: '#00ff00',
        color: '#000000',
        borderColor: '#00ff00',
        fontWeight: 'bold',
        boxShadow: '0 0 8px rgba(0, 255, 0, 0.7)'
    },
    actionButton: { // Generic button style for start/play again
        backgroundColor: '#00ff00',
        color: '#000000',
        border: 'none',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'all 0.2s ease-in-out',
        boxShadow: '0 4px 6px rgba(0, 255, 0, 0.3)',
        '&:hover': {
            backgroundColor: '#00cc00',
            boxShadow: '0 6px 8px rgba(0, 255, 0, 0.5)',
            transform: 'translateY(-2px)'
        },
        '&:active': {
            backgroundColor: '#009900',
            transform: 'translateY(0)'
        }
    },
    gameOverText: {
        color: '#ff0000',
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '10px',
        textShadow: '0 0 5px rgba(255, 0, 0, 0.7)'
    },
    finalScore: {
        color: '#ffff00',
        fontSize: '20px',
        marginBottom: '20px'
    },
    gameTips: { // Container for game instructions/tips below the board
        marginTop: '15px',
        textAlign: 'center' as const,
        color: '#ffffff',
        maxWidth: '320px',
    }
};

export default SnakeApp;