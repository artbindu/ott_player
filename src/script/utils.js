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

window.toggleInputModeDropdown = toggleInputModeDropdown;
window.chooseLocalFile = chooseLocalFile;
window.loadDirectoryFiles = loadDirectoryFiles;
window.playSelectedMedia = playSelectedMedia;
window.playPreviousMedia = playPreviousMedia;
window.playNextMedia = playNextMedia;
window.enableMobileDraggableControls = enableMobileDraggableControls;
