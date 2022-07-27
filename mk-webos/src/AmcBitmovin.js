const Bitmovinplayer = required("../thirdparty/bitmovin_8.90.0/bitmovinplayer_8.90.0.js");


var bufferConfig = {};
var bufferLevels = {};
bufferLevels["forwardduration"] = 30;
bufferLevels["backwardduration"] = 10;
bufferConfig["audio"] = bufferLevels;
bufferConfig["video"] = bufferLevels;
var config = {
  key: "YOUR-PLAYER-KEY",
  logs: {
    //level: 'debug'
  },
  playback: {
    autoplay: true,
    muted: true,
    preferredTech: [{
      player: 'html5',
      streaming: 'dash'
    }]
  },
  tweaks: {
    file_protocol: true,
    BACKWARD_BUFFER_PURGE_INTERVAL: 10,
    enable_seek_for_live: true
  },
  buffer: bufferConfig
};

var source = {
  "dash": "https://womprodc.cdn.mdstrm.com/sdash/LIVE$4784/index.mpd/Manifest?start=2022-07-18T04%3A22%3A10.936Z&end=END&device=clear_live_wom_html5_chrome_dash_v1_wv3_all",
};
// create Bitmovin player instance
var container = document.getElementById('my-player');

debugger;
// bitmovin.player.Player.addModule(bitmovin.player["webos"].default);

var player = new Bitmovinplayer.player.Player(container, config);

function onSourceLoaded() {
  console.log('BM:➵ onSourceLoaded');
};

function onReady() {
  console.log('BM:➵ onReady');
};

function onPlay() {
  console.log('BM:➵ onPlay');
};

function onPlaying() {
  console.log('BM:➵ onPlaying');
}
function onPause() {
  console.log('BM:➵ onPause');
}

function onPlaybackFinished() {
  console.log('BM:➵ onPlaybackFinished');
}

function onDvrWindowExceeded(event) {
  console.log('BM:➵ onDvrWindowExceeded');
}

function onStallStarted(event) {
  console.log('BM:➵ onStallStarted');
}

function onStallEnded(event) {
  console.log('BM:➵ onStallEnded');
}

function onPeriodSwitch(event) {
  console.log('BM:➵ onPeriodSwitch');
}

function onPeriodSwitched(event) {
  console.log('BM:➵ onPeriodSwitched');
}

function onTimeChanged(event) {
  var timeAbs = player.getCurrentTime("absolutetime");
  var timeRel = player.getCurrentTime("relativetime");
  console.log('BM:➵ onTimeChanged: timeAbs=' + timeAbs + ', timeRel=' + timeRel);
}

player.on('paused', onPause);
player.on('sourceloaded', onSourceLoaded);
player.on('ready', onReady);
player.on('play', onPlay);
player.on('playing', onPlaying);
player.on('playbackfinished', onPlaybackFinished);
player.on('dvrwindowexceeded', onDvrWindowExceeded);
player.on('stallstarted', onStallStarted);
player.on('stallended', onStallEnded);
player.on('periodswitch', onPeriodSwitch);
player.on('periodswitched', onPeriodSwitched);
player.on('timechanged', onTimeChanged);

console.log('BM:➵ Loading player');
player.load(source).then(
  function () {
    //Success
    console.log('BM:➵ Player load resolved');
    // var modules = bitmovin.player.Player.getModules();
    // console.log("Modules: " + modules);
  },
  function (reason) {
    //Error
    console.log('BM:➵ Error while creating Bitmovin Player instance');
  }
);
