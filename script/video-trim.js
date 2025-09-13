async function trimVideo() {
    const getInSecond = (val) => val.split(':').map(x => Number(x)).reverse().reduce((acc, el, index) => acc+el*Math.pow(60, index), 0);
    const startTime = getInSecond(document.getElementById('trimStartInput').value);
    const endTime = getInSecond(document.getElementById('trimEndInput').value);

    // Check if input times are valid
    if (isNaN(startTime) || isNaN(endTime) || startTime >= endTime) {
        alert("Please enter valid start and end times.");
        return;
    }

    try {
        // Initialize FFmpeg
        const { createFFmpeg, fetchFile } = FFmpeg;

        // Create the FFmpeg instance
        const ffmpeg = createFFmpeg({ log: true });

        // Load the FFmpeg library
        await ffmpeg.load();

        // Fetch the video from the URL
        const videoFile = await fetchFile(videoUrl);

        // Write the video to the FFmpeg file system
        ffmpeg.FS('writeFile', 'input.mp4', videoFile);

        // Run the FFmpeg command to trim the video
        await ffmpeg.run('-i', 'input.mp4', '-ss', startTime.toString(), '-to', endTime.toString(), '-c', 'copy', 'output.mp4');

        // Read the output file from the FFmpeg file system
        const outputFile = ffmpeg.FS('readFile', 'output.mp4');

        // Create a Blob from the output file buffer
        const videoBlob = new Blob([outputFile.buffer], { type: 'video/mp4' });

        // Create a URL for the Blob
        const trimmedVideoUrl = URL.createObjectURL(videoBlob);
        
        // Set the source of the trimmed video element
        const trimmedVideoElement = document.getElementById('trimmed-video');
        trimmedVideoElement.src = trimmedVideoUrl;

        alert("Video trimmed successfully!");

    } catch (error) {
        console.error('Error trimming video:', error);
        alert("An error occurred while trimming the video.");
    }
}
