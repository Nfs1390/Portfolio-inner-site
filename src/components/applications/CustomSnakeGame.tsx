// src/components/applications/CustomSnakeGame.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';

// Type Definitions
type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Difficulty = 'easy' | 'medium' | 'hard';

// Constants for game speed based on difficulty
const DIFFICULTY_SPEEDS = {
  easy: 200,
  medium: 120,
  hard: 80,
};

// Interface for component props
interface CustomSnakeGameProps {
  width?: number;
  height?: number;
  cellSize?: number;
  snakeColor?: string;
  foodColor?: string;
  backgroundColor?: string;
  difficulty: Difficulty; // Required, passed from parent
  onGameOver: (score: number) => void; // Required callback for parent
  isGameActive: boolean; // Controls if the game loop is running and input is accepted
}

// Main Snake Game Component
const CustomSnakeGame: React.FC<CustomSnakeGameProps> = ({
  width = 300,
  height = 300,
  cellSize = 15,
  snakeColor = '#00ff00',
  foodColor = '#ff0000',
  backgroundColor = '#000000',
  difficulty, // Use the difficulty passed via props
  onGameOver,
  isGameActive, // Use the prop to control game state
}) => {
  // Calculate grid dimensions
  const gridWidth = Math.floor(width / cellSize);
  const gridHeight = Math.floor(height / cellSize);

  // State variables (internal to the game board's current play session)
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT'); // For rendering purposes
  const [score, setScore] = useState(0);

  // Refs for managing game loop and DOM focus
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null); // For focusing the game board

  // Direction management for preventing double-turn bug
  const currentDirectionRef = useRef<Direction>(direction); // The "true" current direction
  const canChangeDirectionRef = useRef<boolean>(true); // Flag to allow one direction change per tick

  // Helper to check if two directions are opposite
  const isOpposite = useCallback((dir1: Direction, dir2: Direction): boolean => {
    return (
      (dir1 === 'UP' && dir2 === 'DOWN') ||
      (dir1 === 'DOWN' && dir2 === 'UP') ||
      (dir1 === 'LEFT' && dir2 === 'RIGHT') ||
      (dir1 === 'RIGHT' && dir2 === 'LEFT')
    );
  }, []);

  // Checks for collisions with walls or the snake's own body
  const checkCollision = useCallback((head: Position, snakeBody: Position[]): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
      return true;
    }
    // Self-collision (check from the second segment onwards)
    return snakeBody.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
  }, [gridWidth, gridHeight]);

  // Generates a new food position, ensuring it doesn't spawn on the snake
  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridWidth),
        y: Math.floor(Math.random() * gridHeight),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake, gridWidth, gridHeight]);

  // Moves the snake, handles food consumption and game over conditions
  const moveSnake = useCallback(() => {
    setSnake(currentSnake => {
      const activeDirection = currentDirectionRef.current;
      canChangeDirectionRef.current = true; // Reset the flag for the next key press

      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      // Update head position based on the activeDirection
      switch (activeDirection) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check for collisions after moving the head
      if (checkCollision(head, newSnake)) {
        onGameOver(score); // Notify parent component about game over and final score
        return currentSnake; // Return current snake state to stop further moves for this tick
      }

      // Add new head
      newSnake.unshift(head);

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood()); // Generate new food
      } else {
        newSnake.pop(); // Remove tail if no food eaten (snake moves)
      }

      return newSnake;
    });
  }, [food, score, checkCollision, generateFood, onGameOver]);

  // Handles keyboard arrow key presses and WASD to change snake direction
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Only process input if the game is active (controlled by prop)
    if (!isGameActive) return;

    const { key } = event;
    event.preventDefault(); // Prevent default browser scroll behavior

    let newDesiredDirection: Direction | null = null;

    switch (key) {
      case 'ArrowUp': case 'w': case 'W': newDesiredDirection = 'UP'; break;
      case 'ArrowDown': case 's': case 'S': newDesiredDirection = 'DOWN'; break;
      case 'ArrowLeft': case 'a': case 'A': newDesiredDirection = 'LEFT'; break;
      case 'ArrowRight': case 'd': case 'D': newDesiredDirection = 'RIGHT'; break;
    }

    if (newDesiredDirection && canChangeDirectionRef.current) {
        // Only allow change if it's not directly opposite the *current* snake direction
        if (!isOpposite(currentDirectionRef.current, newDesiredDirection)) {
            currentDirectionRef.current = newDesiredDirection; // Update the ref directly
            setDirection(newDesiredDirection); // Update state for rendering (optional, but good for dev tools)
            canChangeDirectionRef.current = false; // Block further changes this tick
        }
    }
  }, [isGameActive, isOpposite]);

  // Effect to manage game initialization/reset when 'isGameActive' or 'difficulty' changes
  useEffect(() => {
    if (isGameActive) {
      // Re-initialize game state
      setSnake([{ x: 10, y: 10 }]);
      setFood({ x: 15, y: 15 });
      setDirection('RIGHT');
      currentDirectionRef.current = 'RIGHT';
      canChangeDirectionRef.current = true;
      setScore(0);

      // Focus the game container to capture key presses
      if (containerRef.current) {
        containerRef.current.focus();
      }
    } else { // If game is no longer active, clear interval
      clearInterval(gameLoopRef.current!);
    }
  }, [isGameActive, difficulty]);

  // Effect for the game loop (setInterval)
  useEffect(() => {
    clearInterval(gameLoopRef.current!); // Clear any existing interval

    if (isGameActive) { // Only run if the game is active. Parent handles stopping when game over.
      gameLoopRef.current = setInterval(moveSnake, DIFFICULTY_SPEEDS[difficulty]);
    }

    // Cleanup function to clear interval when component unmounts or dependencies change
    return () => {
      clearInterval(gameLoopRef.current!);
    };
  }, [isGameActive, moveSnake, difficulty]);

  // Effect to add and remove keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Renders individual cells of the game board
  const renderCell = useCallback((x: number, y: number) => {
    const isSnake = snake.some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;
    const isHead = snake[0]?.x === x && snake[0]?.y === y;

    let cellColor = backgroundColor;
    if (isFood) {
      cellColor = foodColor;
    } else if (isSnake) {
      cellColor = snakeColor;
    }

    return (
      <div
        key={`${x}-${y}`}
        style={{
          width: cellSize,
          height: cellSize,
          backgroundColor: cellColor,
          // Border for individual snake segments
          border: isSnake ? `1px solid ${isHead ? '#ffffff' : '#008800'}` : 'none',
          boxSizing: 'border-box',
        }}
      />
    );
  }, [snake, food, cellSize, backgroundColor, foodColor, snakeColor]);

  // Component JSX (Only renders the game board, its score, and difficulty)
  return (
    <div
      ref={containerRef}
      tabIndex={isGameActive ? 0 : -1} // Only focusable when active game is running
      style={styles.gameContainer}
    >
      <div style={styles.gameInfo}>
        <div style={styles.score}>Score: {score}</div>
        <div style={styles.difficulty}>Difficulty: {difficulty.toUpperCase()}</div>
      </div>

      <div
        style={{
          ...styles.gameBoard,
          width,
          height,
          backgroundColor
        }}
      >
        {/* Render grid cells only if the game is active */}
        {isGameActive && Array.from({ length: gridHeight }, (_, y) =>
          Array.from({ length: gridWidth }, (_, x) => renderCell(x, y))
        )}
      </div>
    </div>
  );
};

// Inline Styles
const styles = {
  gameContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    fontFamily: 'monospace',
    backgroundColor: '#1a1a1a', // This background color is for the entire game frame
    padding: '10px',
    borderRadius: '8px',
    // border: '2px solid #333', // Removed outer border for cleaner look
    outline: 'none',
    boxShadow: '0 0 15px rgba(0, 255, 0, 0.5)',
    position: 'relative' as const,
    minWidth: '320px', // Min width to hold the 300px board + padding
    minHeight: '320px', // Min height to hold the 300px board + info + padding
  },
  gameInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '10px',
    color: '#00ff00',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '0 5px'
  },
  score: {
    color: '#00ff00'
  },
  difficulty: {
    color: '#ffff00'
  },
  gameBoard: {
    display: 'grid',
    gridTemplateColumns: `repeat(${Math.floor(300 / 15)}, ${15}px)`, // Hardcoded grid (20x20 for 15px cells)
    gap: '1px',
    // border: '2px solid #00ff00', // REMOVED: This was the "fence-like" border
    marginBottom: '15px',
    position: 'relative' as const,
    width: 300,
    height: 300,
  },
};

export default CustomSnakeGame;