class OTTMediaPlayer {
  constructor(videoElement, controls) {
    this.config = {
      fwdTime: 10,
      rndTime: -10,
      isEnableFullScreen: false,
      isEnablePipMode: false,
      isRotatedVideo: false,
      btnType: {
        playPause: 'PLAY-PAUSE',
        volume: 'VOLUME',
        seek: 'SEEK',
        volume: 'VOLUME',
        fullScreen: 'FULL-SCREEN',
        pip: 'PIP',
        rotation: 'ROTATION'
      }
    };
    this.video = videoElement;
    this.controls = controls;
    this.init();
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

    this.bindEvents();
    this.updateUIControls();
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
    this.resetPlayback.addEventListener('click', () => this.toggleResetPlayer());
    this.forwardPlayback.addEventListener('click', () => this.toggleForwardPlayback(this.config.fwdTime));
    this.backwordPlayback.addEventListener('click', () => this.toggleForwardPlayback(this.config.rndTime));
    this.volumeBar.addEventListener('input', () => this.setVolume());
    this.volumeBtn.addEventListener('click', () => this.toggleMute());
    this.seekBar.addEventListener('input', () => this.seekVideo());
    
    this.rotationBtn.addEventListener('click', () => this.toggleScreenRotation());
    // Native Video Events
    this.video.addEventListener('volumechange', () => this.updateVolumeBar());
    this.video.addEventListener('timeupdate', () => this.updateSeekBar());
    // PiP Mode Configuration
    this.pipModeBtn.addEventListener('click', () => this.togglePipMode(!this.config.isEnablePipMode));
    this.video.addEventListener('leavepictureinpicture', () => {
      if(this.config.isEnablePipMode && !document.pictureInPictureElement) {
        this.switchFullScreenPipConfig();
        this.updateUIButton({ type: this.config.btnType.pip });
      }
    });
    // Full Screen Configuration
    this.fullScreenBtn.addEventListener('click', () => this.toggleFullScreen(!this.config.isEnableFullScreen));
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.toggleFullScreen(!this.config.isEnableFullScreen);
        if(!this.config.isEnablePipMode && !!document.pictureInPictureElement) {
          this.switchFullScreenPipConfig();
          this.updateUIButton({ type: this.config.btnType.pip });
        }
      }
    });
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
    } else if(!!document.pictureInPictureElement) {
      document.exitPictureInPicture();
    }
    this.switchFullScreenPipConfig();
  }

  toggleMute() {
    this.video.muted = !this.video.muted;
    this.updateVolumeBar();
  }

  togglePlayPause() {
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
    this.updateSeekBar();
  }

  updateSeekBar() {
    this.seekBar.value = Math.floor(this.video.currentTime * 100 / this.video.duration);
    this.startPos.textContent = this.formatTime(this.video.currentTime);
    this.endPos.textContent = this.formatTime(this.video.duration);
    if (this.video.currentTime <= 1) this.updateUIButton({ type: this.config.btnType.playPause });
  }

  updateVolumeBar() {
    this.volumeBar.value = this.video.volume;
    this.volumeValue.textContent = `${this.video.muted ? '00' : (this.video.volume * 99).toFixed(0)}%`;
    this.updateUIButton({ type: this.config.btnType.volume });
  }

  updateUIButton(config = { type: '' }) {
    switch (config.type) {
      case this.config.btnType.playPause:
        this.playPauseBtn.innerHTML = `<i class="fa ${!!this.video.paused ? 'fa-play' : 'fa-pause'}"></i>`;
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
        this.rotationBtn.innerHTML = `<i class="fa fa-rotate-${!!this.config.isRotatedVideo ? 'left' : 'right'}"></i>`;
        break;
    }
    console.warn('buttonUI', this.config.isEnableFullScreen, this.config.isEnablePipMode);
  }
  
  toggleScreenRotation() {
    if (screen.orientation) {
      // Listen for orientation changes using onchange
      console.log(`call to rotation`);
      screen.orientation.onchange = (event) => {
        const type = screen.orientation.type;
        const angle = screen.orientation.angle;
        console.log(`ScreenOrientation changed: ${type}, ${angle} degrees.`);
      };
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
}

// Toggle input mode dropdown visibility
function toggleInputModeDropdown() {
  var mode = document.getElementById('inputModeDropdown').value;
  document.getElementById('fileInputRow').style.display = (mode === 'file') ? '' : 'none';
  document.getElementById('urlInputRow').style.display = (mode === 'url') ? '' : 'none';
}

// Choose local file from file input
function chooseLocalFile() {
  const fileInput = document.getElementById('fName');
  const video = document.getElementById('media-video-player');
  if (fileInput.files && fileInput.files[0]) {
    const fileURL = URL.createObjectURL(fileInput.files[0]);
    video.pause();
    video.src = fileURL;
    video.load();
    video.play();
  }
}

// Attach to global for HTML usage
window.toggleInputModeDropdown = toggleInputModeDropdown;
window.chooseLocalFile = chooseLocalFile;

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

    volumeBar: document.getElementById('volumeBar'),
    volumeValue: document.getElementById('volumeValue'),
    volumeBtn: document.getElementById('volume'),
  };

  const player = new OTTMediaPlayer(
    document.getElementById('media-video-player'),
    playerConfig
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
