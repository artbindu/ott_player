import * as BitmovinPlayer from "../thirdparty/bitmovin_8.90.0/bitmovinplayer_8.90.0";

var config = {
  key: "YOUR-PLAYER-KEY",
  logs: {
    // level: 'debug'
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
  buffer: {
    audio: {
      backwardduration: 10,
      forwardduration: 30
    }, video: {
      backwardduration: 10,
      forwardduration: 30
    }
  }
};

var source = {
  "dash": "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
};
// create Bitmovin player instance
var container = document.getElementById('my-player');


console.log(`BP-01: loaded modules: `, BitmovinPlayer.Player.getModules());
var player = new BitmovinPlayer.Player(container, config);

function onSourceLoaded() {
  console.log('onSourceLoaded');
};

function onReady() {
  console.log('onReady');
};

function onPlay() {
  console.log('onPlay');
};

function onPlaying() {
  console.log('onPlaying');
}
function onPause() {
  console.log('onPause');
}

function onPlaybackFinished() {
  console.log('onPlaybackFinished');
}

function onDvrWindowExceeded(event) {
  console.log('onDvrWindowExceeded');
}

function onStallStarted(event) {
  console.log('onStallStarted');
}

function onStallEnded(event) {
  console.log('onStallEnded');
}

function onPeriodSwitch(event) {
  console.log('onPeriodSwitch');
}

function onPeriodSwitched(event) {
  console.log('onPeriodSwitched');
}

function onTimeChanged(event) {
  var timeAbs = player.getCurrentTime("absolutetime");
  var timeRel = player.getCurrentTime("relativetime");
  console.log('onTimeChanged: timeAbs=' + timeAbs + ', timeRel=' + timeRel);
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

console.log('BP-01: Loading player');
player.load(source).then(
  function () {
    //Success
    console.log('BP-01: Player load resolved');
    console.log(`BP-01: loaded modules: `, BitmovinPlayer.Player.getModules());
  },
  function (reason) {
    //Error
    console.log('Error while creating Bitmovin Player instance', reason);
  }
);