/*
 * Legacy compatibility entry point.
 *
 * The player source has been split into:
 * - script/config.js
 * - script/utils.js
 * - script/ottMediaPlayer.js
 * - script/index.js
 *
 * Keep this file to support older HTML pages still referencing script/media.js.
 */
(function () {
  if (
    window.OTTMediaPlayer &&
    window.enableMobileDraggableControls &&
    window.OTT_PLAYER_CONFIG
  ) {
    return;
  }

  var head = document.head || document.getElementsByTagName("head")[0];
  var scripts = [
    "script/config.js",
    "script/utils.js",
    "script/ottMediaPlayer.js",
    "script/index.js",
  ];

  scripts.forEach(function (src) {
    var existing = document.querySelector('script[src="' + src + '"]');
    if (existing) return;

    var script = document.createElement("script");
    script.src = src;
    head.appendChild(script);
  });
})();
