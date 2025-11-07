export default class Utils {
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

  static scriptList(frameResolution) {
    return {
      break: "------ Basic Video Information & Transformation --------",
      frameResolution: `${frameResolution.width} x ${frameResolution.height} ${isHighResolution ? '✅' : '🚫'}`,
      storeMediaInfo: `ffprobe -v quiet -print_format json -show_format -show_streams "{INPUTFILE}" > "trim/mediaInfo.json"`,
      reEncode_video_and_Audio: `ffmpeg -i "{INPUTFILE}" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 192k "${object.INPUTFILE.replace(/\.[\w\d]+$/gi, '')}.mp4"`,
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
  }

  static generateFFMpegScript(frameResolution) {
    const cropVideo = {
      FourK: { width: 3840, height: 2160 },
      FHD: { width: 1920, height: 1080 },
      HD: { width: 1080, height: 720 }
    };
    const isHighResolution = Math.max(frameResolution.width, frameResolution.height) >= Math.max(cropVideo.FourK.width, cropVideo.FourK.height);

    const object = {
      INPUTFILE: this.video.name,
      STARTTIME: this.trimConfig.trimStart.toFixed(1),
      TRIMDURATION: (this.trimConfig.trimEnd - this.trimConfig.trimStart).toFixed(1),
      OUTPUTFILE: `trim/${this.trimConfig.trimStart.toFixed(2)}`,
      VIDEO_WIDTH: frameResolution.width,
      VIDEO_HEIGHT: frameResolution.height,
      CORP_HEIGHT: isHighResolution ? Math.max(cropVideo.FHD.width, cropVideo.FHD.height) : Math.max(frameResolution.height, cropVideo.HD.height),
      CORP_WIDTH: isHighResolution ? Math.min(cropVideo.FHD.width, cropVideo.FHD.height) : Math.min(frameResolution.width, cropVideo.HD.height)
    };

    console.clear();
    const scriptList = Utils.scriptList(frameResolution);

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
