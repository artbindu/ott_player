/*
 * Primary application entry point.
 *
 * Current source layout:
 * - src/script/config.js
 * - src/script/utils.js
 * - src/script/ottMediaPlayer.js
 * - src/script/index.js (this file)
 *
 * Build output is bundled to dist/index.min.js.
 */
import "./config.js";
import {
  chooseLocalFile,
  enableMobileDraggableControls,
  loadDirectoryFiles,
  playNextMedia,
  playPreviousMedia,
  playSelectedMedia,
  toggleInputModeDropdown,
} from "./utils.js";
import { OTTMediaPlayer } from "./ottMediaPlayer.js";

// Legacy inline handlers from HTML are bound here so this file remains the single entry point.
window.toggleInputModeDropdown = toggleInputModeDropdown;
window.chooseLocalFile = chooseLocalFile;
window.loadDirectoryFiles = loadDirectoryFiles;
window.playSelectedMedia = playSelectedMedia;
window.playPreviousMedia = playPreviousMedia;
window.playNextMedia = playNextMedia;
window.enableMobileDraggableControls = enableMobileDraggableControls;
window.__ottPlayerEntryLoaded = true;

// Auto-instantiate player and setup helpers on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  const config = window.OTT_PLAYER_CONFIG || {};
  const ids = (config.elements || {});
  const playbackIds = (ids.playback || {});
  const trimIds = (ids.trim || {});
  const getById = (id) => document.getElementById(id);

  const playerConfig = {
    startPos: getById(playbackIds.startPos),
    seekBar: getById(playbackIds.seekBar),
    endPos: getById(playbackIds.endPos),

    resetPlayback: getById(playbackIds.resetPlayback),
    playbackRate: getById(playbackIds.playbackRate),
    backwordPlayback: getById(playbackIds.backwordPlayback),
    playPauseBtn: getById(playbackIds.playPauseBtn),
    forwardPlayback: getById(playbackIds.forwardPlayback),
    fullScreenBtn: getById(playbackIds.fullScreenBtn),
    pipModeBtn: getById(playbackIds.pipModeBtn),
    rotationBtn: getById(playbackIds.rotationBtn),
    theaterModeBtn: getById(playbackIds.theaterModeBtn),

    volumeBar: getById(playbackIds.volumeBar),
    volumeValue: getById(playbackIds.volumeValue),
    volumeBtn: getById(playbackIds.volumeBtn),

    videoMode: getById(playbackIds.videoMode),
  };

  const trimFeature = {
    trimStartBtn: getById(trimIds.trimStartBtn),
    trimEndBtn: getById(trimIds.trimEndBtn),
    playTrimmedBtn: getById(trimIds.playTrimmedBtn),
    trimStartInput: getById(trimIds.trimStartInput),
    trimEndInput: getById(trimIds.trimEndInput),
    isRepeateChkBox: getById(trimIds.isRepeateChkBox),
    repeateTrimBtn: getById(trimIds.repeateTrimBtn),
  };

  const player = new OTTMediaPlayer(
    getById(ids.videoPlayer),
    playerConfig,
    { trimFeature },
  );

  OTTMediaPlayer.makeControlsDraggable(ids.controlsContainer, ids.dragHandle);

  // Attach playFromHeaderUrl to global for button usage
  window.playFromHeaderUrl = function () {
    OTTMediaPlayer.playFromHeaderUrl(
      ids.headerVideoUrlInput,
      ids.videoPlayer,
    );
  };

  enableMobileDraggableControls();

  // Preserve debug access to the current player instance.
  window.__ottPlayerInstance = player;
});
