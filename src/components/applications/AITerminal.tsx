import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TerminalLine {
    id: number;
    type: 'input' | 'output' | 'error' | 'system';
    content: string;
}

interface AITerminalProps {
    width?: number;
    height?: number;
    onExit?: () => void;
}

const initialLines: TerminalLine[] = [
    { id: 0, type: 'system', content: 'Alsunaid(R) Alsunaid 98' },
    { id: 1, type: 'system', content: '(C)Copyright Alsunaid Inc 1981-2025.' },
    { id: 2, type: 'output', content: '' },
];

const LOCAL_JOKES = [
    "Don't worry, even the best programmers Google their own code.",
    "Confession accepted. The AI recommends: less coffee, more sleep!",
    "You call that a sin? I've seen worse in my error logs.",
    "TherapistBot says: Have you tried turning your guilt off and on again?",
    "It's okay, nobody really understands CSS either.",
];

const PROMPTS: Record<string, string | string[]> = {
    help: [
        'Available commands:',
        '   help    - Show a list of available commands',
        '   about   - About this terminal',
        '   clear   - Clear the screen',
        '   joke    - Tell a joke',
        '   nasser <your question> - Ask Nasser AKA "Main Character" anything',
        '   confess <your confession> - Confess your sins to the Nassers therapist',
        '   exit    - Close the terminal',
    ],
    about: 'SunaidOS Command Prompt: Built different. Runs on chaos, tea, and questionable decisions.',
};

const AITerminal: React.FC<AITerminalProps> = ({ width = 600, height = 400, onExit }) => {
    const [lines, setLines] = useState<TerminalLine[]>(initialLines);
    const [currentInput, setCurrentInput] = useState('');
    const [lineId, setLineId] = useState(initialLines.length);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.scrollLeft = inputRef.current.scrollWidth;
        }
    }, [lines, currentInput]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentInput(e.target.value);
    };

    // Calculate max characters per line based on terminal width
    const getMaxCharsPerLine = useCallback(() => {
        // Approximate character width in monospace font
        const charWidth = 8.4; // pixels per character in Courier New at 14px
        const availableWidth = (width || 600) - 20; // minus padding
        return Math.floor(availableWidth / charWidth) - 5; // safety margin
    }, [width]);

    // Helper function to wrap text
    const wrapText = useCallback((text: string): string[] => {
        const maxChars = getMaxCharsPerLine();
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            
            if (testLine.length <= maxChars) {
                currentLine = testLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    // Single word is too long, break it
                    for (let i = 0; i < word.length; i += maxChars) {
                        lines.push(word.slice(i, i + maxChars));
                    }
                }
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines.length > 0 ? lines : [''];
    }, [getMaxCharsPerLine]);

    const typeWriterEffect = useCallback((
        fullText: string,
        startLineId: number,
        prefix: string = '',
        delay: number = 18,
        onComplete?: () => void
    ) => {
        const wrappedLines = wrapText(fullText);
        let currentLineIndex = 0;
        let currentCharIndex = 0;
        
        const interval = setInterval(() => {
            if (currentLineIndex >= wrappedLines.length) {
                clearInterval(interval);
                if (onComplete) onComplete();
                return;
            }

            const currentWrappedLine = wrappedLines[currentLineIndex];
            const isFirstLine = currentLineIndex === 0;
            const linePrefix = isFirstLine ? prefix : '';
            const displayText = linePrefix + currentWrappedLine.slice(0, currentCharIndex);
            
            setLines(prev => {
                const newLines = [...prev];
                const targetId = startLineId + currentLineIndex;
                
                // Find existing line or create new one
                let targetIndex = newLines.findIndex(line => line.id === targetId);
                if (targetIndex === -1) {
                    // Create new line
                    newLines.push({
                        id: targetId,
                        type: 'output',
                        content: displayText
                    });
                } else {
                    // Update existing line
                    newLines[targetIndex] = {
                        ...newLines[targetIndex],
                        content: displayText
                    };
                }
                
                return newLines;
            });

            currentCharIndex++;
            
            if (currentCharIndex > currentWrappedLine.length) {
                currentLineIndex++;
                currentCharIndex = 0;
            }
        }, delay);
    }, [wrapText]);

    const processCommand = useCallback(async (input: string, inputLineId: number) => {
        const trimmed = input.trim();
        const cmd = trimmed.toLowerCase();
        let newLinesToAppend: TerminalLine[] = [];
        let currentOutputId = inputLineId;

        const addLine = (content: string, type: TerminalLine['type'] = 'output') => {
            newLinesToAppend.push({ id: currentOutputId++, type, content });
            return currentOutputId - 1;
        };

        const finalUpdate = (delayBeforeUpdate: number = 0) => {
            setTimeout(() => {
                setLines(prev => [...prev, ...newLinesToAppend]);
                setLineId(currentOutputId);
            }, delayBeforeUpdate);
        };

        try {
            if (cmd === 'exit') {
                addLine('Shutting down AI Terminal...');
                addLine('');
                finalUpdate();
                setTimeout(() => { if (onExit) onExit(); }, 1000);
                return;
            }

            if (cmd === 'help') {
                (PROMPTS.help as string[]).forEach(line => addLine(line));
                addLine('');
                finalUpdate();
                return;
            }

            if (cmd === 'about') {
                addLine(PROMPTS.about as string);
                addLine('');
                finalUpdate();
                return;
            }

            if (cmd === 'clear') {
                setLines(initialLines);
                setLineId(initialLines.length);
                setCurrentInput('');
                return;
            }
            
            if (cmd.startsWith('joke')) {
                const jokeLineId = addLine('');
                setLines(prev => [...prev, ...newLinesToAppend]);
                setLineId(currentOutputId);

                const remoteJokePromise = fetch('/api/joke', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(res => res.json())
                .then(data => data.result)
                .catch(() => {
                    const localJoke = LOCAL_JOKES[Math.floor(Math.random() * LOCAL_JOKES.length)];
                    return localJoke;
                });

                const jokeText = await remoteJokePromise;
                typeWriterEffect(jokeText, jokeLineId, 'Joke: ', 18, () => {
                    const wrappedLines = wrapText(jokeText);
                    const nextId = jokeLineId + wrappedLines.length;
                    setLines(prev => [...prev, { id: nextId, type: 'output', content: '' }]);
                    setLineId(nextId + 1);
                });
                return;
            }

            if (cmd.startsWith('nasser')) {
                const question = trimmed.slice(6).trim();
                if (!question) {
                    addLine('Usage: nasser <your question>');
                    addLine('');
                    finalUpdate();
                    return;
                }
                addLine('Asking Nasser (AI)...');
                setLines(prev => [...prev, ...newLinesToAppend]);
                setLineId(currentOutputId);

                const responseLineId = currentOutputId++;
                setLines(prev => [...prev, { id: responseLineId, type: 'output', content: '' }]);

                try {
                    const res = await fetch('/api/ask-nasser', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: question, type: 'nasser' })
                    });
                    const data = await res.json();
                    const responseText = data.result || 'Nasser AI did not respond.';
                    
                    typeWriterEffect(responseText, responseLineId, '', 18, () => {
                        const wrappedLines = wrapText(responseText);
                        const nextId = responseLineId + wrappedLines.length;
                        setLines(prev => [...prev, { id: nextId, type: 'output', content: '' }]);
                        setLineId(nextId + 1);
                    });
                } catch {
                    typeWriterEffect('Failed to reach Nasser AI.', responseLineId, '', 18, () => {
                        const wrappedLines = wrapText('Failed to reach Nasser AI.');
                        const nextId = responseLineId + wrappedLines.length;
                        setLines(prev => [...prev, { id: nextId, type: 'output', content: '' }]);
                        setLineId(nextId + 1);
                    });
                }
                return;
            }

            if (cmd.startsWith('confess')) {
                const confession = trimmed.slice(7).trim();
                if (!confession) {
                    addLine('Usage: confess <your confession>');
                    addLine('');
                    finalUpdate();
                    return;
                }
                addLine(`Confession received: "${confession}"`);
                setLines(prev => [...prev, ...newLinesToAppend]);
                setLineId(currentOutputId);

                const responseLineId = currentOutputId++;
                setLines(prev => [...prev, { id: responseLineId, type: 'output', content: '' }]);

                try {
                    const res = await fetch('/api/ask-nasser', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: confession, type: 'confess' })
                    });
                    const data = await res.json();
                    const response = data.result || 'Nasser AI did not respond.';
                    
                    typeWriterEffect(response, responseLineId, 'TherapistBot: ', 18, () => {
                        const wrappedLines = wrapText(response);
                        const nextId = responseLineId + wrappedLines.length;
                        setLines(prev => [...prev, { id: nextId, type: 'output', content: '' }]);
                        setLineId(nextId + 1);
                    });
                } catch {
                    const joke = LOCAL_JOKES[Math.floor(Math.random() * LOCAL_JOKES.length)];
                    typeWriterEffect(joke, responseLineId, 'TherapistBot: ', 18, () => {
                        const wrappedLines = wrapText(joke);
                        const nextId = responseLineId + wrappedLines.length;
                        setLines(prev => [...prev, { id: nextId, type: 'output', content: '' }]);
                        setLineId(nextId + 1);
                    });
                }
                return;
            }

            if (cmd.startsWith('echo')) {
                const echoText = input.slice(4).trim();
                addLine(echoText);
                addLine(''); // Blank line after echo output
                finalUpdate();
                return;
            }

            addLine(`Command not found: ${trimmed}`, 'error');
            addLine('Type "help" for available commands.');
            addLine('');
            finalUpdate();

        } catch (err) {
            console.error("Error during command processing:", err);
            addLine(`An unexpected error occurred: ${err instanceof Error ? err.message : String(err)}`, 'error');
            addLine('');
            finalUpdate();
        }
    }, [initialLines, onExit, typeWriterEffect, wrapText]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const inputContent = currentInput;
            const inputLine: TerminalLine = { id: lineId, type: 'input', content: inputContent };
            setLines(prev => [...prev, inputLine]);

            if (inputContent.trim() === '') {
                setLineId(id => id + 1);
                setCurrentInput('');
                return;
            }

            processCommand(inputContent, lineId + 1);
            setCurrentInput('');
        }
    };

    const getLineStyle = (type: TerminalLine['type']): React.CSSProperties => {
        const baseStyle: React.CSSProperties = {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            minHeight: '1em',
            maxWidth: '100%',
            overflow: 'hidden'
        };

        switch (type) {
            case 'input':
                return { 
                    ...baseStyle,
                    color: '#fff', 
                    fontWeight: 'bold', 
                    display: 'flex', 
                    alignItems: 'flex-start' 
                };
            case 'output':
            case 'system':
                return { ...baseStyle, color: '#fff', fontWeight: 'normal' };
            case 'error':
                return { ...baseStyle, color: '#ff4444' };
            default:
                return { ...baseStyle, color: '#fff' };
        }
    };

    return (
        <div
            ref={containerRef}
            style={{
                width: width,
                height: height,
                background: '#000',
                color: '#fff',
                fontFamily: 'Courier New, monospace',
                fontSize: 14,
                padding: '10px',
                overflow: 'auto',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                lineHeight: 'normal',
            }}
            onClick={() => inputRef.current && inputRef.current.focus()}
        >
            {lines.map((line) => (
                <div key={line.id} style={getLineStyle(line.type)}>
                    {line.type === 'input' && <span style={{ fontWeight: 'bold', flexShrink: 0 }}>C:\Users\Nasser\Desktop&gt;&nbsp;</span>}
                    <span style={{ flexGrow: 1 }}>{line.content}</span>
                </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <span style={{ fontWeight: 'bold', flexShrink: 0 }}>C:\Users\Nasser\Desktop&gt;&nbsp;</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    className="aiterminal-input"
                    autoFocus
                    spellCheck={false}
                    tabIndex={0}
                    style={{
                        background: 'transparent',
                        color: '#fff',
                        border: 'none',
                        outline: 'none',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        flexGrow: 1,
                        whiteSpace: 'pre',
                        overflowX: 'auto',
                        padding: 0,
                        margin: 0,
                    }}
                />
            </div>
        </div>
    );
};

export default AITerminal;