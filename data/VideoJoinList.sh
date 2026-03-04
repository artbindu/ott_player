#!/bin/bash

# Set the directory
DIR="trim"

# Output file
OUTPUT_FILE="mergevideolist.txt"

# Clear the output file
> "$OUTPUT_FILE"

# List all files, sort by creation/modification time (oldest first), and write to input.txt
find "$DIR" -maxdepth 1 -type f -printf "%T@ %p\n" | sort -n | cut -d' ' -f2- | while read -r file; do
  echo "file $file" >> "$OUTPUT_FILE"
done
