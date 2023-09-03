var options = {
    // "samplle": "'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8'",
    // "hls": "https://vsppstreamer-vspp08.proda.tmo.tv3cloud.com:5554/shls/LIVE$11297/index.m3u8?device=mf_hls_abr_clear&start=LIVE&end=END",
    "dash": "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd"
};

var container = document.getElementById('my-player');
// var player = new videojs.Player(container, options);

// function onPlayerReady() {
//     console.log('onPlayerReady');
// };
// player.on('onPlayerReady', onPlayerReady);

// player.load(source).then(
//     function () { // Success
//         console.log('Player load resolved');
//         var modules = bitmovin.player.Player.getModules();
//         console.log("Modules: " + modules);
//     },
//     function (reason) { // Error
//         console.log('Error while creating Bitmovin Player instance');
//     }
// );

var plyr = videojs('my-player', options, function onPlayerReady() {
    videojs.log('Your player is ready!');

    // In this context, `this` is the player that was created by Video.js.
    this.play();

    // How about an event listener?
    this.on('ended', function () {
        videojs.log('Awww...over so soon?!');
    });
});

