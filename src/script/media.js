/*
 * Legacy compatibility loader shim.
 *
 * This file supports older pages that still include script/media.js by
 * dynamically loading modular script/* files in order.
 *
 * Primary application entry is src/script/index.js.
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
