import * as Bitmovinplayer from "bitmovin-player";


//<!-- STEP 3 - Configure and Initialize the player-->
var playerConfig = {
    "key": "<PLAYER_LICENSE_KEY>",
    "playback": {
      "muted": true,
      "autoplay": true
    }
  }
  var container = document.getElementById('my-player');
  var player = new Bitmovinplayer.Player(container, playerConfig);
  
  //<!-- STEP 4 - Configure and load a Source for the player -->
  var sourceConfig = {
    "title": "Default Demo Source Config",
    "description": "Select another example in \"Step 4 - Load a Source\" to test it here",
    "dash": "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
    "hls": "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",
    "smooth": "https://test.playready.microsoft.com/smoothstreaming/SSWSS720H264/SuperSpeedway_720.ism/manifest",
    "progressive": "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/MI201109210084_mpeg-4_hd_high_1080p25_10mbits.mp4",
    "poster": "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/poster.jpg"
  }

  function onPause() {
    console.log('BM:➵ onPause');
  }
  player.on('paused', onPause);
  
  player.load(sourceConfig).then(function() {
      console.log('Successfully loaded Source Config!');
    }).catch(function(reason) {
      console.log('Error while loading source:', reason);
    }
  );