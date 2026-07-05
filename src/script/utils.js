export function getOttElements() {
  const config = window.OTT_PLAYER_CONFIG || {};
  const elements = config.elements || {};
  const inputDefaults = {
    inputModeDropdown: "inputModeDropdown",
    fileInputRow: "fileInputRow",
    urlInputRow: "urlInputRow",
    directoryInputRow: "directoryInputRow",
    navButtonsRow: "navButtonsRow",
    fileInput: "fName",
    directoryInput: "directoryInput",
    mediaDropdown: "mediaDropdown",
    directoryName: "directoryName",
  };

  return {
    videoPlayer: elements.videoPlayer || "media-video-player",
    controlsContainer: elements.controlsContainer || "media-media-controls",
    dragHandle: elements.dragHandle || "dragHandle",
    inputs: {
      ...inputDefaults,
      ...(elements.inputs || {}),
    },
  };
}

export function getOttUiConfig() {
  const config = window.OTT_PLAYER_CONFIG || {};
  const ui = config.ui || {};

  return {
    inputModes: {
      file: "file",
      url: "url",
      directory: "directory",
      ...(ui.inputModes || {}),
    },
    labels: {
      emptyDirectory: "No Directory",
      mediaDropdownDefault: "Select a media file...",
      ...(ui.labels || {}),
    },
    mediaTypePrefixes: Array.isArray(ui.mediaTypePrefixes)
      ? ui.mediaTypePrefixes
      : ["video/", "audio/"],
  };
}

// Toggle input mode dropdown visibility
export function toggleInputModeDropdown() {
  const { inputs } = getOttElements();
  const { inputModes } = getOttUiConfig();
  var mode = document.getElementById(inputs.inputModeDropdown).value;
  document.getElementById(inputs.fileInputRow).style.display =
    mode === inputModes.file ? "" : "none";
  document.getElementById(inputs.urlInputRow).style.display =
    mode === inputModes.url ? "" : "none";
  document.getElementById(inputs.directoryInputRow).style.display =
    mode === inputModes.directory ? "" : "none";
  document.getElementById(inputs.navButtonsRow).style.display = "none"; // Hide nav buttons when not in directory mode
}

// Choose local file from file input
export function chooseLocalFile() {
  const elements = getOttElements();
  const fileInput = document.getElementById(elements.inputs.fileInput);
  const video = document.getElementById(elements.videoPlayer);
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
export function loadDirectoryFiles() {
  const { inputs } = getOttElements();
  const { labels, mediaTypePrefixes } = getOttUiConfig();
  const directoryInput = document.getElementById(inputs.directoryInput);
  const mediaDropdown = document.getElementById(inputs.mediaDropdown);
  const directoryName = document.getElementById(inputs.directoryName);
  mediaDropdown.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.textContent = labels.mediaDropdownDefault;
  defaultOption.value = "";
  mediaDropdown.appendChild(defaultOption);

  if (directoryInput.files && directoryInput.files.length > 0) {
    const dirName = directoryInput.files[0].webkitRelativePath.split("/")[0];
    directoryName.textContent = `${dirName}(${directoryInput.files.length})`;
    Array.from(directoryInput.files)
      .filter(
        (file) =>
          mediaTypePrefixes.some((typePrefix) =>
            file.type.startsWith(typePrefix),
          ),
      )
      .forEach((file) => {
        const option = document.createElement("option");
        option.value = URL.createObjectURL(file);
        option.textContent = file.name;
        option.dataset.file = file; // Store file reference
        mediaDropdown.appendChild(option);
      });
    mediaDropdown.hidden = false;
    document.getElementById(inputs.navButtonsRow).style.display = ""; // Show nav buttons when media files are loaded
    // Automatically select and play the first media file
    if (mediaDropdown.options.length > 1) {
      mediaDropdown.selectedIndex = 1;
      playSelectedMedia();
    }
  } else {
    directoryName.textContent = labels.emptyDirectory;
    mediaDropdown.hidden = true;
    document.getElementById(inputs.navButtonsRow).style.display = "none"; // Hide nav buttons when no files
  }
}

// Play selected media from dropdown
export function playSelectedMedia() {
  const elements = getOttElements();
  const mediaDropdown = document.getElementById(elements.inputs.mediaDropdown);
  const selectedValue = mediaDropdown.value;
  if (selectedValue) {
    const video = document.getElementById(elements.videoPlayer);
    video.pause();
    video.src = selectedValue;
    video.name = mediaDropdown.options[mediaDropdown.selectedIndex].textContent;
    video.load();
    video.play();
  }
}

// Navigate to previous media in directory
export function playPreviousMedia() {
  const mediaDropdown = document.getElementById(
    getOttElements().inputs.mediaDropdown,
  );
  if (mediaDropdown.selectedIndex > 1) {
    // Index 0 is default, 1 is first file
    mediaDropdown.selectedIndex--;
    playSelectedMedia();
  } else if (mediaDropdown.selectedIndex === 1) {
    mediaDropdown.selectedIndex = mediaDropdown.options.length - 1;
    playSelectedMedia();
  }
}

// Navigate to next media in directory
export function playNextMedia() {
  const mediaDropdown = document.getElementById(
    getOttElements().inputs.mediaDropdown,
  );
  if (mediaDropdown.selectedIndex < mediaDropdown.options.length - 1) {
    mediaDropdown.selectedIndex++;
    playSelectedMedia();
  } else if (mediaDropdown.selectedIndex === mediaDropdown.options.length - 1) {
    mediaDropdown.selectedIndex = 1;
    playSelectedMedia();
  }
}

// Make player-controls draggable on mobile and desktop, with focus fix
export function enableMobileDraggableControls() {
  const elements = getOttElements();
  const controls = document.getElementById(elements.controlsContainer);
  const handle = document.getElementById(elements.dragHandle);
  let isDragging = false,
    startX,
    startY,
    origX,
    origY;

  function setPosition(x, y) {
    controls.style.left = x + "px";
    controls.style.top = y + "px";
    controls.style.position = "fixed";
    controls.style.zIndex = 1000;
    controls.style.transition = "none";
    controls.focus(); // Ensure focus after move
  }

  // Desktop
  handle.addEventListener("mousedown", function (e) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = controls.getBoundingClientRect();
    origX = rect.left;
    origY = rect.top;
    setPosition(origX, origY);
    controls.setAttribute("tabindex", "-1"); // Make focusable if not already
    controls.focus();
  });
  document.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;
    setPosition(origX + dx, origY + dy);
  });
  document.addEventListener("mouseup", function () {
    isDragging = false;
  });

  // Mobile (touch)
  handle.addEventListener("touchstart", function (e) {
    isDragging = true;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    const rect = controls.getBoundingClientRect();
    origX = rect.left;
    origY = rect.top;
    setPosition(origX, origY);
    controls.setAttribute("tabindex", "-1");
    controls.focus();
  });
  document.addEventListener("touchmove", function (e) {
    if (!isDragging) return;
    const touch = e.touches[0];
    let dx = touch.clientX - startX;
    let dy = touch.clientY - startY;
    setPosition(origX + dx, origY + dy);
  });
  document.addEventListener("touchend", function () {
    isDragging = false;
  });
}

/**
 * Creates the ffmpeg command template dictionary used by trim/export helpers.
 *
 * @param {{videoResolution:{width:number,height:number},isHighResolution:boolean,inputFileName:string}} params
 * @returns {Record<string, string>}
 */
export function getFfmpegScriptList({
  videoResolution,
  isHighResolution,
  inputFileName,
}) {
  return {
    break0: "------ Basic Video Information & Transformation --------",
    videoResolution: `${videoResolution.width} x ${videoResolution.height} ${isHighResolution ? "✅" : "🚫"}`,
    storeMediaInfo:
      'ffprobe -v quiet -print_format json -show_format -show_streams "{INPUTFILE}" > "trim/mediaInfo.json"',
    reEncode_video_and_Audio: `ffmpeg -i "{INPUTFILE}" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 192k "${inputFileName.replace(/\.[\w\d]+$/gi, "")}.mp4"`,
    break1: "--------Full Video Audio-------------",
    // Trim Video with range in second
    trimeVideo_sec:
      'ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',
    trimVideoWithoutAudio_sec:
      'ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -c:v libx264 -crf 23 -preset fast -an "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',
    trimAudioOnlyFromVideo_sec:
      'ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -q:a 0 -map a "{OUTPUTFILE}_{SCRIPTKEY}.mp3"',
    rotateVideoClockWise90:
      'ffmpeg -i "{INPUTFILE}" -vf "transpose=1" "{OUTPUTFILE}_{SCRIPTKEY}_clock90.mp4"',
    rotateVideoAntiClockWise90:
      'ffmpeg -i "{INPUTFILE}" -vf "transpose=1,transpose=1,transpose=1" "{OUTPUTFILE}_{SCRIPTKEY}_anticlock90.mp4"',

    break2: "\n--------Video Crop Center | Left | Right-------------",
    cropVideo_left:
      'ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -vf "crop={CROP_WIDTH}:{CROP_HEIGHT}:(({VIDEO_WIDTH}-{CROP_WIDTH}*3)/2 + {CROP_WIDTH}*0):({VIDEO_HEIGHT}-1920)/2" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',
    cropVideo_center_OLD:
      'ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -vf "crop={CROP_WIDTH}:{CROP_HEIGHT}:(({VIDEO_WIDTH}-{CROP_WIDTH}*3)/2 + {CROP_WIDTH}*1):({VIDEO_HEIGHT}-1920)/2" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',
    cropVideo_center:
      'ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -vf "crop={CROP_WIDTH}:{CROP_HEIGHT}:(({VIDEO_WIDTH}-{CROP_WIDTH})/2):(({VIDEO_HEIGHT}-{CROP_HEIGHT})/2)" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',
    cropVideo_right:
      'ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -vf "crop={CROP_WIDTH}:{CROP_HEIGHT}:(({VIDEO_WIDTH}-{CROP_WIDTH}*3)/2 + {CROP_WIDTH}*2):({VIDEO_HEIGHT}-1920)/2" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',

    break3:
      "\n--------Reverse Corped Video Center | Left | Right-------------",
    cropVideo_left_reverse:
      'ffmpeg -i "{OUTPUTFILE}_{SCRIPTKEY-REV}.mp4" -vf reverse -af areverse -preset fast -c:v libx264 -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',
    cropVideo_center_reverse:
      'ffmpeg -i "{OUTPUTFILE}_{SCRIPTKEY-REV}.mp4" -vf reverse -af areverse -preset fast -c:v libx264 -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',
    cropVideo_right_reverse:
      'ffmpeg -i "{OUTPUTFILE}_{SCRIPTKEY-REV}.mp4" -vf reverse -af areverse -preset fast -c:v libx264 -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',

    break4:
      "\n--------Video Crop Extrime Left/Right | Middle of Left-Center/Right-Center-------------",
    cropVideo_extrime_left:
      'ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -vf "crop={CROP_WIDTH}:{CROP_HEIGHT}:0:({VIDEO_HEIGHT}-1920)/2" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',
    cropVideo_left_center_mid:
      'ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -vf "crop={CROP_WIDTH}:{CROP_HEIGHT}:(({VIDEO_WIDTH}-{CROP_WIDTH}*3)/2 + ({CROP_WIDTH}*(0+1)/2)):({VIDEO_HEIGHT}-1920)/2" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',
    cropVideo_center_right_mid:
      'ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -vf "crop={CROP_WIDTH}:{CROP_HEIGHT}:(({VIDEO_WIDTH}-{CROP_WIDTH}*3)/2 + ({CROP_WIDTH}*(1+2)/2)):({VIDEO_HEIGHT}-1920)/2" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',
    cropVideo_extrime_right:
      'ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -vf "crop={CROP_WIDTH}:{CROP_HEIGHT}:({VIDEO_WIDTH}-{CROP_WIDTH}):({VIDEO_HEIGHT}-1920)/2" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',

    break5:
      "\n--------Reverse Corped Video Extrime Left/Right | Middle of Left-Center/Right-Center-------------",
    cropVideo_extrime_left_reverse:
      'ffmpeg -i "{OUTPUTFILE}_{SCRIPTKEY-REV}.mp4" -vf reverse -af areverse -preset fast -c:v libx264 -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',
    cropVideo_left_center_mid_reverse:
      'ffmpeg -i "{OUTPUTFILE}_{SCRIPTKEY-REV}.mp4" -vf reverse -af areverse -preset fast -c:v libx264 -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',
    cropVideo_center_right_mid_reverse:
      'ffmpeg -i "{OUTPUTFILE}_{SCRIPTKEY-REV}.mp4" -vf reverse -af areverse -preset fast -c:v libx264 -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',
    cropVideo_extrime_right_reverse:
      'ffmpeg -i "{OUTPUTFILE}_{SCRIPTKEY-REV}.mp4" -vf reverse -af areverse -preset fast -c:v libx264 -c:a aac -b:a 128k "{OUTPUTFILE}_{SCRIPTKEY}.mp4"',

    break6: "--------Merge Clips-------------",
    mergedCropVideo:
      "ffmpeg -f concat -safe 0 -i mergevideolist.txt -c copy {SCRIPTKEY}.mp4",
    mergedCropVideo_no_Audio: 'ffmpeg -i "mergedCropVideo.mp4" -an {SCRIPTKEY}.mp4',
    trimAudioFromVideo:
      'ffmpeg -i "{INPUTFILE}" -ss {STARTTIME} -t {TRIMDURATION} -c copy "{SCRIPTKEY}.mp3"',
    mergedCropAudios:
      "ffmpeg -f concat -safe 0 -i mergevideolist.txt -c copy {SCRIPTKEY}.mp3",
    mergedAudio_And_Video:
      "ffmpeg -i mergedCropVideo_no_Audio.mp4 -i trimAudioFromVideo.mp3 -c:v copy -c:a aac -shortest {SCRIPTKEY}.mp4",
    mergedAudio_And_Video_90deg:
      'ffmpeg -i "mergedAudio_And_Video.mp4" -vf "transpose=1" "{SCRIPTKEY}.mp4"',
    mergedAudio_And_Video_270deg:
      'ffmpeg -i "mergedAudio_And_Video.mp4" -vf "transpose=1,transpose=1,transpose=1" "{SCRIPTKEY}.mp4"',
  };
}

