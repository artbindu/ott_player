import { Player, PlayerEvent, BufferType, MediaType, MetadataType, HttpRequestType, TimelineReferencePoint } from "bitmovin-player/modules/bitmovinplayer-core";
import * as PolyfillModule from "bitmovin-player/modules/bitmovinplayer-polyfill";
import * as EngineBitmovinModule from "bitmovin-player/modules/bitmovinplayer-engine-bitmovin";
import * as EngineNativeModule from "bitmovin-player/modules/bitmovinplayer-engine-native";
import * as ContainerModule from "bitmovin-player/modules/bitmovinplayer-container-mp4";
import ContainerTSModule from 'bitmovin-player/modules/bitmovinplayer-container-ts';
import * as MseRendererModule from "bitmovin-player/modules/bitmovinplayer-mserenderer";
import LowLatency from "bitmovin-player/modules/bitmovinplayer-lowlatency";
import AbrModule from "bitmovin-player/modules/bitmovinplayer-abr";
import DrmModule from "bitmovin-player/modules/bitmovinplayer-drm";
import XmlModule from "bitmovin-player/modules/bitmovinplayer-xml";
import DashModule from "bitmovin-player/modules/bitmovinplayer-dash";
import * as HlsModule from 'bitmovin-player/modules/bitmovinplayer-hls';
import Style from 'bitmovin-player/modules/bitmovinplayer-style';
import RemoteControl from 'bitmovin-player/modules/bitmovinplayer-remotecontrol';
import * as Analytics from 'bitmovin-player/modules/bitmovinplayer-analytics';
import * as SubtitlesModule from 'bitmovin-player/modules/bitmovinplayer-subtitles';
import * as SubtitlesCEA608Module from 'bitmovin-player/modules/bitmovinplayer-subtitles-cea608';
import * as SubtitlesNative from 'bitmovin-player/modules/bitmovinplayer-subtitles-native';
import SubtitlesWebVTT from 'bitmovin-player/modules/bitmovinplayer-subtitles-vtt';
import WebOs from 'bitmovin-player/modules/bitmovinplayer-webos';
import Tizen from 'bitmovin-player/modules/bitmovinplayer-tizen';
// import { UIFactory } from 'bitmovin-player/bitmovinplayer-ui';
import 'bitmovin-player/bitmovinplayer-ui.css';

/* Other Modular Player */
import VrModule from "bitmovin-player/modules/bitmovinplayer-vr";
import AdvertisingCoreModule from "bitmovin-player/modules/bitmovinplayer-advertising-core";
import AdvertisingModule from "bitmovin-player/modules/bitmovinplayer-advertising-bitmovin";
import * as Patch from "bitmovin-player/modules/bitmovinplayer-patch";
import CryptoModule from "bitmovin-player/modules/bitmovinplayer-crypto";
import * as SmoothModule from "bitmovin-player/modules/bitmovinplayer-smooth";
import ContainerWebMModule from "bitmovin-player/modules/bitmovinplayer-container-webm";
import SubtitleTTML from "bitmovin-player/modules/bitmovinplayer-subtitles-ttml";
import Thumbnail from "bitmovin-player/modules/bitmovinplayer-thumbnail";
// import UIModule from "bitmovin-player/modules/bitmovinplayer-ui";

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
    enable_seek_for_live: true,
    native_hls_parsing: true
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
Player.addModule(EngineNativeModule.default);
Player.addModule(ContainerModule.default);
Player.addModule(ContainerTSModule.default);
Player.addModule(MseRendererModule.default);
Player.addModule(LowLatency.default);
Player.addModule(AbrModule.default);
Player.addModule(DrmModule.default);
Player.addModule(XmlModule.default);
Player.addModule(DashModule.default);
Player.addModule(HlsModule.default);
Player.addModule(Style.default);
Player.addModule(RemoteControl.default);
Player.addModule(Analytics.default);
Player.addModule(SubtitlesModule.default);
Player.addModule(SubtitlesCEA608Module.default);
Player.addModule(SubtitlesNative.default);
Player.addModule(SubtitlesWebVTT.default);
Player.addModule(WebOs.default);
Player.addModule(Tizen.default);

Player.addModule(VrModule.default);
Player.addModule(AdvertisingCoreModule.default);
Player.addModule(AdvertisingModule.default);
Player.addModule(Patch.default);
Player.addModule(CryptoModule.default);
Player.addModule(SmoothModule.default);
Player.addModule(ContainerWebMModule.default);
Player.addModule(SubtitleTTML.default);
Player.addModule(Thumbnail.default);
// Player.addModule(UIModule.default);


console.log(`BM: [new]`, BufferType, MediaType, MetadataType, HttpRequestType, TimelineReferencePoint);
console.log(`BM: loaded modules: `, Player.getModules());
console.log(`BM: `, PlayerEvent);

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
    console.log(`loaded modules: `, Player.getModules());
  },
  function (reason) {
    //Error
    console.log('Error while creating Bitmovin Player instance', reason);
  }
);