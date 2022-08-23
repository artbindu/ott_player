const bitmovin_url = "https://cdn.bitmovin.com/player/web/8/modules/";
const bitmovin_modules = [
    "bitmovinplayer-core.js",
    "bitmovinplayer-polyfill.js",
    "bitmovinplayer-engine-bitmovin.js",
    "bitmovinplayer-mserenderer.js",
    "bitmovinplayer-abr.js",
    "bitmovinplayer-drm.js",
    "bitmovinplayer-container-mp4.js",
    "bitmovinplayer-xml.js",
    "bitmovinplayer-dash.js",
    "bitmovinplayer-style.js"
];

let n = 0;
// This is Recursive Function
function loadBitmovinModules() {
    var script = document.createElement('script');
    script.src = bitmovin_url + bitmovin_modules[n];
    script.onload = function () {
        n++;
        if (n < bitmovin_modules.length) {
            loadBitmovinModules();
        } else {
            window.onload = loadModularPlayer;
        }
    }
    script.onerror = function(err) {
        console.log('load error :' + bitmovin_modules[n],  err);
    }
    document.head.appendChild(script);
}

function loadModularPlayer() {
    bitmovin.player.core.Player.addModule(window.bitmovin.player.polyfill.default);
    bitmovin.player.core.Player.addModule(window.bitmovin.player['engine-bitmovin'].default);
    bitmovin.player.core.Player.addModule(window.bitmovin.player['container-mp4'].default);
    bitmovin.player.core.Player.addModule(window.bitmovin.player.mserenderer.default);
    bitmovin.player.core.Player.addModule(window.bitmovin.player.abr.default);
    bitmovin.player.core.Player.addModule(window.bitmovin.player.drm.default);
    bitmovin.player.core.Player.addModule(window.bitmovin.player.xml.default);
    bitmovin.player.core.Player.addModule(window.bitmovin.player.dash.default);
    bitmovin.player.core.Player.addModule(window.bitmovin.player.style.default);
    // bitmovin.player.core.Player.addModule(window.bitmovin.player.webos.default);

    var bufferConfig = {};
    var bufferLevels = {};
    bufferLevels["forwardduration"] = 30;
    bufferLevels["backwardduration"] = 10,
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

    // var source = {
    //   dash: 'https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd',
    //   drm: {
    //     widevine: {
    //       LA_URL: 'https://proxy.uat.widevine.com/proxy?provider=widevine_test'
    //     }
    //   }
    // };

    // create Bitmovin player instance
    var container = document.getElementById('my-player');
    var player = new bitmovin.player.core.Player(container, config);

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
            var modules = bitmovin.player.core.Player.getModules();
            console.log("Modules: " + modules);
        },
        function (reason) {
            //Error
            console.log('Error while creating Bitmovin Player instance');
        }
    );
}

// Load Bitmovin Player Modules
loadBitmovinModules();
