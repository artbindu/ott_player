#!/bin/bash

# Set the directory
DIR="trim"

# Output file
OUTPUT_FILE="videolist.txt"

# Clear the output file
> "$OUTPUT_FILE"

# List all files, sort by filename ascending, and write to videolist.txt
find "$DIR" -maxdepth 1 -type f | sort | while read -r file; do
  echo "file $file" >> "$OUTPUT_FILE"
done

# Merge videos using ffmpeg
ffmpeg -f concat -safe 0 -i "$OUTPUT_FILE" -c copy mergedCropVideo.mp4
# # Remove Audio From Video
ffmpeg -i "mergedCropVideo.mp4" -ss 1.1 -t 350.0 -c:v libx264 -crf 23 -preset fast -an "mergedCropVideo_mute.mp4"
# Merged Audio Video
ffmpeg -i mergedCropVideo_mute.mp4 -i finalAudio.mp3 -c:v copy -c:a aac -shortest output.mp4
