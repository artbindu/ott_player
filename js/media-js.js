class OTTMediaPlayer {
  constructor(videoElement, controls) {
    this.video = videoElement;
    this.controls = controls;
    this.init();
    this.videoConfig = {
      forwardAmount: 10,
      rewindAmount: -10
    }
  }

  init() {
    this.startPos = this.controls.startPos;
    this.endPos = this.controls.endPos;
    this.seekBar = this.controls.seekBar;

    this.resetPlayback = this.controls.resetPlayback;
    this.playSpeed = this.controls.playSpeed;
    this.forwardPlayback = this.controls.forwardPlayback;
    this.playPauseBtn = this.controls.playPauseBtn;
    this.backwordPlayback = this.controls.backwordPlayback;
    this.volumeBar = this.controls.volumeBar;
    this.volumeValue = this.controls.volumeValue;
    this.volumeBtn = this.controls.volumeBtn;

    this.fullScreen = this.controls.fullScreen;
    this.pipModel = this.controls.pipModel;

    this.bindEvents();
    this.updateUI();
  }

  bindEvents() {
    this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    this.playSpeed.addEventListener('change', () => this.setPlaybackSpeed());
    this.resetPlayback.addEventListener('click', () => this.toggleResetPlayer());
    this.forwardPlayback.addEventListener('click', () => this.toggleForwardPlayback(this.videoConfig.forwardAmount));
    this.backwordPlayback.addEventListener('click', () => this.toggleBackwardPlayback(this.videoConfig.rewindAmount));
    this.volumeBar.addEventListener('input', () => this.setVolume());
    this.volumeBtn.addEventListener('click', () => this.toggleMute());
    this.video.addEventListener('volumechange', () => this.updateVolumeUI());
    this.seekBar.addEventListener('input', () => this.seekVideo());
    this.video.addEventListener('timeupdate', () => this.updateSeekBar());
    this.fullScreen.addEventListener('click', () => this.toggleFullScreen());
    this.pipModel.addEventListener('click', () => this.togglePipMode());
  }

  toggleFullScreen() {
    this.video.fullscreen ? document.exitFullscreen() : this.video.requestFullscreen();
  }

  togglePipMode() {
    this.pipModel.fullscreen ? document.exitPictureInPicture() : this.video.requestPictureInPicture();
  }

  toggleMute() {
    this.video.muted = !this.video.muted;
    this.updateVolumeUI();
  }

  togglePlayPause() {
    this.video.paused ? this.video.play() : this.video.pause();
    this.updatePlayPauseIcon();
  }

  setPlaybackSpeed() {
    this.video.playbackRate = parseFloat(this.playSpeed.value);
  }

  toggleResetPlayer() {
    this.video.currentTime = 0;
    this.video.play();
  }

  toggleForwardPlayback(amount = 0) {
    this.video.currentTime += amount;
  }

  setVolume() {
    this.video.volume = parseFloat(this.volumeBar.value);
    this.video.muted = false;
    this.updateVolumeUI();
  }

  seekVideo() {
    this.video.currentTime = Math.floor(this.video.duration * parseInt(this.seekBar.value) / 100);
    this.updateSeekBar();
  }

  updateSeekBar() {
    this.seekBar.value = Math.floor(this.video.currentTime * 100 / this.video.duration);
    this.startPos.textContent = this.formatTime(this.video.currentTime);
    this.endPos.textContent = this.formatTime(this.video.duration);
  }

  updateVolumeUI() {
    this.volumeBar.value = this.video.volume;
    this.volumeBtn.innerHTML = this.video.muted ? '🔇' : '🔊';
    this.volumeValue.textContent = `${this.video.muted ? '00' : (this.video.volume * 99).toFixed(0)}%`;
  }

  updatePlayPauseIcon() {
    this.playPauseBtn.innerHTML = this.video.paused ? '▶️' : '⏸️';
  }

  updateUI() {
    this.updatePlayPauseIcon();
    this.updateVolumeUI();
    this.updateSeekBar();
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
  document.getElementById('pathInputRow').style.display = (mode === 'path') ? '' : 'none';
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

// Choose actual file path from text input
function chooseActualFilePath() {
  const pathInput = document.getElementById('fName1');
  const video = document.getElementById('media-video-player');
  let filePath = pathInput.value.trim();
  if (!filePath) return;
  if (filePath.indexOf('.') < 1) {
    filePath = `${filePath}.mp4`;
  }
  video.pause();
  video.src = `data/${filePath}`;
  video.load();
  video.play();
}

// Attach to global for HTML usage
window.toggleInputModeDropdown = toggleInputModeDropdown;
window.chooseLocalFile = chooseLocalFile;
window.chooseActualFilePath = chooseActualFilePath;

// Auto-instantiate player and setup helpers on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  const player = new OTTMediaPlayer(
    document.getElementById('media-video-player'),
    {
      startPos: document.getElementById('startPos'),
      seekBar: document.getElementById('player-seekbar'),
      endPos: document.getElementById('endPos'),

      resetPlayback: document.getElementById('reset'),
      playSpeed: document.getElementById('playSpeed'),
      forwardPlayback: document.getElementById('forward'),
      playPauseBtn: document.getElementById('playPause'),
      backwordPlayback: document.getElementById('backword'),

      volumeBar: document.getElementById('volumeBar'),
      volumeValue: document.getElementById('volumeValue'),
      volumeBtn: document.getElementById('volume'),

      fullScreen: document.getElementById('fullScreen'),
      pipModel: document.getElementById('pipModel')
    }
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
