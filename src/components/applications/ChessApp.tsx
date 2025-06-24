import React, { useState, useCallback, useEffect, useRef } from 'react';
import Window from '../os/Window';
import { Chess, Square, Move, PieceSymbol, Color } from 'chess.js';

// Import your chess piece SVG files
import wP from '../../assets/chess-pieces/pawn.png';
import wR from '../../assets/chess-pieces/rook.png';
import wN from '../../assets/chess-pieces/knight.png';
import wB from '../../assets/chess-pieces/bishop.png';
import wQ from '../../assets/chess-pieces/queen.png';
import wK from '../../assets/chess-pieces/king.png';

import bP from '../../assets/chess-pieces/pawn1.png';
import bR from '../../assets/chess-pieces/rook1.png';
import bN from '../../assets/chess-pieces/knight1.png';
import bB from '../../assets/chess-pieces/bishop1.png';
import bQ from '../../assets/chess-pieces/queen1.png';
import bK from '../../assets/chess-pieces/king1.png';

// Import Audio Files
import captureSound from '../../assets/chess-pieces/capture.mp3';
import castleSound from '../../assets/chess-pieces/castle.mp3';
import gameEndSound from '../../assets/chess-pieces/game-end.mp3';
import gameStartSound from '../../assets/chess-pieces/game-start.mp3';
import illegalSound from '../../assets/chess-pieces/illegal.mp3';
import moveCheckSound from '../../assets/chess-pieces/move-check.mp3';
import moveOpponentSound from '../../assets/chess-pieces/move-opponent.mp3';
import moveSelfSound from '../../assets/chess-pieces/move-self.mp3';
import promoteSound from '../../assets/chess-pieces/promote.mp3';

interface WindowAppProps {
    onClose: () => void;
    onInteract: () => void;
    onMinimize: () => void;
}

export interface ChessAppProps extends WindowAppProps {}

const soundFiles = {
    capture: captureSound,
    castle: castleSound,
    gameEnd: gameEndSound,
    gameStart: gameStartSound,
    illegal: illegalSound,
    moveCheck: moveCheckSound,
    moveOpponent: moveOpponentSound,
    moveSelf: moveSelfSound,
    promote: promoteSound,
};
type SoundName = keyof typeof soundFiles;

// Map PieceSymbols directly to image paths
const PieceImageMap: { [key in PieceSymbol]: { w: string; b: string } } = {
    'p': { w: wP, b: bP },
    'r': { w: wR, b: bR },
    'n': { w: wN, b: bN },
    'b': { w: wB, b: bB },
    'q': { w: wQ, b: bQ },
    'k': { w: wK, b: bK },
};

// Chess Board Constants
const boardSize = 560; // Base size for the 8x8 grid
const squareSize = boardSize / 8;
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']; // Ranks for white's perspective

// Window Dimensions for Chess App
const rightPanelWidth = 200;
const gapBetweenBoardAndPanel = 40; // Increased gap for aesthetic separation
const fixedWindowWidth = boardSize + gapBetweenBoardAndPanel + rightPanelWidth + (20 * 2); // 20px window padding
const fixedWindowHeight = 850;

// --- ChessSquare Component ---
interface ChessSquareProps {
    square: Square;
    piece: { type: PieceSymbol; color: Color } | null;
    isLight: boolean;
    lastMove: [Square, Square] | null;
    legalMoves: Square[];
    sourceSquare: Square | null;
    kingSquareForHighlight: Square | null;
    gameTurn: 'w' | 'b';
    isThinking: boolean;
    squareSize: number;
    onSquareClick: (square: Square) => void;
}

const ChessSquare: React.FC<ChessSquareProps> = React.memo((
    {
        square, piece, isLight, lastMove, legalMoves, sourceSquare,
        kingSquareForHighlight, gameTurn, isThinking, squareSize, onSquareClick
    }) => {

    // Define colors for the new theme
    const lightSquareColor = '#F0D9B5'; // Light tan
    const darkSquareColor = '#B58863'; // Medium brown
    const lastMoveLightHighlight = '#C9D96E'; // Greenish
    const lastMoveDarkHighlight = '#A2BD4A'; // Darker greenish
    const legalMovesLightHighlight = '#A6C97F'; // Soft green
    const legalMovesDarkHighlight = '#7CB052'; // Darker soft green
    const sourceSquareLightHighlight = '#8EC8F1'; // Light blue
    const sourceSquareDarkHighlight = '#5FA9E0'; // Darker blue
    const checkHighlightColor = '#FF6961'; // Soft red

    let currentBackgroundColor = isLight ? lightSquareColor : darkSquareColor;

    if (lastMove && (square === lastMove[0] || square === lastMove[1])) {
        currentBackgroundColor = isLight ? lastMoveLightHighlight : lastMoveDarkHighlight;
    }
    if (legalMoves.includes(square)) {
        currentBackgroundColor = isLight ? legalMovesLightHighlight : legalMovesDarkHighlight;
    }
    if (square === sourceSquare) {
        currentBackgroundColor = isLight ? sourceSquareLightHighlight : sourceSquareDarkHighlight;
    }
    const isKingInCheck = piece &&
                            piece.type === 'k' &&
                            piece.color === gameTurn &&
                            square === kingSquareForHighlight;
    if (isKingInCheck) {
        currentBackgroundColor = checkHighlightColor;
    }

    const pieceImageSrc = piece ? PieceImageMap[piece.type][piece.color] : null;

    return (
        <div
            style={{
                width: squareSize,
                height: squareSize,
                backgroundColor: currentBackgroundColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}
            onClick={() => onSquareClick(square)}
        >
            {/* Overlay for legal moves (dot or circle around piece) */}
            {legalMoves.includes(square) && (
                <div style={{
                    position: 'absolute',
                    width: piece ? '80%' : '25%', // Larger dot if piece is present, smaller if empty
                    height: piece ? '80%' : '25%',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.2)', // Semi-transparent black dot
                    border: piece ? '3px solid rgba(0,0,0,0.2)' : 'none', // Border for captured squares
                }} />
            )}
            {piece && pieceImageSrc && (
                <div
                    style={{
                        cursor: (gameTurn === 'w' && piece.color === 'w' && !isThinking) ? 'pointer' : 'default',
                        filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.4))',
                        zIndex: 1, // Ensure piece is above move indicator
                    }}
                >
                    <img
                        src={pieceImageSrc}
                        alt={`${piece.color} ${piece.type}`}
                        style={{
                            width: squareSize * 0.9,
                            height: squareSize * 0.9,
                            objectFit: 'contain'
                        }}
                    />
                </div>
            )}
        </div>
    );
});


// --- ChessApp Main Component ---
const ChessApp: React.FC<ChessAppProps> = (props) => {
    // --- State Variables ---
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState(game.fen());
    const [turn, setTurn] = useState<'w' | 'b'>('w');
    const [appPhase, setAppPhase] = useState<'start' | 'playing' | 'gameOver'>('start');
    const [gameOverMessage, setGameOverMessage] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [sourceSquare, setSourceSquare] = useState<Square | null>(null);
    const [selectedSkillLevel, setSelectedSkillLevel] = useState(10);
    const [lastMove, setLastMove] = useState<[Square, Square] | null>(null);
    const [legalMoves, setLegalMoves] = useState<Square[]>([]);
    // whiteCapturedPieces: pieces *captured by Black* (i.e., white pieces lost by White player)
    const [whiteCapturedPieces, setWhiteCapturedPieces] = useState<PieceSymbol[]>([]);
    // blackCapturedPieces: pieces *captured by White* (i.e., black pieces lost by Black AI)
    const [blackCapturedPieces, setBlackCapturedPieces] = useState<PieceSymbol[]>([]);

    // --- Refs ---
    const stockfishWorkerRef = useRef<Worker | null>(null);
    const isWorkerReady = useRef(false);
    const isComponentMounted = useRef(true);
    const audioContextRef = useRef<AudioContext | null>(null);
    const soundBuffersRef = useRef<{ [key: string]: AudioBuffer | null }>({});

    // Ref to hold the latest game instance, so worker can access it without re-init
    const gameRef = useRef(game);
    useEffect(() => {
        gameRef.current = game;
    }, [game]); // Update the ref whenever the 'game' state changes

    // --- Helper function to play sounds cleanly using Web Audio API ---
    const playSound = useCallback(async (soundName: SoundName) => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            return;
        }
        if (audioContextRef.current.state === 'suspended') {
            try {
                await audioContextRef.current.resume();
            } catch (e) {
                console.error("Failed to resume AudioContext:", e);
                return;
            }
        }
        const buffer = soundBuffersRef.current[soundName];
        if (buffer) {
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            source.start(0);
        }
    }, []);

    // Ref to hold the latest playSound function
    const playSoundRef = useRef(playSound);
    useEffect(() => {
        playSoundRef.current = playSound;
    }, [playSound]); // Update the ref whenever playSound changes (due to useCallback dependencies)


    // --- Promotion Modal State ---
    const [promotionInfo, setPromotionInfo] = useState<{
        from: Square;
        to: Square;
        color: Color;
    } | null>(null);
    const [pendingPromotionMove, setPendingPromotionMove] = useState<any>(null);


    // --- AI Move Logic ---
    const makeComputerMove = useCallback(() => {
        if (isThinking || game.isGameOver() || game.turn() !== 'b' || !stockfishWorkerRef.current || !isWorkerReady.current) {
            return;
        }
        setIsThinking(true);
        stockfishWorkerRef.current.postMessage(`position fen ${game.fen()}`);
        stockfishWorkerRef.current.postMessage('go movetime 1000');
    }, [game, isThinking]);

    // --- Game Reset Logic ---
    const resetGame = useCallback(() => {
        const newGame = new Chess();
        setGame(newGame);
        setFen(newGame.fen());
        setTurn('w');
        setAppPhase('start');
        setGameOverMessage('');
        setIsThinking(false);
        setSourceSquare(null);
        setLastMove(null);
        setLegalMoves([]);
        // Make sure these are cleared
        setWhiteCapturedPieces([]);
        setBlackCapturedPieces([]);

        if (stockfishWorkerRef.current && isWorkerReady.current) {
            stockfishWorkerRef.current.postMessage('ucinewgame');
            stockfishWorkerRef.current.postMessage('isready');
            stockfishWorkerRef.current.postMessage(`setoption name Skill Level value ${selectedSkillLevel}`);
        }
    }, [selectedSkillLevel]);

    // --- UI Logic for Click-to-Move ---
    const handleSquareClick = useCallback((square: Square) => {
        if (isThinking || game.isGameOver() || game.turn() !== 'w') {
            return;
        }
        if (sourceSquare) {
            const tempGame = new Chess(); // Create a temporary game instance for move calculation
            tempGame.loadPgn(game.pgn()); // Load current game state into temp game

            const validMovesForSource = tempGame.moves({ square: sourceSquare, verbose: true });
            const targetMove = validMovesForSource.find(move => move.to === square);

            if (targetMove) {
                if (targetMove.flags.includes('p') && game.turn() === 'w' && !targetMove.promotion) {
                    setPromotionInfo({ from: sourceSquare, to: square, color: 'w' });
                    setPendingPromotionMove({ from: sourceSquare, to: square });
                    return;
                }

                let moveResult: Move | null = null;
                try {
                    // Attempt the move on the temporary game instance
                    moveResult = tempGame.move({
                        from: sourceSquare,
                        to: square,
                        promotion: targetMove.promotion || undefined
                    });

                    if (moveResult === null) {
                        playSound('illegal');
                        setSourceSquare(null);
                        setLegalMoves([]);
                        return; // Invalid move, stop here
                    }
                } catch (error) {
                    console.error("Error attempting player move:", error);
                    playSound('illegal');
                    setSourceSquare(null);
                    setLegalMoves([]);
                    return; // Error in move, stop here
                }

                // If move was successful on tempGame, update states
                if (moveResult) {
                    // Update captured pieces first (if any)
                    // FIX: Added 'moveResult &&' for robust type narrowing and '!' for assertion
                    if (moveResult && moveResult.captured && moveResult.color === 'w') {
                        setBlackCapturedPieces(prev => [...prev, moveResult!.captured as PieceSymbol]); // FIX: Added '!'
                        playSound('capture');
                    } else if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) {
                        playSound('castle');
                    } else if (moveResult.flags.includes('p') && moveResult.promotion) {
                        playSound('promote');
                    } else {
                        playSound('moveSelf');
                    }

                    // Then update the main game state and related properties
                    setGame(tempGame); // Use the tempGame which now holds the new state
                    setFen(tempGame.fen());
                    setTurn(tempGame.turn());
                    setLastMove([moveResult.from, moveResult.to]); // Use the moveResult from tempGame

                    if (tempGame.inCheck()) { // Check after the move has been applied to tempGame
                        playSound('moveCheck');
                    }
                } else {
                    playSound('illegal'); // Should ideally be caught by the try/catch, but good fallback
                }
                setSourceSquare(null);
                setLegalMoves([]);
            } else {
                // If not a valid target square for current source, re-select or clear
                const clickedPiece = game.get(square);
                if (clickedPiece && clickedPiece.color === game.turn()) {
                    setSourceSquare(square);
                    setLegalMoves(game.moves({ square: square, verbose: true }).map(move => move.to));
                } else {
                    setSourceSquare(null);
                    setLegalMoves([]); // Clear legal moves if clicking non-friendly piece or empty square
                }
            }
        } else {
            // No source square selected, attempt to select one
            const piece = game.get(square);
            if (piece && piece.color === game.turn()) {
                setSourceSquare(square);
                setLegalMoves(game.moves({ square: square, verbose: true }).map(move => move.to));
            } else {
                setSourceSquare(null);
                setLegalMoves([]); // Clear legal moves if clicking empty square
            }
        }
    }, [game, isThinking, sourceSquare, playSound]);

    // --- Undo Functionality ---
    const handleUndo = useCallback(() => {
        if (isThinking || game.history().length === 0) {
            return;
        }

        const newGame = new Chess();
        newGame.loadPgn(game.pgn());

        let undonePlayerMove: Move | null = null;
        let undoneAIMove: Move | null = null;

        // Undo logic based on original game turn
        if (game.turn() === 'w' && newGame.history().length >= 2) { // AI just moved, need to undo AI then Player
            undoneAIMove = newGame.undo();
            if (undoneAIMove && undoneAIMove.captured) {
                const capturedPiece: PieceSymbol = undoneAIMove.captured;
                setWhiteCapturedPieces(prev => {
                    const index = prev.indexOf(capturedPiece);
                    if (index !== -1) {
                        const newArr = [...prev];
                        newArr.splice(index, 1);
                        return newArr;
                    }
                    return prev;
                });
            }

            if (newGame.history().length > 0) { // Then undo player's move
                undonePlayerMove = newGame.undo();
                if (undonePlayerMove && undonePlayerMove.captured) {
                    const capturedPiece: PieceSymbol = undonePlayerMove.captured;
                    setBlackCapturedPieces(prev => {
                        const index = prev.indexOf(capturedPiece);
                        if (index !== -1) {
                            const newArr = [...prev];
                            newArr.splice(index, 1);
                            return newArr;
                        }
                        return prev;
                    });
                }
            }
        } else if (game.turn() === 'b' && newGame.history().length >= 1) { // Player just moved, undo only player move
            undonePlayerMove = newGame.undo();
            if (undonePlayerMove && undonePlayerMove.captured) {
                const capturedPiece: PieceSymbol = undonePlayerMove.captured;
                setBlackCapturedPieces(prev => {
                    const index = prev.indexOf(capturedPiece);
                    if (index !== -1) {
                        const newArr = [...prev];
                        newArr.splice(index, 1);
                        return newArr;
                    }
                    return prev;
                });
            }
        } else {
            return; // No moves to undo
        }

        setGame(newGame);
        setFen(newGame.fen());
        setTurn(newGame.turn());
        setLastMove(null);
        setSourceSquare(null);
        setLegalMoves([]);
    }, [game, isThinking]);


    // --- Scoring System Logic ---
    const getMaterialScore = useCallback(() => {
        let whiteScore = 0;
        let blackScore = 0;
        const pieceValues: { [key: string]: number } = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0 };
        game.board().forEach(row => {
            row.forEach(square => {
                if (square) {
                    const value = pieceValues[square.type];
                    if (square.color === 'w') { whiteScore += value; }
                    else { blackScore += value; }
                }
            });
        });
        return whiteScore - blackScore;
    }, [game]);

    const getScoreDisplay = useCallback(() => {
        const materialScore = getMaterialScore();
        if (materialScore === 0) return "Material Advantage: Even";
        return `Material Advantage: ${materialScore > 0 ? '+' : ''}${materialScore} (${materialScore > 0 ? 'White' : 'Black'})`;
    }, [getMaterialScore]);

    const getCapturedMaterialValue = useCallback((capturedPieces: PieceSymbol[]) => {
        const pieceValues: { [key: string]: number } = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9 };
        return capturedPieces.reduce((sum, type) => sum + (pieceValues[type] || 0), 0);
    }, []);

    // --- Effect Hook for Stockfish Web Worker Lifecycle and Audio Preloading ---
    useEffect(() => {
        isComponentMounted.current = true;

        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            const loadSound = async (url: string, name: string) => {
                try {
                    const response = await fetch(url);
                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
                    soundBuffersRef.current[name] = audioBuffer;
                } catch (error) {
                    console.error(`Error loading sound '${name}':`, error);
                }
            };
            Object.entries(soundFiles).forEach(([name, path]) => { loadSound(path, name); });
        }

        stockfishWorkerRef.current = new Worker('/stockfish.js');
        const worker = stockfishWorkerRef.current;

        worker.onmessage = (event) => {
            if (!isComponentMounted.current) return;

            const message = event.data;
            if (message === 'readyok') {
                isWorkerReady.current = true;
                if (stockfishWorkerRef.current) {
                    stockfishWorkerRef.current.postMessage(`setoption name Skill Level value ${selectedSkillLevel}`);
                }
            } else if (message.startsWith('bestmove')) {
                const bestMoveUCI = message.split(' ')[1];

                const currentGameState = gameRef.current; // Get latest game state via ref
                const tempGame = new Chess();
                tempGame.loadPgn(currentGameState.pgn()); // Load current game state from ref

                let moveResult: Move | null = null;

                try {
                    moveResult = tempGame.move(bestMoveUCI);
                    if (moveResult === null) {
                        console.error("Stockfish bestmove was not valid:", bestMoveUCI);
                        setIsThinking(false);
                        return;
                    }
                } catch (e) {
                    console.error("Error applying Stockfish move to tempGame:", e);
                    setIsThinking(false);
                    return;
                }

                if (moveResult) {
                    // FIX: Added 'moveResult &&' for robust type narrowing and '!' for assertion
                    if (moveResult && moveResult.captured) {
                        setWhiteCapturedPieces(prev => [...prev, moveResult!.captured as PieceSymbol]); // FIX: Added '!'
                        playSoundRef.current('capture');
                    } else if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) {
                        playSoundRef.current('castle');
                    } else {
                        playSoundRef.current('moveOpponent');
                    }
                    if (moveResult.flags.includes('p') && moveResult.promotion) {
                        playSoundRef.current('promote');
                    }

                    setGame(prevGame => {
                        const newGameFromTemp = new Chess();
                        newGameFromTemp.loadPgn(tempGame.pgn());

                        setFen(newGameFromTemp.fen());
                        setTurn(newGameFromTemp.turn());
                        setLastMove([moveResult!.from, moveResult!.to]); // FIX: Added '!'
                        setIsThinking(false);

                        if (newGameFromTemp.inCheck()) {
                            playSoundRef.current('moveCheck');
                        }
                        return newGameFromTemp;
                    });
                }
            }
        };

        worker.postMessage('uci');
        worker.postMessage('isready');

        return () => {
            isComponentMounted.current = false;
            if (worker) {
                worker.terminate();
                stockfishWorkerRef.current = null;
                isWorkerReady.current = false;
            }
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(e => console.error("Error closing AudioContext:", e));
            }
        };
    }, [selectedSkillLevel]);

    // --- Effect Hook to Check Game State and Trigger AI Move ---
    useEffect(() => {
        if (game.isGameOver()) {
            playSound('gameEnd');
            if (game.isCheckmate()) setGameOverMessage(`${game.turn() === 'w' ? 'Black' : 'White'} wins by Checkmate!`);
            else if (game.isDraw()) setGameOverMessage('Game Over: Draw!');
            else if (game.isStalemate()) setGameOverMessage('Game Over: Stalemate!');
            else if (game.isThreefoldRepetition()) setGameOverMessage('Game Over: Threefold Repetition!');
            else if (game.isInsufficientMaterial()) setGameOverMessage('Game Over: Insufficient Material!');
            setAppPhase('gameOver');
        } else if (appPhase === 'playing' && game.turn() === 'b' && !isThinking && isWorkerReady.current) {
            makeComputerMove();
        }
    }, [game, appPhase, isThinking, makeComputerMove, playSound]);

    // Plays game start sound when phase changes to 'playing'.
    useEffect(() => {
        if (appPhase === 'playing') {
            playSound('gameStart');
        }
    }, [appPhase, playSound]);

    const findKingSquare = useCallback((color: 'w' | 'b'): Square | null => {
        const board = game.board();
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const boardPiece = board[r][f];
                if (boardPiece && boardPiece.type === 'k' && boardPiece.color === color) {
                    return `${files[f]}${ranks[r]}` as Square;
                }
            }
            }
        return null;
    }, [game]);


    const renderGameContent = () => {
        const scoreDisplay = getScoreDisplay();
        const kingSquareForHighlight = game.inCheck() ? findKingSquare(game.turn()) : null;

        return (
            <div style={appStyles.outerContainer}>
                {appPhase === 'start' && (
                    <div style={appStyles.screenContent}>
                        <h2 style={appStyles.title}><img src={wP} alt="Chess Icon" /> Simple Chess <img src={wP} alt="" /></h2>
                        <p style={appStyles.instructions}>
                            Play a classic game of chess against the computer.<br/>
                            You are White.
                        </p>
                        <div style={appStyles.skillSelectorContainer}>
                            <label htmlFor="skill-level-select" style={appStyles.skillLabel}>
                                Select AI Skill Level:
                            </label>
                            <select
                                id="skill-level-select"
                                value={selectedSkillLevel}
                                onChange={(e) => setSelectedSkillLevel(Number(e.target.value))}
                                style={appStyles.skillSelect}
                            >
                                {Array.from({ length: 21 }, (_, i) => i).map(level => (
                                    <option key={level} value={level}>
                                        {level === 0 ? '0 (Beginner)' : level === 20 ? '20 (Master)' : level}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            style={appStyles.actionButton}
                            onClick={() => {
                                if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                                    audioContextRef.current.resume().then(() => playSound('gameStart')).catch(e => console.error("Failed to resume AudioContext on start:", e));
                                } else {
                                    playSound('gameStart');
                                }
                                setAppPhase('playing');
                            }}
                        >
                            Start Game
                        </button>
                    </div>
                )}

                {/* Main game board and panel (visible when playing or game over) */}
                {(appPhase === 'playing' || appPhase === 'gameOver') && (
                    <>
                        {/* TOP PANEL: COMPUTER INFO & CAPTURED WHITE PIECES */}
                        <div style={appStyles.infoPanelTop}>
                            <div style={appStyles.playerInfoRow}>
                                <span style={appStyles.playerName}>Computer (AI)</span>
                                <span style={appStyles.playerIcon}>💻</span> {/* Computer icon */}
                                <span style={appStyles.skillLevelDisplay}>Skill: {selectedSkillLevel}</span>
                            </div>
                            <div style={appStyles.capturedPiecesRowTop}>
                                {whiteCapturedPieces.sort((a,b) => a.localeCompare(b)).map((type, index) => (
                                    <img
                                        key={`wc-${type}-${index}`}
                                        src={PieceImageMap[type].w} // White pieces captured by Black (AI)
                                        alt={`White ${type}`}
                                        style={appStyles.capturedPieceImage}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* MIDDLE SECTION: BOARD & SIDE PANEL */}
                        <div style={appStyles.boardAndSidePanelContainer}>
                            {/* Board Wrapper (no labels inside now) */}
                            <div style={appStyles.boardWrapper}>
                                {/* Chess Board */}
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: `repeat(8, ${squareSize}px)`,
                                        gridTemplateRows: `repeat(8, ${squareSize}px)`,
                                        width: boardSize,
                                        height: boardSize,
                                        border: '2px solid #555',
                                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
                                    }}
                                >
                                    {ranks.map((rank, rIdx) =>
                                        files.map((file, fIdx) => {
                                            const square = `${file}${rank}` as Square;
                                            const piece = game.get(square) || null;

                                            const isLight = (rIdx + fIdx) % 2 === 0;

                                            return (
                                                <ChessSquare
                                                    key={square}
                                                    square={square}
                                                    piece={piece}
                                                    isLight={isLight}
                                                    lastMove={lastMove}
                                                    legalMoves={legalMoves}
                                                    sourceSquare={sourceSquare}
                                                    kingSquareForHighlight={kingSquareForHighlight}
                                                    gameTurn={game.turn()}
                                                    isThinking={isThinking}
                                                    squareSize={squareSize}
                                                    onSquareClick={handleSquareClick}
                                                />
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Right Side Panel - now for game info & undo */}
                            <div style={appStyles.rightPanel}>
                                {appPhase === 'playing' && (
                                    <>
                                        <div style={appStyles.gameInfo}>
                                            <p style={appStyles.turnIndicator}>
                                                {isThinking ? 'Computer is thinking...' : (game.turn() === 'w' ? "Your Turn (White)" : "Computer's Turn (Black)")}
                                                {isThinking && <span style={appStyles.thinkingDots}>...</span>}
                                            </p>
                                            <p style={appStyles.scoreDisplay}>{scoreDisplay}</p>
                                        </div>
                                        <p style={appStyles.instructionsPlaying}>
                                            Click a piece, then click a square to move.
                                        </p>
                                    </>
                                )}

                                {appPhase === 'gameOver' && (
                                    <div style={appStyles.gameOverOverlay}>
                                        <h2 style={appStyles.gameOverText}>Game Over!</h2>
                                        <p style={appStyles.finalScore}>{gameOverMessage}</p>
                                        <button style={appStyles.actionButton} onClick={resetGame}>
                                            Play Again
                                        </button>
                                    </div>
                                )}

                                {/* Undo button is here */}
                                {appPhase === 'playing' && (
                                    <button
                                        style={appStyles.undoButton}
                                        onClick={handleUndo}
                                        disabled={game.history().length === 0 || isThinking}
                                    >
                                        Undo Last Move
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* BOTTOM PANEL: PLAYER INFO & CAPTURED BLACK PIECES */}
                        <div style={appStyles.infoPanelBottom}>
                            <div style={appStyles.playerInfoRow}>
                                <span style={appStyles.playerName}>You (White)</span>
                                <span style={appStyles.playerIcon}>👤</span> {/* Player icon */}
                                {/* Score display can be here or in side panel based on preference */}
                                {/* <span style={appStyles.scoreDisplay}>{scoreDisplay}</span> */}
                            </div>
                            <div style={appStyles.capturedPiecesRowBottom}>
                                {blackCapturedPieces.sort((a,b) => a.localeCompare(b)).map((type, index) => (
                                    <img
                                        key={`bc-${type}-${index}`}
                                        src={PieceImageMap[type].b} // Black pieces captured by White (Player)
                                        alt={`Black ${type}`}
                                        style={appStyles.capturedPieceImage}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* --- Promotion Modal --- */}
                {promotionInfo && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <div style={{ background: appStyles.outerContainer.backgroundColor, padding: 30, borderRadius: 10, boxShadow: '0 5px 15px rgba(0,0,0,0.5)', textAlign: 'center', color: appStyles.outerContainer.color }}>
                            <h3 style={{color: appStyles.title.color, marginBottom: 15}}>Choose Promotion</h3>
                            {['q','r','b','n'].map(type => (
                                <button key={type} style={{
                                    margin: 10,
                                    fontSize: 24,
                                    padding: '12px 20px',
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: appStyles.actionButton.backgroundColor,
                                    color: appStyles.actionButton.color,
                                    cursor: 'pointer',
                                    boxShadow: appStyles.actionButton.boxShadow,
                                    transition: appStyles.actionButton.transition,
                                }}
                                  onClick={() => {
                                    setPromotionInfo(null);
                                    setPendingPromotionMove(null);
                                    const newGameAfterMove = new Chess();
                                    newGameAfterMove.loadPgn(game.pgn());
                                    try {
                                      const moveResult = newGameAfterMove.move({
                                        from: promotionInfo.from,
                                        to: promotionInfo.to,
                                        promotion: type
                                      });
                                      if (moveResult) {
                                        setGame(newGameAfterMove);
                                        setFen(newGameAfterMove.fen());
                                        setTurn(newGameAfterMove.turn());
                                        setLastMove([moveResult.from, moveResult.to]);
                                        playSound('promote');
                                        if (newGameAfterMove.inCheck()) {
                                          playSound('moveCheck');
                                        }
                                      } else {
                                        playSound('illegal');
                                      }
                                    } catch (error) {
                                      playSound('illegal');
                                    } finally {
                                      setSourceSquare(null);
                                      setLegalMoves([]);
                                    }
                                  }}
                                >
                                  <img src={PieceImageMap[type as PieceSymbol][promotionInfo.color]} alt={type} style={{width: 30, height: 30, verticalAlign: 'middle', marginRight: 5}}/>
                                  {type.toUpperCase()}
                                </button>
                              ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Window
            top={50}
            left={50}
            width={fixedWindowWidth}
            height={fixedWindowHeight}
            windowTitle="Simple Chess"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
        >
            {renderGameContent()}
        </Window>
    );
};

// Re-defining styles without pseudo-classes for direct React.CSSProperties compatibility
const appStyles = {
    outerContainer: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        height: '100%',
        width: '100%',
        fontFamily: 'Roboto, sans-serif',
        backgroundColor: '#2C2B29', // Dark charcoal background
        color: '#E0E0E0', // Light grey text
        padding: 0,
        margin: 0,
        overflow: 'hidden', // Prevent overflow from content if any
        boxSizing: 'border-box',
    } as React.CSSProperties,
    screenContent: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%', // Take full height
        width: '100%', // Take full width
        textAlign: 'center' as 'center',
        padding: 20,
        boxSizing: 'border-box',
    } as React.CSSProperties,
    title: {
        fontSize: 36, // Slightly larger title
        marginBottom: 10,
        color: '#F0D9B5', // Light tan from board
        fontWeight: 'bold' as 'bold',
    } as React.CSSProperties,
    instructions: {
        fontSize: 18,
        marginBottom: 20,
        color: '#E0E0E0',
    } as React.CSSProperties,
    skillSelectorContainer: {
        marginBottom: 30, // More space
        width: '100%',
        maxWidth: 300, // Slightly narrower
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
    } as React.CSSProperties,
    skillLabel: {
        fontSize: 16,
        marginBottom: 10, // More space
        color: '#E0E0E0',
    } as React.CSSProperties,
    skillSelect: {
        fontSize: 16,
        padding: '10px 15px', // More padding
        borderRadius: 8, // More rounded
        border: '1px solid #555', // Darker border
        width: '100%',
        maxWidth: 200,
        marginBottom: 20,
        backgroundColor: '#3B3A38', // Match panel background
        color: '#E0E0E0',
        cursor: 'pointer',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)', // Inner shadow for depth
        appearance: 'none', // Remove default select arrow
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%23e0e0e0' d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338z'/%3E%3C/svg%3E")`, // Custom arrow
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.7em top 50%',
        backgroundSize: '1.2em auto',
    } as React.CSSProperties,
    actionButton: {
        fontSize: 18,
        padding: '14px 30px', // More padding
        borderRadius: 8, // More rounded
        border: 'none',
        backgroundColor: '#5E8C6A', // Muted green
        color: '#FFFFFF',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out, transform 0.1s ease-in-out',
        width: '100%',
        maxWidth: 220, // Slightly wider
        boxShadow: '0 4px 6px rgba(0,0,0,0.4)', // More prominent shadow
        fontWeight: 'bold' as 'bold',
    } as React.CSSProperties,
    actionButtonDisabled: {
        backgroundColor: '#555',
        cursor: 'not-allowed',
        boxShadow: 'none',
        opacity: 0.7,
    } as React.CSSProperties,
    gameContainer: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        flexGrow: 1,
        width: '100%',
        height: '100%',
        padding: 0,
        margin: 0,
        alignItems: 'center',
        justifyContent: 'center',
    } as React.CSSProperties,
    infoPanelTop: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        width: '100%',
        padding: '10px 20px',
        backgroundColor: '#3B3A38',
        borderBottom: '1px solid #555',
        boxSizing: 'border-box',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: '5px',
        flexShrink: 0,
    } as React.CSSProperties,
    infoPanelBottom: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        width: '100%',
        padding: '10px 20px',
        backgroundColor: '#3B3A38',
        borderTop: '1px solid #555',
        boxSizing: 'border-box',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: '5px',
        flexShrink: 0,
    } as React.CSSProperties,
    playerInfoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '5px',
        color: '#E0E0E0',
        fontSize: 16,
        fontWeight: 'bold' as 'bold',
    } as React.CSSProperties,
    playerName: {
        fontSize: 18,
        color: '#F0D9B5',
    } as React.CSSProperties,
    playerIcon: {
        fontSize: 20,
    } as React.CSSProperties,
    skillLevelDisplay: {
        fontSize: 14,
        color: '#A0A0A0',
    } as React.CSSProperties,
    boardAndSidePanelContainer: {
        display: 'flex',
        flexDirection: 'row' as 'row',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        width: '100%',
    } as React.CSSProperties,
    boardWrapper: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        marginRight: gapBetweenBoardAndPanel,
        flexShrink: 0,
        position: 'relative',
        padding: 0,
        boxSizing: 'border-box',
    } as React.CSSProperties,
    gameInfo: {
        marginBottom: 20,
        textAlign: 'center' as 'center',
        width: '100%',
    } as React.CSSProperties,
    turnIndicator: {
        fontSize: 18,
        marginBottom: 10,
        color: '#E0E0E0',
    } as React.CSSProperties,
    scoreDisplay: {
        fontSize: 16,
        fontWeight: 'bold' as 'bold',
        color: '#F0D9B5',
    } as React.CSSProperties,
    instructionsPlaying: {
        fontSize: 16,
        marginBottom: 15,
        color: '#E0E0E0',
    } as React.CSSProperties,
    instructionsGameOver: {
        fontSize: 18,
        marginBottom: 20,
        color: '#E0E0E0',
        fontWeight: 'bold' as 'bold',
    } as React.CSSProperties,
    capturedPiecesRowTop: {
        display: 'flex',
        flexDirection: 'row' as 'row',
        flexWrap: 'wrap' as 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 5,
        minHeight: 30,
    } as React.CSSProperties,
    capturedPiecesRowBottom: {
        display: 'flex',
        flexDirection: 'row' as 'row',
        flexWrap: 'wrap' as 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 5,
        minHeight: 30,
    } as React.CSSProperties,
    capturedPieceImage: {
        width: 28,
        height: 28,
        objectFit: 'contain',
        margin: '0 2px',
        filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.2))',
    } as React.CSSProperties,
    capturedScore: {
        fontSize: 14,
        color: '#E0E0E0',
        textAlign: 'center' as 'center',
        marginBottom: 10,
    } as React.CSSProperties,
    undoButton: {
        fontSize: 16,
        padding: '10px 20px',
        borderRadius: 6,
        border: 'none',
        backgroundColor: '#8C6A5E',
        color: '#FFF',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out, transform 0.1s ease-in-out',
        width: '100%',
        maxWidth: 180,
        marginTop: 'auto',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    } as React.CSSProperties,
    gameOverOverlay: {
        position: 'absolute' as 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        borderRadius: 'inherit',
    } as React.CSSProperties,
    gameOverText: {
        fontSize: 28,
        marginBottom: 10,
        color: '#F0D9B5',
        textAlign: 'center' as 'center',
    } as React.CSSProperties,
    finalScore: {
        fontSize: 22,
        marginBottom: 20,
        color: '#E0E0E0',
        textAlign: 'center' as 'center',
    } as React.CSSProperties,
    thinkingDots: {
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: '#E0E0E0',
        marginLeft: 4,
        animation: 'blink 1.4s infinite',
    } as React.CSSProperties,
    rightPanel: {
        width: rightPanelWidth,
        padding: 20,
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: 15,
        background: '#3B3A38',
        borderLeft: '2px solid #555',
        boxSizing: 'border-box',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
    } as React.CSSProperties,
};

export default ChessApp;
