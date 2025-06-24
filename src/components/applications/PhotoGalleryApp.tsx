import React, { useState, useMemo, useEffect, useRef } from 'react';
import Window from '../os/Window'; // Ensure this path is correct for your Window component

// ONLY ICONS PROVIDED OR CONFIRMED BY YOU WILL BE IMPORTED:
import recycleBinEmpty from '../../assets/icons/recycle_bin_empty-4.png'; // Confirmed working
import folderIcon from '../../assets/icons/directory_open_cool-0.png'; // Confirmed folder icon
import calendarIcon from '../../assets/icons/calendar-0.png'; // Confirmed calendar icon
import magnifyingGlassIcon from '../../assets/icons/magnifying_glass-0.png'; // Magnifying glass icon

// NAVIGATION ICONS
import goNextIcon from '../../assets/icons/go-next.png';
import goPreviousIcon from '../../assets/icons/go-previous.png';

// POP-UP ICONS (NEW)
import warningIcon from '../../assets/icons/msg_warning-0.png';
import errorIcon from '../../assets/icons/msg_error-0.png';

// VIDEO CONTROL ICONS
import forwardIcon from '../../assets/icons/forward.png';
import volumeOnIcon from '../../assets/icons/volumeOn.png';
import volumeOffIcon from '../../assets/icons/volumeOff.png';
import rewindIcon from '../../assets/icons/rewind.png';
import playIcon from '../../assets/icons/play.png';
import pauseIcon from '../../assets/icons/pause.png';

// Import specific images from assets (as per user's latest provided list)
import workingAtComputerImage from '../../assets/pictures/workingAtComputer.jpg';
import currentme from '../../assets/pictures/currentme.jpg';
import login from '../../assets/pictures/projects/audio/login.jpg';
import workshop from '../../assets/pictures/projects/audio/workshop.PNG';
import team from '../../assets/pictures/projects/software/team.jpeg';
import glove from '../../assets/pictures/projects/software/glove.png';
import CAPM from '../../assets/pictures/CAPM.png'; 

// Define WindowAppProps if it's not globally available or imported from another file.
interface WindowAppProps {
  onClose: () => void;
  onInteract: () => void;
  onMinimize: () => void;
  // Add any other props your Window component requires, e.g., 'isActive', 'id', 'children'
}

export interface PhotoGalleryAppProps extends WindowAppProps { }

// Define your image paths. Add more images for a better grid/filmstrip display.
const allImages = [
  { id: 1, src: workingAtComputerImage, name: 'baby Nasser :)', type: 'image' },
  { id: 2, src: currentme, name: 'Current Me', type: 'image' },
  { id: 3, src: team, name: 'My Senior Project Team', type: 'image' },
  { id: 4, src: workshop, name: 'Figma Workshop for App', type: 'image' },
  { id: 5, src: login, name: 'Log in Screen for App', type: 'image' },
  { id: 6, src: glove, name: 'Senior Project Glove Prototype', type: 'image' },
  { id: 7, src: '/pictures/gloveVideo.mp4', name: 'Glove Video', type: 'video' },
  { id: 8, src: CAPM, name: 'CAPM Project', type: 'image' },  
];

const PhotoGalleryApp: React.FC<PhotoGalleryAppProps> = (props) => {
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [activeImageId, setActiveImageId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState<'all' | 'image' | 'video'>('all');

  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showGenZJokePopup, setShowGenZJokePopup] = useState(false);

  const [statusText, setStatusText] = useState('');
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const filteredImages = useMemo(() => {
    let images = allImages;
    if (contentTypeFilter !== 'all') {
      images = images.filter(item => item.type === contentTypeFilter);
    }
    if (!searchTerm) {
      return images;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return images.filter(item =>
      item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.src.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm, contentTypeFilter]);

  const activeImage = useMemo(() => {
    return allImages.find(item => item.id === activeImageId);
  }, [activeImageId]);

  useEffect(() => {
    setZoomLevel(1);
    setRotationAngle(0);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [activeImageId]);

  useEffect(() => {
    if (activeImage && viewMode === 'single') {
      setStatusText(`Viewing: ${activeImage.name} (${activeImage.src})`);
    } else {
      setStatusText(`Gallery - ${filteredImages.length} items`);
    }
  }, [activeImage, filteredImages.length, viewMode]);

  const openSingleImageView = (id: number) => {
    setActiveImageId(id);
    setViewMode('single');
    setShowInfoPanel(false);
  };

  const closeSingleImageView = () => {
    setViewMode('grid');
    setActiveImageId(null);
    setSearchTerm('');
    setContentTypeFilter('all');
    setShowInfoPanel(false);
  };

  const navigateSingleImage = (direction: 'prev' | 'next') => {
    if (!activeImage || filteredImages.length === 0) return;

    const currentIndex = filteredImages.findIndex(item => item.id === activeImage.id);
    let nextIndex = currentIndex;

    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % filteredImages.length;
    } else { // 'prev'
      nextIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }
    setActiveImageId(filteredImages[nextIndex].id);
    setShowInfoPanel(false);
  };

  const handleZoomOut = () => {
    setStatusText("Zoomed out.");
    setZoomLevel(prev => Math.max(0.5, prev - 0.2));
  };
  const handleZoomIn = () => {
    setStatusText("Zoomed in.");
    setZoomLevel(prev => Math.min(3.0, prev + 0.2));
  };
  const handleRotate = () => {
    setRotationAngle(prev => (prev + 90) % 360);
    setStatusText(`Rotated ${(rotationAngle + 90) % 360} degrees.`);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setStatusText("Video paused.");
      } else {
        videoRef.current.play();
        setStatusText("Video playing.");
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      setStatusText(isMuted ? "Volume on." : "Volume off.");
    }
  };

  const rewindVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
      setStatusText("Rewound 5 seconds.");
    }
  };

  const forwardVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 5);
      setStatusText("Forwarded 5 seconds.");
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
    setStatusText("Attempting to delete photo...");
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setShowGenZJokePopup(true);
    setStatusText("Deletion failed. (Check joke for details)");
  };

  const closeGenZJokePopup = () => {
    setShowGenZJokePopup(false);
    setStatusText("Joke received. Back to gallery.");
  };

  const handleFile = () => {
    setStatusText("Opening 'File' menu... (Not implemented yet)");
  };

  const handleFix = () => {
    setStatusText("Accessing photo 'Fix' tools... (Not implemented yet)");
  };

  const handleInfo = () => {
    setShowInfoPanel(prev => !prev);
    if (!showInfoPanel && activeImage) {
      setStatusText(`Displaying info for: ${activeImage.name}`);
    } else if (showInfoPanel) {
      setStatusText("Info panel closed.");
    } else {
      setStatusText("No item selected to show information.");
    }
  };

  const handlePrint = () => {
    setStatusText("Preparing print preview... (Not implemented yet)");
  };

  const handlePublish = () => {
    setStatusText("Initiating publishing workflow... (Not implemented yet)");
  };

  const handleEmail = () => {
    setStatusText("Composing new email... (Not implemented yet)");
  };

  const handleMake = () => {
    setStatusText("Accessing 'Make Something' options... (Not implemented yet)");
  };

  const handleOpen = () => {
    setStatusText("Opening file browser... (Not implemented yet)");
  };

  return (
    <Window
      top={50}
      left={50}
      width={850} // Increased window width
      height={600} // Increased window height
      windowBarIcon="windowGameIcon"
      windowTitle="Photo Gallery"
      closeWindow={props.onClose}
      onInteract={props.onInteract}
      minimizeWindow={props.onMinimize}
      bottomLeftText={statusText}
    >
      <div style={styles.appContainer}>
        {/* Top Ribbon */}
        <div style={styles.topRibbon}>
          <button style={styles.ribbonButton} onClick={handleFile}>File</button>
          <button style={styles.ribbonButton} onClick={handleFix}>Fix</button>
          <button style={styles.ribbonButton} onClick={handleInfo}>Info</button>
          <button style={styles.ribbonButton} onClick={handlePrint}>Print</button>
          <button style={styles.ribbonButton} onClick={handlePublish}>Publish</button>
          <button style={styles.ribbonButton} onClick={handleEmail}>E-mail</button>
          <button style={styles.ribbonButton} onClick={handleMake}>Make</button>
          <button style={styles.ribbonButton} onClick={handleOpen}>Open</button>
          <input
            type="text"
            placeholder="Search the gallery"
            style={styles.searchBox}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {viewMode === 'single' && (
            <button style={{ ...styles.ribbonButton, marginLeft: '10px' }} onClick={closeSingleImageView}>
              <img src={goPreviousIcon} alt="Back" style={styles.controlIconImageSmaller} /> Back to Grid
            </button>
          )}
        </div>

        {/* Main Content Area: Sidebar/Filmstrip + Photo Grid/Enlarged Photo */}
        <div style={styles.mainContent}>
          {/* Left Pane: Navigation Sidebar (Grid View) or Vertical Filmstrip (Single View) */}
          {viewMode === 'grid' ? (
            <div style={styles.sidebar}>
              <div style={styles.sidebarSection}>
                <span style={styles.sidebarHeader}>Content Types</span>
                <ul style={styles.treeView}>
                  <li>
                    <span
                      style={{ ...styles.treeItem, ...styles.iconFolder }}
                      onClick={() => { setContentTypeFilter('all'); setSearchTerm(''); setStatusText("Showing all content."); }}
                    >
                      All
                    </span>
                  </li>
                  <li>
                    <span
                      style={{ ...styles.treeItem, ...styles.iconFolder }}
                      onClick={() => { setContentTypeFilter('image'); setSearchTerm(''); setStatusText("Showing all pictures."); }}
                    >
                      Pictures
                    </span>
                  </li>
                  <li>
                    <span
                      style={{ ...styles.treeItem, ...styles.iconFolder }}
                      onClick={() => { setContentTypeFilter('video'); setSearchTerm(''); setStatusText("Showing all videos."); }}
                    >
                      Videos
                    </span>
                  </li>
                </ul>
              </div>
              <div style={styles.sidebarSection}>
                <span style={styles.sidebarHeader}>Date taken</span>
                <ul style={styles.treeView}>
                  {/* Calendar icon added */}
                  <li><span style={{ ...styles.treeItem, ...styles.iconCalendar }} onClick={() => { setSearchTerm('2004'); setStatusText("Filtered by 2004."); }}>2004</span></li>
                  <li><span style={{ ...styles.treeItem, ...styles.iconCalendar }} onClick={() => { setSearchTerm('2005'); setStatusText("Filtered by 2005."); }}>2005</span></li>
                  <li><span style={{ ...styles.treeItem, ...styles.iconCalendar }} onClick={() => { setSearchTerm('2006'); setStatusText("Filtered by 2006."); }}>2006</span></li>
                </ul>
              </div>
            </div>
          ) : ( // viewMode === 'single'
            <div style={styles.verticalFilmstrip}>
              {filteredImages.map((item) => (
                <div
                  key={item.id}
                  style={{
                    ...styles.filmstripThumbnailWrapper,
                    border: activeImageId === item.id ? '2px solid #000080' : '2px solid #808080', // Darker selected border
                  }}
                  onClick={() => openSingleImageView(item.id)}
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.src}
                      alt={item.name}
                      style={styles.filmstripThumbnailImage}
                    />
                  ) : (
                    // Display a video thumbnail or placeholder icon for videos in filmstrip
                    <div style={styles.videoThumbnailPlaceholder}>
                      🎥 Video
                    </div>
                  )}
                  <div style={styles.filmstripThumbnailLabel}>{item.name}</div>
                </div>
              ))}
            </div>
          )}

          {/* Right Pane: Photo Grid (Grid View) or Enlarged Photo/Video (Single View) */}
          <div style={styles.photoGridContainer}>
            {viewMode === 'grid' ? (
              filteredImages.length > 0 ? (
                <div style={styles.photoGrid}>
                  {filteredImages.map((item) => (
                    <div
                      key={item.id}
                      style={styles.thumbnailWrapper}
                      onClick={() => openSingleImageView(item.id)} // Single click directly opens large view
                    >
                      {item.type === 'image' ? (
                        <img
                          src={item.src}
                          alt={item.name}
                          style={styles.gridThumbnailImage}
                        />
                      ) : (
                        <div style={styles.videoGridThumbnailPlaceholder}>
                          <img src={playIcon} alt="Video" style={{ width: '32px', height: '32px' }} />
                          <br />{item.name}
                        </div>
                      )}
                      <div style={styles.thumbnailLabel}>
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.noResultsText}>No content found matching "{searchTerm}"</p>
              )
            ) : ( // viewMode === 'single'
              activeImage ? (
                activeImage.type === 'image' ? (
                  <img
                    src={activeImage.src}
                    alt={activeImage.name}
                    style={{
                      ...styles.enlargedPhoto,
                      transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)`, // Apply zoom and rotate
                    }}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={activeImage.src}
                    style={{
                      ...styles.enlargedVideo,
                      transform: `scale(${zoomLevel})`, // Zoom for video, no rotation
                    }}
                    onEnded={() => setIsPlaying(false)}
                    muted={isMuted}
                  // No autoplay by default, will be controlled by button
                  />
                )
              ) : (
                <p style={styles.noResultsText}>Select an item</p>
              )
            )}
            {/* Info panel for grid view, if enabled */}
            {showInfoPanel && (
              <div style={styles.infoPanel}>
                <h4 style={styles.infoPanelHeader}>Photo/Video Information</h4>
                {activeImage ? (
                  <>
                    <p><strong>Name:</strong> {activeImage.name}</p>
                    <p><strong>Type:</strong> {activeImage.type}</p>
                    <p><strong>Path:</strong> {activeImage.src}</p>
                    <p><strong>ID:</strong> {activeImage.id}</p>
                    <p>
                      <strong>Description:</strong> This is a placeholder description for the selected item.
                      It contains various details about the item, such as its origin, date, and any tags.
                    </p>
                  </>
                ) : (
                  <p>No item selected to show information.</p>
                )}
                <button style={styles.infoPanelCloseButton} onClick={() => setShowInfoPanel(false)}>Close Info</button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div style={styles.controlBar}>
          {/* Left Group: Zoom buttons */}
          <div style={styles.controlGroup}>
            <button style={styles.controlButton} onClick={handleZoomOut}>
              <img src={magnifyingGlassIcon} alt="Zoom Out" style={styles.controlIconImage} />➖
            </button>
            <button style={styles.controlButton} onClick={handleZoomIn}>
              <img src={magnifyingGlassIcon} alt="Zoom In" style={styles.controlIconImage} />➕
            </button>
          </div>

          {/* Conditional Middle Group: Image Navigation OR Video Playback */}
          {viewMode === 'single' && activeImageId !== null && (
            <div style={{ ...styles.controlGroup, flexGrow: 1, justifyContent: 'center' }}>
              {activeImage?.type === 'image' && (
                <>
                  <button style={styles.controlButton} onClick={() => navigateSingleImage('prev')}>
                    <img src={goPreviousIcon} alt="Previous" style={styles.controlIconImage} />
                  </button>
                  <button style={styles.controlButton} onClick={() => navigateSingleImage('next')}>
                    <img src={goNextIcon} alt="Next" style={styles.controlIconImage} />
                  </button>
                </>
              )}
              {activeImage?.type === 'video' && (
                <>
                  <button style={styles.controlButton} onClick={rewindVideo}>
                    <img src={rewindIcon} alt="Rewind" style={styles.controlIconImage} />
                  </button>
                  <button style={styles.controlButton} onClick={togglePlayPause}>
                    <img src={isPlaying ? pauseIcon : playIcon} alt={isPlaying ? "Pause" : "Play"} style={styles.controlIconImage} />
                  </button>
                  <button style={styles.controlButton} onClick={forwardVideo}>
                    <img src={forwardIcon} alt="Forward" style={styles.controlIconImage} />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Conditional Right Group: Rotate (Image) / Volume (Video) / Delete */}
          {viewMode === 'single' && activeImageId !== null && (
            <div style={styles.controlGroup}>
              {activeImage?.type === 'image' && (
                <button style={styles.controlButton} onClick={handleRotate}>🔄</button>
              )}
              {activeImage?.type === 'video' && (
                <button style={styles.controlButton} onClick={toggleMute}>
                  <img src={isMuted ? volumeOffIcon : volumeOnIcon} alt={isMuted ? "Volume Off" : "Volume On"} style={styles.controlIconImage} />
                </button>
              )}
              <button style={styles.controlButton} onClick={handleDelete}>
                <img src={recycleBinEmpty} alt="Delete" style={styles.controlIconImage} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- First Pop-up: Cannot Delete (Error Style) --- */}
      {showDeleteConfirmation && (
        <div style={styles.overlay}>
          <div style={styles.dialogBox}>
            <div style={{ ...styles.dialogTitleBar, backgroundColor: '#0000A0' }}> {/* Darker for error, matches 95 gray */}
              <span style={styles.dialogTitleText}>Warning</span>
              <button style={styles.dialogCloseButton} onClick={closeDeleteConfirmation} aria-label="Close">X</button>
            </div>
            <div style={styles.dialogContent}>
              <img src={warningIcon} alt="Error" style={styles.dialogIconImage} /> {/* Error Icon */}
              <p style={styles.dialogMessageText}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“About to delete this masterpiece...”
              </p>
            </div>
            <div style={styles.dialogButtonContainerSingle}>
              <button style={styles.dialogButton} onClick={closeDeleteConfirmation}>OK</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Second Pop-up: Gen Z Joke (Information Style) --- */}
      {showGenZJokePopup && (
        <div style={styles.overlay}>
          <div style={styles.dialogBox}>
            <div style={{ ...styles.dialogTitleBar, backgroundColor: '#0000A0' }}> {/* Slightly deeper blue for Win95 active title */}
              <span style={styles.dialogTitleText}>Information</span>
              <button style={styles.dialogCloseButton} onClick={closeGenZJokePopup} aria-label="Close">X</button>
            </div>
            <div style={styles.dialogContent}>
              <img src={errorIcon} alt="Warning" style={styles.dialogIconImage} /> {/* Warning Icon */}
              <p style={styles.dialogMessageText}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“Server said <b>'NO'</b>. We keeping it.”
              </p>
            </div>
            <div style={styles.dialogButtonContainerSingle}>
              <button style={styles.dialogButton} onClick={closeGenZJokePopup}>OK</button>
            </div>
          </div>
        </div>
      )}
    </Window>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    backgroundColor: '#C0C0C0', // Standard Windows 95/98 gray
    fontFamily: 'MS Sans Serif, Arial, sans-serif',
    fontSize: 12,
    color: '#000',
    border: '1px solid #808080', // Subtle border inside window content area
    boxSizing: 'border-box',
  },
  topRibbon: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px', // Increased padding
    backgroundColor: '#C0C0C0', // Match main background for seamless look
    borderBottom: '1px solid #808080',
    boxShadow: 'inset 0 -1px #DFDFDF', // Light bottom shadow, slightly less white
    gap: '4px', // Increased gap
    flexShrink: 0, // Prevent ribbon from shrinking
  },
  ribbonButton: {
    backgroundColor: '#C0C0C0',
    borderTop: '1px solid #FFFFFF',
    borderLeft: '1px solid #FFFFFF',
    borderRight: '1px solid #808080',
    borderBottom: '1px solid #808080',
    boxShadow: 'inset 1px 1px #DFDFDF, inset -1px -1px #404040', // Stronger 3D effect
    padding: '6px 12px', // Increased padding
    cursor: 'pointer',
    fontFamily: 'MS Sans Serif, "Microsoft Sans Serif", Arial, sans-serif', // Explicitly set for 95 feel
    fontSize: 12, // Increased font size
    whiteSpace: 'nowrap', // Prevent text wrapping
    // HOVER/ACTIVE REMOVED: Cannot be defined in inline style object
  },
  searchBox: {
    marginLeft: 'auto', // Pushes search box to the right
    padding: '5px 8px', // Increased padding
    border: '1px solid #808080',
    backgroundColor: '#fff',
    fontSize: 12, // Increased font size
    outline: 'none',
  },
  mainContent: {
    display: 'flex',
    flexGrow: 1, // Allows this section to fill available space
    overflow: 'hidden', // Crucial for containing scrolling areas in both panes
  },
  sidebar: {
    width: '220px', // Increased sidebar width
    backgroundColor: '#C0C0C0', // Match main background
    borderRight: '1px solid #808080',
    padding: '10px', // Increased padding
    overflowY: 'auto', // Scrollable sidebar if content is tall
    boxShadow: 'inset -1px -1px #DFDFDF', // Inner shadow to differentiate from main content
    flexShrink: 0, // Prevent sidebar from shrinking
  },
  sidebarSection: {
    marginBottom: '15px', // Increased margin
  },
  sidebarHeader: {
    fontWeight: 'bold',
    marginBottom: '8px', // Increased margin
    display: 'block',
    borderBottom: '1px dotted #A0A0A0', // Subtle separator
    paddingBottom: '4px', // Increased padding
    fontSize: 13, // Increased font size
  },
  treeView: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  },
  // Base style for the tree items
  treeItem: {
    display: 'flex', // Use flexbox to align icon (if present) and text
    alignItems: 'center', // Vertically center icon and text
    padding: '3px 0', // Increased padding
    cursor: 'pointer',
    whiteSpace: 'nowrap', // Prevent text wrapping
    fontSize: 12, // Increased font size
    // HOVER REMOVED: Cannot be defined in inline style object
  },
  // Specific icon style for the folder icon
  iconFolder: {
    backgroundImage: `url(${folderIcon})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left center',
    backgroundSize: '18px 18px', // Increased icon size
    paddingLeft: '26px', // Adjusted padding for larger icon
  },
  // Specific icon style for the calendar icon
  iconCalendar: {
    backgroundImage: `url(${calendarIcon})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left center',
    backgroundSize: '18px 18px', // Increased icon size
    paddingLeft: '26px', // Adjusted padding for larger icon
  },

  // Styles for the zoom/navigation/rotate buttons
  controlButton: {
    backgroundColor: '#C0C0C0',
    borderTop: '1px solid #FFFFFF',
    borderLeft: '1px solid #FFFFFF',
    borderRight: '1px solid #808080',
    borderBottom: '1px solid #808080',
    boxShadow: 'inset 1px 1px #DFDFDF, inset -1px -1px #404040', // Stronger 3D effect
    padding: '6px 10px', // Increased padding
    cursor: 'pointer',
    fontSize: 16, // Common font size for button content (emojis, or text if any)
    minWidth: '36px', // Ensure buttons have a minimum size
    minHeight: '36px', // Ensure buttons have a minimum size
    display: 'flex',
    alignItems: 'center', // Center content vertically
    justifyContent: 'center', // Center content horizontally
  },
  // Style for the image icons within control buttons
  controlIconImage: {
    width: '20px', // Increased icon size
    height: '20px', // Increased icon size
  },
  // Specific style for smaller icons, like on the 'Back to Grid' button
  controlIconImageSmaller: {
    width: '16px', // Smaller size for ribbon buttons
    height: '16px',
    marginRight: '4px', // Keep a small margin for text
  },

  photoGridContainer: {
    flexGrow: 1, // Takes up remaining space
    backgroundColor: '#fff', // White background for the photo display area
    padding: '12px', // Increased padding
    overflowY: 'auto', // Scrollable photo grid
    boxSizing: 'border-box',
    display: 'flex',
    // Center the content horizontally within this container
    justifyContent: 'center',
    // Align content to the start vertically
    alignContent: 'flex-start',
    position: 'relative', // Needed for absolute positioning of info panel
  },
  photoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', // Increased minmax for larger thumbnails
    gap: '15px', // Increased gap
    width: '100%', // Allow the grid to take full width available from flex container
    // Center grid items horizontally within their grid cell
    justifyItems: 'center',
    // Aligns grid items to the start of their grid cell vertically
    alignItems: 'start',
  },
  thumbnailWrapper: {
    width: '130px', // Increased size for the wrapper
    height: '130px', // Increased size for the wrapper
    backgroundColor: '#C0C0C0', // Thumbnail background, match general gray
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3px', // Increased padding
    cursor: 'pointer',
    border: '2px solid #808080', // Default border color, slightly darker
    boxSizing: 'border-box',
    transition: 'border 0.1s ease, box-shadow 0.1s ease', // Smooth transition for selection
  },
  gridThumbnailImage: {
    width: 'auto', // Allow width to be determined by objectFit and height
    height: '80%', // Allocate space for image within the thumbnail, leave room for label
    maxWidth: '100%', // Ensure it doesn't overflow container
    maxHeight: '100%',
    objectFit: 'contain', // Changed to 'contain' to prevent cropping and distortion
    display: 'block',
  },
  thumbnailLabel: {
    fontSize: 10, // Increased font size
    color: '#000',
    marginTop: '5px', // Adjusted margin
    textAlign: 'center',
    wordBreak: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: '30px', // Increased margin
    color: '#808080',
    width: '100%',
    fontSize: 13, // Increased font size
  },

  // --- Single Photo/Video View Specific Styles ---
  verticalFilmstrip: {
    width: '140px', // Increased filmstrip width
    backgroundColor: '#C0C0C0', // Match main gray
    borderRight: '1px solid #808080',
    padding: '8px', // Increased padding
    overflowY: 'auto', // Make filmstrip scrollable
    boxShadow: 'inset -1px -1px #DFDFDF', // Consistent inner shadow
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px', // Increased gap
  },
  filmstripThumbnailWrapper: {
    width: '120px', // Increased thumbnail size
    height: 'auto', // Allow height to adjust based on content (image + label)
    minHeight: '100px', // Ensure a minimum height for consistency
    backgroundColor: '#C0C0C0', // Match main gray
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align content to top (image, then label)
    padding: '3px', // Increased padding
    cursor: 'pointer',
    border: '2px solid #808080', // Darker default border
    boxSizing: 'border-box',
    transition: 'border 0.1s ease, box-shadow 0.1s ease',
  },
  filmstripThumbnailImage: {
    width: 'auto', // Allow width to be determined by objectFit and height
    height: '70px', // Fixed height for image area within filmstrip thumbnail
    maxWidth: '100%', // Ensure it fits container
    maxHeight: '100%',
    objectFit: 'contain', // Changed to 'contain'
    display: 'block',
  },
  filmstripThumbnailLabel: {
    fontSize: 9, // Increased font size
    color: '#000',
    marginTop: '3px',
    textAlign: 'center',
    wordBreak: 'normal', // Allow words to wrap
    whiteSpace: 'normal', // Allow text to wrap
    overflow: 'visible', // Ensure text is not hidden
    textOverflow: 'clip', // Prevent ellipsis if text wraps
    width: '100%',
    lineHeight: '1.2', // Improve line spacing
  },
  videoThumbnailPlaceholder: {
    width: '90%',
    height: '60%',
    backgroundColor: '#404040', // Darker background for video placeholder
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px', // Increased font size
    textAlign: 'center',
  },
  videoGridThumbnailPlaceholder: {
    width: '90%',
    height: '75%',
    backgroundColor: '#404040', // Darker background for video placeholder
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px', // Increased font size
    textAlign: 'center',
    gap: '8px', // Increased gap
  },
  enlargedPhotoContainer: {
    flexGrow: 1, // Takes up remaining space
    backgroundColor: '#000', // Black background for photo display area
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto', // Allow scrolling if zoomed image/video is larger than container
    position: 'relative', // For potential future absolute positioning if needed
  },
  enlargedPhoto: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain', // Ensure the whole image is visible
    display: 'block',
    transition: 'transform 0.1s ease-out', // Smooth transition for zoom/rotate
    transformOrigin: 'center center', // Ensures rotation/zoom is from center
  },
  enlargedVideo: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    display: 'block',
    transition: 'transform 0.1s ease-out',
    transformOrigin: 'center center',
  },

  // --- Bottom Control Bar Styles ---
  controlBar: {
    display: 'flex',
    justifyContent: 'space-between', // Pushes left, center, right groups apart
    alignItems: 'center',
    padding: '6px 10px', // Increased padding
    backgroundColor: '#C0C0C0', // Match main gray
    borderTop: '1px solid #808080',
    boxShadow: 'inset 0 1px #DFDFDF', // Light top shadow
    flexShrink: 0, // Prevent control bar from shrinking
  },
  controlGroup: {
    display: 'flex',
    gap: '4px', // Increased gap
  },

  // --- Pop-up Styles (Manual Windows 95 Look) ---
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent black background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Make sure it's on top of everything
  },
  dialogBox: {
    width: '350px', // Increased width
    backgroundColor: '#C0C0C0', // Classic Windows gray
    border: '1px solid #000', // Outer black border
    boxShadow: '2px 2px 0 0 #000, inset 1px 1px #fff, inset -1px -1px #808080', // 3D effect
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
  dialogTitleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '3px 5px', // Increased padding
    backgroundColor: '#0000A0', // Deeper blue for Win95 active title bar
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13, // Increased font size
    borderBottom: '1px solid #000',
    cursor: 'default', // Indicate not draggable without explicit implementation
  },
  dialogTitleText: {
    marginLeft: '5px', // Increased margin
  },
  dialogCloseButton: {
    width: '18px', // Increased size
    height: '16px', // Increased size
    padding: '0',
    backgroundColor: '#C0C0C0',
    borderTop: '1px solid #FFFFFF',
    borderLeft: '1px solid #FFFFFF',
    borderRight: '1px solid #808080',
    borderBottom: '1px solid #808080',
    boxShadow: 'inset 1px 1px #DFDFDF, inset -1px -1px #404040',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '11px', // Increased font size
    lineHeight: '1',
    fontWeight: 'bold',
    color: '#000',
  },
  dialogContent: {
    display: 'flex',
    alignItems: 'center', // Vertically center icon and text
    gap: '15px', // Adjusted gap for spacing between icon and text
    padding: '25px 20px', // Increased padding
    backgroundColor: '#C0C0C0', // Content area background
  },
  // New style for dialog icons
  dialogIconImage: {
    width: '32px', // Standard icon size for dialogs
    height: '32px', // Standard icon size for dialogs
    flexShrink: 0, // Prevent icon from shrinking
  },
  dialogMessageText: {
    flexGrow: 1,
    margin: 0,
    lineHeight: 1.4, // Increased line height for readability
    fontSize: 13, // Increased font size
    textAlign: 'left',
  },
  dialogButtonContainerSingle: {
    display: 'flex',
    justifyContent: 'center',
    padding: '12px 0 18px 0', // Increased padding
    backgroundColor: '#C0C0C0', // Button area background
    borderTop: '1px solid #808080', // Separator line for button area
    boxShadow: 'inset 0 1px #DFDFDF', // Shadow for separator
  },
  dialogButton: {
    backgroundColor: '#C0C0C0',
    borderTop: '1px solid #FFFFFF',
    borderLeft: '1px solid #FFFFFF',
    borderRight: '1px solid #808080',
    borderBottom: '1px solid #808080',
    boxShadow: 'inset 1px 1px #DFDFDF, inset -1px -1px #404040', // Stronger 3D effect
    padding: '8px 20px', // Standard button padding
    cursor: 'pointer',
    fontSize: 12, // Increased font size
    minWidth: '85px', // Increased min-width
  },

  // --- Info Panel Styles ---
  infoPanel: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    bottom: '0px',
    width: '300px', // Increased width
    backgroundColor: '#C0C0C0', // Match main gray
    borderLeft: '1px solid #808080',
    padding: '15px', // Increased padding
    boxShadow: 'inset 1px 0 #DFDFDF', // Consistent inner shadow
    overflowY: 'auto',
    zIndex: 50,
    transition: 'width 0.2s ease-out',
  },
  infoPanelHeader: {
    marginTop: 0,
    marginBottom: '12px', // Increased margin
    paddingBottom: '6px', // Increased padding
    borderBottom: '1px dotted #A0A0A0',
    fontSize: 13, // Increased font size
    fontWeight: 'bold',
  },
  infoPanelCloseButton: {
    backgroundColor: '#C0C0C0',
    borderTop: '1px solid #FFFFFF',
    borderLeft: '1px solid #FFFFFF',
    borderRight: '1px solid #808080',
    borderBottom: '1px solid #808080',
    boxShadow: 'inset 1px 1px #DFDFDF, inset -1px -1px #404040',
    padding: '6px 12px', // Increased padding
    cursor: 'pointer',
    fontSize: 11, // Increased font size
    marginTop: '20px', // Increased margin
    display: 'block',
    margin: '20px auto 0 auto',
  },
};

export default PhotoGalleryApp;
