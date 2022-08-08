import { Player, PlayerEvent, BufferType, MediaType, MetadataType, HttpRequestType, TimelineReferencePoint } from "bitmovin-player/modules/bitmovinplayer-core";
import * as PolyfillModule from "bitmovin-player/modules/bitmovinplayer-polyfill";
import * as EngineBitmovinModule from "bitmovin-player/modules/bitmovinplayer-engine-bitmovin";
import * as MseRendererModule from "bitmovin-player/modules/bitmovinplayer-mserenderer";
import AbrModule from "bitmovin-player/modules/bitmovinplayer-abr";
import DrmModule from "bitmovin-player/modules/bitmovinplayer-drm";
import * as ContainerModule from "bitmovin-player/modules/bitmovinplayer-container-mp4";
import * as XmlModule from "bitmovin-player/modules/bitmovinplayer-xml";
import * as DashModule from "bitmovin-player/modules/bitmovinplayer-dash";
import * as HlsModule from 'bitmovin-player/modules/bitmovinplayer-hls';
import * as ContainerTSModule from 'bitmovin-player/modules/bitmovinplayer-container-ts';
import * as SubtitlesModule from 'bitmovin-player/modules/bitmovinplayer-subtitles';
import * as SubtitlesCEA608Module from 'bitmovin-player/modules/bitmovinplayer-subtitles-cea608';
// import StyleModule from 'bitmovin-player/modules/bitmovinplayer-style';
// import { UIFactory } from 'bitmovin-player/bitmovinplayer-ui';
import 'bitmovin-player/bitmovinplayer-ui.css';


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

Player.addModule(PolyfillModule.default);
Player.addModule(EngineBitmovinModule.default);
Player.addModule(MseRendererModule.default);
Player.addModule(AbrModule.default);
Player.addModule(DrmModule.default);
Player.addModule(ContainerModule.default);
Player.addModule(XmlModule.default.default);
Player.addModule(DashModule.default.default);
Player.addModule(HlsModule.default);
Player.addModule(ContainerTSModule.default.default);
Player.addModule(SubtitlesModule.default);
Player.addModule(SubtitlesCEA608Module.default);

console.log(`BM: `, PlayerEvent, BufferType, MediaType, MetadataType, HttpRequestType, TimelineReferencePoint)
console.log(`BM: loaded modules: `, Player.getModules());

var player = new Player(container, config);

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

console.log('Loading player');
player.load(source).then(
  function () {
    //Success
    console.log('Player load resolved');
    console.log(`BM: loaded modules: `, Player.getModules());
  },
  function (reason) {
    //Error
    console.log('Error while creating Bitmovin Player instance', reason);
  }
);