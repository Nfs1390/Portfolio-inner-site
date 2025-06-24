import React, { useCallback, useEffect, useState } from 'react';
import Colors from '../../constants/colors';
import ShowcaseExplorer from '../applications/ShowcaseExplorer';
import Doom from '../applications/Doom';
import OregonTrail from '../applications/OregonTrail';
import ShutdownSequence from './ShutdownSequence';
import Nordle from '../applications/Nordle';
import Toolbar from './Toolbar';
import DesktopShortcut, { DesktopShortcutProps } from './DesktopShortcut';
import Scrabble from '../applications/Scrabble';
import { IconName } from '../../assets/icons';
import Credits from '../applications/Credits';
import ImageGallery from '../applications/PhotoGalleryApp';
import SnakeApp from '../applications/SnakeApp';
import ChessApp from '../applications/ChessApp';
import AITerminalApp from '../applications/AITerminalApp'; // 👈 Fixed import name

export interface DesktopProps {}

type ExtendedWindowAppProps<T> = T & WindowAppProps;

const APPLICATIONS: {
  [key: string]: {
    key: string;
    name: string;
    shortcutIcon: IconName;
    component: React.FC<ExtendedWindowAppProps<any>>;
  };
} = {
  showcase: {
    key: 'showcase',
    name: 'My Showcase',
    shortcutIcon: 'showcaseIcon',
    component: ShowcaseExplorer,
  },
  trail: {
    key: 'trail',
    name: 'The Oregon Trail',
    shortcutIcon: 'trailIcon',
    component: OregonTrail,
  },
  doom: {
    key: 'doom',
    name: 'Doom',
    shortcutIcon: 'doomIcon',
    component: Doom,
  },
  scrabble: {
    key: 'scrabble',
    name: 'Scrabble',
    shortcutIcon: 'scrabbleIcon',
    component: Scrabble,
  },
  Nordle: {
    key: 'Nordle',
    name: 'Nordle',
    shortcutIcon: 'NordleIcon',
    component: Nordle,
  },
  credits: {
    key: 'credits',
    name: 'Credits',
    shortcutIcon: 'credits',
    component: Credits,
  },
  imagegallery: {
    key: 'imagegallery',
    name: 'Image Gallery',
    shortcutIcon: 'Camera',
    component: ImageGallery,
  },
  ChessApp: {
    key: 'ChessApp',
    name: 'Chess',
    shortcutIcon: 'chessIcon',
    component: ChessApp,
  },
  SnakeApp: {
    key: 'SnakeApp',
    name: 'Snake',
    shortcutIcon: 'SnakeIcon',
    component: SnakeApp,
  },
  //AITerminal: { // 👈 Added AI Terminal here
  //  key: 'AITerminal',
  //  name: 'Command Line',
  //  shortcutIcon: 'console_prompt', // You'll need to add this icon
  //  component: AITerminalApp,
  //},
};

const Desktop: React.FC<DesktopProps> = () => {
  const [windows, setWindows] = useState<DesktopWindows>({});
  const [shortcuts, setShortcuts] = useState<DesktopShortcutProps[]>([]);
  const [shutdown, setShutdown] = useState(false);
  const [numShutdowns, setNumShutdowns] = useState(1);

  useEffect(() => {
    if (shutdown) rebootDesktop();
  }, [shutdown]);

  useEffect(() => {
    const newShortcuts: DesktopShortcutProps[] = [];

    Object.keys(APPLICATIONS).forEach((key) => {
      const app = APPLICATIONS[key];
      newShortcuts.push({
        shortcutName: app.name,
        icon: app.shortcutIcon,
        onOpen: () => {
          addWindow(
            app.key,
            <app.component
              onInteract={() => onWindowInteract(app.key)}
              onMinimize={() => minimizeWindow(app.key)}
              onClose={() => removeWindow(app.key)}
              key={app.key}
            />
          );
        },
      });
    });

    newShortcuts.forEach((shortcut) => {
      if (shortcut.shortcutName === 'My Showcase') {
        shortcut.onOpen();
      }
    });

    setShortcuts(newShortcuts);
  }, []);

  const rebootDesktop = useCallback(() => {
    setWindows({});
  }, []);

  const removeWindow = useCallback((key: string) => {
    setTimeout(() => {
      setWindows((prev) => {
        const newWindows = { ...prev };
        delete newWindows[key];
        return newWindows;
      });
    }, 100);
  }, []);

  const minimizeWindow = useCallback((key: string) => {
    setWindows((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        minimized: true,
      },
    }));
  }, []);

  const getHighestZIndex = useCallback(() => {
    return Math.max(0, ...Object.values(windows).map((w) => w.zIndex));
  }, [windows]);

  const toggleMinimize = useCallback(
    (key: string) => {
      const highestZ = getHighestZIndex();
      const updated = { ...windows };
      updated[key].minimized = !updated[key].minimized;
      updated[key].zIndex = highestZ + 1;
      setWindows(updated);
    },
    [windows, getHighestZIndex]
  );

  const onWindowInteract = useCallback(
    (key: string) => {
      setWindows((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          zIndex: getHighestZIndex() + 1,
        },
      }));
    },
    [getHighestZIndex]
  );

  const startShutdown = useCallback(() => {
    setTimeout(() => {
      setShutdown(true);
      setNumShutdowns((n) => n + 1);
    }, 600);
  }, []);

  const addWindow = useCallback(
    (key: string, element: JSX.Element) => {
      setWindows((prev) => ({
        ...prev,
        [key]: {
          zIndex: getHighestZIndex() + 1,
          minimized: false,
          component: element,
          name: APPLICATIONS[key]?.name || key,
          icon: APPLICATIONS[key]?.shortcutIcon || '',
        },
      }));
    },
    [getHighestZIndex]
  );

  // Add the event listener for AI Terminal after all callbacks are defined
  useEffect(() => {
    function handleOpenAITerminal() {
      addWindow(
        'AITerminal',
        <AITerminalApp
          onInteract={() => onWindowInteract('AITerminal')}
          onMinimize={() => minimizeWindow('AITerminal')}
          onClose={() => removeWindow('AITerminal')}
          key={'AITerminal'}
        />
      );
    }
    window.addEventListener('open-ai-terminal', handleOpenAITerminal);
    return () => {
      window.removeEventListener('open-ai-terminal', handleOpenAITerminal);
    };
  }, [addWindow, onWindowInteract, minimizeWindow, removeWindow]);

  return !shutdown ? (
    <div style={styles.desktop}>
      {Object.keys(windows).map((key) => {
        const win = windows[key];
        if (!win?.component) return null;
        return (
          <div
            key={`win-${key}`}
            style={{
              zIndex: win.zIndex,
              ...(win.minimized ? styles.minimized : {}),
            }}
          >
            {React.cloneElement(win.component, {
              key,
              onInteract: () => onWindowInteract(key),
              onClose: () => removeWindow(key),
            })}
          </div>
        );
      })}

      <div style={styles.shortcuts}>
        {shortcuts.map((shortcut, i) => {
          // 👈 Updated positioning logic to include AI Terminal
          const isSecondColumn = shortcut.shortcutName === 'Snake' || shortcut.shortcutName === 'AI Terminal';
          
          let top, left;
          if (shortcut.shortcutName === 'Snake') {
            top = 0;
            left = 96;
          } else if (shortcut.shortcutName === 'AI Terminal') {
            top = 104; // Position AI Terminal below Snake
            left = 96;
          } else {
            // Calculate position for first column (excluding Snake and AI Terminal)
            const firstColumnApps = shortcuts.filter(s => 
              s.shortcutName !== 'Snake' && s.shortcutName !== 'AI Terminal'
            );
            const firstColumnIndex = firstColumnApps.findIndex(s => s.shortcutName === shortcut.shortcutName);
            top = firstColumnIndex * 104;
            left = 6;
          }

          return (
            <div
              key={shortcut.shortcutName}
              style={{
                ...styles.shortcutContainer,
                top,
                left,
              }}
            >
              <DesktopShortcut
                icon={shortcut.icon}
                shortcutName={shortcut.shortcutName}
                onOpen={shortcut.onOpen}
              />
            </div>
          );
        })}
      </div>

      <Toolbar
        windows={windows}
        toggleMinimize={toggleMinimize}
        shutdown={startShutdown}
        AITerminalApp={AITerminalApp}
      />
    </div>
  ) : (
    <ShutdownSequence
      setShutdown={setShutdown}
      numShutdowns={numShutdowns}
    />
  );
};

const styles: StyleSheetCSS = {
  desktop: {
    minHeight: '100%',
    flex: 1,
    backgroundColor: Colors.turquoise,
  },
  shutdown: {
    minHeight: '100%',
    flex: 1,
    backgroundColor: '#1d2e2f',
  },
  shortcutContainer: {
    position: 'absolute',
  },
  shortcuts: {
    position: 'absolute',
    top: 16,
    left: 6,
  },
  minimized: {
    pointerEvents: 'none',
    opacity: 0,
  },
};

export default Desktop;

