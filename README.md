# OTT Player

## OTT Native Players
- [hls Player](https://github.com/artbindu/ott_player/tree/hls)
- [dashIF Player](https://github.com/artbindu/ott_player/tree/dash)
- [shaka Player](https://github.com/artbindu/ott_player/tree/sakha)


<hr><hr>

# 🔔 <u><b>Bitmovin Player Documentation</b></u> 🔔
<hr><hr>


# <u><i>This is Repository of creating Bitmovin Player and Bitmovin Modular Player with node packages and bitmovin library one-by-one</i></u>


[Bitmovin Demo Player](https://bitmovin.com/demos/stream-test?format=dash&manifest=https%3A%2F%2Fbitmovin-a.akamaihd.net%2Fcontent%2FMI201109210084_1%2Fmpds%2Ff08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd)

[Bitmovin Documentation](https://bitmovin.com/docs)

Bitmovin Source Configuration: 
```javascript
var sourceConfig = {
    "title": "Default Demo Source Config",
    "dash": "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
    "hls": "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",
    "smooth": "https://test.playready.microsoft.com/smoothstreaming/SSWSS720H264/SuperSpeedway_720.ism/manifest",
    "progressive": "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/MI201109210084_mpeg-4_hd_high_1080p25_10mbits.mp4",
    "poster": "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/poster.jpg"
  }
```

</br>
<hr><hr>

## <b>Bitmovin Sample Player</b>

<hr><hr>

- Load player with [latest bitmovin release](https://developer.bitmovin.com/playback/docs/release-notes-web)
<hr>

- Bitmovin Sample Player : `bitmovin-player.html`
```
  npm i && npm run bitmovin:sample-player ↵
```
- Bitmovin Modular Player : `bitmovin-modular-player.html`
```
  npm i && npm run bitmovin:modular-player ↵
```
<hr><hr>

## <b>Bitmovin Player</b> 👉 `bitmovin-player`

<hr><hr>

- Create this player using bitmovin player version: [`8.90.0`](https://developer.bitmovin.com/playback/docs/release-notes-web#8900)
- Checked directory && install node-modules
```
cd bitmovin-player && npm i ↵
```
- Build & Run Code through rollup.js
```
 npm run build && npm run server ↵
```
or
```
 npm run start ↵
```
<hr><hr>

## <b>Bitmovin Modular Player - 01</b> 👉 `bitmovin-modular-player-jsLoad`

<hr><hr>

- Create this player with all bitmovin modules of player version: [`8.90.0`](https://developer.bitmovin.com/playback/docs/release-notes-web#8900)
- This is duplicate of `bitmovin-modular-player.html`. We load bitmovin 8.90.0 player modules through javascript into the html script
- Checked directory && install node-modules
```
 cd bitmovin-modular-player-jsLoad && npm i ↵
```
- Build & Run Code
```
 npm run build && npm run server ↵
```
or
```
 npm run start ↵
```
<hr><hr>

## <b>Bitmovin Modular Player - 02</b> 👉 `bitmovin-modular-player`

<hr><hr>

- Create this player with all bitmovin modules of player version: [`8.90.0`](https://developer.bitmovin.com/playback/docs/release-notes-web#8900)
- Locally we store all bitmovin modules and then use them
- Checked directory && install node-modules
```
 cd bitmovin-modular-player && npm i ↵
```
- Build & Run Code
```
 npm run build && npm run server ↵
```
or
```
 npm run start ↵
```
<hr><hr>

## <b>Bitmovin Modular Player - 03</b> 👉 `bitmovin-modular-player-npm`

<hr><hr>

- Create this player with all bitmovin modules of player version: [`8.90.0`](https://developer.bitmovin.com/playback/docs/release-notes-web#8900)
- Load bitmovin [8.90.0](https://www.npmjs.com/package/bitmovin-player/v/8.90.0) player through [npm](https://www.npmjs.com/package/bitmovin-player?activeTab=versions) and use the modules one by one
```
npm i bitmovin-player@8.90.0
```
- Checked directory && install node-modules
```
 cd bitmovin-player-npm-modular-player && npm i ↵
```
- Build & Run Code
```
 npm run build && npm run server ↵
```
or
```
 npm run start ↵
```
<hr><hr>
