import Utils from './utils.js';

class OTTMediaPlayer {
  constructor(videoElement, controls, playerFeatures) {
    this.config = {
      fwdTime: 10,
      rndTime: -10,
      isEnableFullScreen: false,
      isEnablePipMode: false,
      isEnableTheaterMode: false,
      rotationCount: 0,
      btnType: Utils.buttonType,
      isEnableAutoColorChange: false,
    };
    this.video = videoElement;
    this.controls = controls;
    this.video.volume = 1.0;

    // Player Features: Trim
    this.trimUIControls = playerFeatures.trimFeature;
    this.trimConfig = {
      trimStart: 0,
      trimEnd: this.video.duration || 0,
      defaultVal: 5, // 5 Sec
      isTrimActive: false,
      isAutoLoopEnabled: false,
    };

    this.init();
    this.lastUpdateTime = 0;
    // Set seekBar value to 0 by default
    if (this.controls.seekBar) {
      this.controls.seekBar.value = 0;
    }
  }

  init() {
    this.startPos = this.controls.startPos;
    this.endPos = this.controls.endPos;
    this.seekBar = this.controls.seekBar;

    this.resetPlayback = this.controls.resetPlayback;
    this.playbackRate = this.controls.playbackRate;
    this.backwordPlayback = this.controls.backwordPlayback;
    this.playPauseBtn = this.controls.playPauseBtn;
    this.forwardPlayback = this.controls.forwardPlayback;
    this.volumeBar = this.controls.volumeBar;
    this.volumeValue = this.controls.volumeValue;
    this.volumeBtn = this.controls.volumeBtn;

    this.fullScreenBtn = this.controls.fullScreenBtn;
    this.pipModeBtn = this.controls.pipModeBtn;
    this.rotationBtn = this.controls.rotationBtn;
    this.theaterModeBtn = this.controls.theaterModeBtn;

    this.playbackMode = this.controls.videoMode;

    // Video Controls Events
    this.bindEvents();
    this.updateUIControls();
    this.bindKeyPressEvent(this);

    // Trim Feature Events
    this.bindTrimEvents();
    this.updateTrimDisplays();
  }

  updateUIControls() {
    this.updateUIButton({ type: this.config.btnType.playPause });
    this.updateVolumeBar();
    this.updateSeekBar();
  }

  switchFullScreenPipConfig = () => {
    setTimeout(() => {
      this.config.isEnableFullScreen = !!document.fullscreenElement;
      this.config.isEnablePipMode = !!document.pictureInPictureElement;
      this.updateUIButton({ type: this.config.btnType.fullScreen });
    }, 100);
  }

  bindEvents() {
    this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    this.playbackRate.addEventListener('change', () => this.setPlaybackSpeed());
    this.playbackMode.addEventListener('change', () => this.setVideoMode());
    this.resetPlayback.addEventListener('click', () => this.toggleResetPlayer());
    this.forwardPlayback.addEventListener('click', () => this.toggleForwardPlayback(this.config.fwdTime));
    this.backwordPlayback.addEventListener('click', () => this.toggleForwardPlayback(this.config.rndTime));
    this.volumeBar.addEventListener('input', () => this.setVolume());
    this.volumeBtn.addEventListener('click', () => this.toggleMute());
    this.seekBar.addEventListener('input', () => this.seekVideo());

    this.rotationBtn.addEventListener('click', () => this.toggleScreenRotation());
    this.theaterModeBtn.addEventListener('click', () => this.toogleTheaterMode(!this.config.isEnableTheaterMode));
    // Native Video Events
    this.video.addEventListener('volumechange', () => this.updateVolumeBar());
    this.video.addEventListener('timeupdate', () => this.updateSeekBar());
    this.video.addEventListener('ended', () => this.onVideoEnded());
    // PiP Mode Configuration
    this.pipModeBtn.addEventListener('click', () => this.togglePipMode(!this.config.isEnablePipMode));
    this.video.addEventListener('leavepictureinpicture', () => {
      if (this.config.isEnablePipMode && !document.pictureInPictureElement) {
        this.switchFullScreenPipConfig();
      }
    });
    // Full Screen Configuration
    this.fullScreenBtn.addEventListener('click', () => this.toggleFullScreen(!this.config.isEnableFullScreen));
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.toggleFullScreen(!this.config.isEnableFullScreen);
        if (!this.config.isEnablePipMode && !!document.pictureInPictureElement) {
          this.switchFullScreenPipConfig();
        }
      }
    });
  }

  bindKeyPressEvent() {
    document.addEventListener('keydown', (event) => {
      switch (Utils.pressedKeyType(event.code)) {
        case 'PLAY_PAUSE':
          this.togglePlayPause();
          break;
        case 'FAST_FORWARD':
          this.toggleForwardPlayback(this.config.rndTime);
          break;
        case 'FAST_BACKWARD':
          this.toggleForwardPlayback(this.config.fwdTime);
          break;
        case 'PLAY_NEXT':
          playNextMedia();
          break;
        case 'PLAY_PREVIOUS':
          playPreviousMedia();
          break;
        case 'FULL_SCREEN':
          if (document.fullscreenElement)
            document.exitFullscreen();
          this.toggleFullScreen(!this.config.isEnableFullScreen);
          break;
        case 'PIP_MODE':
          if (document.pictureInPictureElement)
            document.exitPictureInPicture();
          this.togglePipMode(!this.config.isEnablePipMode);
          break;
        case 'VOLUME_UP':
          this.volumeBar.value = this.video.volume < 1 ? (Number(this.volumeBar.value || 0) + 0.01).toFixed(2) : this.volumeBar.value;
          this.setVolume();
          break;
        case 'VOLUME_DOWN':
          this.volumeBar.value = this.video.volume > 0 ? ((Number(this.volumeBar.value || 1) - 0.01) % 1).toFixed(2) : this.volumeBar.value;
          this.setVolume();
          break;
        case 'VOLUME_MUTE': // Mute
          this.toggleMute();
          break;
        case 'VOLUME_BAR_VALUE':
          this.volumeBar.value = event.key / 10;
          this.setVolume();
          break;
        case 'TRIM_START_TIME':
          this.setTrimStart();
          break;
        case 'TRIM_END_TIME':
          this.setTrimEnd();
          break;
        case 'PLAY_TRIMED_VIDEO':
          this.playTrimmedSegment();
          break;
        case 'RESET_TRIME_RANGE':
          this.resetTrimRange();
          break;
        case 'VIDEO_RATION':
          if (document.fullscreenElement && !this.config.rotationCount) {
            console.warn("Screen Rotation will not work");
            return;
          }
          this.toggleScreenRotation();
          break;
        case 'PREVIOUS_VIDEO_MODE': // Previous Video Mode
          this.cycleVideoMode(-1);
          break;
        case 'NEXT_VIDEO_MODE': // Next Video Mode
          this.cycleVideoMode(1);
          break;
        default:
          console.warn('invalid key press Event: ', event.code);
          break;
      }
    });
  }

  bindTrimEvents() {
    this.trimUIControls.trimStartBtn.addEventListener('click', () => this.setTrimStart());
    this.trimUIControls.trimEndBtn.addEventListener('click', () => this.setTrimEnd());
    this.trimUIControls.playTrimmedBtn.addEventListener('click', () => this.playTrimmedSegment());
    this.trimUIControls.playTrimmedBtn.addEventListener('dblclick', () => this.resetTrimRange());
    this.trimUIControls.trimStartInput.addEventListener('input', () => this.updateTrimFromInput('start'));
    this.trimUIControls.trimEndInput.addEventListener('input', () => this.updateTrimFromInput('end'));
    this.trimUIControls.isRepeateChkBox.addEventListener('change', () => this.toggleAutoLoop());
    this.trimUIControls.repeateTrimBtn.addEventListener('click', () => this.toggleRepeteTrim());
  }

  theaterModeCssConfig(isEnableTheaterMode) {
    // player section styles
    const playerCard = document.querySelector('.content.player-card');
    playerCard.style.position = isEnableTheaterMode ? 'fixed' : '';
    playerCard.style.top = isEnableTheaterMode ? '0' : '';
    playerCard.style.left = isEnableTheaterMode ? '0' : '';
    playerCard.style.width = isEnableTheaterMode ? '100vw' : '';
    playerCard.style.height = isEnableTheaterMode ? '100vh' : '';
    playerCard.style.zIndex = isEnableTheaterMode ? '9999' : '';
    // video styles
    const video = document.querySelector('.media-video-player');
    video.style.position = isEnableTheaterMode ? 'fixed' : '';
    video.style.top = isEnableTheaterMode ? '0' : '';
    video.style.left = isEnableTheaterMode ? '0' : '';
    video.style.width = isEnableTheaterMode ? '100vw' : '';
    video.style.height = isEnableTheaterMode ? '100vh' : '';
    video.style.zIndex = isEnableTheaterMode ? '10000' : '';
    video.style.objectFit = isEnableTheaterMode ? 'fill' : '';
    // video controls zIndex
    const controls = document.getElementById('media-media-controls');
    controls.style.zIndex = isEnableTheaterMode ? '10001' : '';
  }

  toogleTheaterMode(isEnableTheaterMode) {
    this.config.isEnableTheaterMode = isEnableTheaterMode;
    if (isEnableTheaterMode) {
      // Exit Pip mode if enabled
      if (!!document.pictureInPictureElement) {
        document.exitPictureInPicture();
      }
    }
    this.theaterModeCssConfig(isEnableTheaterMode);
    if(!isEnableTheaterMode) {
      this.config.isEnableFullScreen = false;
      this.config.isEnablePipMode = false;
    }
    this.updateUIButton({ type: this.config.btnType.theaterMode });
  }

  toggleFullScreen(isEnableFullScreen) {
    if (isEnableFullScreen) {
      this.video.requestFullscreen();
    }
    this.switchFullScreenPipConfig();
  }

  togglePipMode(isEnablePipMode) {
    if (isEnablePipMode && !document.pictureInPictureElement) {
      this.video.requestPictureInPicture();
    } else if (!!document.pictureInPictureElement) {
      document.exitPictureInPicture();
    }
    this.switchFullScreenPipConfig();
  }

  toggleMute() {
    this.video.muted = !this.video.muted;
    this.updateVolumeBar();
  }

  togglePlayPause(isNative = true) {
    if (isNative) { this.trimConfig.isTrimActive = false; }
    this.video.paused ? this.video.play() : this.video.pause();
    this.updateUIButton({ type: this.config.btnType.playPause });
  }

  setPlaybackSpeed() {
    this.video.playbackRate = parseFloat(this.playbackRate.value);
  }

  toggleResetPlayer() {
    this.video.currentTime = 0;
    this.video.play();
    this.updateUIButton({ type: this.config.btnType.playPause });
  }

  toggleForwardPlayback(amount = 0) {
    this.video.currentTime += amount;
  }

  setVolume() {
    this.video.volume = parseFloat(this.volumeBar.value);
    this.video.muted = false;
    this.updateVolumeBar();
  }

  seekVideo() {
    this.video.currentTime = Math.floor(this.video.duration * parseInt(this.seekBar.value) / 100);
    if (this.trimConfig.isTrimActive && !this.isBtwnTrimRange()) {
      this.trimConfig.isTrimActive = false;
      this.updateTrimDisplays();
    }
    this.updateSeekBar();
  }

  updateSeekBar() {
    const now = Date.now();
    const shouldUpdateUI = (now - this.lastUpdateTime >= 1000) || this.video.seeking;

    if (this.trimConfig.isTrimActive && !this.isBtwnTrimRange()) {
      this.video.currentTime = this.trimConfig.trimStart;
      if (this.trimConfig.isAutoLoopEnabled) {
        this.video.play();
        this.updateUIButton({ type: this.config.btnType.playPause });
      } else {
        this.togglePlayPause(false);
      }
    } else if (shouldUpdateUI) {
      this.seekBar.value = Math.floor(this.video.currentTime * 100 / this.video.duration);
      this.startPos.textContent = this.formatTime(this.video.currentTime);
      this.endPos.textContent = this.formatTime(this.video.duration);
      if (this.video.currentTime <= 1) this.updateUIButton({ type: this.config.btnType.playPause });
      this.lastUpdateTime = now;
    }

    if (shouldUpdateUI && this.config.isEnableAutoColorChange && parseInt(this.video.currentTime) % 1 === 0) {
      this.updateAutoColorChange();
    }
  }

  setTrimStart() {
    this.trimConfig.trimStart = this.video.currentTime;
    if (this.trimConfig.trimStart >= this.trimConfig.trimEnd) {
      this.trimConfig.trimEnd = Math.max(this.video.duration || 0, this.trimConfig.trimStart + this.trimConfig.defaultVal);
    }
    this.trimConfig.isTrimActive = true;
    this.updateTrimDisplays();
  }
  setTrimEnd() {
    this.trimConfig.trimEnd = this.video.currentTime;
    if (this.trimConfig.trimEnd <= this.trimConfig.trimStart) {
      this.trimConfig.trimStart = Math.max(0, this.trimConfig.trimStart - this.trimConfig.defaultVal);
    }
    this.trimConfig.isTrimActive = true;
    this.updateTrimDisplays();
  }
  resetTrimRange() {
    this.trimConfig.trimStart = 0;
    this.trimConfig.trimEnd = this.video.duration || 0;
    this.trimConfig.isTrimActive = false;
    this.trimUIControls.playTrimmedBtn.disabled = true;
    this.updateTrimDisplays();
  }

  toggleAutoLoop() {
    this.trimConfig.isAutoLoopEnabled = this.trimUIControls.isRepeateChkBox.checked;
  }
  toggleRepeteTrim() {
    this.trimConfig.isAutoLoopEnabled = !this.trimConfig.isAutoLoopEnabled;
    this.trimUIControls.isRepeateChkBox.checked = this.trimConfig.isAutoLoopEnabled;
  }
  isValidRange() {
    return this.trimConfig.trimStart >= 0 && this.trimConfig.trimEnd > 0 && this.trimConfig.trimStart !== this.trimConfig.trimEnd
  }
  isBtwnTrimRange() {
    return this.isValidRange() && this.trimConfig.isTrimActive &&
      this.trimConfig.trimStart <= this.video.currentTime && this.video.currentTime <= this.trimConfig.trimEnd;
  }

  updateTrimDisplays() {
    this.trimUIControls.trimStartInput.value = this.formatTime(this.trimConfig.trimStart);
    this.trimUIControls.trimEndInput.value = this.formatTime(this.trimConfig.trimEnd);

    // UI Button Status
    if (this.trimConfig.isTrimActive && this.isBtwnTrimRange()) {
      this.trimUIControls.playTrimmedBtn.disabled = false;
    }
    this.trimUIControls.repeateTrimBtn.disabled = !this.trimConfig.isTrimActive;
    this.trimUIControls.playTrimmedBtn.innerHTML = this.trimConfig.isTrimActive ? `<i class="fa ${!!this.video.paused ? 'fa-play' : 'fa-pause'}"></i> <i class="fa fa-cut"></i> Trim` :
      this.trimUIControls.playTrimmedBtn.disabled ? '<i class="fa fa-cut"></i> <i class="fas fa-video"></i> Trim' : '<i class="fa fa-bookmark"></i> <i class="fa fa-cut"></i> Trim';
  }

  updateTrimFromInput(type) {
    const input = type === 'start' ? this.trimUIControls.trimStartInput : this.trimUIControls.trimEndInput;
    const timeStr = input.value.trim();
    const seconds = this.parseTime(timeStr);
    if (seconds !== null) {
      if (type === 'start') {
        this.trimConfig.trimStart = seconds;
      } else {
        this.trimConfig.trimEnd = seconds;
      }
      this.trimConfig.isTrimActive = true;
      // Validate and adjust if necessary
      if (this.trimConfig.trimStart >= this.trimConfig.trimEnd) {
        if (type === 'start') {
          this.trimConfig.trimEnd = Math.min(this.video.duration || 0, this.trimConfig.trimStart + this.trimConfig.defaultVal);
        } else {
          this.trimConfig.trimStart = Math.max(0, this.trimConfig.trimEnd - 1);
        }
        this.updateTrimDisplays();
      }
    } else {
      // Invalid input, revert to current value
      input.value = this.formatTime(type === 'start' ? this.trimConfig.trimStart : this.trimConfig.trimEnd);
    }
  }

  parseTime(timeStr) {
    const parts = timeStr.split(':').map(p => parseInt(p, 10));
    if (parts.length === 3 && parts.every(p => !isNaN(p))) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2 && parts.every(p => !isNaN(p))) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 1 && !isNaN(parts[0])) {
      return parts[0];
    }
    return null;
  }

  playTrimmedSegment() {
    if (!this.trimConfig.isTrimActive) {
      if ((this.video.currentTime > (this.trimConfig.trimEnd + 1)) || (this.video.currentTime < (this.trimConfig.trimStart - 1))) {
        this.trimConfig.isTrimActive = true;
        this.video.pause();
        this.playTrimmedSegment();
      }
      return;
    }
    if (this.trimConfig.trimStart >= this.trimConfig.trimEnd) {
      alert('Invalid trim range. Start time must be before end time.');
      return;
    }
    if (this.video.currentTime < this.trimConfig.trimStart || this.video.currentTime >= this.trimConfig.trimEnd) {
      this.video.currentTime = this.trimConfig.trimStart;
      this.updateTrimDisplays();
    }
    this.ffmpegScript();
    this.togglePlayPause(false);
  }

  updateVolumeBar() {
    this.volumeBar.value = this.video.volume;
    this.volumeValue.textContent = `${this.video.muted ? '00' : (this.video.volume * 99).toFixed(0)}%`;
    this.updateUIButton({ type: this.config.btnType.volume });
  }

  setVideoMode() {
    this.config.isEnableAutoColorChange = false;
    this.video.style.filter = this.getVideoMode();
  }

  updateAutoColorChange() {
    this.video.style.filter = this.video.style.filter.replace(/(?<=(hue-rotate\())\d+(?=deg\))/gi, x => parseInt(Math.random(0, 1) * 360));
    // console.warn('pos: ', parseInt(this.video.currentTime), 'style: ', this.video.style.filter);
  };

  getVideoMode() {
    switch (this.playbackMode.value) {
      case 'normal':
        return '';
      case 'cinema':
        return 'contrast(120%) brightness(90%)';
      case 'vivid':
        return 'contrast(140%) brightness(110%) saturate(120%)';
      case 'bw':
        return 'grayscale(100%)';
      case 'night':
        return 'brightness(60%) contrast(110%)';
      case 'glow':
        return 'sepia(80%) saturate(120%) brightness(110%)';
      case 'heat':
        return 'contrast(130%) saturate(140%) hue-rotate(15deg)';
      case 'sepia':
        return 'sepia(100%)';
      case 'invert':
        return 'invert(100%)';
      case 'blur':
        return 'blur(2px)';
      case 'autocolorchange':
        this.config.isEnableAutoColorChange = true;
        return `hue-rotate(${parseInt(Math.random(0, 1) * 360)}deg) contrast(120%) brightness(90%)`;
      default:
        return '';
    }
  }

  cycleVideoMode(direction) {
    const select = this.playbackMode;
    const currentIndex = select.selectedIndex;
    const newIndex = (currentIndex + direction + select.options.length) % select.options.length;
    select.selectedIndex = newIndex;
    select.dispatchEvent(new Event('change'));
  }

  updateUIButton(config = { type: '' }) {
    switch (config.type) {
      case this.config.btnType.playPause:
        this.playPauseBtn.innerHTML = `<i class="fa ${!!this.video.paused ? 'fa-play' : 'fa-pause'}"></i>`;
        this.trimUIControls.playTrimmedBtn.innerHTML = this.trimConfig.isTrimActive ? `<i class="fa ${!!this.video.paused ? 'fa-play' : 'fa-pause'}"></i> <i class="fa fa-cut"></i> Trim` :
          this.trimUIControls.playTrimmedBtn.disabled ? '<i class="fa fa-cut"></i> <i class="fas fa-video"></i> Trim' : '<i class="fa fa-bookmark"></i> <i class="fa fa-cut"></i> Trim';
        break;
      case this.config.btnType.volume:
        this.volumeBtn.innerHTML = `<i class="fa fa-volume-${!!this.video.muted ? 'mute' : 'up'}"></i>`;
        break;
      case this.config.btnType.fullScreen:
      case this.config.btnType.pip:
        this.fullScreenBtn.innerHTML = `<i class="fa fa-${!!this.config.isEnableFullScreen ? 'compress' : 'expand'}"></i>`;
        this.pipModeBtn.innerHTML = `<i class="${!!this.config.isEnablePipMode ? 'fas fa-external-link-alt' : 'fa fa-window-restore'}"></i>`;
        break;
      case this.config.btnType.rotation:
        this.rotationBtn.innerHTML = `<i class="fa fa-undo" style="transform: rotate(${-90 * this.config.rotationCount}deg);"></i>`;
        break;
      case this.config.btnType.theaterMode:
        this.theaterModeBtn.innerHTML = `<i class="fas fa-theater-masks"></i>`;
        break;
    }
  }

  toggleScreenRotation() {
    this.config.rotationCount = (this.config.rotationCount + 1) % 4;
    this.video.style.transform = `rotate(${-90 * this.config.rotationCount}deg)`;
    this.updateUIButton({ type: this.config.btnType.rotation });
  }

  onVideoEnded() {
    const mediaDropdown = document.getElementById('mediaDropdown');
    if (mediaDropdown && mediaDropdown.selectedIndex < mediaDropdown.options.length) {
      playNextMedia();
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '--:--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
  }

  // Static helper for draggable controls
  static makeControlsDraggable(controlsId, handleId) {
    const controls = document.getElementById(controlsId);
    const handle = document.getElementById(handleId);
    let isDragging = false, startX, startY, origX, origY;
    handle.addEventListener('mousedown', function (e) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = controls.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      controls.style.transition = 'none';
      controls.style.position = 'fixed';
      controls.style.zIndex = 1000;
    });
    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      let dx = e.clientX - startX;
      let dy = e.clientY - startY;
      controls.style.left = (origX + dx) + 'px';
      controls.style.top = (origY + dy) + 'px';
    });
    document.addEventListener('mouseup', function () {
      isDragging = false;
    });
  }

  // Static helper for playing video from header URL
  static playFromHeaderUrl(inputId, videoId) {
    var url = document.getElementById(inputId).value.trim();
    if (!url) return;
    var video = document.getElementById(videoId);
    video.pause();
    video.src = url;
    video.load();
    video.play();
  }

  ffmpegScript() {
    Utils.generateFFMpegScript({
      width: this.video.videoWidth,
      height: this.video.videoHeight
    });
  }
}

// Toggle input mode dropdown visibility
function toggleInputModeDropdown() {
  var mode = document.getElementById('inputModeDropdown').value;
  document.getElementById('fileInputRow').style.display = (mode === 'file') ? '' : 'none';
  document.getElementById('urlInputRow').style.display = (mode === 'url') ? '' : 'none';
  document.getElementById('directoryInputRow').style.display = (mode === 'directory') ? '' : 'none';
  document.getElementById('navButtonsRow').style.display = 'none'; // Hide nav buttons when not in directory mode
}

// Choose local file from file input
function chooseLocalFile() {
  const fileInput = document.getElementById('fName');
  const video = document.getElementById('media-video-player');
  if (fileInput.files && fileInput.files[0]) {
    const fileURL = URL.createObjectURL(fileInput.files[0]);
    video.pause();
    video.src = fileURL;
    video.name = fileInput.files[0].name;
    video.load();
    video.play();
  }
}

// Load media files from selected directory
function loadDirectoryFiles() {
  const directoryInput = document.getElementById('directoryInput');
  const mediaDropdown = document.getElementById('mediaDropdown');
  const directoryName = document.getElementById('directoryName');
  mediaDropdown.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.textContent = 'Select a media file...';
  defaultOption.value = '';
  mediaDropdown.appendChild(defaultOption);

  if (directoryInput.files && directoryInput.files.length > 0) {
    const dirName = directoryInput.files[0].webkitRelativePath.split('/')[0];
    directoryName.textContent = `${dirName}(${directoryInput.files.length})`;
    Array.from(directoryInput.files)
      .filter(file => file.type.startsWith('video/') || file.type.startsWith('audio/'))
      .forEach(file => {
        const option = document.createElement('option');
        option.value = URL.createObjectURL(file);
        option.textContent = file.name;
        option.dataset.file = file; // Store file reference
        mediaDropdown.appendChild(option);
      });
    mediaDropdown.hidden = false;
    document.getElementById('navButtonsRow').style.display = ''; // Show nav buttons when media files are loaded
    // Automatically select and play the first media file
    if (mediaDropdown.options.length > 1) {
      mediaDropdown.selectedIndex = 1;
      playSelectedMedia();
    }
  } else {
    directoryName.textContent = 'No Directory';
    mediaDropdown.hidden = true;
    document.getElementById('navButtonsRow').style.display = 'none'; // Hide nav buttons when no files
  }
}

// Play selected media from dropdown
function playSelectedMedia() {
  const mediaDropdown = document.getElementById('mediaDropdown');
  const selectedValue = mediaDropdown.value;
  if (selectedValue) {
    const video = document.getElementById('media-video-player');
    video.pause();
    video.src = selectedValue;
    video.name = mediaDropdown.options[mediaDropdown.selectedIndex].textContent;
    video.load();
    video.play();
  }
}

// Navigate to previous media in directory
function playPreviousMedia() {
  const mediaDropdown = document.getElementById('mediaDropdown');
  if (mediaDropdown.selectedIndex > 1) { // Index 0 is default, 1 is first file
    mediaDropdown.selectedIndex--;
    playSelectedMedia();
  } else if (mediaDropdown.selectedIndex === 1) {
    mediaDropdown.selectedIndex = mediaDropdown.options.length - 1;
    playSelectedMedia();
  }
}

// Navigate to next media in directory
function playNextMedia() {
  const mediaDropdown = document.getElementById('mediaDropdown');
  if (mediaDropdown.selectedIndex < mediaDropdown.options.length - 1) {
    mediaDropdown.selectedIndex++;
    playSelectedMedia();
  } else if (mediaDropdown.selectedIndex === mediaDropdown.options.length - 1) {
    mediaDropdown.selectedIndex = 1;
    playSelectedMedia();
  }
}

// Attach to global for HTML usage
window.toggleInputModeDropdown = toggleInputModeDropdown;
window.chooseLocalFile = chooseLocalFile;
window.loadDirectoryFiles = loadDirectoryFiles;
window.playSelectedMedia = playSelectedMedia;
window.playPreviousMedia = playPreviousMedia;
window.playNextMedia = playNextMedia;

// Auto-instantiate player and setup helpers on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  const playerConfig = {
    startPos: document.getElementById('startPos'),
    seekBar: document.getElementById('player-seekbar'),
    endPos: document.getElementById('endPos'),

    resetPlayback: document.getElementById('reset'),
    playbackRate: document.getElementById('playbackRate'),
    backwordPlayback: document.getElementById('backword'),
    playPauseBtn: document.getElementById('playPause'),
    forwardPlayback: document.getElementById('forward'),
    fullScreenBtn: document.getElementById('fullScreen'),
    pipModeBtn: document.getElementById('pipMode'),
    rotationBtn: document.getElementById('screenRotation'),
    theaterModeBtn: document.getElementById('theaterMode'),

    volumeBar: document.getElementById('volumeBar'),
    volumeValue: document.getElementById('volumeValue'),
    volumeBtn: document.getElementById('volume'),

    videoMode: document.getElementById('videoMode'),
  };

  const trimFeature = {
    trimStartBtn: document.getElementById('setTrimStart'),
    trimEndBtn: document.getElementById('setTrimEnd'),
    playTrimmedBtn: document.getElementById('playTrimmed'),
    trimStartInput: document.getElementById('trimStartInput'),
    trimEndInput: document.getElementById('trimEndInput'),
    isRepeateChkBox: document.getElementById('enableAutoLoop'),
    repeateTrimBtn: document.getElementById('repeatTrim'),
  };

  const player = new OTTMediaPlayer(
    document.getElementById('media-video-player'),
    playerConfig,
    { trimFeature }
  );
  OTTMediaPlayer.makeControlsDraggable('media-media-controls', 'dragHandle');
  // Attach playFromHeaderUrl to global for button usage
  window.playFromHeaderUrl = function () {
    OTTMediaPlayer.playFromHeaderUrl('headerVideoUrlInput', 'media-video-player');
  };
  enableMobileDraggableControls();
});

// Make player-controls draggable on mobile and desktop, with focus fix
function enableMobileDraggableControls() {
  const controls = document.getElementById('media-media-controls');
  const handle = document.getElementById('dragHandle');
  let isDragging = false, startX, startY, origX, origY;

  function setPosition(x, y) {
    controls.style.left = x + 'px';
    controls.style.top = y + 'px';
    controls.style.position = 'fixed';
    controls.style.zIndex = 1000;
    controls.style.transition = 'none';
    controls.focus(); // Ensure focus after move
  }

  // Desktop
  handle.addEventListener('mousedown', function (e) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = controls.getBoundingClientRect();
    origX = rect.left;
    origY = rect.top;
    setPosition(origX, origY);
    controls.setAttribute('tabindex', '-1'); // Make focusable if not already
    controls.focus();
  });
  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;
    setPosition(origX + dx, origY + dy);
  });
  document.addEventListener('mouseup', function () {
    isDragging = false;
  });

  // Mobile (touch)
  handle.addEventListener('touchstart', function (e) {
    isDragging = true;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    const rect = controls.getBoundingClientRect();
    origX = rect.left;
    origY = rect.top;
    setPosition(origX, origY);
    controls.setAttribute('tabindex', '-1');
    controls.focus();
  });
  document.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    const touch = e.touches[0];
    let dx = touch.clientX - startX;
    let dy = touch.clientY - startY;
    setPosition(origX + dx, origY + dy);
  });
  document.addEventListener('touchend', function () {
    isDragging = false;
  });
}
