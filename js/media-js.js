
var fileName;
var myPlayer = document.getElementById('media-video-player');
var fs = require('fs');

var intervalTimer = (myPlayer.duration > 3600) ? 1000 : 250; // milisecond
var seekBar = document.getElementById("player-seekbar");  // for media seekBar change
var seekBarMaxVal = 100; // default seekBarMaxValue
var autoPlayInterval = null;

function toggleInputModeDropdown() {
    var mode = document.getElementById('inputModeDropdown').value;
    document.getElementById('fileInputRow').style.display = (mode === 'file') ? '' : 'none';
    document.getElementById('pathInputRow').style.display = (mode === 'path') ? '' : 'none';
    document.getElementById('urlInputRow').style.display = (mode === 'url') ? '' : 'none';
}


// (function () {
//     var old = console.log;
//     var logger = document.getElementById('log');
//     console.log = function (message) {
//         if (typeof message == 'object') {
//             logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
//         } else {
//             logger.innerHTML += message + '<br />';
//         }
//     }
// })();

function playPauseFun() {
    console.error("isPaused: ", myPlayer.paused);
    (myPlayer.paused) ? myPlayer.play() : myPlayer.pause();
    console.log(`isPaused: ${(myPlayer.paused) ? 'yes' : 'no'}`);
    mediaSeekBarValue = (!myPlayer.paused) ? setInterval(updateMediaSeekBar, intervalTimer) : clearInterval(mediaSeekBarValue);

    stopAutoForward();

    console.log('unit seekBarTime: ', Math.round(myPlayer.duration / seekBarMaxVal, 2), 'sec :: PlayerDuration: ', timeFormat(myPlayer.duration), 'currentTime: ', timeFormat(myPlayer.currentTime));
    return true;
}

function chooseNewFile() {
    myPlayer.pause();
    fileName = document.getElementById("fName").value.split("\\").reverse()[0];
    console.log(`BM: actual fileName: ${document.getElementById("fName").value} take fileName: ${fileName}`);
    document.getElementById("media-video-player").innerHTML = "<source src=\"data/" + fileName + "\" type=\"video/mp4\">";
    myPlayer = document.getElementById('media-video-player');
    myPlayer.load();  // reload new file
    reset();
}

// Play video from URL
function playFromUrl() {
    var url = document.getElementById('videoUrlInput').value.trim();
    if (!url) return;
    var video = document.getElementById('media-video-player');
    video.pause();
    video.src = url;
    video.load();
    video.play();
}

/* update for show all files */
function chooseNewFile1() {
    myPlayer.pause();
    fileName = document.getElementById("fName1").value.trim();
    if (fileName.indexOf('.') < 1) {
        fileName = `${fileName}.mp4`;
    }
    console.log(`BM: actual fileName: ${document.getElementById("fName1").value} take fileName: ${fileName}`);
    document.getElementById("media-video-player").innerHTML = "<source src=\"data/" + fileName + "\" type=\"video/mp4\">";
    myPlayer = document.getElementById('media-video-player');
    myPlayer.load();  // reload new file
    reset();
}

function reset() {
    stopAutoForward();

    // auto reset selected button
    document.getElementById("playSpeed").selectedIndex = 4;
    /* call them to auto-relode & auto-play video */
    myPlayer.load();  // by default after player.load() player is paused automatically
    playPauseFun();  // call it to update player-seek-bar

    // reset playbackRate
    myPlayer.playbackRate = 1;
    myPlayer.currentTime = 0;
    updateMediaSeekBar();
    myPlayer.play();
    return true;
}

var isDecrese = true;
function volumeFun() {
    var inc = (isDecrese & myPlayer.volume >= 0.10) ? -1 : 1;
    myPlayer.volume = (myPlayer.volume * 10 + inc) / 10;
    isDecrese = ((inc === -1 & myPlayer.volume >= 0.10) || myPlayer.volume === 1) ? true : false;
    console.log(`playerVolume: ${myPlayer.volume}`);
    document.getElementById("volumeValue").innerHTML = (myPlayer.volume !== 0) ? (myPlayer.volume === 1) ? "1.0" : myPlayer.volume : "0.0";
    return true;
}

function forwardBackward(ctime) {
    console.log('cTime: ', ctime);
    myPlayer.currentTime = (ctime > 0) ? ((myPlayer.currentTime < myPlayer.duration) ? (myPlayer.currentTime + ctime) : myPlayer.duration) : ((myPlayer.currentTime > 0) ? (myPlayer.currentTime + ctime) : 0);
    console.log(`playerCurrentTime: ${myPlayer.currentTime}`);
    return updateMediaSeekBar();
}

function updateMediaSeekBar() {
    let currentTime = timeFormat(myPlayer.currentTime);
    let remainingTime = timeFormat(myPlayer.duration - myPlayer.currentTime);
    document.getElementById('startPos').innerText = currentTime;
    document.getElementById('endPos').innerText = remainingTime;

    seekBarMaxVal = Math.floor(myPlayer.duration * 10);
    document.getElementById("player-seekbar").max = seekBarMaxVal;
    let seekBarPos = Math.ceil(myPlayer.currentTime * seekBarMaxVal / myPlayer.duration);
    document.getElementById("player-seekbar").value = seekBarPos;

    console.log(`max: ${seekBarMaxVal} duration: ${myPlayer.duration} \nSeekBarPos: ${seekBarPos} currentTime: ${currentTime}`);
    // close interval
    if (myPlayer.currentTime === myPlayer.duration) {
        document.getElementById("player-seekbar").value = 0; // reset 'player-seekbar' value
        myPlayer.currentTime = 0;  // reset currentTime;
        clearInterval(mediaSeekBarValue);
    }
    return true;
}

seekBar.addEventListener("mouseup", playerSeekBarChangeValue);
function playerSeekBarChangeValue() {
    let isPaused = (myPlayer.paused);
    let seekValue = seekBar.value;
    console.log('BM: change seekbar', seekValue);
    myPlayer.pause();
    mediaSeekBarValue = (!myPlayer.paused) ? setInterval(updateMediaSeekBar, intervalTimer) : clearInterval(mediaSeekBarValue);

    myPlayer.currentTime = 0;
    myPlayer.currentTime = Math.floor(myPlayer.duration * seekValue / seekBarMaxVal);
    console.log('BM: isPaused', isPaused, 'current position: ', myPlayer.currentTime);
    (!isPaused) ? myPlayer.play() : myPlayer.pause();
    mediaSeekBarValue = (!myPlayer.paused) ? setInterval(updateMediaSeekBar, intervalTimer) : clearInterval(mediaSeekBarValue);
    return true;
}

/** 
 * when we click on 'dropdown' box then we have to click two(2) times.
 * So there was problem to auto-forward when we are in paused mode, because in that case 'playbackRate' does not work
 * To solve that chalange : Set;            isAutoForward = 0 (by default)
 *                          first click;    isAutoForward = 1
 *                          second click;   isAutoForward = 2
 *          and then forward in pause mode
 * */
var isAutoForward = 0;
function autoForward() {
    isAutoForward = (myPlayer.paused) ? ((isAutoForward === 2) ? isAutoForward : (isAutoForward + 1) % 3) : 0;
    // when we continuously use dropdown box for auto-forword in paused mode
    if (myPlayer.paused & isAutoForward === 2) {
        console.log("clear previous autoForward interval");
        clearInterval(autoPlayInterval);
    }

    console.log(`isAutoForward: ${isAutoForward} isPaused: ${myPlayer.paused}`);
    let rTime = parseFloat(document.getElementById("playSpeed").value);
    if (!myPlayer.paused) {
        if (rTime < 10)
            myPlayer.playbackRate = rTime;
        else
            myPlayer.currentTime += rTime;
        return true;
    } else if (myPlayer.paused & isAutoForward === 2) {
        myPlayer.playbackRate = 0;
        autoPlayInterval = setInterval(() => {
            if (myPlayer.currentTime >= myPlayer.duration || isAutoForward === 0) {
                clearInterval(autoPlayInterval);
                return;
            }
            if (!myPlayer.seeking & myPlayer.currentTime < myPlayer.duration) {
                myPlayer.currentTime += rTime;
                updateMediaSeekBar()
            }
        }, 1000);  // interval time = 1sec i.e. 1000 ms.
    } else if (myPlayer.paused & isAutoForward === 2 & rTime === 1) {
        isAutoForward = 0;
    }
}

// when we press 'play|pause' or 'reset' button then call it
function stopAutoForward() {
    myPlayer.playbackRate = 1;
    document.getElementById("playSpeed").selectedIndex = 4;
    isAutoForward = 0
    if (autoPlayInterval) { clearInterval(autoPlayInterval); /* autoPlayInterval= null;*/ }
}

// t : in second (integer)
function timeFormat(t) {
    t = Math.floor(t);
    return (t < 60) ?
        ((t < 10) ? '00:00:0' : '00:00:') + t.toString() :  // --:--::ss

        ((t < 60 * 60) ?
            '00:' + (((Math.floor(t / 60) < 10) ? '0' : '') + Math.floor(t / 60).toString()) + // --:mm:
            ':' + ((t % 60 < 10) ? '0' : '') + (t % 60).toString() :  // ss

            ((Math.floor(t / (60 * 60)) < 10) ? '0' : '') + Math.floor(t / (60 * 60)).toString() + // hh
            ':' + ((Math.floor((t % (60 * 60)) / 60) < 10) ? '0' : '') + Math.floor((t % (60 * 60)) / 60).toString() + // mm 
            ':' + ((((t % (60 * 60)) % 60) < 10) ? '0' : '') + (t % (60 * 60)) % 60).toString(); // ss
}


/* after all initilization first automatically call it  */
var autoStart = (function () {
    myPlayer.pause();
    playPauseFun();
})();

