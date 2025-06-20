// src/assets/icons/index.ts

import windowResize from './windowResize.png';
import maximize from './maximize.png';
import minimize from './minimize.png';
import computerBig from './computerBig.png';
import computerSmall from './computerSmall.png';
import myComputer from './myComputer.png';
import showcaseIcon from './showcaseIcon.png';
import doomIcon from './doomIcon.png';
import NordleIcon from './NordleIcon.png';
import credits from './credits.png';
import volumeOn from './volumeOn.png';
import volumeOff from './volumeOff.png';
import trailIcon from './trailIcon.png';
import windowGameIcon from './windowGameIcon.png';
import windowExplorerIcon from './windowExplorerIcon.png';
import windowsStartIcon from './windowsStartIcon.png';
import scrabbleIcon from './scrabbleIcon.png';
import close from './close.png';

// --- THESE ARE THE IMPORTS CAUSING "MODULE NOT FOUND" ---
// YOU MUST ENSURE THESE FILES PHYSICALLY EXIST IN src/assets/icons/
import magnifyingGlassIcon from './magnifying_glass-0.png';
import msgErrorIcon from './msg_error-0.png';
import msgWarningIcon from './msg_warning-0.png';
import calendarIcon from './calendar-0.png';
import folderIcon from './folder-0.png';         // <--- MAKE SURE THIS EXISTS
import tagIcon from './tag-0.png';               // <--- MAKE SURE THIS EXISTS
import plusIcon from './plus-0.png';             // <--- MAKE SURE THIS EXISTS
import arrowLeftIcon from './arrow_left-0.png';  // <--- MAKE SURE THIS EXISTS
import playIcon from './play-0.png';             // <--- MAKE SURE THIS EXISTS
import arrowRightIcon from './arrow_right-0.png';// <--- MAKE SURE THIS EXISTS
import rotateIcon from './rotate-0.png';         // <--- MAKE SURE THIS EXISTS
import recycleBinIcon from './image_b28b8b.png'; // <--- MAKE SURE THIS EXISTS (or adjust filename if different)

const icons = {
    windowResize: windowResize,
    maximize: maximize,
    minimize: minimize,
    computerBig: computerBig,
    computerSmall: computerSmall,
    myComputer: myComputer,
    showcaseIcon: showcaseIcon,
    doomIcon: doomIcon,
    volumeOn: volumeOn,
    volumeOff: volumeOff,
    credits: credits,
    scrabbleIcon: scrabbleIcon,
    NordleIcon: NordleIcon,
    close: close,
    windowGameIcon: windowGameIcon,
    windowExplorerIcon: windowExplorerIcon,
    windowsStartIcon: windowsStartIcon,
    trailIcon: trailIcon,
    // --- ADD THE NEWLY IMPORTED ICONS TO THIS OBJECT ---
    magnifyingGlassIcon: magnifyingGlassIcon,
    msgErrorIcon: msgErrorIcon,
    msgWarningIcon: msgWarningIcon,
    calendarIcon: calendarIcon,
    folderIcon: folderIcon,
    tagIcon: tagIcon,
    plusIcon: plusIcon,
    arrowLeftIcon: arrowLeftIcon,
    playIcon: playIcon,
    arrowRightIcon: arrowRightIcon,
    rotateIcon: rotateIcon,
    recycleBinIcon: recycleBinIcon,
};

export type IconName = keyof typeof icons;

// The type for getIconByName is `string` because Webpack imports PNGs as string paths.
const getIconByName = (iconName: IconName): string => icons[iconName];

export default getIconByName;

// --- CRUCIAL FIX: EXPORT ALL THE ICONS PhotoGalleryApp.tsx IS TRYING TO IMPORT BY NAME ---
export {
    // Existing exports (if any other component uses them)
    windowResize,
    maximize,
    minimize,
    computerBig,
    computerSmall,
    myComputer,
    showcaseIcon,
    doomIcon,
    NordleIcon,
    credits,
    volumeOn,
    volumeOff,
    trailIcon,
    windowGameIcon,
    windowExplorerIcon,
    windowsStartIcon,
    scrabbleIcon,
    close,

    // --- NEW EXPORTS NEEDED BY PhotoGalleryApp.tsx ---
    magnifyingGlassIcon,
    msgErrorIcon,
    msgWarningIcon,
    calendarIcon,
    folderIcon,
    tagIcon,
    plusIcon,
    arrowLeftIcon,
    playIcon,
    arrowRightIcon,
    rotateIcon,
    recycleBinIcon,
};