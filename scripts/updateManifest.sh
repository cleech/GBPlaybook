#!/usr/bin/bash

# Check if jq is installed
if ! command -v jq > /dev/null 2>&1; then
    echo "Error: jq is not installed. Please install it (e.g., 'sudo apt install jq' or 'brew install jq')." >&2
    exit 1
fi

# Check if manifest.json exists
if [ ! -f "manifest.json" ]; then
    echo "Error: manifest.json not found in the current directory." >&2
    exit 1
fi

for dataFile in "$@"; do
    # Check if the data file exists before processing
    if [ ! -f "$dataFile" ]; then
        echo "Warning: Data file '$dataFile' not found. Skipping." >&2
        continue # Skip to the next file
    fi

    TMP=$(mktemp)
    # Add error handling for mktemp
    if [ -z "$TMP" ] || [ ! -w "$TMP" ]; then
        echo "Error: Could not create temporary file." >&2
        exit 1
    fi

    # Use stat and sha256sum safely, checking for errors
    mtime=$(stat -c '%Y' "$dataFile")
    if [ $? -ne 0 ]; then
        echo "Error: Failed to get mtime for '$dataFile'. Skipping." >&2
        rm -f "$TMP" # Clean up temp file
        continue
    fi

    sha=$(sha256sum "$dataFile" | cut -d' ' -f1)
     if [ $? -ne 0 ] || [ -z "$sha" ]; then
        echo "Error: Failed to get sha256sum for '$dataFile'. Skipping." >&2
        rm -f "$TMP" # Clean up temp file
        continue
    fi

    # Define the core update logic as a jq function for reuse
    # Pass shell variables safely using --arg/--argjson
    jq --argjson mtime "$mtime" \
       --arg sha "$sha" \
       --arg dataFile "$dataFile" \
       '
         # Define a function to perform the timestamp/sha update
         def update_entry($ts; $sh):
           (.timestamp |= ($ts|todate) | .sha256 |= $sh);

         # 1. Update the top-level timestamp
         (.timestamp |= (now|todate)) |

         # 2. Process the datafiles array
         (.datafiles |= map(
           # Check if the top-level filename matches
           if .filename == $dataFile then
             # Update this top-level entry
             update_entry($mtime; $sha)
           # Else, check if translations exist and is an object
           elif (.translations | type == "object") then
             # Try to update within the translations map
             .translations |= map_values(
               if .filename == $dataFile then
                 # Update this translation entry
                 update_entry($mtime; $sha)
               else
                 # Keep other translations unchanged
                 .
               end
             )
           # Else, no match found here, keep the entry unchanged
           else
             .
           end
         ))
       ' \
       manifest.json > "${TMP}"

    # Check if jq succeeded before replacing the manifest
    if [ $? -eq 0 ]; then
        mv "${TMP}" manifest.json
    else
        echo "Error: jq command failed for file '$dataFile'. Manifest not updated." >&2
        rm -f "${TMP}" # Clean up temp file on failure
        # Optionally exit here if one failure should stop the whole process:
        # exit 1
    fi
done

echo "Manifest update process complete."
