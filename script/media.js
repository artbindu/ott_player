const localMoviePath = 'data/movielist/';
class OTTMediaPlayer {
  constructor(videoElement, controls, playerFeatures) {
    this.config = {
      fwdTime: 10,
      rndTime: -10,
      isEnableFullScreen: false,
      isEnablePipMode: false,
      rotationCount: 0,
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
    this.video.volume = 0.5;

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

    this.playbackMode = this.controls.videoMode;

    // Video Controls Events
    this.bindEvents();
    this.updateUIControls();
    this.bindKeyPressEvent();

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
    // Native Video Events
    this.video.addEventListener('volumechange', () => this.updateVolumeBar());
    this.video.addEventListener('timeupdate', () => this.updateSeekBar());
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
      switch(event.code) {
        case 'Space':
        case 'Enter':
          this.togglePlayPause();
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.toggleForwardPlayback(this.config.rndTime);
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.toggleForwardPlayback(this.config.fwdTime);
          break;
        case 'KeyF':
          if(document.fullscreenElement)
            document.exitFullscreen();
          this.toggleFullScreen(!this.config.isEnableFullScreen);
          break;
        case 'KeyP':
          if(document.pictureInPictureElement)
            document.exitPictureInPicture();
          this.togglePipMode(!this.config.isEnablePipMode);
          break;
        case 'Equal': // Volume Up
        case 'Plus':
          this.volumeBar.value = this.video.volume < 1 ? (Number(this.volumeBar.value || 0) + 0.01).toFixed(2) : this.volumeBar.value;
          this.setVolume();
          break;
        case 'Minus': // Volume Down
        case 'Hypen':
          this.volumeBar.value = this.video.volume > 0 ? ((Number(this.volumeBar.value || 1) - 0.01)%1).toFixed(2) : this.volumeBar.value;
          this.setVolume();
          break;
        case 'KeyM': // Mute
          this.toggleMute();
          break;
        case 'Digit0':
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
        case 'Digit9':
          this.volumeBar.value = event.key/10;
          this.setVolume();
          break;
        case 'KeyT': // Trim Start
          this.setTrimStart();
          break;
        case 'KeyC': // Trim Cut (End)
          this.setTrimEnd();
          break;
        case 'KeyG': // Play Trim Range Video
          this.playTrimmedSegment();
          break;
        case 'KeyR': // Reset Trim Range
          this.resetTrimRange();
          break;
        case 'KeyO': // Video Rotation
          if(document.fullscreenElement && !this.config.rotationCount) {
            console.warn("Screen Rotation will not work");
            return;
          }
          this.toggleScreenRotation();
          break;
        case 'ArrowUp': // Previous Video Mode
          this.cycleVideoMode(-1);
          break;
        case 'ArrowDown': // Next Video Mode
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
    if(this.trimConfig.isTrimActive && !this.isBtwnTrimRange()) {
      this.trimConfig.isTrimActive = false;
      this.updateTrimDisplays();
    }
    this.updateSeekBar();
  }

  updateSeekBar() {
    if (this.trimConfig.isTrimActive && !this.isBtwnTrimRange()) {
      this.video.currentTime = this.trimConfig.trimStart;
      if(this.trimConfig.isAutoLoopEnabled) {
        this.video.play();
        this.updateUIButton({ type: this.config.btnType.playPause });
      } else {
        this.togglePlayPause(false);
      }
    } else {
      this.seekBar.value = Math.floor(this.video.currentTime * 100 / this.video.duration);
      this.startPos.textContent = this.formatTime(this.video.currentTime);
      this.endPos.textContent = this.formatTime(this.video.duration);
      if (this.video.currentTime <= 1) this.updateUIButton({ type: this.config.btnType.playPause });
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
      this.trimConfig.trimStart <= this.video.currentTime  && this.video.currentTime <= this.trimConfig.trimEnd;
  }

  updateTrimDisplays() {
    this.trimUIControls.trimStartInput.value = this.formatTime(this.trimConfig.trimStart);
    this.trimUIControls.trimEndInput.value = this.formatTime(this.trimConfig.trimEnd);
    
    // UI Button Status
    if(this.trimConfig.isTrimActive && this.isBtwnTrimRange()) {
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
      if((this.video.currentTime > (this.trimConfig.trimEnd + 1)) || (this.video.currentTime < (this.trimConfig.trimStart-1))) {
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
    if(this.video.currentTime < this.trimConfig.trimStart || this.video.currentTime >= this.trimConfig.trimEnd) {
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
    switch (this.playbackMode.value) {
      case 'normal':
        this.video.style.filter = '';
        break;
      case 'cinema':
        this.video.style.filter = 'contrast(120%) brightness(90%)';
        break;
      case 'vivid':
        this.video.style.filter = 'contrast(140%) brightness(110%) saturate(120%)';
        break;
      case 'bw':
        this.video.style.filter = 'grayscale(100%)';
        break;
      case 'night':
        this.video.style.filter = 'brightness(60%) contrast(110%)';
        break;
      case 'glow':
        this.video.style.filter = 'sepia(80%) saturate(120%) brightness(110%)';
        break;
      case 'heat':
        this.video.style.filter = 'contrast(130%) saturate(140%) hue-rotate(15deg)';
        break;
      case 'sepia':
        this.video.style.filter = 'sepia(100%)';
        break;
      case 'invert':
        this.video.style.filter = 'invert(100%)';
        break;
      case 'blur':
        this.video.style.filter = 'blur(2px)';
        break;
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
        this.rotationBtn.innerHTML = `<i class="fa fa-undo" style="transform: rotate(${-90*this.config.rotationCount}deg);"></i>`;
        break;
    }
  }

  toggleScreenRotation() {
    this.config.rotationCount = (this.config.rotationCount + 1)%4;
    this.video.style.transform = `rotate(${-90*this.config.rotationCount}deg)`;
    this.updateUIButton({ type: this.config.btnType.rotation });
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
    
    const videoResolution = {
      width: this.video.videoWidth,
      height: this.video.videoHeight
    };
    const cropVideo = {
      FourK: {width: 3840,  height: 2160},
      FHD: { width: 1920, height: 1080},
      HD:  { width: 1080,  height: 720} 
    };
    const isHighResolution = Math.max(videoResolution.width,videoResolution.height) >= Math.max(cropVideo.FourK.width, cropVideo.FourK.height);

    const object = {
      INPUTFILE: this.video.name,
      STARTTIME: this.trimConfig.trimStart.toFixed(1),
      TRIMDURATION: (this.trimConfig.trimEnd - this.trimConfig.trimStart).toFixed(1),
      OUTPUTFILE: `trim/${this.trimConfig.trimStart.toFixed(2)}`,
      VIDEO_WIDTH: videoResolution.width,
      VIDEO_HEIGHT: videoResolution.height,
      CORP_HEIGHT: isHighResolution ?  Math.max(cropVideo.FHD.width, cropVideo.FHD.height) : Math.max(videoResolution.height, cropVideo.HD.height),
      CORP_WIDTH: isHighResolution ? Math.min(cropVideo.FHD.width, cropVideo.FHD.height) : Math.min(videoResolution.width, cropVideo.HD.height)
    };

    const scriptList = {
      videoResolution: `${videoResolution.width} x ${videoResolution.height} ${isHighResolution ? '✅' : '🚫'}`,
      storeMediaInfo: `ffprobe -v quiet -print_format json -show_format -show_streams "{INPUTFILE}" > "trim/mediaInfo.json"`,
      reEncode_video_and_Audio: `ffmpeg -i {INPUTFILE} -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 192k ${object.INPUTFILE.replace(/\.[\w\d]+$/gi, '')}.mp4`,
      break0: '--------Full Video Audio-------------',
      // Trim Video with range in second
      trimeVideo_sec: `ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,
      trimVideoWithoutAudio_sec: `ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -c:v libx264 -crf 23 -preset fast -an "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,

      break1: '\n--------Video Crop Center | Left | Right-------------',
      cropVideo_left: `ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -vf "crop={CORP_WIDTH}:{CORP_HEIGHT}:(({VIDEO_WIDTH}-{CORP_WIDTH}*3)/2 + {CORP_WIDTH}*0):({VIDEO_HEIGHT}-1920)/2" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,
      cropVideo_center: `ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -vf "crop={CORP_WIDTH}:{CORP_HEIGHT}:(({VIDEO_WIDTH}-{CORP_WIDTH}*3)/2 + {CORP_WIDTH}*1):({VIDEO_HEIGHT}-1920)/2" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,
      cropVideo_right: `ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -vf "crop={CORP_WIDTH}:{CORP_HEIGHT}:(({VIDEO_WIDTH}-{CORP_WIDTH}*3)/2 + {CORP_WIDTH}*2):({VIDEO_HEIGHT}-1920)/2" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,

      break2: '\n--------Reverse Corped Video Center | Left | Right-------------',
      cropVideo_left_reverse: `ffmpeg -i "{OUTPUTFILE}_{SCRIPTKEY-REV}.mp4" -vf reverse -af areverse -preset fast -c:v libx264 -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,
      cropVideo_center_reverse: `ffmpeg -i "{OUTPUTFILE}_{SCRIPTKEY-REV}.mp4" -vf reverse -af areverse -preset fast -c:v libx264 -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,
      cropVideo_right_reverse: `ffmpeg -i "{OUTPUTFILE}_{SCRIPTKEY-REV}.mp4" -vf reverse -af areverse -preset fast -c:v libx264 -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,

      break3: '\n--------Video Crop Extrime Left/Right | Middle of Left-Center/Right-Center-------------',
      cropVideo_extrime_left: `ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -vf "crop={CORP_WIDTH}:{CORP_HEIGHT}:0:({VIDEO_HEIGHT}-1920)/2" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,
      cropVideo_left_center_mid: `ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -vf "crop={CORP_WIDTH}:{CORP_HEIGHT}:(({VIDEO_WIDTH}-{CORP_WIDTH}*3)/2 + ({CORP_WIDTH}*(0+1)/2)):({VIDEO_HEIGHT}-1920)/2" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,
      cropVideo_center_right_mid: `ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -vf "crop={CORP_WIDTH}:{CORP_HEIGHT}:(({VIDEO_WIDTH}-{CORP_WIDTH}*3)/2 + ({CORP_WIDTH}*(1+2)/2)):({VIDEO_HEIGHT}-1920)/2" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,
      cropVideo_extrime_right: `ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -vf "crop={CORP_WIDTH}:{CORP_HEIGHT}:({VIDEO_WIDTH}-{CORP_WIDTH}):({VIDEO_HEIGHT}-1920)/2" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,
      
      break4: '\n--------Reverse Corped Video Extrime Left/Right | Middle of Left-Center/Right-Center-------------',
      cropVideo_extrime_left_reverse: `ffmpeg -i "{OUTPUTFILE}_{SCRIPTKEY-REV}.mp4" -vf reverse -af areverse -preset fast -c:v libx264 -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,
      cropVideo_left_center_mid_reverse: `ffmpeg -i "{OUTPUTFILE}_{SCRIPTKEY-REV}.mp4" -vf reverse -af areverse -preset fast -c:v libx264 -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,
      cropVideo_center_right_mid_reverse: `ffmpeg -i "{OUTPUTFILE}_{SCRIPTKEY-REV}.mp4" -vf reverse -af areverse -preset fast -c:v libx264 -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,
      cropVideo_extrime_right_reverse: `ffmpeg -i "{OUTPUTFILE}_{SCRIPTKEY-REV}.mp4" -vf reverse -af areverse -preset fast -c:v libx264 -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"`,
      
      break5: '--------Merge Clips-------------',
      mergedCropVideo: 'ffmpeg -f concat -safe 0 -i mergevideolist.txt -c copy {SCRIPTKEY}.mp4',
      mergedCropVideo_no_Audio: 'ffmpeg -i "mergedCropVideo.mp4" -an {SCRIPTKEY}.mp4',
      trimAudioFromVideo: 'ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -c copy "{SCRIPTKEY}.mp3"',
      mergedCropAudios: 'ffmpeg -f concat -safe 0 -i mergevideolist.txt -c copy {SCRIPTKEY}.mp3',
      mergedAudio_And_Video: 'ffmpeg -i mergedCropVideo_no_Audio.mp4 -i trimAudioFromVideo.mp3 -c:v copy -c:a aac -shortest {SCRIPTKEY}.mp4',
      mergedAudio_And_Video_90deg: 'ffmpeg -i "mergedAudio_And_Video.mp4" -vf "transpose=1" "{SCRIPTKEY}.mp4"',
      mergedAudio_And_Video_270deg: 'ffmpeg -i "mergedAudio_And_Video.mp4" -vf "transpose=1,transpose=1,transpose=1" "{SCRIPTKEY}.mp4"',
    }

    console.clear();
    Object.keys(scriptList).forEach(script => 
      console.log(
        scriptList[script]
              .replace(/\{SCRIPTKEY\}/gi, script)
              .replace(/\{SCRIPTKEY-REV\}/gi, script.replace('_reverse', ''))
              .replace(/\{\w+\}/gi, (x) => object[x.replace(/[\}\{]/gi, '')])
      )
    );
  }
}

// Toggle input mode dropdown visibility
function toggleInputModeDropdown() {
  var mode = document.getElementById('inputModeDropdown').value;
  document.getElementById('fileInputRow').style.display = (mode === 'file') ? '' : 'none';
  document.getElementById('urlInputRow').style.display = (mode === 'url') ? '' : 'none';
  document.getElementById('dataFilesRow').style.display = (mode === 'data') ? '' : 'none';
  if (mode === 'data') {
    loadDataFiles();
  }
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

// Load video files from data directory
function loadDataFiles() {
  fetch(`./${localMoviePath}`)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = doc.querySelectorAll('a');
      const videoFiles = Array.from(links)
        .map(a => a.href.split('/').pop())
        .filter(filename => /\.(mp4|webm|ogg|avi|mkv)$/i.test(filename));
      const container = document.getElementById('dataFilesRow');
      container.innerHTML = '';
      const select = document.createElement('select');
      select.className = 'control-btn';
      select.onchange = () => {
        if (select.value) {
          playFromData(select.value);
        }
      };
      const defaultOption = document.createElement('option');
      defaultOption.textContent = 'Select a video file...';
      defaultOption.value = '';
      select.appendChild(defaultOption);
      videoFiles.forEach(filename => {
        const option = document.createElement('option');
        option.value = filename;
        option.textContent = filename;
        select.appendChild(option);
      });
      container.appendChild(select);
    })
    .catch(error => console.error('Error loading data files:', error));
}

// Play video from data directory
function playFromData(filename) {
  const video = document.getElementById('media-video-player');
  video.pause();
  video.src = `${localMoviePath}${filename}`;
  video.name = filename;
  video.load();
  video.play();
}

// Attach to global for HTML usage
window.toggleInputModeDropdown = toggleInputModeDropdown;
window.chooseLocalFile = chooseLocalFile;
window.loadDataFiles = loadDataFiles;
window.playFromData = playFromData;

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
