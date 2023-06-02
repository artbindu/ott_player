
var roll_response = `<roll>
<checksum>fc5223ede033f161b2466a602a611aa3</checksum>
<version>4.6.16.1.1</version>
<client_source_ip>10.151.193.224</client_source_ip>
<bookmark>0</bookmark>
<live>true</live>
<beacon_interval>30000</beacon_interval>
<start_time>2023-05-09T18:00:00Z</start_time>
<end_time>2023-05-09T18:30:00Z</end_time>
<duration>1800</duration>
<manifest-uri><![CDATA[LIVE$11945/index.m3u8?device=mf_hls_abr_gdrm_v1hfp&start=LIVE&end=END]]></manifest-uri>
<live_dvr_duration>86400</live_dvr_duration>
<cdns>
  <cdn>
    <name>VSPP_LIVE_1</name>
    <retrieval-type>static</retrieval-type>
    <base-url>https://vsppstreamer-vspp08.proda.tmo.tv3cloud.com:5554/shls</base-url>
    <priority>50</priority>
    <threshold>0</threshold>
  </cdn>
</cdns>
<drm_type>fairplay</drm_type>
<package_type>hls</package_type>
<drm><token>3_emz2a/xzdrs/4jalEQMDz/lQo0O3CEB53K8uZqnwDPtPftOLdJHLPvVbDpxCP/IQbTvPRbn+AOU4Y7wa/04XQw91S89zJOSj7b2batkzkqG8G3xATwbUmlAmoRAZuIkSYBBESALxtDNr/LlceGQqhgCbmwjE4bNPhlrXn/oKYTRV8igc1/b8VOPMoVwo+4hoTrDWaZrPv6dG8R9pV1NLjxf5rPeMej4IRjMPmzeIX7pcUqLhraqSsfS+i3A5LjGP5hfZpAXY6vzIS7q/q8eXOoyMVtv6vTDMgfiJAEhJCm+o1P2VvVX0s/jEimWFNwTatH3chyBMlKOSrHShZ9n05aPfavT7XosbsIboMMS4a4+A1ctnZkp7YHK4OPj9mjy926IApRCKx7fKGVVHEeOR2QHJZxDUycdKCsM9sXuH9us=</token></drm>
<prep_version>0</prep_version>
</roll>`;


var user = `mfdevuser12$default`;


var parser = new DOMParser();
var xmlDoc=parser.parseFromString(roll_response,"text/xml");

var baseUrl = xmlDoc.getElementsByTagName("base-url")[0].innerHTML;          // 'https://bkms.itvc.cogeco.net:443/shls'
var path = xmlDoc.getElementsByTagName("manifest-uri")[0].childNodes[0].data; // 'LIVE$1089/index.m3u8?device=mdrm_live_ccx_hls_v1_fp_hd&amp;start=LIVE&amp;end=END'
var manifestUrl = `${baseUrl}\/${path}&userAccount=${user}`.replace(/amp;/gi, '');

var oldManifestUrl = '';
var redirectUrl = '';
var count = 0;

var audioUrl = '';

function downloadSegments(obj) {
    let segmentsList = '';
    if(obj && obj.type === 'audio') {
        segmentsList = obj.data.match(/(?=Alter).*(?=.ts)/gim)
    } else if(obj && obj.type === 'video') {
        segmentsList = obj.data.match(/(?=Level).*(?=.ts)/gim)
    }
    if(segmentsList && segmentsList.length) {
        let manifestUrl = obj.url;

        // let seg1 = segmentsList[0];
        // let segUrl = manifestUrl.replace(obj.type === 'audio' ? manifestUrl.match(/(?=Alter).*/gi) : manifestUrl.match(/(?=Level).*/gi), seg1);
        // getRequestCall(segUrl, 'segment');
    
        var i = 0;                 
        function myLoop() {        
            setTimeout(function () {   
                let seg1 = segmentsList[i];
                let segUrl = manifestUrl.replace(obj.type === 'audio' ? manifestUrl.match(/(?=Alter).*/gi) : manifestUrl.match(/(?=Level).*/gi), seg1);
                getRequestCall(segUrl, 'segment');
                i++;                    
                if (i < segmentsList.length) {       
                    myLoop();            
                }                     
            }, 2000)
        }
        myLoop();
    }
}

function generateWrongAudioUrl(_audioUrl, _replaceUrl) {
    console.log('BM: Actual Audio URL: ', _audioUrl);
    /* ingest code : Wrong audio Url*/
    // audioUrl = "https://vsppstreamer-vspp08.proda.tmo.tv3cloud.com:5554/shls/LIVEindex.m3u8/S!d2EVbWZfaGxzX2Ficl9nZHJtX3YxaGZwEgtU.v...wFGIXsxAZ8_/Alter-audio_482_eng(482,Level_params=dxADIeIBnw..)?start=LIVE&end=END1945/index.m3u8/S!d2EVbWZfaGxzX2Ficl9nZHJtX3YxaGZwEgtU.v...wFGIXsxAZ8_/Alter-audio_482_eng(482,Level_params=dxADIeIBnw..)?start=LIVE&end=END";
    if(_audioUrl.match(/(?<=LIVE\$1).*/gi).toString().length) {
        _audioUrl = _audioUrl.replace(/\$1/g, _replaceUrl);
    }
    console.log('BM: Wrong Audio URL: ', _audioUrl);
    return _audioUrl;
}

function parseAudioManifestData(_data) {
    // #EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=6000000,CODECS=\"mp4a.40.2,avc1.640020\",RESOLUTION=1280x720,AUDIO=\"AACL\"
    // index.m3u8/S!d2EabWRybV9saXZlX2NjeF9obHNfdjFfZnBfaGQSBVT-....ATZBMXqf/Level(6000000)?start=LIVE&end=END
    let audioStreamInfo = _data.split('\n').filter(x => x.includes('#EXT-X-MEDIA:') && x.includes('TYPE=AUDIO'));
    // "index.m3u8/S!d2EabWRybV9saXZlX2NjeF9obHNfdjFfZnBfaGQSBUNAs47IRPC3jsg2QTF6nw__/Level(500000)?start=2023-04-25T04%3A40%3A00Z&end=2023-04-25T04%3A50%3A00Z"
    let audioUriInfo = audioStreamInfo.join("\n").match(/(?<=(URI=")).*(?=")/gim);
    console.log(audioUriInfo);

    let audioUrl = manifestUrl.replace(/index.m3u8.*/gi, audioUriInfo[audioUriInfo.length-1]);
    // ingest wrong audio url code :: BM: On/Off
    // audioUrl = generateWrongAudioUrl(audioUrl, audioUriInfo[audioUriInfo.length-1]);

    getRequestCall(audioUrl, 'audio', downloadSegments); // take last audio segment URL
}

function parseVideoManifestData(_data) {
    // #EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=500000,CODECS=\"mp4a.40.2,avc1.42e00d\",RESOLUTION=256x144,AUDIO=\"AACL\" index.m3u8/S!d2EabWRybV9saXZlX2NjeF9obHNfdjFfZnBfaGQSBVT-....ATZBMXqf/Level(500000)?start=LIVE&end=END
    let videoStreamInfo = _data.replace(/\sindex.m3u8/gm, ',URI=\"index.m3u8').split('\n').filter(x => x.includes('BANDWIDTH=') && x.includes('#EXT-X-STREAM-INF:'));
    let videoUriInfo = videoStreamInfo.join("\n").match(/(?<=(URI=")).*/gim);
    console.log(videoUriInfo);

    let videoUrl = manifestUrl.replace(/index.m3u8.*/gi, videoUriInfo[videoUriInfo.length-1]); // take last video segment URL 
    getRequestCall(videoUrl, 'video', downloadSegments);
}

function parseManifestData(_data) {
    parseVideoManifestData(_data);
    parseAudioManifestData(_data);
}

function getRequestCall(_url, str, callback) {
    console.warn('call getRequestCall with url: ', _url);
    // create an XMLHTTPRequest object
    let req = new XMLHttpRequest();
    // pass the method 'GET', url
    req.open("GET", _url);
    req.onload = (() => {
        // Request finished. Do processing here.
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                if(str === 'manifest') {
                    let manifestData = req.response;
                    redirectUrl = req.responseURL;
                    if(redirectUrl && manifestUrl !== redirectUrl) {
                        oldManifestUrl = manifestUrl;
                        manifestUrl = redirectUrl;
                    }
                    console.log('Manifest Data: ', manifestData);
                    if (callback) callback(manifestData, callback)
                } else if(str === 'video' || str === 'audio') {
                    let subManifest = req.response;
                    console.log(`${str.toUpperCase()} Data: `, subManifest);
                    if (callback) callback({ url: _url, data: subManifest, type: str }, callback)
                } else if(str === 'segment') {
                    console.log('Segment Data: ', req.response);
                } else {
                    debugger;
                }
            } else {
                // if(req.status === 400 && req.responseURL) {
                //     redirectUrl = req.responseURL;
                //     count += 1;
                //     if(!count)
                //     getRequestCall(redirectUrl);
                // } else {
                console.log(`Request failed with status code ${req.status} from url ${req.responseURL}`);
                // }
            }
        }
    });
    req.onerror = (error =>{
        console.log(`Request failed with error ${error.type}`);
    });
    // send request
    req.send();
}
// debugger;
getRequestCall(manifestUrl, 'manifest', parseManifestData);