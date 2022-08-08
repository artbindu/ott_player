# <i><b>This is Repository of creating Bitmovin Player and Bitmovin Modular Player with node packages and bitmovin library one-by-one</b></i>


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

## <b>Bitmovin Player</b>

<hr><hr>

- Created this player using bitmovin player version: `8.90.0`
- Checked directory && install node-modules
```
cd bitmovin-player && npm i ↵
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

## <b>Bitmovin Player with modular player</b>

<hr><hr>

- Created this player using bitmovin modular player (version: `8.90.0`)
- Checked directory && install node-modules
```
 cd bitmovin-player-modular-player && npm i ↵
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

## <b>Bitmovin Player with modular player</b>

<hr><hr>

- Created this player using bitmovin modular player (current version at package.json: `^8.90.0`)
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