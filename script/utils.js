class Utils {
  static buttonType = {
    playPause: 'PLAY-PAUSE',
    volume: 'VOLUME',
    seek: 'SEEK',
    fullScreen: 'FULL-SCREEN',
    pip: 'PIP',
    rotation: 'ROTATION',
    theaterMode: 'THEATER-MODE',
  };

  // Bind key press events for media player
  static pressedKeyType(eventCode) {
      switch (eventCode) {
        case 'Space':
        case 'Enter':
          return 'PLAY_PAUSE';
        case 'KeyA':
        case 'ArrowLeft':
          return 'FAST_FORWARD';
        case 'KeyD':
        case 'ArrowRight':
          return 'FAST_BACKWARD';
        case 'KeyN':
          return 'PLAY_NEXT';
        case 'KeyV':
          return 'PLAY_PREVIOUS';
        case 'KeyF':
          return 'FULL_SCREEN';
        case 'KeyP':
          return 'PIP_MODE';
        case 'Equal': // Volume Up
        case 'Plus':
          return 'VOLUME_UP';
        case 'Minus': // Volume Down
        case 'Hypen':
          return 'VOLUME_DOWN';
        case 'KeyM': // Mute
          return 'VOLUME_MUTE';
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
          return 'VOLUME_BAR_VALUE';
        case 'KeyT': // Trim Start
          return 'TRIM_START_TIME';
        case 'KeyC': // Trim Cut (End)
          return 'TRIM_END_TIME';
        case 'KeyG': // Play Trim Range Video
          return 'PLAY_TRIMED_VIDEO';
        case 'KeyR': // Reset Trim Range
          return 'RESET_TRIME_RANGE';
        case 'KeyO': // Video Rotation
          return 'VIDEO_RATION';
        case 'ArrowUp': // Previous Video Mode
          return 'PREVIOUS_VIDEO_MODE';
        case 'ArrowDown': // Next Video Mode
          return 'NEXT_VIDEO_MODE';
        default:
          return;
      }  
  }
}
