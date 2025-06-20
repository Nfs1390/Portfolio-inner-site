import React, { useState, useMemo, useEffect } from 'react';
import Window from '../os/Window';
import styles from './PhotoGalleryApp.module.css';

// --- IMPORT ICONS DIRECTLY FROM YOUR index.ts ---
import {
  magnifyingGlassIcon,
  msgErrorIcon,
  msgWarningIcon,
  calendarIcon,
  folderIcon, // Now imported directly
  tagIcon,    // Now imported directly
  plusIcon,   // Now imported directly
  arrowLeftIcon, // Now imported directly
  playIcon,   // Now imported directly
  arrowRightIcon, // Now imported directly
  rotateIcon, // Now imported directly
  recycleBinIcon, // Now imported directly (assuming image_b28b8b.png)
} from '../../assets/icons'; // Adjust path if index.ts is elsewhere

// You will also need to ensure your `Window` component's `windowBarIcon`
// prop gets the icon it expects. If it uses `getIconByName`, that will still work.
// For example:
// import getIconByName from '../../assets/icons';
// const WindowGameIcon = getIconByName("windowGameIcon"); // Then pass WindowGameIcon to Window component

// Define WindowAppProps if it's not globally available or imported from another file.
interface WindowAppProps {
  onClose: () => void;
  onInteract: () => void;
  onMinimize: () => void;
  // Add any other props your Window component requires, e.g., 'isActive', 'id', 'children'
  windowBarIcon?: string; // If your Window component expects a string path for the icon
}

export interface PhotoGalleryAppProps extends WindowAppProps {}

// Define your image paths for the main gallery content.
// IMPORTANT: These paths should also be processed by Webpack, so they
// should ideally be in a 'src/assets/pictures/' folder and imported,
// or also moved to the 'public/' folder. For simplicity for now,
// let's assume they are still working as before or are in public/pictures.
const allImages = [
  { id: 1, src: '/pictures/picture1.jpg', name: 'Desert Sunset' },
  { id: 2, src: '/pictures/picture2.jpg', name: 'Colorful Flowers' },
  { id: 3, src: '/pictures/picture3.jpg', name: 'Abstract Art' },
  // ... rest of your images. If these are also causing issues, they
  // need similar treatment (either be imported by Webpack or moved to public).
];

const PhotoGalleryApp: React.FC<PhotoGalleryAppProps> = (props) => {
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [activeImageId, setActiveImageId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // States for Zoom and Rotate
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0); // 0, 90, 180, 270

  // States for Delete Pop-ups
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showGenZJokePopup, setShowGenZJokePopup] = useState(false);

  // New state for Status Bar text
  const [statusText, setStatusText] = useState('');

  // New state for Info Panel visibility
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // --- Derived states using useMemo (must come before effects that depend on them) ---
  const filteredImages = useMemo(() => {
    if (!searchTerm) {
      return allImages;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allImages.filter(image =>
      image.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      image.src.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm]);

  const activeImage = useMemo(() => {
    return allImages.find(img => img.id === activeImageId);
  }, [activeImageId]);

  // --- Effects ---
  // Reset zoom and rotation when active image changes (important for new photo)
  useEffect(() => {
    setZoomLevel(1);
    setRotationAngle(0);
  }, [activeImageId]);

  // Update status text based on selected image or overall gallery info
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
    setShowInfoPanel(false); // Close info panel when opening single view
  };

  const closeSingleImageView = () => {
    setViewMode('grid');
    setActiveImageId(null);
    setSearchTerm('');
    setShowInfoPanel(false); // Close info panel when returning to grid
  };

  const navigateSingleImage = (direction: 'prev' | 'next') => {
    if (!activeImage || filteredImages.length === 0) return;

    const currentIndex = filteredImages.findIndex(img => img.id === activeImage.id);
    let nextIndex = currentIndex;

    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % filteredImages.length;
    } else { // 'prev'
      nextIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }
    setActiveImageId(filteredImages[nextIndex].id);
    setShowInfoPanel(false); // Close info panel on navigation
  };

  // --- Button Handlers ---
  const handleZoomOut = () => {
    setStatusText("Zoomed out.");
    setZoomLevel(prev => Math.max(0.5, prev - 0.2)); // Min zoom 0.5
  };
  const handleZoomIn = () => {
    setStatusText("Zoomed in.");
    setZoomLevel(prev => Math.min(3.0, prev + 0.2)); // Max zoom 3.0
  };
  const handlePlayPause = () => {
    setStatusText("Slideshow controls (play/pause) not implemented.");
  };
  const handleRotate = () => {
    setRotationAngle(prev => (prev + 90) % 360); // Rotate 90 degrees clockwise
    setStatusText(`Rotated ${(rotationAngle + 90) % 360} degrees.`);
  };

  // Modified handleDelete to show first popup
  const handleDelete = () => {
    setShowDeleteConfirmation(true);
    setStatusText("Attempting to delete photo...");
  };

  // Modified closeDeleteConfirmation to trigger second popup
  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setShowGenZJokePopup(true); // Show the Gen Z joke popup next
    setStatusText("Deletion failed. (Check joke for details)");
  };

  const closeGenZJokePopup = () => {
    setShowGenZJokePopup(false);
    setStatusText("Joke received. Back to gallery.");
  };

  // --- Ribbon Button Handlers ---
  const handleFile = () => {
    setStatusText("Opening 'File' menu... (Not implemented yet)");
    // Here you would typically open a dropdown or a specific file dialog
  };

  const handleFix = () => {
    setStatusText("Accessing photo 'Fix' tools... (Not implemented yet)");
    // Could eventually toggle a 'Fix' panel/sidebar
  };

  const handleInfo = () => {
    setShowInfoPanel(prev => !prev); // Toggle info panel visibility
    if (!showInfoPanel && activeImage) {
      setStatusText(`Displaying info for: ${activeImage.name}`);
    } else if (showInfoPanel) {
      setStatusText("Info panel closed.");
    } else {
      setStatusText("No photo selected to show information.");
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
      width={780}
      height={550}
      windowBarIcon="windowGameIcon" // Assuming your Window component handles this via `getIconByName`
      windowTitle="Photo Gallery"
      closeWindow={props.onClose}
      onInteract={props.onInteract}
      minimizeWindow={props.onMinimize}
      bottomLeftText={statusText}
    >
      <div
        className={styles.appContainer}
        style={{
          // --- Referencing imported icon variables ---
          // Webpack will replace these variables with the correct bundled URL paths
          '--icon-magnifying-glass': `url(${magnifyingGlassIcon})`,
          '--icon-msg-error': `url(${msgErrorIcon})`,
          '--icon-msg-warning': `url(${msgWarningIcon})`,
          '--icon-calendar': `url(${calendarIcon})`,
          '--icon-folder': `url(${folderIcon})`,
          '--icon-tag': `url(${tagIcon})`,
          '--icon-plus': `url(${plusIcon})`,
          '--icon-arrow-left': `url(${arrowLeftIcon})`,
          '--icon-play': `url(${playIcon})`,
          '--icon-arrow-right': `url(${arrowRightIcon})`,
          '--icon-rotate': `url(${rotateIcon})`,
          '--icon-recycle-bin': `url(${recycleBinIcon})`,

          // Using existing icons for zoom if no dedicated ones
          '--icon-zoom-in': `url(${magnifyingGlassIcon})`,
          '--icon-zoom-out': `url(${magnifyingGlassIcon})`,
          '--icon-prev': `url(${arrowLeftIcon})`,
          '--icon-next': `url(${arrowRightIcon})`,

        } as React.CSSProperties} // Cast to React.CSSProperties for custom properties
      >
        {/* ... (rest of your JSX, unchanged) ... */}

        {/* Top Ribbon */}
        <div className={styles.topRibbon}>
          <button className={styles.ribbonButton} onClick={handleFile}>File</button>
          <button className={styles.ribbonButton} onClick={handleFix}>Fix</button>
          <button className={styles.ribbonButton} onClick={handleInfo}>Info</button>
          <button className={styles.ribbonButton} onClick={handlePrint}>Print</button>
          <button className={styles.ribbonButton} onClick={handlePublish}>Publish</button>
          <button className={styles.ribbonButton} onClick={handleEmail}>E-mail</button>
          <button className={styles.ribbonButton} onClick={handleMake}>Make</button>
          <button className={styles.ribbonButton} onClick={handleOpen}>Open</button>
          <div className={styles.searchBoxContainer}>
            <input
              type="text"
              placeholder="Search the gallery"
              className={styles.searchBox}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {viewMode === 'single' && (
            <button className={`${styles.ribbonButton} ${styles.backButton}`} onClick={closeSingleImageView}>
                ⬅️ Back to Grid
            </button>
          )}
        </div>

        {/* Main Content Area: Sidebar/Filmstrip + Photo Grid/Enlarged Photo */}
        <div className={styles.mainContent}>
          {/* Left Pane: Navigation Sidebar (Grid View) or Vertical Filmstrip (Single View) */}
          {viewMode === 'grid' ? (
            <div className={styles.sidebar}>
              <div className={styles.sidebarSection}>
                <span className={styles.sidebarHeader}>All photos and videos</span>
                <ul className={styles.treeView}>
                  <li><span className={styles.treeItem} onClick={() => { setSearchTerm(''); setStatusText("Showing all pictures."); }}><span className={styles.iconFolder}></span> Pictures</span></li>
                  <li><span className={styles.treeItem} onClick={() => setStatusText("Showing all videos.")}><span className={styles.iconFolder}></span> Videos</span></li>
                  <li><span className={styles.treeItem} onClick={() => setStatusText("Showing public pictures.")}><span className={styles.iconFolder}></span> Public Pictures</span></li>
                </ul>
              </div>
              <div className={styles.sidebarSection}>
                <span className={styles.sidebarHeader}>Date taken</span>
                <ul className={styles.treeView}>
                  <li><span className={styles.treeItem} onClick={() => { setSearchTerm('2004'); setStatusText("Filtered by 2004."); }}><span className={styles.iconCalendar}></span> 2004</span></li>
                  <li><span className={styles.treeItem} onClick={() => { setSearchTerm('2005'); setStatusText("Filtered by 2005."); }}><span className={styles.iconCalendar}></span> 2005</span></li>
                  <li><span className={styles.treeItem} onClick={() => { setSearchTerm('2006'); setStatusText("Filtered by 2006."); }}><span className={styles.iconCalendar}></span> 2006</span></li>
                </ul>
              </div>
              <div className={styles.sidebarSection}>
                <span className={styles.sidebarHeader}>Tags</span>
                <ul className={styles.treeView}>
                  <li><span className={styles.treeItem} onClick={() => setStatusText("Create a new tag... (Not implemented yet)")}><span className={styles.iconPlus}></span> Create a new tag</span></li>
                  <li><span className={styles.treeItem} onClick={() => setStatusText("Showing untagged photos.")}><span className={styles.iconTag}></span> Not tagged</span></li>
                  <li><span className={styles.treeItem} onClick={() => { setSearchTerm('flowers'); setStatusText("Filtered by 'Flowers' tag."); }}><span className={styles.iconTag}></span> Flowers</span></li>
                  <li><span className={styles.treeItem} onClick={() => { setSearchTerm('landscape'); setStatusText("Filtered by 'Landscape' tag."); }}><span className={styles.iconTag}></span> Landscape</span></li>
                  <li><span className={styles.treeItem} onClick={() => { setSearchTerm('ocean'); setStatusText("Filtered by 'Ocean' tag."); }}><span className={styles.iconTag}></span> Ocean</span></li>
                  <li><span className={styles.treeItem} onClick={() => { setSearchTerm('sample'); setStatusText("Filtered by 'Sample' tag."); }}><span className={styles.iconTag}></span> Sample</span></li>
                </ul>
              </div>
            </div>
          ) : ( // viewMode === 'single'
            <div className={styles.verticalFilmstrip}>
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={`${styles.filmstripThumbnailWrapper} ${activeImageId === image.id ? styles.filmstripThumbnailSelected : ''}`}
                  onClick={() => openSingleImageView(image.id)}
                >
                  <img
                    src={image.src}
                    alt={image.name}
                    className={styles.filmstripThumbnailImage}
                  />
                  <div className={styles.filmstripThumbnailLabel}>{image.name}</div>
                </div>
              ))}
            </div>
          )}

          {/* Right Pane: Photo Grid (Grid View) or Enlarged Photo (Single View) */}
          {viewMode === 'grid' ? (
            <div className={styles.photoGridContainer}>
              {filteredImages.length > 0 ? (
                <div className={styles.photoGrid}>
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      className={styles.thumbnailWrapper}
                      onClick={() => openSingleImageView(image.id)} // Single click directly opens large view
                    >
                      <img
                        src={image.src}
                        alt={image.name}
                        className={styles.gridThumbnailImage}
                      />
                      <div className={styles.thumbnailLabel}>
                          {image.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noResultsText}>No photos found matching "{searchTerm}"</p>
              )}
              {/* Info panel for grid view, if enabled */}
              {showInfoPanel && (
                <div className={styles.infoPanel}>
                  <h4 className={styles.infoPanelHeader}>Photo Information</h4>
                  {/* Info panel content is the same for both views */}
                  {activeImage ? (
                    <>
                      <p><strong>Name:</strong> {activeImage.name}</p>
                      <p><strong>Path:</strong> {activeImage.src}</p>
                      <p><strong>ID:</strong> {activeImage.id}</p>
                      <p>
                          <strong>Description:</strong> This is a placeholder description for the selected photo.
                          It contains various details about the image, such as its origin, date, and any tags.
                      </p>
                    </>
                  ) : (
                    <p>No photo selected to show information.</p>
                  )}
                  <button className={styles.infoPanelCloseButton} onClick={() => setShowInfoPanel(false)}>Close Info</button>
                </div>
              )}
            </div>
          ) : ( // viewMode === 'single'
            <div className={styles.enlargedPhotoContainer}>
              {activeImage ? (
                <img
                  src={activeImage.src}
                  alt={activeImage.name}
                  className={styles.enlargedPhoto}
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)`, // Apply zoom and rotate
                  }}
                />
              ) : (
                <p className={styles.noResultsText}>Select an image</p>
              )}
              {/* Info panel for single view, if enabled */}
              {showInfoPanel && (
                <div className={styles.infoPanel}>
                  <h4 className={styles.infoPanelHeader}>Photo Information</h4>
                  {activeImage ? (
                    <>
                      <p><strong>Name:</strong> {activeImage.name}</p>
                      <p><strong>Path:</strong> {activeImage.src}</p>
                      <p><strong>ID:</strong> {activeImage.id}</p>
                      <p>
                          <strong>Description:</strong> This is a placeholder description for the selected photo.
                          It contains various details about the image, such as its origin, date, and any tags.
                      </p>
                    </>
                  ) : (
                    <p>No photo selected to show information.</p>
                  )}
                  <button className={styles.infoPanelCloseButton} onClick={() => setShowInfoPanel(false)}>Close Info</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className={styles.controlBar}>
          {/* Zoom buttons always visible */}
          <div className={styles.controlGroup}>
            <button className={styles.controlButton} onClick={handleZoomOut}>
              <span className={styles.iconZoomOut}></span>
            </button>
            <button className={styles.controlButton} onClick={handleZoomIn}>
              <span className={styles.iconZoomIn}></span>
            </button>
          </div>

          {/* Navigation, Rotate, and Delete buttons only visible in single image view */}
          {viewMode === 'single' && activeImageId !== null && (
            <>
              <div className={styles.controlGroup}>
                <button className={styles.controlButton} onClick={() => navigateSingleImage('prev')}>
                  <span className={styles.iconPrev}></span>
                </button>
                <button className={styles.controlButton} onClick={handlePlayPause}>
                  <span className={styles.iconPlay}></span>
                </button>
                <button className={styles.controlButton} onClick={() => navigateSingleImage('next')}>
                  <span className={styles.iconNext}></span>
                </button>
              </div>
              <div className={styles.controlGroup}>
                <button className={styles.controlButton} onClick={handleRotate}>
                  <span className={styles.iconRotate}></span>
                </button>
                <button className={styles.controlButton} onClick={handleDelete}>
                  <span className={styles.iconRecycleBin}></span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- First Pop-up: Cannot Delete (Error Style) --- */}
      {showDeleteConfirmation && (
        <div className={styles.overlay}>
          <div className={styles.dialogBox}>
            <div className={`${styles.dialogTitleBar} ${styles.dialogTitleBarError}`}>
              <span className={styles.dialogTitleText}>Error</span>
              <button className={styles.dialogCloseButton} onClick={closeDeleteConfirmation} aria-label="Close">X</button>
            </div>
            <div className={styles.dialogContent}>
              <div className={styles.dialogIcon}>
                <span className={styles.iconMsgError}></span>
              </div>
              <p className={styles.dialogMessageText}>
                This photo cannot be deleted. It appears to be an essential system file for the nostalgia core.
              </p>
            </div>
            <div className={styles.dialogButtonContainerSingle}>
              <button className={styles.dialogButton} onClick={closeDeleteConfirmation}>OK</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Second Pop-up: Gen Z Joke (Information Style) --- */}
      {showGenZJokePopup && (
        <div className={styles.overlay}>
          <div className={styles.dialogBox}>
            <div className={`${styles.dialogTitleBar} ${styles.dialogTitleBarInfo}`}>
              <span className={styles.dialogTitleText}>Information</span>
              <button className={styles.dialogCloseButton} onClick={closeGenZJokePopup} aria-label="Close">X</button>
            </div>
            <div className={styles.dialogContent}>
              <div className={styles.dialogIcon}>
                <span className={styles.iconMsgWarning}></span>
              </div>
              <p className={styles.dialogMessageText}>
                That photo is giving "main character energy" and deleting it would be, like, totally un-aesthetic. No cap.
              </p>
            </div>
            <div className={styles.dialogButtonContainerSingle}>
              <button className={styles.dialogButton} onClick={closeGenZJokePopup}>OK</button>
            </div>
          </div>
        </div>
      )}
    </Window>
  );
};

export default PhotoGalleryApp;