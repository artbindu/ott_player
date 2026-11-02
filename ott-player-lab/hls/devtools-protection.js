(function () {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "[::1]" ||
    window.location.protocol === "file:"
  ) {
    return;
  }

  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  }, true);

  document.addEventListener("keydown", function (event) {
    var key = event.key.toLowerCase();
    var toolsKey = ["i", "j", "c", "k"].indexOf(key) !== -1;
    var devToolsShortcut = key === "f12" ||
      (event.ctrlKey && event.shiftKey && toolsKey) ||
      (event.metaKey && event.altKey && toolsKey);
    var sourceShortcut = key === "u" &&
      (event.ctrlKey || (event.metaKey && event.altKey));
    var saveShortcut = key === "s" && (event.ctrlKey || event.metaKey);
    if (devToolsShortcut || sourceShortcut || saveShortcut) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  setInterval(function () {
    console.clear();
  }, 2000);

  setInterval(function () {
    debugger;
  }, 100);
})();